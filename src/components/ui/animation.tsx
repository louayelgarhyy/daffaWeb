import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AnimationType = "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "scale" | "bounce";

interface AnimationProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

const animationClasses: Record<AnimationType, string> = {
  "fade": "animate-in fade-in",
  "slide-up": "animate-in slide-in-from-bottom",
  "slide-down": "animate-in slide-in-from-top",
  "slide-left": "animate-in slide-in-from-right",
  "slide-right": "animate-in slide-in-from-left",
  "scale": "animate-in zoom-in",
  "bounce": "animate-in zoom-in-95",
};

export const Animation = ({ 
  children, 
  type = "fade", 
  delay = 0, 
  duration = 500,
  className 
}: AnimationProps) => {
  return (
    <div 
      className={cn(animationClasses[type], className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: "both"
      }}
    >
      {children}
    </div>
  );
};
