
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export const toast = ({
  title,
  description,
  variant = "default",
  duration = 5000,
  action,
}: ToastProps) => {
  return sonnerToast(title, {
    description,
    duration,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
  });
};

// Export a simple stub for useToast to satisfy the interface
export const useToast = () => {
  return { toast };
};
