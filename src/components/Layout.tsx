
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";

const Layout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    setIsRouteChanging(true);
    const timer = setTimeout(() => setIsRouteChanging(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  console.log("Layout rendering", { isMobile, path: location.pathname });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {isMobile ? (
          <>
            <Navbar isMobile={true} />
            <main className="flex-1 pb-16">
              <div className={`page-transition ${isRouteChanging ? 'page-exit-active' : 'page-enter-active'}`}>
                <Outlet />
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
                <div className={`page-transition ${isRouteChanging ? 'page-exit-active' : 'page-enter-active'}`}>
                  <Outlet />
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
