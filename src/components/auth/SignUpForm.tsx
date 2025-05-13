import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
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
import { AlertCircle, Mail, Lock, User, Phone } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { motion } from "framer-motion";

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    phoneNumber: z
      .string()
      .min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres")
      .regex(/^[0-9+ ()-]{10,15}$/, "Format de téléphone invalide"),
    email: z.string().email("Adresse email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
    hcaptchaToken: z
      .string()
      .min(1, "Veuillez compléter la vérification HCaptcha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signupSchema>;

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const hcaptchaRef = useRef<HCaptcha>(null);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      hcaptchaToken: "",
    },
  });

  const handleSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await signup(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
        values.phoneNumber,
        values.hcaptchaToken
      );

      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue sur votre portail client Botnb.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error during signup:", error);

      let errorMessage = "Échec de la création du compte. Veuillez réessayer.";

      if (error.message) {
        if (error.message.includes("already been registered")) {
          errorMessage = "Cette adresse email est déjà utilisée.";
        } else if (error.message.includes("password")) {
          errorMessage =
            "Le mot de passe ne répond pas aux critères de sécurité.";
        } else {
          errorMessage = error.message;
        }
      }

      setError(errorMessage);

      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Prénom</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Jean"
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Nom</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Dupont"
                      className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary focus:ring-primary/20"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Numéro de téléphone
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="tel"
                    placeholder="06 12 34 56 78"
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Confirmer le mot de passe
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
              Création en cours...
            </div>
          ) : (
            "S'inscrire"
          )}
        </Button>
      </form>
    </Form>
  );
};
