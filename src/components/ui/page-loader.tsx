import { useEffect, useState } from "react";

export const PageLoader = ({ onComplete }: { onComplete?: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fade out after 1200ms
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-[20px] transition-opacity duration-1200"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-foreground/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-foreground animate-bounce-scale"></div>
          </div>
        </div>
        <p className="mt-4 text-foreground text-sm font-medium">جاري التحميل...</p>
      </div>
    </div>
  );
};
