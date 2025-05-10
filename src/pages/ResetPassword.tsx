
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { updatePassword } from "../hooks/auth/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "../lib/supabase";

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type FormValues = z.infer<typeof passwordSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidResetLink, setIsValidResetLink] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    // Check if we're on a valid reset password page
    const checkResetSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        setIsValidResetLink(false);
        setError("Ce lien de réinitialisation est invalide ou expiré.");
      } else {
        setIsValidResetLink(true);
      }
    };

    checkResetSession();
  }, []);

  const handleSubmit = async (values: FormValues) => {
    if (!isValidResetLink) {
      setError("Ce lien de réinitialisation est invalide ou expiré.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updatePassword(values.password);
      
      if (result.success) {
        setSuccess(true);
        toast({
          title: "Mot de passe mis à jour",
          description: "Votre mot de passe a été réinitialisé avec succès."
        });
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else {
        setError(result.error || "Une erreur est survenue lors de la réinitialisation du mot de passe.");
      }
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/b97f6b22-40f5-4de9-9245-072e4eeb6895.png" 
            alt="Botnb Logo" 
            className="h-16 mx-auto mb-4" 
          />
          <h2 className="text-3xl font-bold">Portail Client Botnb</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Réinitialisation du mot de passe</CardTitle>
            <CardDescription>
              Créez un nouveau mot de passe pour votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200 animate-fade-in">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !isValidResetLink || success}
                >
                  {isLoading ? "Mise à jour en cours..." : "Réinitialiser le mot de passe"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <Link to="/signin" className="text-primary hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
