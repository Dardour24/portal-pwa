
import React from "react";
import { HomeIcon, Settings, Pencil, MessageCircle, Text, Ban } from "lucide-react";

// Helper to create icon elements with standard styling
const createIconElement = (Icon: React.ComponentType<any>) => {
  return React.createElement(Icon, {
    className: "h-8 w-8 mb-4 text-primary"
  });
};

// Card data configuration
export const cardData = [
  {
    id: "beds24",
    title: "Configurer vos accès à Beds24",
    text: "Rendez-vous sur la page Beds24 pour configurer un accès à votre compte afin de le connecter à votre Botnb.",
    image: "/lovable-uploads/f4040222-fd67-46ef-bba0-b7a1fbdfe543.png",
    icon: createIconElement(Settings),
    buttonText: "Mon Beds24",
    buttonLink: "/beds24"
  },
  {
    id: "logement",
    title: "Transmettez les Informations de votre Logement",
    text: "BotnB est déjà un expert de la location courte durée.\n\nCependant, vous pouvez l'aider à connaitre votre logement : Renseignez le Formulaire ci dessous",
    image: "/lovable-uploads/6ab33741-bb6b-436a-aee7-ad8b5b81cdff.png",
    icon: createIconElement(HomeIcon),
    buttonText: "Ajouter un Logement",
    buttonLink: "/properties"
  },
  {
    id: "whatsapp",
    title: "Recevez les réponses de Botnb sur votre Whatsapp",
    text: "Botnb vous propose une réponse, vous validez ou modifiez via WhatsApp et votre réponse est envoyée vers Beds24.",
    image: "/lovable-uploads/9d79d896-59e6-4ecd-b9df-318e2e5de422.png",
    icon: createIconElement(MessageCircle),
    buttonText: null,
    buttonLink: null
  },
  {
    id: "info",
    title: "Modifier vos informations logements à tous moments",
    text: "Apprenez tout ce que Botnb doit savoir sur votre logement pour qu'il réponde correctement aux questions de vos précieux voyageurs. Ne mettez pas d'URL, d'adresse internet",
    image: "/lovable-uploads/99174476-f39b-4cfb-b37a-a91ea6ff8142.png", 
    icon: createIconElement(Text),
    buttonText: "Mes Logements",
    buttonLink: "/properties"
  },
  {
    id: "warning",
    title: "Attention aux URLs",
    text: "Si vous envisagez que Botnb réponde sur Airbnb, les adresses de site internet seront bloquées par Airbnb",
    image: "/lovable-uploads/99174476-f39b-4cfb-b37a-a91ea6ff8142.png", 
    icon: createIconElement(Ban),
    buttonText: null,
    buttonLink: null
  }
];
