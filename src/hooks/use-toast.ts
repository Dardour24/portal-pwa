
// Export Sonner's toast functionality with compatibility layer
import { toast as sonnerToast, ToasterProps } from "sonner";

// Create a wrapper around Sonner's toast to support the old API format
export const toast = (props: string | { 
  title?: string;
  description?: string;
  [key: string]: any;
}) => {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }

  const { title, description, ...rest } = props;
  
  // If title and description are provided, format them in Sonner's style
  if (title && description) {
    return sonnerToast(title, { description, ...rest });
  } 
  
  // If only title is provided
  if (title) {
    return sonnerToast(title, rest);
  }
  
  // Fallback for any other case - convert object to string to avoid type errors
  return sonnerToast(String(props));
};

// Create a mock useToast hook that maintains compatibility
export const useToast = () => {
  return {
    toast,
    // Empty toasts array to maintain compatibility with existing code
    toasts: []
  };
};

// Export types for compatibility
export type { ToasterProps };

// Custom Toast type for backward compatibility
export interface Toast {
  id: string | number;
  title?: string;
  description?: string;
  [key: string]: any;
}
