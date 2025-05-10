
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { verifySupabaseSetup } from "./utils/verifySupabaseSetup";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Properties from "./pages/Properties";
import Beds24 from "./pages/Beds24";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Vérifier la configuration Supabase au chargement initial de l'application
    verifySupabaseSetup()
      .then(isConfigured => {
        console.log("Configuration Supabase vérifiée:", isConfigured ? "OK" : "NON configurée");
        if (!isConfigured) {
          console.warn("IMPORTANT: La configuration Supabase n'est pas complète. Veuillez exécuter le script SQL nécessaire dans l'éditeur SQL de Supabase.");
        }
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="properties" element={
                  <ProtectedRoute>
                    <Properties />
                  </ProtectedRoute>
                } />
                <Route path="beds24" element={
                  <ProtectedRoute>
                    <Beds24 />
                  </ProtectedRoute>
                } />
                <Route path="faq" element={<Faq />} />
                <Route path="contact" element={<Contact />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
