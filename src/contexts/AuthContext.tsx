import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserRole = "teacher" | "student" | "parent" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function getUserRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching user role:", error);
  }
  
  if (data?.role) {
    return data.role as UserRole;
  }
  
  // No role found — default to teacher only as last resort
  console.warn("No role found for user", userId, "— defaulting to teacher");
  return "teacher";
}

async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("user_id", userId)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching profile:", error);
  }
  return data;
}

async function buildUser(supabaseUser: SupabaseUser): Promise<User> {
  const [role, profile] = await Promise.all([
    getUserRole(supabaseUser.id),
    getProfile(supabaseUser.id),
  ]);
  
  console.log("Built user with role:", role, "for", supabaseUser.email);
  
  return {
    id: supabaseUser.id,
    name: profile?.full_name || supabaseUser.email?.split("@")[0] || "",
    email: supabaseUser.email || "",
    role,
    avatar: profile?.avatar_url || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(async () => {
            const appUser = await buildUser(newSession.user);
            setUser(appUser);
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        const appUser = await buildUser(existingSession.user);
        setUser(appUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signup = async (email: string, password: string, fullName: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error: error.message };

    // Assign role
    if (data.user) {
      const { error: roleError } = await supabase.from("user_roles").insert({ user_id: data.user.id, role });
      if (roleError) {
        console.error("Error assigning role:", roleError);
      }
    }
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
