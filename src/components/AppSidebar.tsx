import {
  LayoutDashboard, BookOpen, ClipboardCheck, Users, Bell,
  LogOut, GraduationCap, BarChart3, Calendar
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const teacherNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Calificaciones", url: "/grades", icon: BookOpen },
  { title: "Asistencia", url: "/attendance", icon: ClipboardCheck },
  { title: "Estudiantes", url: "/students", icon: Users },
  { title: "Reportes", url: "/reports", icon: BarChart3 },
  { title: "Anuncios", url: "/announcements", icon: Bell },
];

const studentNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Mis Calificaciones", url: "/grades", icon: BookOpen },
  { title: "Mi Asistencia", url: "/attendance", icon: ClipboardCheck },
  { title: "Horario", url: "/schedule", icon: Calendar },
  { title: "Anuncios", url: "/announcements", icon: Bell },
];

const parentNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Calificaciones", url: "/grades", icon: BookOpen },
  { title: "Asistencia", url: "/attendance", icon: ClipboardCheck },
  { title: "Anuncios", url: "/announcements", icon: Bell },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const navItems = user?.role === "teacher" ? teacherNav
    : user?.role === "student" ? studentNav : parentNav;

  return (
    <Sidebar collapsible="icon" className="gradient-sidebar border-r-0">
      <SidebarContent>
        {/* Brand */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-slide-in">
              <h2 className="font-heading font-bold text-sidebar-foreground text-sm">EduPortal</h2>
              <p className="text-xs text-sidebar-muted capitalize">{user?.role === "teacher" ? "Profesor" : user?.role === "student" ? "Estudiante" : "Padre/Tutor"}</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted text-xs uppercase tracking-wider">
            {!collapsed && "Navegación"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-4 h-4 mr-2 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user?.name?.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-muted truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!collapsed && "Cerrar sesión"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
