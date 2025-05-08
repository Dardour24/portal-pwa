
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        navigate("/");
      } else {
        await signup(email, password, firstName, lastName, phoneNumber);
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      toast({
        title: isLogin ? "Erreur de connexion" : "Erreur d'inscription",
        description: error.message || (isLogin ? "Email ou mot de passe incorrect." : "Erreur lors de l'inscription."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>
        
        <div className="flex justify-center mb-6">
          <div className="flex rounded-md overflow-hidden">
            <button
              className={`px-4 py-2 ${
                isLogin
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Connexion
            </button>
            <button
              className={`px-4 py-2 ${
                !isLogin
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Inscription
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={!isLogin}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={!isLogin}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Numéro de téléphone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border rounded mb-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded mb-2"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-900 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Chargement...
              </>
            ) : (
              isLogin ? "Se connecter" : "S'inscrire"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
