import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, lazy, Suspense } from "react";
import { verifySupabaseSetup } from "./utils/verifySupabaseSetup";
import { Spinner } from "./components/ui/spinner";
import { CustomCursor } from "./components/CustomCursor";
import "./styles/cursor.css";

// Pages chargées de manière différée avec React.lazy
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Properties = lazy(() => import("./pages/Properties"));
const Beds24 = lazy(() => import("./pages/Beds24"));
const Faq = lazy(() => import("./pages/Faq"));
const Contact = lazy(() => import("./pages/Contact"));
const BotnbLink = lazy(() => import("./pages/BotnbLink")); // Nouvelle page BotnbLink
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Composant de chargement pour Suspense
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <Spinner className="h-10 w-10" />
  </div>
);

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
    verifySupabaseSetup().then((isConfigured) => {
      console.log(
        "Configuration Supabase vérifiée:",
        isConfigured ? "OK" : "NON configurée"
      );
      if (!isConfigured) {
        console.warn(
          "IMPORTANT: La configuration Supabase n'est pas complète. Veuillez exécuter le script SQL nécessaire dans l'éditeur SQL de Supabase."
        );
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <CustomCursor />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/" element={<Layout />}>
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="properties"
                    element={
                      <ProtectedRoute>
                        <Properties />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="beds24"
                    element={
                      <ProtectedRoute>
                        <Beds24 />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="botnblink"
                    element={
                      <ProtectedRoute>
                        <BotnbLink />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="faq" element={<Faq />} />
                  <Route path="contact" element={<Contact />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
