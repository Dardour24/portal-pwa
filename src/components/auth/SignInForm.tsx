
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
  password: z.string().min(1, "Le mot de passe est requis")
});

export type SignInFormValues = z.infer<typeof loginSchema>;

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = async (values: SignInFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login(values.email, values.password);
      
      if (result.user) {
        toast({
          title: "Connecté avec succès",
          description: "Bienvenue sur votre portail client Botnb."
        });
        navigate("/");
      } else {
        setError("Erreur de connexion : identifiants invalides.");
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe invalide."
        });
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      
      // Gestion spécifique des erreurs
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect. Veuillez réessayer.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Veuillez vérifier votre email pour confirmer votre compte.");
        } else {
          setError(error.message || "Une erreur est survenue lors de la connexion.");
        }
      } else {
        setError("Une erreur est survenue lors de la connexion.");
      }
      
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe invalide."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4 animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="votre@email.com"
                    {...field}
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Mot de passe</FormLabel>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    autoComplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Form>
    </>
  );
};
