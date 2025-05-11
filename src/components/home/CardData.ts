
import React from "react";
import { HomeIcon, Settings, Pencil, LucideIcon } from "lucide-react";

// Create a proper WhatsApp icon using a React component approach
export const createWhatsAppIcon = () => {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "h-8 w-8 mb-4 text-primary"
    },
    React.createElement("path", { d: "M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" }),
    React.createElement("path", { d: "M9 10a.5.5 0 0 1 1 0c0 1.97 1.6 3.57 3.57 3.57a.5.5 0 0 1 0 1c-2.53 0-4.57-2.04-4.57-4.57z" }),
    React.createElement("path", { d: "M13.5 14a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z" }),
    React.createElement("path", { d: "M11.5 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z" })
  );
};

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
    text: "Rendez-vous sur 'Mes Logements' pour transmettre à votre Botnb toutes les informations sur votre Logement !",
    image: "/lovable-uploads/6ab33741-bb6b-436a-aee7-ad8b5b81cdff.png",
    icon: createIconElement(HomeIcon),
    buttonText: "Ajouter un Logement",
    buttonLink: "/properties/add"
  },
  {
    id: "whatsapp",
    title: "Recevez les réponses de Botnb sur votre Whatsapp",
    text: "Botnb vous propose une réponse, vous validez ou modifiez via WhatsApp et votre réponse est envoyée vers Beds24.",
    image: "/lovable-uploads/9d79d896-59e6-4ecd-b9df-318e2e5de422.png",
    icon: createWhatsAppIcon(),
    buttonText: null,
    buttonLink: null
  },
  {
    id: "info",
    title: "Modifier vos informations logements à tous moments",
    text: "Rendez Vous sur l'ongle 'Mes Logements' pour ajuster les informations de votre logement",
    image: "/lovable-uploads/99174476-f39b-4cfb-b37a-a91ea6ff8142.png", 
    icon: createIconElement(Pencil),
    buttonText: "Mes Logements",
    buttonLink: "/properties"
  }
];
