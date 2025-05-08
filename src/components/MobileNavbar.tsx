
import { Home, User, House, Bed, HelpCircle, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`mobile-nav-link ${
              isActive(item.path)
                ? "text-primary"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
