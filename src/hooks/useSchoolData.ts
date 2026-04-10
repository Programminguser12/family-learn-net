import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Student = Tables<"students">;
export type Subject = Tables<"subjects">;
export type Grade = Tables<"grades">;
export type Attendance = Tables<"attendance">;
export type Announcement = Tables<"announcements">;

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").order("name");
      if (error) throw error;
      return data as Student[];
    },
  });
}

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subjects").select("*").order("name");
      if (error) throw error;
      return data as Subject[];
    },
  });
}

export function useGrades(filters?: { studentId?: string; subjectId?: string }) {
  return useQuery({
    queryKey: ["grades", filters],
    queryFn: async () => {
      let query = supabase.from("grades").select("*").order("date", { ascending: false });
      if (filters?.studentId) query = query.eq("student_id", filters.studentId);
      if (filters?.subjectId) query = query.eq("subject_id", filters.subjectId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Grade[];
    },
  });
}

export function useAttendance(filters?: { studentId?: string; date?: string }) {
  return useQuery({
    queryKey: ["attendance", filters],
    queryFn: async () => {
      let query = supabase.from("attendance").select("*").order("date", { ascending: false });
      if (filters?.studentId) query = query.eq("student_id", filters.studentId);
      if (filters?.date) query = query.eq("date", filters.date);
      const { data, error } = await query;
      if (error) throw error;
      return data as Attendance[];
    },
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data as Announcement[];
    },
  });
}

// Mutations
export function useAddGrade() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (grade: Omit<TablesInsert<"grades">, "created_by">) => {
      const { data, error } = await supabase.from("grades").insert({ ...grade, created_by: user?.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["grades"] }),
  });
}

export function useUpdateGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<TablesInsert<"grades">>) => {
      const { error } = await supabase.from("grades").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["grades"] }),
  });
}

export function useDeleteGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("grades").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["grades"] }),
  });
}

export function useUpsertAttendance() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (record: Omit<TablesInsert<"attendance">, "created_by">) => {
      const { error } = await supabase.from("attendance").upsert(
        { ...record, created_by: user?.id },
        { onConflict: "student_id,subject_id,date" }
      );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance"] }),
  });
}

export function useAddAnnouncement() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (ann: Omit<TablesInsert<"announcements">, "created_by">) => {
      const { error } = await supabase.from("announcements").insert({ ...ann, created_by: user?.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useAddStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (student: TablesInsert<"students">) => {
      const { error } = await supabase.from("students").insert(student);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

// Helper functions
export function getGradeColor(value: number): string {
  if (value >= 90) return "text-success";
  if (value >= 70) return "text-accent";
  if (value >= 60) return "text-warning";
  return "text-destructive";
}

export function getGradeBg(value: number): string {
  if (value >= 90) return "bg-success/10";
  if (value >= 70) return "bg-accent/10";
  if (value >= 60) return "bg-warning/10";
  return "bg-destructive/10";
}

export function getAttendanceInfo(status: string) {
  switch (status) {
    case "present": return { label: "Presente", color: "text-success", bg: "bg-success/10" };
    case "absent": return { label: "Ausente", color: "text-destructive", bg: "bg-destructive/10" };
    case "late": return { label: "Tardanza", color: "text-warning", bg: "bg-warning/10" };
    case "excused": return { label: "Justificado", color: "text-accent", bg: "bg-accent/10" };
    default: return { label: status, color: "text-muted-foreground", bg: "bg-muted" };
  }
}

export function useMyStudent() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-student", user?.id],
    enabled: !!user,
    queryFn: async () => {
      // For students: find their student record
      const { data } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (data) return data;
      // For parents: find their child
      const { data: child } = await supabase
        .from("students")
        .select("*")
        .eq("parent_user_id", user!.id)
        .maybeSingle();
      return child;
    },
  });
}
