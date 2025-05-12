
import { useState, useEffect, useCallback, memo } from "react";
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
import { User as UserType } from "../types/auth";

interface MenuButtonProps {
  onClick: () => void;
}

// Mémoriser le bouton du menu pour éviter les re-rendus
const MenuButton = memo(({ onClick }: MenuButtonProps) => (
  <Button 
    variant="ghost" 
    size="icon" 
    className="mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    onClick={onClick}
    aria-label="Ouvrir le menu latéral"
  >
    <Menu className="h-5 w-5" aria-hidden="true" />
    <span className="sr-only">Toggle sidebar</span>
  </Button>
));

MenuButton.displayName = "MenuButton";

// Mémoriser le logo pour éviter les re-rendus
const Logo = memo(() => {
  const [imgSrc, setImgSrc] = useState<string>("/lovable-uploads/b97f6b22-40f5-4de9-9245-072e4eeb6895.png");
  const [imgError, setImgError] = useState<boolean>(false);

  // Gestionnaire d'erreur pour l'image du logo
  const handleImageError = () => {
    console.log("Logo image error, trying alternative path");
    // Essayer un chemin alternatif si l'image ne charge pas
    if (imgSrc.startsWith("/lovable-uploads/")) {
      setImgSrc("/b97f6b22-40f5-4de9-9245-072e4eeb6895.png"); // Essayer sans le préfixe
    } else {
      // Si toujours en échec, afficher un texte de remplacement
      setImgError(true);
    }
  };

  return (
    <motion.div 
      className="logo-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!imgError ? (
        <img 
          src={imgSrc} 
          alt="Botnb Logo" 
          className="h-8" 
          onError={handleImageError}
          loading="eager"
        />
      ) : (
        <span className="font-bold text-lg">Botnb</span>
      )}
    </motion.div>
  );
});

Logo.displayName = "Logo";

interface UserMenuProps {
  user: UserType | null;
  onProfileClick: () => void;
  onLogout: () => void;
}

// Mémoriser le menu utilisateur pour éviter les re-rendus
const UserMenu = memo(({ user, onProfileClick, onLogout }: UserMenuProps) => {
  if (!user) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Menu utilisateur"
        >
          <User className="h-5 w-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          <span className="sr-only">Mon Compte</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-card border border-gray-100">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-separator" />
        <DropdownMenuItem 
          onClick={onProfileClick}
          className="cursor-pointer hover:bg-gray-50"
          role="menuitem"
        >
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onLogout}
          className="cursor-pointer hover:bg-red-50 hover:text-red-600"
          role="menuitem"
        >
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

UserMenu.displayName = "UserMenu";

interface NavbarProps {
  isMobile: boolean;
}

const Navbar = ({ isMobile }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Gérer le défilement de manière optimisée avec un throttle implicite
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

  // Mémoriser les gestionnaires d'événements pour éviter les re-rendus
  const handleLogout = useCallback(() => {
    logout();
    navigate("/signin");
  }, [logout, navigate]);

  const handleProfileClick = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-4 py-2 transition-all duration-300 bg-pageBackground dark:bg-gray-950 ${
        scrolled ? "shadow-md" : ""
      }`}
      role="banner"
    >
      {/* Left side */}
      <div className="flex items-center">
        {!isMobile && (
          <SidebarTrigger>
            <MenuButton onClick={() => {}} />
          </SidebarTrigger>
        )}
        
        {isMobile && <Logo />}
      </div>

      {/* Right side */}
      <div className="flex items-center">
        <UserMenu 
          user={user} 
          onProfileClick={handleProfileClick} 
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default Navbar;
