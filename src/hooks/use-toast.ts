
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
  duration?: number;
};

export const toast = ({
  title,
  description,
  variant = "default",
  action,
  duration = 5000,
  ...props
}: ToastProps) => {
  const options = {
    className: variant === "destructive" ? "destructive" : "",
    description,
    action,
    duration,
    ...props,
  };

  return sonnerToast(title ?? "", options);
};

// Export a simple stub for useToast to satisfy the interface
export const useToast = () => {
  return { toast };
};
