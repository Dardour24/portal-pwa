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
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Mail,
  Lock,
  User,
  Phone,
  MessageCircle,
} from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneInput } from "@/components/ui/phone-input";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SignUpFormProps {
  verifiedEmail: string;
}

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    whatsappPhone: z.string().min(10, "Le numéro WhatsApp doit être valide"),
    phoneNumber: z.string().min(10, "Le numéro de téléphone doit être valide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string(),
    hcaptchaToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signupSchema>;

export function SignUpForm({ verifiedEmail }: SignUpFormProps) {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const hcaptchaRef = useRef<HCaptcha>(null);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      whatsappPhone: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      await signup(
        verifiedEmail,
        data.password,
        data.firstName,
        data.lastName,
        data.whatsappPhone,
        data.phoneNumber,
        data.hcaptchaToken || ""
      );
      toast({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter",
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
        variant: "destructive",
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                {...form.register("firstName")}
                placeholder="Entrez votre prénom"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                {...form.register("lastName")}
                placeholder="Entrez votre nom"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappPhone" className="flex items-center gap-2">
              <FaWhatsapp className="text-green-500" />
              Numéro WhatsApp
            </Label>
            <PhoneInput
              id="whatsappPhone"
              value={form.watch("whatsappPhone")}
              onChange={(value) => form.setValue("whatsappPhone", value)}
              placeholder="Entrez votre numéro WhatsApp"
            />
            <p className="text-sm text-muted-foreground">
              Ce numéro doit être un numéro WhatsApp valide
            </p>
            {form.formState.errors.whatsappPhone && (
              <p className="text-sm text-red-500">
                {form.formState.errors.whatsappPhone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <FaPhone className="text-blue-500" />
              Numéro de téléphone personnel
            </Label>
            <PhoneInput
              id="phoneNumber"
              value={form.watch("phoneNumber")}
              onChange={(value) => form.setValue("phoneNumber", value)}
              placeholder="Entrez votre numéro de téléphone"
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {form.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>

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
            {isLoading ? "Création du compte..." : "Créer un compte"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
