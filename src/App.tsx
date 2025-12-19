import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetails from "./pages/OrderDetails";
import MyOrders from "./pages/MyOrders";
import ManageAddresses from "./pages/ManageAddresses";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  return (
    <ThemeProvider defaultTheme="light" storageKey="abaya-theme">
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/addresses"
                  element={
                    <ProtectedRoute>
                      <ManageAddresses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-confirmation/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetails />
                    </ProtectedRoute>
                  }
                />

                {/* Placeholder routes - to be implemented */}
                <Route path="/collections" element={<Shop />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<NotFound />} />

                {/* Category routes */}
                <Route path="/:category" element={<CategoryPage />} />
                <Route path="/:category/:subcategory" element={<CategoryPage />} />

                {/* 404 - Must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
