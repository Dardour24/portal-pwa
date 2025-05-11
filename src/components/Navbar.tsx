
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
import { motion } from "framer-motion";

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
      className={`sticky top-0 z-30 flex items-center justify-between px-4 py-2 transition-all duration-300 bg-pageBackground dark:bg-gray-950 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      {/* Left side */}
      <div className="flex items-center">
        {!isMobile && (
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
        )}
        
        {isMobile && (
          <motion.div 
            className="logo-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src="/lovable-uploads/b97f6b22-40f5-4de9-9245-072e4eeb6895.png" 
              alt="Botnb Logo" 
              className="h-8" 
            />
          </motion.div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="sr-only">Mon Compte</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-card border border-gray-100">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-separator" />
              <DropdownMenuItem 
                onClick={() => navigate("/profile")}
                className="cursor-pointer hover:bg-gray-50"
              >
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer hover:bg-red-50 hover:text-red-600"
              >
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
