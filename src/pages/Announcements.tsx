import { announcements } from "@/data/schoolData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar } from "lucide-react";

export default function Announcements() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Anuncios</h1>
        <p className="text-muted-foreground">Comunicados y avisos importantes</p>
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
      </div>
    </div>
  );
}
