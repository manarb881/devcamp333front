import { AuthContext,useData } from "@/contexts/DataContext";
import React, { useState, useEffect,useContext } from "react"; // Import React

// Import React
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate if you want redirection
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Ensure sonner is set up in your App component

 // <-- Import useAuth
import { Plus, AlertCircle, Search, LogIn } from "lucide-react"; // <-- Added LogIn icon optionally
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Product } from "@/contexts/DataContext"; // Make sure Product type is imported if needed

const Products: React.FC = () => {
  const { products, addToCart, isAdmin } = useData();
// <-- Get authentication status
  const navigate = useNavigate(); // <-- Initialize navigate for redirection

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"name" | "category" | "price" | "recent">("name");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated, profile,token } = useContext(AuthContext);
  // Simulate async fetch or wait for products to load
  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        if (products.length === 0) {
            // console.warn("Products still empty after timeout in Products component.");
        }
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [products]);

  // Filter and sort products
  const filteredProducts = (() => {
    if (!Array.isArray(products)) {
      console.error("Products is not an array:", products);
      return [];
    }
    let result: Product[] = [...products];
    try {
        if (filterType === "name" && searchQuery) {
            result = result.filter((product) =>
              product.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else if (filterType === "category" && searchQuery) {
            result = result.filter((product) =>
              typeof product.category === "string"
              ? product.category.toLowerCase().includes(searchQuery.toLowerCase())
              : false
            );
        } else if (filterType === "price") {
            result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        } else if (filterType === "recent") {
            result.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
        }
    } catch (error) {
        console.error("Error during product filtering/sorting:", error);
        return products;
    }
    return result;
  })();

  const handleAddToCart = (productId: number, productName: string) => {
    // --- Authentication Check ---
    if (!isAuthenticated) {
      // --- Display Notification to Sign In ---
      toast.info("Please sign in to add items to your cart.", { // Changed to info, or keep as error if preferred
        action: {
          label: "Sign In",
          onClick: () => navigate('/auth/login'), // Navigate to your login route
        },
        icon: <LogIn size={16} />, // Optional: Add an icon
      });
      return; // Stop the function here if not authenticated
    }
    // --- End Check ---

    // Proceed to add to cart if authenticated
    try {
        addToCart(productId);
        toast.success(`${productName} added to cart`);
    } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error("Could not add item to cart. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col bg-background">
      <div className="container-custom flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="page-heading text-3xl font-bold tracking-tight text-foreground">
                Products
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse our selection of quality products
            </p>
          </div>
          {isAdmin && (
            <Link to="/products/admin">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Plus size={18} /> Manage Products
              </Button>
            </Link>
          )}
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg shadow-sm border">
          <div className="w-full sm:w-auto">
            <Select
              value={filterType}
              onValueChange={(value: "name" | "category" | "price" | "recent") => {
                setFilterType(value);
                if (value === 'price' || value === 'recent') {
                    setSearchQuery("");
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(filterType === "name" || filterType === "category") && (
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search by ${filterType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          )}
        </div>

        <div>
            {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border bg-card">
                    <div className="aspect-square bg-muted animate-pulse"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                        <div className="h-8 bg-muted rounded animate-pulse w-1/3 ml-auto"></div>
                    </div>
                </div>
                ))}
            </div>
            ) : filteredProducts.length === 0 ? (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-16 text-center bg-card border rounded-lg shadow-sm"
            >
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery && (filterType === "name" || filterType === "category")
                    ? "No products match your search"
                    : "No products available"}
                </h2>
                <p className="text-muted-foreground max-w-md px-4">
                {searchQuery && (filterType === "name" || filterType === "category")
                    ? "Try adjusting your search term or filter."
                    : "There are currently no products listed. Please check back later!"}
                </p>
            </motion.div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                    className="h-full"
                >
                    <Card className="h-full flex flex-col overflow-hidden border shadow-sm hover:shadow-md transition-shadow duration-300 bg-card">
                    <Link to={`/products/${product.id}`} className="block group overflow-hidden">
                        <div className="aspect-square relative overflow-hidden bg-muted">
                        <img
                            src={product.imageUrl || "https://via.placeholder.com/300x300?text=No+Image"}
                            alt={product.name || "Product Image"}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "https://via.placeholder.com/300x300?text=Load+Error";
                            }}
                        />
                        {product.category && (
                            <Badge variant="secondary" className="absolute top-2 right-2 capitalize">
                                {product.category}
                            </Badge>
                        )}
                        </div>
                    </Link>
                    <CardHeader className="p-4 pb-2">
                        <Link to={`/products/${product.id}`}>
                        <CardTitle className="text-lg font-semibold leading-tight truncate text-foreground hover:text-primary transition-colors">
                            {product.name || "Unnamed Product"}
                        </CardTitle>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2 flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description || "No description available."}
                        </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-2 flex justify-between items-center mt-auto">
                        <span className="text-lg font-bold text-primary">
                            ${Number(product.price || 0).toFixed(2)}
                        </span>
                        <Button
                            size="sm"
                            onClick={() => handleAddToCart(product.id, product.name || "Product")}
                            // removed disabled={!isAuthenticated} prop <<<--- CHANGE IS HERE
                            aria-label={`Add ${product.name || 'Product'} to cart`}
                        >
                            Add to Cart
                        </Button>
                    </CardFooter>
                    </Card>
                </motion.div>
                ))}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Products;