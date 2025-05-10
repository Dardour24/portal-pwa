
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import { AnimatePresence, motion } from "framer-motion";

const Layout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => setIsRouteChanging(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {isMobile ? (
          <>
            <Navbar isMobile={true} />
            <main className="flex-1 pb-16">
              <div className="container-layout py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
            <MobileNavbar />
          </>
        ) : (
          <div className="flex h-full min-h-screen w-full">
            <Sidebar />
            <div className="flex flex-col flex-1">
              <Navbar isMobile={false} />
              <main className="flex-1 p-6 overflow-auto">
                <div className="container-layout">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Outlet />
                    </motion.div>
                  </AnimatePresence>
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
