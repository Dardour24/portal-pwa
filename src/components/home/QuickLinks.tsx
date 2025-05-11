
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const QuickLinks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:hidden">
      <Button onClick={() => navigate('/properties')} className="w-full">
        Mes Logements <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Button onClick={() => navigate('/beds24')} className="w-full">
        Mon Beds24 <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuickLinks;
