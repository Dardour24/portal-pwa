
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoSrc, setLogoSrc] = useState("/lovable-uploads/b97f6b22-40f5-4de9-9245-072e4eeb6895.png");
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleLogoError = () => {
    if (logoSrc.includes("/lovable-uploads/")) {
      // Try without prefix
      setLogoSrc("/b97f6b22-40f5-4de9-9245-072e4eeb6895.png");
    } else {
      setLogoError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {!logoError ? (
        <img 
          src={logoSrc} 
          alt="Botnb Logo" 
          className="h-20 mb-6" 
          onError={handleLogoError}
        />
      ) : (
        <div className="text-3xl font-bold mb-6">Botnb</div>
      )}
      <h1 className="text-6xl font-bold mb-4 text-gray-800 dark:text-gray-200">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 text-center">
        Oops! La page que vous recherchez n'existe pas.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate("/")}>
          Retour à l'accueil
        </Button>
        <Button variant="outline" onClick={() => navigate("/contact")}>
          Nous contacter
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
