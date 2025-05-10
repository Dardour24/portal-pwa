
// Re-export Sonner's toast functionality
import { toast as sonnerToast, useToast as useSonnerToast } from "sonner";

export const toast = sonnerToast;
export const useToast = useSonnerToast;

// Types for backwards compatibility
export type {
  Toast,
  ToasterProps,
} from "sonner";
