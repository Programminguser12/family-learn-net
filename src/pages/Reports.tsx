import { useStudents, useGrades, useSubjects, getGradeColor } from "@/hooks/useSchoolData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function Reports() {
  const { data: students = [] } = useStudents();
  const { data: allGrades = [] } = useGrades();
  const { data: subjects = [] } = useSubjects();

  const subjectAverages = subjects.map(sub => {
    const sg = allGrades.filter(g => g.subject_id === sub.id);
    const avg = sg.length ? Math.round(sg.reduce((s, g) => s + g.value, 0) / sg.length) : 0;
    return { ...sub, avg, count: sg.length };
  });

  const topStudents = students.map(student => {
    const sg = allGrades.filter(g => g.student_id === student.id);
    const avg = sg.length ? Math.round(sg.reduce((s, g) => s + g.value, 0) / sg.length) : 0;
    return { ...student, avg };
  }).sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Reportes</h1>
        <p className="text-muted-foreground">Análisis de rendimiento académico</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" /> Promedio por Materia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectAverages.map(sub => (
                <div key={sub.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{sub.name}</span>
                    <span className={`text-sm font-bold ${getGradeColor(sub.avg)}`}>{sub.avg}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${sub.avg}%` }} />
                  </div>
                </div>
              ))}
              {subjectAverages.length === 0 && <p className="text-sm text-muted-foreground">No hay datos</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading">Ranking de Estudiantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStudents.map((student, i) => (
                <div key={student.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium">{student.name}</span>
                  <span className={`font-heading font-bold ${getGradeColor(student.avg)}`}>{student.avg}</span>
                </div>
              ))}
              {topStudents.length === 0 && <p className="text-sm text-muted-foreground">No hay datos</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
