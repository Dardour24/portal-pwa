
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import PageTransition from "./ui/page-transition";

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

  // Extracted common content rendering to reduce duplication
  const renderContent = () => (
    <PageTransition pathname={location.pathname}>
      <Outlet />
    </PageTransition>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        {isMobile ? (
          // Mobile layout
          <>
            <Navbar isMobile={true} />
            <main className={`flex-1 ${needsReducedPadding ? 'pb-12' : 'pb-16'}`}>
              <div className="container-layout py-3 md:py-4">
                {renderContent()}
              </div>
            </main>
            <MobileNavbar />
          </>
        ) : (
          // Desktop layout
          <div className="flex h-full min-h-screen w-full">
            <Sidebar />
            <div className="flex flex-col flex-1">
              <Navbar isMobile={false} />
              <main className="flex-1 p-5 overflow-auto">
                <div className="container-layout">
                  {renderContent()}
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
