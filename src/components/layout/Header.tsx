import { ShoppingCart, Search, Menu, Heart, User, Package, UserCog, LogIn, LogOut, MapPin } from "lucide-react";
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

export const Header = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
            <nav className="flex flex-col space-y-6 mt-8">
              <Link
                to="/"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/shop"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.shop')}
              </Link>
              <Link
                to="/collections"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.collections')}
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-primary">
            {t('nav.home')}
          </Link>
          <Link to="/shop" className="transition-colors hover:text-primary">
            {t('nav.shop')}
          </Link>
          <Link to="/collections" className="transition-colors hover:text-primary">
            {t('nav.collections')}
          </Link>
          <Link to="/about" className="transition-colors hover:text-primary">
            {t('nav.about')}
          </Link>
          <Link to="/contact" className="transition-colors hover:text-primary">
            {t('nav.contact')}
          </Link>
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
  );
};
