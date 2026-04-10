import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudents, useGrades, useSubjects, useMyStudent, useAddGrade, useDeleteGrade, getGradeColor, getGradeBg } from "@/hooks/useSchoolData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function TeacherGrades() {
  const { data: subjects = [] } = useSubjects();
  const { data: students = [] } = useStudents();
  const [selectedSubject, setSelectedSubject] = useState("");
  const { data: subjectGrades = [] } = useGrades(selectedSubject ? { subjectId: selectedSubject } : undefined);
  const addGrade = useAddGrade();
  const deleteGrade = useDeleteGrade();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ student_id: "", value: "", type: "exam", description: "" });

  const subject = subjects.find(s => s.id === selectedSubject);

  // Auto-select first subject
  if (!selectedSubject && subjects.length > 0) {
    setSelectedSubject(subjects[0].id);
  }

  const handleAdd = async () => {
    if (!form.student_id || !form.value || !selectedSubject) return;
    try {
      await addGrade.mutateAsync({
        student_id: form.student_id,
        subject_id: selectedSubject,
        value: parseInt(form.value),
        type: form.type,
        description: form.description,
        date: new Date().toISOString().split("T")[0],
      });
      toast({ title: "Calificación agregada" });
      setOpen(false);
      setForm({ student_id: "", value: "", type: "exam", description: "" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Calificaciones</h1>
          <p className="text-muted-foreground">Gestiona las calificaciones de tus estudiantes</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Seleccionar materia" /></SelectTrigger>
            <SelectContent>
              {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" />Agregar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nueva Calificación</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Estudiante</Label>
                  <Select value={form.student_id} onValueChange={v => setForm(f => ({ ...f, student_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">Examen</SelectItem>
                      <SelectItem value="homework">Tarea</SelectItem>
                      <SelectItem value="project">Proyecto</SelectItem>
                      <SelectItem value="participation">Participación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Calificación (0-100)</Label>
                  <Input type="number" min={0} max={100} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ej: Examen parcial" />
                </div>
                <Button onClick={handleAdd} disabled={addGrade.isPending} className="w-full gradient-primary text-primary-foreground">
                  {addGrade.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            {subject?.name || "Selecciona una materia"} — Calificaciones
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
                  <th className="text-right text-xs text-muted-foreground font-medium py-3 pr-4">Nota</th>
                  <th className="text-right text-xs text-muted-foreground font-medium py-3"></th>
                </tr>
              </thead>
              <tbody>
                {subjectGrades.map((g) => {
                  const student = students.find(s => s.id === g.student_id);
                  return (
                    <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0">
                            {student?.name?.charAt(0) || "?"}
                          </div>
                          <span className="text-sm font-medium">{student?.name || "—"}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {g.type === "exam" ? "Examen" : g.type === "homework" ? "Tarea" : g.type === "project" ? "Proyecto" : "Participación"}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground">{g.description}</td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground">{g.date}</td>
                      <td className="py-3 pr-4 text-right">
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-heading font-bold text-sm ${getGradeColor(g.value)} ${getGradeBg(g.value)}`}>
                          {g.value}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteGrade.mutate(g.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {subjectGrades.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">No hay calificaciones para esta materia</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentGrades() {
  const { data: myStudent } = useMyStudent();
  const { data: myGrades = [] } = useGrades(myStudent ? { studentId: myStudent.id } : undefined);
  const { data: subjects = [] } = useSubjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Mis Calificaciones</h1>
        <p className="text-muted-foreground">Consulta tus notas por materia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => {
          const sg = myGrades.filter(g => g.subject_id === subject.id);
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
                  {sg.map((g) => (
                    <div key={g.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{g.description}</span>
                      <span className={`font-medium ${getGradeColor(g.value)}`}>{g.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {myGrades.length === 0 && <p className="text-muted-foreground">No hay calificaciones aún</p>}
      </div>
    </div>
  );
}

export default function Grades() {
  const { user } = useAuth();
  if (user?.role === "teacher" || user?.role === "admin") return <TeacherGrades />;
  return <StudentGrades />;
}
