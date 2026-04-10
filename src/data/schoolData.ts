export interface Student {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  teacherId: string;
  color: string;
}

export interface Grade {
  studentId: string;
  subjectId: string;
  value: number;
  date: string;
  type: "exam" | "homework" | "project" | "participation";
  description: string;
}

export interface Attendance {
  studentId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  subjectId: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: "low" | "medium" | "high";
}

export const students: Student[] = [
  { id: "s1", name: "Carlos Rodríguez", grade: "3° A", parentId: "p1" },
  { id: "s2", name: "Lucía Fernández", grade: "3° A", parentId: "p2" },
  { id: "s3", name: "Miguel Torres", grade: "3° A", parentId: "p3" },
  { id: "s4", name: "Sofía López", grade: "3° A", parentId: "p4" },
  { id: "s5", name: "Diego Hernández", grade: "3° A", parentId: "p5" },
  { id: "s6", name: "Valentina Ruiz", grade: "3° A", parentId: "p6" },
  { id: "s7", name: "Andrés Morales", grade: "3° A", parentId: "p7" },
  { id: "s8", name: "Isabella Castro", grade: "3° A", parentId: "p8" },
];

export const subjects: Subject[] = [
  { id: "sub1", name: "Matemáticas", teacherId: "t1", color: "hsl(213 55% 25%)" },
  { id: "sub2", name: "Español", teacherId: "t1", color: "hsl(142 70% 40%)" },
  { id: "sub3", name: "Ciencias", teacherId: "t1", color: "hsl(38 92% 50%)" },
  { id: "sub4", name: "Historia", teacherId: "t1", color: "hsl(0 84% 60%)" },
  { id: "sub5", name: "Inglés", teacherId: "t1", color: "hsl(270 60% 50%)" },
];

export const grades: Grade[] = [
  { studentId: "s1", subjectId: "sub1", value: 92, date: "2026-04-01", type: "exam", description: "Examen parcial" },
  { studentId: "s1", subjectId: "sub2", value: 88, date: "2026-04-02", type: "homework", description: "Ensayo literario" },
  { studentId: "s1", subjectId: "sub3", value: 95, date: "2026-04-03", type: "project", description: "Proyecto ecosistemas" },
  { studentId: "s1", subjectId: "sub4", value: 78, date: "2026-04-01", type: "exam", description: "Examen parcial" },
  { studentId: "s1", subjectId: "sub5", value: 85, date: "2026-04-02", type: "participation", description: "Participación en clase" },
  { studentId: "s2", subjectId: "sub1", value: 76, date: "2026-04-01", type: "exam", description: "Examen parcial" },
  { studentId: "s2", subjectId: "sub2", value: 94, date: "2026-04-02", type: "homework", description: "Ensayo literario" },
  { studentId: "s2", subjectId: "sub3", value: 82, date: "2026-04-03", type: "project", description: "Proyecto ecosistemas" },
  { studentId: "s3", subjectId: "sub1", value: 68, date: "2026-04-01", type: "exam", description: "Examen parcial" },
  { studentId: "s3", subjectId: "sub2", value: 71, date: "2026-04-02", type: "homework", description: "Ensayo literario" },
  { studentId: "s4", subjectId: "sub1", value: 99, date: "2026-04-01", type: "exam", description: "Examen parcial" },
  { studentId: "s4", subjectId: "sub2", value: 97, date: "2026-04-02", type: "homework", description: "Ensayo literario" },
  { studentId: "s5", subjectId: "sub1", value: 55, date: "2026-04-01", type: "exam", description: "Examen parcial" },
  { studentId: "s5", subjectId: "sub2", value: 62, date: "2026-04-02", type: "homework", description: "Ensayo literario" },
  { studentId: "s6", subjectId: "sub1", value: 88, date: "2026-04-01", type: "exam", description: "Examen parcial" },
  { studentId: "s7", subjectId: "sub1", value: 73, date: "2026-04-01", type: "exam", description: "Examen parcial" },
  { studentId: "s8", subjectId: "sub1", value: 91, date: "2026-04-01", type: "exam", description: "Examen parcial" },
];

