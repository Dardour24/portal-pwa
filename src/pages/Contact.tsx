import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Contact = () => {
  useEffect(() => {
    // Add any initialization code here if needed
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Nous Contacter
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Notre équipe est là pour vous aider. N'hésitez pas à nous contacter
          pour toute question ou assistance.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Support Email
              </CardTitle>
              <CardDescription>
                Contactez-nous par email pour toute assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg font-medium text-primary hover:text-primary/80 transition-colors duration-200">
                  contact.botnb@gmail.com
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                FAQ
              </CardTitle>
              <CardDescription>
                Consultez notre FAQ pour des réponses rapides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Retrouvez les réponses aux questions les plus fréquentes dans
                  notre FAQ.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/faq")}
                >
                  Voir la FAQ
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-12 text-center"
      >
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="py-8">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Besoin d'aide supplémentaire ?
            </h3>
            <p className="text-gray-600 mb-4">
              Notre équipe de support est disponible pour vous aider avec vos
              questions et préoccupations.
            </p>
            <p className="text-sm text-gray-500">
              Temps de réponse moyen : 12-24 heures
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Contact;
