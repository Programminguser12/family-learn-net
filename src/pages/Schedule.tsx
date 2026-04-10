import { useSubjects } from "@/hooks/useSchoolData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const schedule = [
  { day: "Lunes", classes: [{ time: "8:00 - 9:30", subject: "Matemáticas" }, { time: "9:45 - 11:15", subject: "Español" }, { time: "11:30 - 13:00", subject: "Ciencias" }] },
  { day: "Martes", classes: [{ time: "8:00 - 9:30", subject: "Historia" }, { time: "9:45 - 11:15", subject: "Inglés" }, { time: "11:30 - 13:00", subject: "Matemáticas" }] },
  { day: "Miércoles", classes: [{ time: "8:00 - 9:30", subject: "Español" }, { time: "9:45 - 11:15", subject: "Ciencias" }, { time: "11:30 - 13:00", subject: "Historia" }] },
  { day: "Jueves", classes: [{ time: "8:00 - 9:30", subject: "Inglés" }, { time: "9:45 - 11:15", subject: "Matemáticas" }, { time: "11:30 - 13:00", subject: "Español" }] },
  { day: "Viernes", classes: [{ time: "8:00 - 9:30", subject: "Ciencias" }, { time: "9:45 - 11:15", subject: "Historia" }, { time: "11:30 - 13:00", subject: "Inglés" }] },
];

export default function Schedule() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Mi Horario</h1>
        <p className="text-muted-foreground">Horario semanal de clases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {schedule.map(day => (
          <Card key={day.day} className="glass-card animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                {day.day}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {day.classes.map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground">{c.time}</p>
                  <p className="text-sm font-medium mt-0.5">{c.subject}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
