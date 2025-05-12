
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Link, Copy } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const BotnbLink = () => {
  const { user } = useAuth();
  const [chatbotLink, setChatbotLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  useEffect(() => {
    if (user?.id) {
      fetchChatbotLink();
    }
  }, [user]);

  const fetchChatbotLink = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("clients")
        .select("chatbot_link")
        .eq("id", user?.id)
        .maybeSingle();
      
      if (error) throw error;
      
      setChatbotLink(data?.chatbot_link || "");
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération du lien chatbot:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le lien du chatbot. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const saveChatbotLink = async () => {
    if (!user?.id) return;
    
    try {
      setIsSaving(true);
      
      // Valider le format de l'URL (simple vérification)
      if (chatbotLink && !isValidUrl(chatbotLink)) {
        toast({
          title: "Format incorrect",
          description: "Veuillez entrer une URL valide (commençant par http:// ou https://)",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      const { error } = await supabase
        .from("clients")
        .update({ chatbot_link: chatbotLink })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({
        title: "Lien enregistré",
        description: "Votre lien BotnB Link a été mis à jour avec succès.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du lien chatbot:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le lien du chatbot. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">BotnB Chatbot Link</h1>
      
      <div className="grid grid-cols-1 gap-6">
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
            ) : isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="chatbotLink" className="text-sm font-medium">URL du chatbot</label>
                  <div className="flex gap-2">
                    <Input
                      id="chatbotLink"
                      value={chatbotLink}
                      onChange={(e) => setChatbotLink(e.target.value)}
                      placeholder="https://votre-chatbot-url.com"
                      className="flex-1"
                    />
                    <Button 
                      onClick={saveChatbotLink} 
                      disabled={isSaving}
                    >
                      {isSaving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        fetchChatbotLink();
                        setIsEditing(false);
                      }}
                      disabled={isSaving}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
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
                      <Button 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                        className="flex-shrink-0"
                      >
                        Modifier
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-muted p-4 rounded-md text-center">
                      <p className="text-muted-foreground mb-2">Vous n'avez pas encore configuré de lien BotnB Link</p>
                      <Button onClick={() => setIsEditing(true)}>
                        Ajouter un lien
                      </Button>
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
    </div>
  );
};

export default BotnbLink;
