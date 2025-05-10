
import { Home, User, House, Bed, HelpCircle, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MobileNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: House, label: "Logements", path: "/properties" },
    { icon: Bed, label: "Beds24", path: "/beds24" },
    { icon: User, label: "Profil", path: "/profile" },
    { icon: HelpCircle, label: "FAQ", path: "/faq" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-950 border-t border-separator shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`mobile-nav-link relative ${
              isActive(item.path)
                ? "text-primary"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => navigate(item.path)}
          >
            {isActive(item.path) && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                layoutId="mobile-nav-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            <item.icon className="h-5 w-5 transition-colors" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
