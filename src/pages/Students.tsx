import { useState } from "react";
import { useStudents, useGrades, useAttendance, useAddStudent, getGradeColor } from "@/hooks/useSchoolData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Students() {
  const { data: students = [] } = useStudents();
  const { data: allGrades = [] } = useGrades();
  const { data: allAttendance = [] } = useAttendance();
  const addStudent = useAddStudent();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", grade: "3° A" });

  const handleAdd = async () => {
    if (!form.name) return;
    try {
      await addStudent.mutateAsync({ name: form.name, grade: form.grade });
      toast({ title: "Estudiante agregado" });
      setOpen(false);
      setForm({ name: "", grade: "3° A" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Estudiantes</h1>
          <p className="text-muted-foreground">{students.length} estudiantes inscritos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" />Agregar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo Estudiante</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Nombre completo</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre del estudiante" /></div>
              <div><Label>Grado</Label><Input value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} placeholder="Ej: 3° A" /></div>
              <Button onClick={handleAdd} disabled={addStudent.isPending} className="w-full gradient-primary text-primary-foreground">
                {addStudent.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(student => {
          const sg = allGrades.filter(g => g.student_id === student.id);
          const avg = sg.length ? Math.round(sg.reduce((s, g) => s + g.value, 0) / sg.length) : 0;
          const sa = allAttendance.filter(a => a.student_id === student.id);
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
        {students.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No hay estudiantes registrados</p>}
      </div>
    </div>
  );
}
