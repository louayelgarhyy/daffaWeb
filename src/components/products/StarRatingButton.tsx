import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingButtonProps {
  rating: number;
  isSelected: boolean;
  onClick: () => void;
  label: string;
}

export const StarRatingButton = ({
  rating,
  isSelected,
  onClick,
  label,
}: StarRatingButtonProps) => {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      onClick={onClick}
      className="w-full justify-start"
    >
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        ))}
        <span className="ms-1">{label}</span>
      </div>
    </Button>
  );
};
