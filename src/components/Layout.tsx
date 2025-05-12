
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import { motion } from "framer-motion";

const Layout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  // Déterminer si nous devons ajouter un padding-bottom plus petit pour certaines pages
  const needsReducedPadding = ['/beds24'].includes(location.pathname);

  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => setIsRouteChanging(false), 200);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Animation simplifiée pour de meilleures performances
  const pageTransition = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.15 }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {isMobile ? (
          <>
            <Navbar isMobile={true} />
            <main className={`flex-1 ${needsReducedPadding ? 'pb-12' : 'pb-16'}`}>
              <div className="container-layout py-3 md:py-4">
                <motion.div
                  key={location.pathname}
                  {...pageTransition}
                >
                  <Outlet />
                </motion.div>
              </div>
            </main>
            <MobileNavbar />
          </>
        ) : (
          <div className="flex h-full min-h-screen w-full">
            <Sidebar />
            <div className="flex flex-col flex-1">
              <Navbar isMobile={false} />
              <main className="flex-1 p-5 overflow-auto">
                <div className="container-layout">
                  <motion.div
                    key={location.pathname}
                    {...pageTransition}
                  >
                    <Outlet />
                  </motion.div>
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
