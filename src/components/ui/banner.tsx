import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type BannerVariant = "info" | "success" | "warning" | "accent" | "promotional";

interface BannerProps {
  variant?: BannerVariant;
  message: string;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const variantStyles: Record<BannerVariant, string> = {
  info: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-destructive/10 text-destructive border-destructive/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  promotional: "bg-gradient-to-r from-primary to-accent text-primary-foreground border-transparent",
};

export const Banner = ({ 
  variant = "info", 
  message, 
  dismissible = true,
  action,
  className 
}: BannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "w-full border px-4 py-3 flex items-center justify-between gap-4 transition-all",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <p className="text-sm font-medium">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-semibold underline underline-offset-2 hover:no-underline transition-all"
          >
            {action.label}
          </button>
        )}
      </div>
      
      {dismissible && (
        <button
          onClick={() => setIsVisible(false)}
          className="hover:opacity-70 transition-opacity"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
