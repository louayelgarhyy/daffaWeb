import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';
import { subcategories } from '@/data/subcategories';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from 'react-i18next';

interface CategoryFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryFilterModal = ({ open, onOpenChange }: CategoryFilterModalProps) => {
  const { t, i18n } = useTranslation(['categories', 'common']);
  const isArabic = i18n.language === 'ar';

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isArabic ? 'right' : 'left'} className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{t('common:filter')}</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => {
              const categorySubcategories = subcategories.filter(
                (sub) => sub.categoryId === category.id
              );
              const hasSubcategories = categorySubcategories.length > 0;
              const categoryName = isArabic ? category.nameAr : category.name;

              if (!hasSubcategories) {
                // For "All Products" - just a simple link
                return (
                  <div key={category.id} className="border-b border-border">
                    <Link
                      to={category.id === 'all' ? '/shop' : `/${category.slug}`}
                      onClick={handleLinkClick}
                      className="flex items-center justify-between py-4 px-1 text-foreground hover:text-primary transition-colors font-medium"
                    >
                      {categoryName}
                    </Link>
                  </div>
                );
              }

              // For categories with subcategories - use accordion
              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="text-foreground font-medium">
                    {categoryName}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2 pl-4">
                      {/* Link to main category */}
                      <Link
                        to={`/${category.slug}`}
                        onClick={handleLinkClick}
                        className="py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {t('common:viewAll')}
                      </Link>

                      {/* Subcategories */}
                      {categorySubcategories.map((subcategory) => {
                        const subcategoryName = isArabic ? subcategory.nameAr : subcategory.name;
                        return (
                          <Link
                            key={subcategory.id}
                            to={`/${category.slug}/${subcategory.slug}`}
                            onClick={handleLinkClick}
                            className="py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {subcategoryName}
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};
