
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  pathname: string;
}

export const pageTransitionVariants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15 }
};

const PageTransition = ({ children, pathname }: PageTransitionProps) => {
  return (
    <motion.div
      key={pathname}
      initial={pageTransitionVariants.initial}
      animate={pageTransitionVariants.animate}
      transition={pageTransitionVariants.transition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
