import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { GraduationCap, BookOpen, Users, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const roles: { value: UserRole; label: string; icon: typeof GraduationCap; desc: string }[] = [
  { value: "teacher", label: "Profesor", icon: GraduationCap, desc: "Gestiona clases y calificaciones" },
  { value: "student", label: "Estudiante", icon: BookOpen, desc: "Consulta notas y tareas" },
  { value: "parent", label: "Padre/Tutor", icon: Users, desc: "Seguimiento de tus hijos" },
];

export default function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || `demo@escuela.com`, password || "demo", selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 gradient-primary opacity-5" />
      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">EduPortal</h1>
          <p className="text-muted-foreground mt-1">Sistema de Gestión Escolar</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-4">
            <p className="text-sm text-muted-foreground text-center">Selecciona tu rol para continuar</p>
            {/* Role selector */}
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
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@escuela.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Demo: ingresa cualquier dato para explorar
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
