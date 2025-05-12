
import { Home, House, Bed, HelpCircle, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCallback, memo } from "react";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

// Composant d'élément de navigation extrait et mémorisé
const NavItem = memo(({ icon: Icon, label, path, isActive, onClick }: NavItemProps) => {
  return (
    <button
      className={`mobile-nav-link relative min-w-[20%] py-2 ${
        isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
      }`}
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <motion.span
          className="absolute bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
          layoutId="mobile-nav-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        />
      )}
      <Icon className="h-5 w-5 mx-auto mb-1 transition-colors" aria-hidden="true" />
      <span className="text-xs">{label}</span>
    </button>
  );
});

NavItem.displayName = "NavItem";

const MobileNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: House, label: "Logements", path: "/properties" },
    { icon: Bed, label: "Beds24", path: "/beds24" },
    { icon: HelpCircle, label: "FAQ", path: "/faq" },
    { icon: Mail, label: "Contact", path: "/contact" },
  ];

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);
  
  const handleNavigate = useCallback((path: string) => () => {
    navigate(path);
  }, [navigate]);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-950 border-t border-separator shadow-lg"
      aria-label="Navigation mobile"
    >
      <div className="flex justify-around items-center h-16" role="menubar">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={isActive(item.path)}
            onClick={handleNavigate(item.path)}
          />
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
