import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {Contact} from "@/components/Contact";
import { DataProvider } from "@/contexts/DataContext";
// *** CORRECT THIS IMPORT PATH AS NEEDED ***
import { AuthProvider } from "@/contexts/DataContext";
// *** IMPORT THE NEW COMPONENT ***
import AdminStatusSynchronizer from "@/components/AdminStatusSynchronizer"; // Adjust path if needed
import './i18n';
// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Blog from "./pages/Blog";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import ProductDetail from "./pages/ProductDetail";
import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/AdminOverview";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Pricing from "./pages/Pricing.tsx";


const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      {/* Make sure AuthProvider is imported from AuthContext */}
      <AuthProvider>
        <DataProvider>
          {/* Place the synchronizer component inside both providers */}
          <AdminStatusSynchronizer />
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Your Routes remain the same */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth/:action" element={<Auth />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:action" element={<Blog />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/products/admin" element={<AdminProducts />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/message" element={<Contact />} />
                    <Route path="/messages/list" element={<Messages />} />
                    <Route path="/Pricing" element={<Pricing />} />

                    {/* Admin Dashboard Routes */}
                    <Route path="/admin" element={<AdminDashboard />}>
                      <Route index element={<AdminOverview />} />

                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;