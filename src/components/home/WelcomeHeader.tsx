
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const WelcomeHeader: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");

  // Extraire le nom à afficher
  useEffect(() => {
    if (user && user.first_name) {
      setDisplayName(user.first_name);
    } else if (user && user.email) {
      setDisplayName("");
    }
  }, [user]);

  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold mb-4">
        Bienvenue {displayName ? `${displayName}` : ""} sur votre Espace Botnb
      </h1>
      <p className="text-lg text-muted-foreground mb-2">
        Botnb ne demande qu'à vous connaître et vous aider !
      </p>
    </div>
  );
};

export default WelcomeHeader;
