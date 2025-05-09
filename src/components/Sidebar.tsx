
import { Sidebar as SidebarComponent, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarFooter } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, House, Bed, HelpCircle, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { title: "Accueil", path: "/", icon: Home },
    // Removed "Mon Compte / Profil" entry
    { title: "Mes Logements", path: "/properties", icon: House },
    { title: "Mon Beds24", path: "/beds24", icon: Bed },
    { title: "FAQ", path: "/faq", icon: HelpCircle },
    { title: "Nous Contacter", path: "/contact", icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <SidebarComponent>
      <SidebarHeader className="py-6">
        <div className="logo-container">
          <img 
            src="/lovable-uploads/b97f6b22-40f5-4de9-9245-072e4eeb6895.png" 
            alt="Botnb Logo" 
            className="h-12" 
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={isActive(item.path) ? "bg-sidebar-accent" : ""}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Déconnexion</span>
        </Button>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
