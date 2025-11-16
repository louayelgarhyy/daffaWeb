import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CursorPosition {
  x: number;
  y: number;
}

interface CustomCursorProps {
  isActive: boolean;
}

export const CustomCursor = ({ isActive }: CustomCursorProps) => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999] mix-blend-difference"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Rotating Circle */}
      <div
        className={cn(
          "relative w-16 h-16 transition-all duration-300",
          isMoving ? "scale-110" : "scale-100"
        )}
      >
        {/* Outer rotating border */}
        <div className="absolute inset-0 rounded-full border-2 border-primary animate-spin-slow opacity-70" 
          style={{ animationDuration: "3s" }}
        />
        
        {/* Inner rotating border - opposite direction */}
        <div className="absolute inset-2 rounded-full border-2 border-accent animate-spin-reverse opacity-60"
          style={{ animationDuration: "2s" }}
        />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: "4s" }}>
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-accent -translate-x-1/2" />
        </div>
        <div className="absolute inset-0 animate-spin-reverse" style={{ animationDuration: "3.5s" }}>
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full bg-primary -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
};
