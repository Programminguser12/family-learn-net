import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudents, useAttendance, useSubjects, useMyStudent, useUpsertAttendance, getAttendanceInfo } from "@/hooks/useSchoolData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function TeacherAttendance() {
  const { data: students = [] } = useStudents();
  const { data: subjects = [] } = useSubjects();
  const { data: allAttendance = [] } = useAttendance();
  const upsertAttendance = useUpsertAttendance();
  const { toast } = useToast();
  const today = new Date().toISOString().split("T")[0];
  const [selectedSubject, setSelectedSubject] = useState("");

  if (!selectedSubject && subjects.length > 0) setSelectedSubject(subjects[0].id);

  const dates = [...new Set(allAttendance.map(a => a.date))].sort().reverse().slice(0, 7);
  if (!dates.includes(today)) dates.unshift(today);
  dates.sort().reverse();

  const handleStatusChange = async (studentId: string, date: string, status: string) => {
    try {
      await upsertAttendance.mutateAsync({
        student_id: studentId,
        subject_id: selectedSubject,
        date,
        status,
      });
      toast({ title: "Asistencia actualizada" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Asistencia</h1>
          <p className="text-muted-foreground">Registro de asistencia por día</p>
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Materia" /></SelectTrigger>
          <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
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
                      const record = allAttendance.find(a => a.student_id === student.id && a.date === date && a.subject_id === selectedSubject);
                      const status = record?.status || "";
                      return (
                        <td key={date} className="text-center py-3 px-2">
                          <Select value={status} onValueChange={(v) => handleStatusChange(student.id, date, v)}>
                            <SelectTrigger className="h-8 w-24 text-[10px] mx-auto">
                              <SelectValue placeholder="—" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">Presente</SelectItem>
                              <SelectItem value="absent">Ausente</SelectItem>
                              <SelectItem value="late">Tardanza</SelectItem>
                              <SelectItem value="excused">Justificado</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan={dates.length + 1} className="py-8 text-center text-muted-foreground text-sm">No hay estudiantes registrados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentAttendance() {
  const { data: myStudent } = useMyStudent();
  const { data: myAttendance = [] } = useAttendance(myStudent ? { studentId: myStudent.id } : undefined);
  const presentCount = myAttendance.filter(a => a.status === "present").length;
  const percentage = myAttendance.length ? Math.round((presentCount / myAttendance.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Mi Asistencia</h1>
        <p className="text-muted-foreground">Porcentaje de asistencia: <span className="font-bold text-foreground">{percentage}%</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {myAttendance.map((a) => {
          const info = getAttendanceInfo(a.status);
          return (
            <Card key={a.id} className="glass-card animate-fade-in">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="text-sm">{new Date(a.date + "T12:00:00").toLocaleDateString("es", { weekday: "long", day: "numeric", month: "short" })}</span>
                <Badge variant="secondary" className={`${info.color} ${info.bg} border-0 text-xs`}>{info.label}</Badge>
              </CardContent>
            </Card>
          );
        })}
        {myAttendance.length === 0 && <p className="text-muted-foreground">No hay registros de asistencia</p>}
      </div>
    </div>
  );
}

export default function Attendance() {
  const { user } = useAuth();
  if (user?.role === "teacher" || user?.role === "admin") return <TeacherAttendance />;
  return <StudentAttendance />;
}
