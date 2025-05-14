import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Update fields when user changes
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate saving profile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    });

    setIsLoading(false);
    setIsEditing(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Mon Compte / Profil
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="col-span-2" variants={itemVariants}>
          <Card className="overflow-hidden border-2 border-blue-50/50 hover:border-blue-100/50 transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="bg-gradient-to-r from-blue-50/80 to-blue-100/50 border-b border-blue-100/50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <User className="h-5 w-5 text-blue-600" />
                Informations Personnelles
              </CardTitle>
              <CardDescription className="text-blue-600/80">
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-blue-900"
                    >
                      Prénom
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-blue-500/70" />
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setIsEditing(true);
                        }}
                        placeholder="Prénom"
                        className="pl-9 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-blue-900"
                    >
                      Nom
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-blue-500/70" />
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          setIsEditing(true);
                        }}
                        placeholder="Nom"
                        className="pl-9 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-blue-900"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-500/70" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setIsEditing(true);
                      }}
                      placeholder="votre@email.com"
                      className="pl-9 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-end gap-4"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEmail(user?.email || "");
                          setFirstName(user?.first_name || "");
                          setLastName(user?.last_name || "");
                        }}
                        disabled={isLoading}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      >
                        Annuler
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                          "relative bg-blue-600 hover:bg-blue-700 text-white",
                          isLoading && "cursor-not-allowed"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {isLoading ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Enregistrement...
                            </motion.div>
                          ) : (
                            <motion.div
                              key="save"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Enregistrer
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border-2 border-blue-50/50 hover:border-blue-100/50 transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="bg-gradient-to-r from-blue-50/80 to-blue-100/50 border-b border-blue-100/50">
              <CardTitle className="text-lg text-blue-900">
                Statut du Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700/80">
                    Email vérifié
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Oui
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700/80">
                    Dernière connexion
                  </span>
                  <span className="text-sm text-blue-600/80">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
