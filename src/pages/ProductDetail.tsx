
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { ArrowLeft, ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useData();
  
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product.id);
    toast.success(`${product.name} added to cart`);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col">
      <div className="container-custom flex-grow">
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <Badge className="absolute top-4 right-4 text-sm">
              {product.category}
            </Badge>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-4 text-2xl font-semibold">${product.price.toFixed(2)}</div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            <div className="mt-8">
              <Button 
                size="lg" 
                className="w-full md:w-auto flex items-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </Button>
            </div>
            
            <Card className="mt-8">
              <CardContent className="p-4">
                <div className="flex space-x-2 text-sm text-muted-foreground">
                  <p>Fast shipping available</p>
                  <span>•</span>
                  <p>30-day return policy</p>
                  <span>•</span>
                  <p>Secure payment</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
