import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import LoginPage from "./pages/LoginPage";
import CreateStorePage from "./pages/CreateStorePage";
import DashboardPage from "./pages/DashboardPage";
import ManageProductsPage from "./pages/ManageProductsPage";
import AddProductPage from "./pages/AddProductPage";
import StoreCatalogPage from "./pages/StoreCatalogPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-store" element={<PrivateRoute><CreateStorePage /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/products/:storeId" element={<PrivateRoute><ManageProductsPage /></PrivateRoute>} />
      <Route path="/add-product/:storeId" element={<PrivateRoute><AddProductPage /></PrivateRoute>} />
      {/* Public catalog routes */}
      <Route path="/catalog/:slug" element={<StoreCatalogPage />} />
      <Route path="/catalog/:slug/checkout" element={<CheckoutPage />} />
      <Route path="/catalog/:slug/product/:productId" element={<ProductDetailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
