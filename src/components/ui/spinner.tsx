
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-primary", className)}
      {...props}
    />
  );
}
