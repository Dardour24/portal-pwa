import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BetaBannerProps {
  className?: string;
  variant?: "banner" | "sticker";
}

export function BetaBanner({ className, variant = "banner" }: BetaBannerProps) {
  if (variant === "sticker") {
    return (
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse",
          className
        )}
      >
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm font-medium">BETA</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full bg-yellow-500 text-white py-2 px-4 flex items-center justify-center gap-2",
        className
      )}
    >
      <AlertCircle className="h-4 w-4" />
      <span className="text-sm font-medium">
        Cette application est actuellement en version bêta. Certaines
        fonctionnalités peuvent être limitées.
      </span>
    </div>
  );
}
