
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { ArrowLeft, Eye, Package, CheckCircle, XCircle, MapPin } from "lucide-react";
import { OrderMap } from "@/components/orders/OrderMap";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, isAdmin } = useData();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);
  
  // Redirect if not an admin
  if (!isAdmin) {
    setTimeout(() => navigate("/"), 0);
    return null;
  }
  
  const filteredOrders = orders 
    ? (statusFilter === "all" 
        ? orders 
        : orders.filter(order => order.status === statusFilter))
    : [];
  
  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order #${orderId} status updated to ${newStatus}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleTrackOrder = (orderId: number) => {
    setSelectedOrder(orderId);
    setShowMap(true);
  };
  
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showMap && selectedOrder && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Order #{selectedOrder} Tracking</h2>
            <Button variant="outline" size="sm" onClick={() => setShowMap(false)}>
              Close Map
            </Button>
          </div>
          <div className="h-[400px] w-full rounded-lg overflow-hidden border">
            <OrderMap orderId={selectedOrder} />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {statusFilter === "all" 
                    ? "No orders found."
                    : `No orders with status "${statusFilter}" found.`}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.customer || "Anonymous"}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={order.status} 
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {(order.status === "shipped" || order.status === "processing") && (
                        <Button 
                          size="icon"
                          variant="ghost" 
                          onClick={() => handleTrackOrder(order.id)} 
                          className="h-8 w-8"
                          title="Track Order"
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
