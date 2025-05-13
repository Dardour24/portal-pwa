import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Mail, Lock } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
  hcaptchaToken: z
    .string()
    .min(1, "Veuillez compléter la vérification HCaptcha"),
});

export type SignInFormValues = z.infer<typeof loginSchema>;

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const hcaptchaRef = useRef<HCaptcha>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      hcaptchaToken: "",
    },
  });

  const handleSubmit = async (values: SignInFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(
        values.email,
        values.password,
        values.hcaptchaToken
      );

      if (result.user) {
        await new Promise((resolve) => setTimeout(resolve, 300));

        toast({
          title: "Connecté avec succès",
          description: "Bienvenue sur votre portail client Botnb.",
        });
        navigate("/");
      } else {
        setError("Erreur de connexion : identifiants invalides.");
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe invalide.",
        });
      }
    } catch (error: any) {
      console.error("Error during login:", error);

      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect. Veuillez réessayer.");
        } else if (error.message.includes("Email not confirmed")) {
          setError(
            "Veuillez vérifier votre email pour confirmer votre compte."
          );
        } else {
          setError(
            error.message || "Une erreur est survenue lors de la connexion."
          );
        }
      } else {
        setError("Une erreur est survenue lors de la connexion.");
      }

      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe invalide.",
      });
    } finally {
      setIsLoading(false);
      hcaptchaRef.current?.resetCaptcha();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary focus:ring-primary/20"
                    {...field}
                  />
                </div>
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
              <FormLabel className="text-sm font-medium">
                Mot de passe
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary focus:ring-primary/20"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hcaptchaToken"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <HCaptcha
                  ref={hcaptchaRef}
                  sitekey={
                    import.meta.env.PUBLIC_HCAPTCHA_SITE_KEY ||
                    "a1f4b8aa-17ee-4a78-b296-d88c39a66a26"
                  }
                  onVerify={(token) => field.onChange(token)}
                  onExpire={() => field.onChange("")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Connexion en cours...
            </div>
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>
    </Form>
  );
};
