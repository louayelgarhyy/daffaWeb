import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
}

interface BannerCarouselProps {
  slides: BannerSlide[];
  autoPlayInterval?: number;
  className?: string;
}

export const BannerCarousel = ({ 
  slides, 
  autoPlayInterval = 5000,
  className 
}: BannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlayInterval]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className={cn("relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden group", className)}>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out",
            index === currentIndex
              ? "opacity-100 translate-x-0 scale-100"
              : index < currentIndex
              ? "opacity-0 -translate-x-full scale-95"
              : "opacity-0 translate-x-full scale-95"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[7000ms] ease-out scale-110"
            style={{
              backgroundImage: `url('${slide.image}')`,
              transform: index === currentIndex ? "scale(1)" : "scale(1.1)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/85 to-transparent" />
          </div>

          <div className="container relative z-10 h-full flex items-center px-4 sm:px-6">
            <div 
              className={cn(
                "max-w-2xl space-y-4 sm:space-y-6 transition-all duration-700 delay-200",
                index === currentIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight animate-in slide-in-from-bottom duration-700">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground animate-in slide-in-from-bottom duration-700 delay-100">
                {slide.subtitle}
              </p>
              {slide.cta && (
                <div className="animate-in slide-in-from-bottom duration-700 delay-200">
                  <Button
                    size="lg"
                    onClick={slide.cta.onClick}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                  >
                    {slide.cta.label}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-background/10 hover:bg-background text-foreground p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-background/10 hover:bg-background text-foreground p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              index === currentIndex
                ? "w-8 sm:w-10 md:w-12 h-2 sm:h-3 bg-foreground shadow-lg"
                : "w-2 sm:w-3 h-2 sm:h-3 bg-muted hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
