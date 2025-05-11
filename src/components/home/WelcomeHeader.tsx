
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const WelcomeHeader: React.FC = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");

  // Extract first name from email
  useEffect(() => {
    try {
      if (user?.email) {
        const emailName = user.email.split("@")[0];
        const nameParts = emailName.split(".");
        if (nameParts.length > 0) {
          setFirstName(nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1));
        }
      }
    } catch (error) {
      console.error("Error processing user email:", error);
    }
  }, [user]);

  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold mb-4">
        Bienvenue sur votre Espace Botnb
      </h1>
      <p className="text-lg text-muted-foreground mb-2">
        Botnb ne demande qu'à vous connaître et vous aider !
      </p>
    </div>
  );
};

export default WelcomeHeader;
