import { useAuth } from "@/contexts/AuthContext";
import { useStudents, useGrades, useAttendance, useAnnouncements, useSubjects, useMyStudent, getGradeColor } from "@/hooks/useSchoolData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, ClipboardCheck, TrendingUp, Bell, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
      </div>
    </div>
  );
}

function TeacherDashboard() {
  const { data: students = [] } = useStudents();
  const { data: allGrades = [] } = useGrades();
  const { data: allAttendance = [] } = useAttendance();
  const { data: announcements = [] } = useAnnouncements();
  const { data: subjects = [] } = useSubjects();

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = allAttendance.filter(a => a.date === today);
  const presentCount = todayAttendance.filter(a => a.status === "present").length;
  const absentCount = todayAttendance.filter(a => a.status === "absent").length;
  const avgGrade = allGrades.length ? Math.round(allGrades.reduce((s, g) => s + g.value, 0) / allGrades.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Panel del Profesor</h1>
        <p className="text-muted-foreground">Resumen del día — {new Date().toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Estudiantes" value={students.length} icon={Users} subtitle="Inscritos activos" color="bg-accent/10 text-accent" />
        <StatCard title="Promedio General" value={avgGrade} icon={TrendingUp} subtitle="Calificación media" color="bg-success/10 text-success" />
        <StatCard title="Presentes Hoy" value={presentCount} icon={CheckCircle2} subtitle={`${absentCount} ausentes`} color="bg-success/10 text-success" />
        <StatCard title="Materias" value={subjects.length} icon={BookOpen} subtitle="Activas este periodo" color="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" /> Calificaciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allGrades.slice(0, 5).map((g) => {
                const student = students.find(s => s.id === g.student_id);
                const subject = subjects.find(s => s.id === g.subject_id);
                return (
                  <div key={g.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{student?.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{subject?.name} — {g.description}</p>
                    </div>
                    <span className={`text-lg font-heading font-bold ${getGradeColor(g.value)}`}>{g.value}</span>
                  </div>
                );
              })}
              {allGrades.length === 0 && <p className="text-sm text-muted-foreground">No hay calificaciones aún</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" /> Anuncios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.slice(0, 4).map((a) => (
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
              {announcements.length === 0 && <p className="text-sm text-muted-foreground">No hay anuncios</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { data: myStudent } = useMyStudent();
  const { data: myGrades = [] } = useGrades(myStudent ? { studentId: myStudent.id } : undefined);
  const { data: myAttendance = [] } = useAttendance(myStudent ? { studentId: myStudent.id } : undefined);
  const { data: subjects = [] } = useSubjects();
  const { data: announcements = [] } = useAnnouncements();

  const avg = myGrades.length ? Math.round(myGrades.reduce((s, g) => s + g.value, 0) / myGrades.length) : 0;
  const presentDays = myAttendance.filter(a => a.status === "present").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Mi Panel</h1>
        <p className="text-muted-foreground">Resumen académico</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Mi Promedio" value={avg} icon={TrendingUp} subtitle="General" color="bg-success/10 text-success" />
        <StatCard title="Asistencia" value={`${presentDays}/${myAttendance.length}`} icon={ClipboardCheck} subtitle="Días presente" color="bg-accent/10 text-accent" />
        <StatCard title="Materias" value={new Set(myGrades.map(g => g.subject_id)).size} icon={BookOpen} subtitle="Con calificaciones" color="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-3"><CardTitle className="text-base font-heading">Mis Calificaciones</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myGrades.map((g) => {
                const subject = subjects.find(s => s.id === g.subject_id);
                return (
                  <div key={g.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{subject?.name}</p>
                      <p className="text-xs text-muted-foreground">{g.description}</p>
                    </div>
                    <span className={`text-lg font-heading font-bold ${getGradeColor(g.value)}`}>{g.value}</span>
                  </div>
                );
              })}
              {myGrades.length === 0 && <p className="text-sm text-muted-foreground">No hay calificaciones aún</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3"><CardTitle className="text-base font-heading">Anuncios Recientes</CardTitle></CardHeader>
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
  const { data: myStudent } = useMyStudent();
  const { data: childGrades = [] } = useGrades(myStudent ? { studentId: myStudent.id } : undefined);
  const { data: childAttendance = [] } = useAttendance(myStudent ? { studentId: myStudent.id } : undefined);
  const { data: subjects = [] } = useSubjects();
  const { data: announcements = [] } = useAnnouncements();

  const avg = childGrades.length ? Math.round(childGrades.reduce((s, g) => s + g.value, 0) / childGrades.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Panel de Padre/Tutor</h1>
        <p className="text-muted-foreground">Seguimiento de {myStudent?.name || "tu hijo/a"} — {myStudent?.grade}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Promedio" value={avg} icon={TrendingUp} subtitle="De tu hijo/a" color="bg-success/10 text-success" />
        <StatCard title="Asistencia" value={`${childAttendance.filter(a => a.status === "present").length}/${childAttendance.length}`} icon={ClipboardCheck} subtitle="Días presente" color="bg-accent/10 text-accent" />
        <StatCard title="Anuncios" value={announcements.length} icon={Bell} subtitle="Disponibles" color="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-3"><CardTitle className="text-base font-heading">Calificaciones</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {childGrades.map((g) => {
                const subject = subjects.find(s => s.id === g.subject_id);
                return (
                  <div key={g.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{subject?.name}</p>
                      <p className="text-xs text-muted-foreground">{g.description}</p>
                    </div>
                    <span className={`text-lg font-heading font-bold ${getGradeColor(g.value)}`}>{g.value}</span>
                  </div>
                );
              })}
              {childGrades.length === 0 && <p className="text-sm text-muted-foreground">No hay calificaciones aún</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3"><CardTitle className="text-base font-heading">Anuncios</CardTitle></CardHeader>
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
  const { user, loading } = useAuth();

  if (loading) return <LoadingSkeleton />;
  if (user?.role === "student") return <StudentDashboard />;
  if (user?.role === "parent") return <ParentDashboard />;
  return <TeacherDashboard />;
}
