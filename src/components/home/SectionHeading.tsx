import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  viewAllLink?: string;
  viewAllLabel?: string;
}

export const SectionHeading = ({
  title,
  subtitle,
  align = 'center',
  viewAllLink,
  viewAllLabel
}: SectionHeadingProps) => {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.language === 'ar';

  return (
    <div className="mb-8">
      {/* Title with underline accent - serdababaya.com style */}
      <div className={`flex flex-col items-center ${align === 'center' ? 'text-center' : ''}`}>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground relative inline-block pb-3">
          {title}
          {/* Golden underline accent */}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-heading-underline rounded-full" />
        </h2>
        {subtitle && (
          <p className="text-muted-foreground mt-3">
            {subtitle}
          </p>
        )}
      </div>

      {/* View All button - positioned below heading like serdababaya.com */}
      {viewAllLink && (
        <div className="flex justify-center mt-4">
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground border border-border rounded-full hover:bg-secondary transition-colors"
          >
            {viewAllLabel || t('buttons.viewAll', { defaultValue: 'عرض الكل' })}
            {isRTL ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Link>
        </div>
      )}
    </div>
  );
};