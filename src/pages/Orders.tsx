
import { useState } from "react";
import { QRCodeGenerator } from "@/components/orders/QRCodeGenerator";
import { useData } from "@/contexts/DataContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShoppingCart, Package, QrCode, ShoppingBag } from "lucide-react";

const OrdersPage = () => {
  const { orders, cart, products, removeFromCart, checkout, cancelOrder } = useData();
  const [activeTab, setActiveTab] = useState("cart");
  
  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Unknown Product";
  };
  
  const getProductImageUrl = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.imageUrl : "";
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered": return "bg-green-100 text-green-800 border-green-300";
      case "cancelled": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleCheckout = () => {
    checkout();
    setActiveTab("orders");
    toast.success("Order placed successfully!");
  };
  
  const handleCancelOrder = (orderId: number) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      cancelOrder(orderId);
      toast.success("Order cancelled successfully");
    }
  };
  
  const handleRemoveFromCart = (productId: number, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col">
      <div className="container-custom flex-grow">
        <h1 className="page-heading">Orders & QR Codes</h1>
        <p className="text-muted-foreground mb-6">
          Manage your shopping cart, view your orders, or generate QR codes
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Cart
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" /> My Orders
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" /> QR Generator
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cart" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> Shopping Cart
                </CardTitle>
                <CardDescription>
                  Review items in your cart before checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="py-8 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">Your cart is empty</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Add products from our store to see them here
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => window.location.href = "/products"}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded overflow-hidden">
                                  <img
                                    src={getProductImageUrl(item.productId)}
                                    alt={getProductName(item.productId)}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span>{getProductName(item.productId)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveFromCart(item.productId, getProductName(item.productId))}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              {cart.length > 0 && (
                <CardFooter className="flex justify-between">
                  <div className="text-lg font-semibold">
                    Total: ${cartTotal.toFixed(2)}
                  </div>
                  <Button onClick={handleCheckout}>Checkout</Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" /> Order History
                </CardTitle>
                <CardDescription>
                  View and manage your past orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="py-8 text-center">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      When you place orders, they will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <Card key={order.id} className="border">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                              <CardDescription>Placed on {order.date}</CardDescription>
                            </div>
                            <Badge 
                              className={`${getStatusColor(order.status)} border text-xs px-2 py-1 capitalize`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded overflow-hidden">
                                          <img
                                            src={getProductImageUrl(item.productId)}
                                            alt={getProductName(item.productId)}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <span>{getProductName(item.productId)}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="font-semibold">Total: ${order.total.toFixed(2)}</div>
                          {order.status === "pending" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel Order
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" /> QR Code Generator
                </CardTitle>
                <CardDescription>
                  Generate QR codes for your orders and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrdersPage;
