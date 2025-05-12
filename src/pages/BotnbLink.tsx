
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Link, Copy, User } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const BotnbLink = () => {
  const { user } = useAuth();
  const [chatbotLink, setChatbotLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clientData, setClientData] = useState<{first_name?: string, last_name?: string, phone?: string} | null>(null);
  
  useEffect(() => {
    if (user?.id) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = async () => {
    try {
      setIsLoading(true);
      
      console.log("Fetching client data for user ID:", user?.id);
      
      const { data, error } = await supabase
        .from("clients")
        .select("chatbot_link, first_name, last_name, phone")
        .eq("id", user?.id)
        .maybeSingle();
      
      if (error) {
        console.error("Erreur lors de la récupération des données client:", error);
        throw error;
      }
      
      console.log("Client data fetched:", data);
      
      setChatbotLink(data?.chatbot_link || "");
      setClientData({
        first_name: data?.first_name || "",
        last_name: data?.last_name || "",
        phone: data?.phone || ""
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données client. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!chatbotLink) return;
    
    navigator.clipboard.writeText(chatbotLink)
      .then(() => {
        toast({
          title: "Copié !",
          description: "Le lien a été copié dans le presse-papier.",
        });
      })
      .catch(() => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien. Veuillez le copier manuellement.",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">BotnB Chatbot Link</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                BotnB Chatbot Link
              </CardTitle>
              <CardDescription>
                Communication directe sans complexité : Idéal pour les hôtes sans gestionnaire de canaux comme Beds24 ou qui ne veulent pas utiliser WhatsApp. Ce service fournit un lien vers un chatbot que vous pouvez partager avec les voyageurs, leur permettant de recevoir des réponses immédiates à leurs questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Votre lien BotnB Link</p>
                    {chatbotLink ? (
                      <div className="flex items-center gap-2">
                        <div className="bg-muted p-2 rounded-md flex-1 overflow-hidden flex items-center">
                          <Link className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm truncate">{chatbotLink}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={copyToClipboard}
                          className="flex-shrink-0"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copier
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-muted p-4 rounded-md text-center">
                        <p className="text-muted-foreground">Votre Link sera bientôt disponible</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            {chatbotLink && (
              <CardFooter className="border-t pt-4 pb-2">
                <p className="text-sm text-muted-foreground">
                  Partagez ce lien avec vos voyageurs pour leur permettre d'accéder directement au chatbot.
                </p>
              </CardFooter>
            )}
          </Card>
        </div>
        
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informations Utilisateur
              </CardTitle>
              <CardDescription>
                Données synchronisées depuis votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <Spinner className="h-8 w-8" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Nom</p>
                    <p>{clientData?.first_name} {clientData?.last_name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Téléphone</p>
                    <p>{clientData?.phone || "Non renseigné"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                    <p>{user?.email || "Non renseigné"}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 pb-2">
              <p className="text-sm text-muted-foreground">
                Ces informations sont automatiquement synchronisées depuis votre profil.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BotnbLink;
