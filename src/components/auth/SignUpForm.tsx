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
import { motion, AnimatePresence } from "framer-motion";

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

interface SignUpFormProps {
  verifiedEmail: string;
}

export const SignUpForm = ({ verifiedEmail }: SignUpFormProps) => {
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
        verifiedEmail,
        values.password,
        values.firstName,
        values.lastName,
        values.phoneNumber,
        values.hcaptchaToken
      );

      toast({
        title: "Compte créé avec succès",
        description: "Veuillez vous connecter pour accéder à votre compte.",
      });

      navigate("/signin");
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Créer votre compte
        </h1>
        <p className="text-sm text-muted-foreground">
          Complétez les informations ci-dessous pour créer votre compte
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="Prénom"
                        className="pl-9"
                        disabled={isLoading}
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
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="Nom"
                        className="pl-9"
                        disabled={isLoading}
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
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Numéro de téléphone"
                      className="pl-9"
                      disabled={isLoading}
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
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Mot de passe"
                      className="pl-9"
                      disabled={isLoading}
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
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirmer le mot de passe"
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <HCaptcha
              ref={hcaptchaRef}
              sitekey={
                import.meta.env.PUBLIC_HCAPTCHA_SITE_KEY ||
                "a1f4b8aa-17ee-4a78-b296-d88c39a66a26"
              }
              onVerify={(token) => form.setValue("hcaptchaToken", token)}
              onExpire={() => form.setValue("hcaptchaToken", "")}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Création du compte..." : "Créer le compte"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};
