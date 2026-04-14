import { useState } from "react";
import { useStudents, useGrades, useAttendance, useAddStudent, useUpdateStudent, useDeleteStudent, getGradeColor } from "@/hooks/useSchoolData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Students() {
  const { data: students = [] } = useStudents();
  const { data: allGrades = [] } = useGrades();
  const { data: allAttendance = [] } = useAttendance();
  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const { toast } = useToast();
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", grade: "3° A" });
  const [editForm, setEditForm] = useState({ id: "", name: "", grade: "" });

  const handleAdd = async () => {
    if (!form.name) return;
    try {
      await addStudent.mutateAsync({ name: form.name, grade: form.grade });
      toast({ title: "Estudiante agregado" });
      setAddOpen(false);
      setForm({ name: "", grade: "3° A" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleEdit = async () => {
    if (!editForm.name) return;
    try {
      await updateStudent.mutateAsync({ id: editForm.id, name: editForm.name, grade: editForm.grade });
      toast({ title: "Estudiante actualizado" });
      setEditOpen(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteStudent.mutateAsync(deleteId);
      toast({ title: "Estudiante eliminado" });
      setDeleteId(null);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const openEdit = (student: { id: string; name: string; grade: string }) => {
    setEditForm({ id: student.id, name: student.name, grade: student.grade });
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Estudiantes</h1>
          <p className="text-muted-foreground">{students.length} estudiantes inscritos</p>
        </div>
        {isTeacher && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
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
        )}
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
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm truncate">{student.name}</h3>
                    <p className="text-xs text-muted-foreground">{student.grade}</p>
                  </div>
                  {isTeacher && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(student)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(student.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Estudiante</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nombre completo</Label><Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Grado</Label><Input value={editForm.grade} onChange={e => setEditForm(f => ({ ...f, grade: e.target.value }))} /></div>
            <Button onClick={handleEdit} disabled={updateStudent.isPending} className="w-full gradient-primary text-primary-foreground">
              {updateStudent.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar estudiante?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminarán también sus calificaciones y registros de asistencia asociados.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
