import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { students, grades, subjects, getGradeColor, getGradeBg } from "@/data/schoolData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

function TeacherGrades() {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);

  const subjectGrades = grades.filter(g => g.subjectId === selectedSubject);
  const subject = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Calificaciones</h1>
          <p className="text-muted-foreground">Gestiona las calificaciones de tus estudiantes</p>
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            {subject?.name} — Calificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-xs text-muted-foreground font-medium py-3 pr-4">Estudiante</th>
                  <th className="text-left text-xs text-muted-foreground font-medium py-3 pr-4">Tipo</th>
                  <th className="text-left text-xs text-muted-foreground font-medium py-3 pr-4">Descripción</th>
                  <th className="text-left text-xs text-muted-foreground font-medium py-3 pr-4">Fecha</th>
                  <th className="text-right text-xs text-muted-foreground font-medium py-3">Nota</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const sg = subjectGrades.filter(g => g.studentId === student.id);
                  if (!sg.length) return null;
                  return sg.map((g, i) => (
                    <tr key={`${student.id}-${i}`} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="secondary" className="text-[10px] capitalize">{g.type === "exam" ? "Examen" : g.type === "homework" ? "Tarea" : g.type === "project" ? "Proyecto" : "Participación"}</Badge>
                      </td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground">{g.description}</td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground">{g.date}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-heading font-bold text-sm ${getGradeColor(g.value)} ${getGradeBg(g.value)}`}>
                          {g.value}
                        </span>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentGrades() {
  const myGrades = grades.filter(g => g.studentId === "s1");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Mis Calificaciones</h1>
        <p className="text-muted-foreground">Consulta tus notas por materia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => {
          const sg = myGrades.filter(g => g.subjectId === subject.id);
          if (!sg.length) return null;
          const avg = Math.round(sg.reduce((s, g) => s + g.value, 0) / sg.length);
          return (
            <Card key={subject.id} className="glass-card animate-fade-in">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold">{subject.name}</h3>
                  <span className={`text-2xl font-heading font-bold ${getGradeColor(avg)}`}>{avg}</span>
                </div>
                <div className="space-y-2">
                  {sg.map((g, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{g.description}</span>
                      <span className={`font-medium ${getGradeColor(g.value)}`}>{g.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function Grades() {
  const { user } = useAuth();
  if (user?.role === "teacher") return <TeacherGrades />;
  return <StudentGrades />;
}
