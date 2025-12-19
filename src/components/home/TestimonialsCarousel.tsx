import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
}

export const TestimonialsCarousel = ({
  testimonials,
  autoPlay = true,
  interval = 5000
}: TestimonialsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotation
  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Testimonial Card */}
      <div className="bg-card border border-border rounded-lg p-8 md:p-12 shadow-sm">
        {/* Star Rating */}
        <div className="flex justify-center gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                "h-5 w-5",
                index < currentTestimonial.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              )}
            />
          ))}
        </div>

        {/* Comment */}
        <blockquote className="text-xl md:text-2xl text-foreground text-center mb-6 font-medium leading-relaxed">
          "{currentTestimonial.comment}"
        </blockquote>

        {/* Customer Name */}
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {currentTestimonial.name}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background border border-border hover:bg-secondary transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background border border-border hover:bg-secondary transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                index === currentIndex
                  ? "w-8 h-2 bg-foreground"
                  : "w-2 h-2 bg-muted hover:bg-foreground/50"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
