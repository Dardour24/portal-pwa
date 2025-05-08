
import { useState, useEffect } from "react";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isMobile: boolean;
}

const Navbar = ({ isMobile }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 transition-shadow duration-300 bg-white dark:bg-gray-950 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      {/* Left side */}
      <div className="flex items-center">
        {!isMobile && (
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
        )}
        
        {isMobile && (
          <div className="logo-container">
            <img 
              src="/lovable-uploads/b97f6b22-40f5-4de9-9245-072e4eeb6895.png" 
              alt="Botnb Logo" 
              className="h-10" 
            />
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Navbar;
