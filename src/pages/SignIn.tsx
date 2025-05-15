import { SignInForm } from "../components/auth/SignInForm";
import { AuthLayout } from "../components/auth/AuthLayout";

const SignIn = () => {
  return (
    <AuthLayout
      title="Connexion"
      description="Connectez-vous à votre compte pour accéder à votre portail client"
      footerText="Pas encore de compte ?"
      footerLinkText="S'inscrire"
      footerLinkTo="/signup"
    >
      <SignInForm />
    </AuthLayout>
  );
};

export default SignIn;
