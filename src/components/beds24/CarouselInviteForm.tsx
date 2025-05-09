
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CarouselInviteFormProps {
  onPrev: () => void;
}

const CarouselInviteForm: React.FC<CarouselInviteFormProps> = ({ onPrev }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const submitInviteCode = async () => {
    if (!inviteCode.trim()) {
      toast.error("Veuillez entrer un code d'invitation");
      return;
    }
    
    if (!user) {
      toast.error("Vous devez être connecté pour soumettre un code");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({ invite_code: inviteCode })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Les informations ont bien été reçues");
      setInviteCode("");
    } catch (error) {
      console.error("Erreur lors de la soumission du code:", error);
      toast.error("Une erreur est survenue lors de la soumission du code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="mb-6 h-[300px] flex items-center justify-center">
          <img 
            src="/lovable-uploads/491cf472-5a9d-43f2-87cb-a122e4d3d45b.png" 
            alt="BotnB Logo" 
            className="max-h-[300px] rounded-lg object-contain" 
          />
        </div>
        <div className="text-center mb-6">
          <p className="whitespace-pre-line">Copiez le code\n\nDans le champ ci-dessous.</p>
        </div>
        <div className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
              Votre Invite Code
            </label>
            <Input 
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Collez votre code d'invitation ici"
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onPrev}>
              Étape précédente
            </Button>
            <Button 
              onClick={submitInviteCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Soumission..." : "Soumettre"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarouselInviteForm;
