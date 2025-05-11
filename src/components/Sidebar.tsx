
import { Sidebar as SidebarComponent, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarFooter } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigation, House, Bed, HelpCircle, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { title: "Accueil", path: "/", icon: Navigation },
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
    <SidebarComponent className="w-[230px] shadow-md">
      <SidebarHeader className="py-4">
        <div className="logo-container flex justify-center">
          <img 
            src="/lovable-uploads/b97f6b22-40f5-4de9-9245-072e4eeb6895.png" 
            alt="Botnb Logo" 
            className="h-10" 
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-1">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={`relative ${isActive(item.path) ? "bg-sidebar-accent text-primary font-medium" : ""}`}
                    onClick={() => navigate(item.path)}
                  >
                    {isActive(item.path) && (
                      <motion.span 
                        className="sidebar-active-indicator"
                        layoutId="sidebar-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
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
          className="w-full justify-start hover:bg-red-50 hover:text-red-600 transition-colors" 
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
