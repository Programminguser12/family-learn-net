import { useAuth } from "@/contexts/AuthContext";
import { students, attendance, getAttendanceIcon } from "@/data/schoolData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck } from "lucide-react";

function TeacherAttendance() {
  const dates = [...new Set(attendance.map(a => a.date))].sort().reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Asistencia</h1>
        <p className="text-muted-foreground">Registro de asistencia por día</p>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-accent" /> Registro de Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left text-xs text-muted-foreground font-medium py-3 pr-4 sticky left-0 bg-card">Estudiante</th>
                  {dates.map(d => (
                    <th key={d} className="text-center text-xs text-muted-foreground font-medium py-3 px-3 whitespace-nowrap">
                      {new Date(d + "T12:00:00").toLocaleDateString("es", { weekday: "short", day: "numeric" })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4 sticky left-0 bg-card">
                      <span className="text-sm font-medium">{student.name}</span>
                    </td>
                    {dates.map(date => {
                      const record = attendance.find(a => a.studentId === student.id && a.date === date);
                      if (!record) return <td key={date} className="text-center py-3 px-3"><span className="text-xs text-muted-foreground">—</span></td>;
                      const info = getAttendanceIcon(record.status);
                      return (
                        <td key={date} className="text-center py-3 px-3">
                          <Badge variant="secondary" className={`text-[10px] ${info.color} ${info.bg} border-0`}>
                            {info.label}
                          </Badge>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentAttendance() {
  const myAttendance = attendance.filter(a => a.studentId === "s1").sort((a, b) => b.date.localeCompare(a.date));
  const presentCount = myAttendance.filter(a => a.status === "present").length;
  const percentage = myAttendance.length ? Math.round((presentCount / myAttendance.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Mi Asistencia</h1>
        <p className="text-muted-foreground">Porcentaje de asistencia: <span className="font-bold text-foreground">{percentage}%</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {myAttendance.map((a, i) => {
          const info = getAttendanceIcon(a.status);
          return (
            <Card key={i} className="glass-card animate-fade-in">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="text-sm">{new Date(a.date + "T12:00:00").toLocaleDateString("es", { weekday: "long", day: "numeric", month: "short" })}</span>
                <Badge variant="secondary" className={`${info.color} ${info.bg} border-0 text-xs`}>{info.label}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function Attendance() {
  const { user } = useAuth();
  if (user?.role === "teacher") return <TeacherAttendance />;
  return <StudentAttendance />;
}
