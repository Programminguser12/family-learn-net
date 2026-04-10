import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAnnouncements, useAddAnnouncement } from "@/hooks/useSchoolData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Calendar, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Announcements() {
  const { user } = useAuth();
  const { data: announcements = [] } = useAnnouncements();
  const addAnnouncement = useAddAnnouncement();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", priority: "medium", author: "" });
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const handleAdd = async () => {
    if (!form.title || !form.content) return;
    try {
      await addAnnouncement.mutateAsync({
        title: form.title,
        content: form.content,
        priority: form.priority,
        author: form.author || user?.name || "",
        date: new Date().toISOString().split("T")[0],
      });
      toast({ title: "Anuncio publicado" });
      setOpen(false);
      setForm({ title: "", content: "", priority: "medium", author: "" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Anuncios</h1>
          <p className="text-muted-foreground">Comunicados y avisos importantes</p>
        </div>
        {isTeacher && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-1" />Nuevo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nuevo Anuncio</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Título</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título del anuncio" /></div>
                <div><Label>Contenido</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Escribe el contenido..." /></div>
                <div><Label>Prioridad</Label>
                  <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Informativo</SelectItem>
                      <SelectItem value="medium">Importante</SelectItem>
                      <SelectItem value="high">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Autor</Label><Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder={user?.name || "Autor"} /></div>
                <Button onClick={handleAdd} disabled={addAnnouncement.isPending} className="w-full gradient-primary text-primary-foreground">
                  {addAnnouncement.isPending ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} className="glass-card animate-fade-in hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-4 h-4 text-accent" />
                    <h3 className="font-heading font-semibold">{a.title}</h3>
                    <Badge variant={a.priority === "high" ? "destructive" : a.priority === "medium" ? "default" : "secondary"} className="text-[10px]">
                      {a.priority === "high" ? "Urgente" : a.priority === "medium" ? "Importante" : "Informativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.content}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(a.date + "T12:00:00").toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span>·</span>
                    <span>{a.author}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && <p className="text-muted-foreground text-center py-8">No hay anuncios</p>}
      </div>
    </div>
  );
}
