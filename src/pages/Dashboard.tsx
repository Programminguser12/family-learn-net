import { useAuth } from "@/contexts/AuthContext";
import { students, grades, attendance, announcements, subjects, getGradeColor } from "@/data/schoolData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, ClipboardCheck, TrendingUp, Bell, CheckCircle2, XCircle, Clock } from "lucide-react";

function StatCard({ title, value, icon: Icon, subtitle, color }: { title: string; value: string | number; icon: any; subtitle: string; color: string }) {
  return (
    <Card className="glass-card animate-fade-in">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-heading font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeacherDashboard() {
  const todayAttendance = attendance.filter(a => a.date === "2026-04-10");
  const presentCount = todayAttendance.filter(a => a.status === "present").length;
  const absentCount = todayAttendance.filter(a => a.status === "absent").length;
  const avgGrade = Math.round(grades.reduce((s, g) => s + g.value, 0) / grades.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Panel del Profesor</h1>
        <p className="text-muted-foreground">Resumen del día — 10 de abril, 2026</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Estudiantes" value={students.length} icon={Users} subtitle="Inscritos activos" color="bg-accent/10 text-accent" />
        <StatCard title="Promedio General" value={avgGrade} icon={TrendingUp} subtitle="Calificación media" color="bg-success/10 text-success" />
        <StatCard title="Presentes Hoy" value={presentCount} icon={CheckCircle2} subtitle={`${absentCount} ausentes`} color="bg-success/10 text-success" />
        <StatCard title="Materias" value={subjects.length} icon={BookOpen} subtitle="Activas este periodo" color="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent grades */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" /> Calificaciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {grades.slice(0, 5).map((g, i) => {
                const student = students.find(s => s.id === g.studentId);
                const subject = subjects.find(s => s.id === g.subjectId);
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{student?.name}</p>
                      <p className="text-xs text-muted-foreground">{subject?.name} — {g.description}</p>
                    </div>
                    <span className={`text-lg font-heading font-bold ${getGradeColor(g.value)}`}>{g.value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" /> Anuncios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    <Badge variant={a.priority === "high" ? "destructive" : a.priority === "medium" ? "default" : "secondary"} className="text-[10px]">
                      {a.priority === "high" ? "Urgente" : a.priority === "medium" ? "Importante" : "Info"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance today */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-accent" /> Asistencia de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {students.map((student) => {
              const record = todayAttendance.find(a => a.studentId === student.id);
              const status = record?.status || "absent";
              const icon = status === "present" ? CheckCircle2 : status === "absent" ? XCircle : Clock;
              const color = status === "present" ? "text-success" : status === "absent" ? "text-destructive" : "text-warning";
              const Icon = icon;
              return (
                <div key={student.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <Icon className={`w-4 h-4 ${color} shrink-0`} />
                  <span className="text-sm truncate">{student.name.split(" ")[0]}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentDashboard() {
  const myGrades = grades.filter(g => g.studentId === "s1");
  const myAttendance = attendance.filter(a => a.studentId === "s1");
  const avg = myGrades.length ? Math.round(myGrades.reduce((s, g) => s + g.value, 0) / myGrades.length) : 0;
  const presentDays = myAttendance.filter(a => a.status === "present").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Mi Panel</h1>
        <p className="text-muted-foreground">Resumen académico — Carlos Rodríguez</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Mi Promedio" value={avg} icon={TrendingUp} subtitle="General" color="bg-success/10 text-success" />
        <StatCard title="Asistencia" value={`${presentDays}/${myAttendance.length}`} icon={ClipboardCheck} subtitle="Días presente" color="bg-accent/10 text-accent" />
        <StatCard title="Materias" value={new Set(myGrades.map(g => g.subjectId)).size} icon={BookOpen} subtitle="Con calificaciones" color="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Mis Calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myGrades.map((g, i) => {
                const subject = subjects.find(s => s.id === g.subjectId);
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{subject?.name}</p>
                      <p className="text-xs text-muted-foreground">{g.description}</p>
                    </div>
                    <span className={`text-lg font-heading font-bold ${getGradeColor(g.value)}`}>{g.value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Anuncios Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.slice(0, 3).map(a => (
                <div key={a.id} className="py-2 border-b last:border-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ParentDashboard() {
  const childGrades = grades.filter(g => g.studentId === "s1");
  const childAttendance = attendance.filter(a => a.studentId === "s1");
  const avg = childGrades.length ? Math.round(childGrades.reduce((s, g) => s + g.value, 0) / childGrades.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Panel de Padre/Tutor</h1>
        <p className="text-muted-foreground">Seguimiento de Carlos Rodríguez — 3° A</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Promedio" value={avg} icon={TrendingUp} subtitle="De tu hijo/a" color="bg-success/10 text-success" />
        <StatCard title="Asistencia" value={`${childAttendance.filter(a => a.status === "present").length}/${childAttendance.length}`} icon={ClipboardCheck} subtitle="Días presente" color="bg-accent/10 text-accent" />
        <StatCard title="Anuncios" value={announcements.length} icon={Bell} subtitle="Sin leer" color="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Calificaciones de Carlos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {childGrades.map((g, i) => {
                const subject = subjects.find(s => s.id === g.subjectId);
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{subject?.name}</p>
                      <p className="text-xs text-muted-foreground">{g.description}</p>
                    </div>
                    <span className={`text-lg font-heading font-bold ${getGradeColor(g.value)}`}>{g.value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Anuncios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a.id} className="py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    {a.priority === "high" && <Badge variant="destructive" className="text-[10px]">Urgente</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  
  if (user?.role === "student") return <StudentDashboard />;
  if (user?.role === "parent") return <ParentDashboard />;
  return <TeacherDashboard />;
}
