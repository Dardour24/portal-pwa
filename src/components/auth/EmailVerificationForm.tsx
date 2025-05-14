import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const emailSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface EmailVerificationFormProps {
  onEmailVerified: (email: string) => void;
}

export const EmailVerificationForm = ({
  onEmailVerified,
}: EmailVerificationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: EmailFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if email exists in registered_email table
      const { data, error } = await supabase
        .from("registered_email")
        .select("email")
        .eq("email", values.email)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned - email not found
          setError(
            "Cette adresse email n'est pas configurée dans notre système. Veuillez contacter votre administrateur pour configurer votre accès."
          );
          toast({
            title: "Email non configuré",
            description:
              "Cette adresse email n'est pas configurée dans notre système. Veuillez contacter votre administrateur pour configurer votre accès.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (data) {
        // Email is registered, proceed to signup
        onEmailVerified(values.email);
      }
    } catch (error: any) {
      console.error("Error verifying email:", error);
      if (error.code !== "PGRST116") {
        setError(
          "Une erreur est survenue lors de la vérification de l'email. Veuillez réessayer."
        );
        toast({
          title: "Erreur de vérification",
          description:
            "Une erreur est survenue lors de la vérification de l'email. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
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
          Vérification de votre email
        </h1>
        <p className="text-sm text-muted-foreground">
          Entrez votre email pour vérifier votre éligibilité
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            {isLoading ? "Vérification..." : "Vérifier l'email"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};
