import { students, grades, attendance, subjects, getGradeColor } from "@/data/schoolData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function Students() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Estudiantes</h1>
        <p className="text-muted-foreground">{students.length} estudiantes inscritos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(student => {
          const sg = grades.filter(g => g.studentId === student.id);
          const avg = sg.length ? Math.round(sg.reduce((s, g) => s + g.value, 0) / sg.length) : 0;
          const sa = attendance.filter(a => a.studentId === student.id);
          const presentCount = sa.filter(a => a.status === "present").length;
          const pct = sa.length ? Math.round((presentCount / sa.length) * 100) : 0;

          return (
            <Card key={student.id} className="glass-card animate-fade-in hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-sm">{student.name}</h3>
                    <p className="text-xs text-muted-foreground">{student.grade}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Promedio</p>
                    <p className={`text-xl font-heading font-bold ${getGradeColor(avg)}`}>{avg || "—"}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground">Asistencia</p>
                    <p className="text-xl font-heading font-bold text-accent">{pct}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
