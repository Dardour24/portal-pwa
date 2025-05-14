import { useState } from "react";
import { EmailVerificationForm } from "../components/auth/EmailVerificationForm";
import { SignUpForm } from "../components/auth/SignUpForm";
import { AuthLayout } from "../components/auth/AuthLayout";
import { motion, AnimatePresence } from "framer-motion";

const SignUp = () => {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  return (
    <AuthLayout
      title="Créer un compte"
      description="Inscrivez-vous pour accéder au portail client"
      footerText="Déjà un compte ?"
      footerLinkText="Se connecter"
      footerLinkTo="/signin"
    >
      <AnimatePresence mode="wait">
        {!verifiedEmail ? (
          <motion.div
            key="email-verification"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <EmailVerificationForm onEmailVerified={setVerifiedEmail} />
          </motion.div>
        ) : (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SignUpForm verifiedEmail={verifiedEmail} />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default SignUp;
