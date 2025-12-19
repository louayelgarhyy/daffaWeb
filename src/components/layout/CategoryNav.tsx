import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';
import { subcategories } from '@/data/subcategories';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export const CategoryNav = () => {
  const { i18n } = useTranslation();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const isArabic = i18n.language === 'ar';

  return (
    <nav className="hidden md:block bg-background border-b border-border sticky top-16 z-40">
      <div className="container px-4">
        <ul className="flex items-center gap-8 py-4">
          {categories.map((category) => {
            const categorySubcategories = subcategories.filter(
              (sub) => sub.categoryId === category.id
            );
            const hasSubcategories = categorySubcategories.length > 0;
            const categoryName = isArabic ? category.nameAr : category.name;

            return (
              <li
                key={category.id}
                className="relative"
                onMouseEnter={() => hasSubcategories && setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  to={category.id === 'all' ? '/shop' : `/${category.slug}`}
                  className={cn(
                    "flex items-center gap-2 text-foreground hover:text-foreground/70 transition-colors font-medium",
                    "py-2"
                  )}
                >
                  {categoryName}
                  {hasSubcategories && (
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      hoveredCategory === category.id && "rotate-180"
                    )} />
                  )}
                </Link>

                {/* Subcategories Dropdown */}
                {hasSubcategories && hoveredCategory === category.id && (
                  <div className="absolute top-full left-0 mt-0 bg-card border border-border rounded-none shadow-xl py-2 min-w-[220px] z-50">
                    {categorySubcategories.map((subcategory) => {
                      const subcategoryName = isArabic ? subcategory.nameAr : subcategory.name;
                      return (
                        <Link
                          key={subcategory.id}
                          to={`/${category.slug}/${subcategory.slug}`}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                        >
                          {subcategoryName}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
