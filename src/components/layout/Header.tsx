import { ShoppingCart, Search, Menu, Heart, User, Package, UserCog, LogIn, LogOut, MapPin, Moon, Sun, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/ThemeProvider";
import { categories } from "@/data/categories";
import { subcategories } from "@/data/subcategories";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const isArabic = i18n.language === 'ar';

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              {categories.map((category) => {
                const categorySubcategories = subcategories.filter(
                  (sub) => sub.categoryId === category.id
                );
                const categoryName = i18n.language === 'ar' ? category.nameAr : category.name;

                return (
                  <div key={category.id}>
                    <Link
                      to={category.id === 'all' ? '/shop' : `/${category.slug}`}
                      className="text-lg font-medium transition-colors hover:text-primary block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {categoryName}
                    </Link>
                    {categorySubcategories.length > 0 && (
                      <div className="ps-4 mt-2 space-y-2">
                        {categorySubcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/${category.slug}/${sub.slug}`}
                            className="text-sm text-muted-foreground hover:text-primary block"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {i18n.language === 'ar' ? sub.nameAr : sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pt-6 border-t border-border space-y-4">
                <Link
                  to="/search"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="h-5 w-5" />
                  <span>{t('nav.search')}</span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  <span>{t('nav.wishlist')}</span>
                </Link>
                <button
                  className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary text-start"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-5 w-5" />
                      <span>{t('theme.lightMode')}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5" />
                      <span>{t('theme.darkMode')}</span>
                    </>
                  )}
                </button>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Package className="h-5 w-5" />
                      <span>{t('accountMenu.myOrders')}</span>
                    </Link>
                    <Link
                      to="/addresses"
                      className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MapPin className="h-5 w-5" />
                      <span>{t('accountMenu.myAddresses')}</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCog className="h-5 w-5" />
                      <span>{t('accountMenu.editProfile')}</span>
                    </Link>
                    <button
                      className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary text-start"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>{t('accountMenu.signOut')}</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>{t('accountMenu.signIn')}</span>
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-1 md:flex-initial justify-center md:justify-start">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
            {t('brand.name')}
          </h1>
        </Link>

        {/* Desktop Navigation - Categories */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {categories.map((category) => {
            const categorySubcategories = subcategories.filter(
              (sub) => sub.categoryId === category.id
            );
            const hasSubcategories = categorySubcategories.length > 0;
            const categoryName = isArabic ? category.nameAr : category.name;

            return (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => hasSubcategories && setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  to={category.id === 'all' ? '/shop' : `/${category.slug}`}
                  className={cn(
                    "flex items-center gap-1 transition-colors hover:text-primary py-2",
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
                  <div className="absolute top-full start-0 mt-0 bg-card border border-border rounded-md shadow-xl py-2 min-w-[200px] z-50">
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
              </div>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Heart className="h-5 w-5" />
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:inline-flex"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t('theme.toggleTheme')}</span>
          </Button>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {isAuthenticated ? (
                <>
                  {user && (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user.name}
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4" />
                      <span>{t('accountMenu.myOrders')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/addresses" className="flex items-center gap-2 cursor-pointer">
                      <MapPin className="h-4 w-4" />
                      <span>{t('accountMenu.myAddresses')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <UserCog className="h-4 w-4" />
                      <span>{t('accountMenu.editProfile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('accountMenu.signOut')}</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t('accountMenu.signIn')}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
    </>
  );
};