export const attendance: Attendance[] = [
  { studentId: "s1", date: "2026-04-07", status: "present", subjectId: "sub1" },
  { studentId: "s1", date: "2026-04-08", status: "present", subjectId: "sub1" },
  { studentId: "s1", date: "2026-04-09", status: "late", subjectId: "sub1" },
  { studentId: "s1", date: "2026-04-10", status: "present", subjectId: "sub1" },
  { studentId: "s2", date: "2026-04-07", status: "present", subjectId: "sub1" },
  { studentId: "s2", date: "2026-04-08", status: "absent", subjectId: "sub1" },
  { studentId: "s2", date: "2026-04-09", status: "present", subjectId: "sub1" },
  { studentId: "s2", date: "2026-04-10", status: "present", subjectId: "sub1" },
  { studentId: "s3", date: "2026-04-07", status: "absent", subjectId: "sub1" },
  { studentId: "s3", date: "2026-04-08", status: "absent", subjectId: "sub1" },
  { studentId: "s3", date: "2026-04-09", status: "excused", subjectId: "sub1" },
  { studentId: "s3", date: "2026-04-10", status: "present", subjectId: "sub1" },
  { studentId: "s4", date: "2026-04-07", status: "present", subjectId: "sub1" },
  { studentId: "s4", date: "2026-04-08", status: "present", subjectId: "sub1" },
  { studentId: "s4", date: "2026-04-09", status: "present", subjectId: "sub1" },
  { studentId: "s4", date: "2026-04-10", status: "present", subjectId: "sub1" },
  { studentId: "s5", date: "2026-04-07", status: "late", subjectId: "sub1" },
  { studentId: "s5", date: "2026-04-08", status: "present", subjectId: "sub1" },
  { studentId: "s5", date: "2026-04-09", status: "absent", subjectId: "sub1" },
  { studentId: "s5", date: "2026-04-10", status: "present", subjectId: "sub1" },
  { studentId: "s6", date: "2026-04-10", status: "present", subjectId: "sub1" },
  { studentId: "s7", date: "2026-04-10", status: "present", subjectId: "sub1" },
  { studentId: "s8", date: "2026-04-10", status: "absent", subjectId: "sub1" },
];

export const announcements: Announcement[] = [
  { id: "a1", title: "Reunión de padres", content: "Se convoca a reunión general de padres el viernes 18 de abril a las 5:00 PM.", date: "2026-04-10", author: "Dirección", priority: "high" },
  { id: "a2", title: "Exámenes parciales", content: "Los exámenes del segundo parcial se realizarán del 21 al 25 de abril.", date: "2026-04-09", author: "Coordinación Académica", priority: "high" },
  { id: "a3", title: "Feria de ciencias", content: "Inscripciones abiertas para la feria de ciencias 2026. Fecha límite: 15 de abril.", date: "2026-04-08", author: "Depto. Ciencias", priority: "medium" },
  { id: "a4", title: "Mantenimiento del sistema", content: "El portal estará en mantenimiento el domingo 13 de abril de 2:00 a 6:00 AM.", date: "2026-04-07", author: "Sistemas", priority: "low" },
];

export function getGradeColor(value: number): string {
  if (value >= 90) return "text-success";
  if (value >= 70) return "text-accent";
  if (value >= 60) return "text-warning";
  return "text-destructive";
}

export function getGradeBg(value: number): string {
  if (value >= 90) return "bg-success/10";
  if (value >= 70) return "bg-accent/10";
  if (value >= 60) return "bg-warning/10";
  return "bg-destructive/10";
}

export function getAttendanceIcon(status: Attendance["status"]) {
  switch (status) {
    case "present": return { label: "Presente", color: "text-success", bg: "bg-success/10" };
    case "absent": return { label: "Ausente", color: "text-destructive", bg: "bg-destructive/10" };
    case "late": return { label: "Tardanza", color: "text-warning", bg: "bg-warning/10" };
    case "excused": return { label: "Justificado", color: "text-accent", bg: "bg-accent/10" };
  }
}
