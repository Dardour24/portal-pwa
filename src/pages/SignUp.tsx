
import { SignUpForm } from "../components/auth/SignUpForm";
import { AuthLayout } from "../components/auth/AuthLayout";

const SignUp = () => {
  return (
    <AuthLayout 
      title="Créer un compte"
      description="Inscrivez-vous pour accéder au portail client"
      footerText="Déjà un compte ?"
      footerLinkText="Se connecter"
      footerLinkTo="/signin"
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
