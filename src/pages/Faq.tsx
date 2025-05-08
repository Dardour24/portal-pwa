
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Faq = () => {
  const faqs = [
    {
      question: "Comment ajouter un nouveau logement ?",
      answer:
        "Pour ajouter un nouveau logement, connectez-vous à votre compte, accédez à la section 'Mes Logements' et cliquez sur le bouton 'Ajouter un logement'. Remplissez ensuite le formulaire avec les informations de votre propriété.",
    },
    {
      question: "Comment synchroniser avec Beds24 ?",
      answer:
        "Pour synchroniser votre compte avec Beds24, accédez à la page 'Mon Beds24' et cliquez sur le bouton 'Connecter Beds24'. Suivez les instructions pour autoriser la connexion entre votre compte Botnb et votre compte Beds24.",
    },
    {
      question: "Comment modifier mes informations personnelles ?",
      answer:
        "Pour modifier vos informations personnelles, rendez-vous dans la section 'Mon Compte / Profil'. Vous pourrez y mettre à jour toutes vos informations personnelles et paramètres de compte.",
    },
    {
      question: "Comment réinitialiser mon mot de passe ?",
      answer:
        "Si vous avez oublié votre mot de passe, cliquez sur 'Mot de passe oublié' sur la page de connexion. Vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.",
    },
    {
      question: "Comment contacter le support ?",
      answer:
        "Pour contacter notre équipe de support, rendez-vous dans la section 'Nous Contacter' où vous trouverez un formulaire de contact et nos coordonnées complètes.",
    },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Foire Aux Questions</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Questions fréquemment posées</CardTitle>
          <CardDescription>
            Retrouvez les réponses aux questions les plus courantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <p className="text-lg mb-4">Vous ne trouvez pas la réponse à votre question ?</p>
        <p className="mb-8">
          N'hésitez pas à nous contacter directement via notre page de contact.
        </p>
        <div className="inline-flex gap-4">
          <a href="/contact" className="text-primary underline">
            Nous Contacter
          </a>
        </div>
      </div>
    </div>
  );
};

export default Faq;
