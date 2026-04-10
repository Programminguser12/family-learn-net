import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { GraduationCap, BookOpen, Users, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const roles: { value: UserRole; label: string; icon: typeof GraduationCap; desc: string }[] = [
  { value: "teacher", label: "Profesor", icon: GraduationCap, desc: "Gestiona clases y calificaciones" },
  { value: "student", label: "Estudiante", icon: BookOpen, desc: "Consulta notas y tareas" },
  { value: "parent", label: "Padre/Tutor", icon: Users, desc: "Seguimiento de tus hijos" },
];

export default function Login() {
  const { login, signup } = useAuth();
  const { toast } = useToast();
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignup) {
      const { error } = await signup(email, password, fullName, selectedRole);
      if (error) {
        toast({ title: "Error al registrarse", description: error, variant: "destructive" });
      } else {
        toast({ title: "¡Cuenta creada!", description: "Revisa tu correo para confirmar o inicia sesión." });
        setIsSignup(false);
      }
    } else {
      const { error } = await login(email, password);
      if (error) {
        toast({ title: "Error al iniciar sesión", description: error, variant: "destructive" });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 gradient-primary opacity-5" />
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">EduPortal</h1>
          <p className="text-muted-foreground mt-1">Sistema de Gestión Escolar</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-4">
            <p className="text-sm text-muted-foreground text-center">
              {isSignup ? "Crea tu cuenta seleccionando tu rol" : "Inicia sesión con tu cuenta"}
            </p>
            {isSignup && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isActive = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all duration-200 ${
                        isActive
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-background hover:border-accent/30"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <Input
                    id="fullName"
                    placeholder="Juan Pérez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@escuela.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
                {loading ? (
                  <span className="animate-pulse">Cargando...</span>
                ) : isSignup ? (
                  <><UserPlus className="w-4 h-4 mr-2" />Registrarse</>
                ) : (
                  <><LogIn className="w-4 h-4 mr-2" />Iniciar Sesión</>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                <button type="button" onClick={() => setIsSignup(!isSignup)} className="text-accent hover:underline">
                  {isSignup ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
