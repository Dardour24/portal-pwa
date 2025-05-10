
import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../hooks/auth/authService";
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

const emailSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide")
});

type FormValues = z.infer<typeof emailSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    }
  });

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const result = await resetPassword(values.email);
      
      if (result.success) {
        setSuccess(true);
        toast({
          title: "Email envoyé",
          description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation."
        });
      } else {
        setError(result.error || "Une erreur est survenue lors de l'envoi du lien de réinitialisation.");
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue."
        });
      }
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue lors de l'envoi du lien de réinitialisation.");
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue."
      });
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
            <CardTitle>Mot de passe oublié</CardTitle>
            <CardDescription>
              Entrez votre adresse email pour recevoir un lien de réinitialisation
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
                  Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.
                </AlertDescription>
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
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
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

export default ForgotPassword;
