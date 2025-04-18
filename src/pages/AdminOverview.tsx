import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { 
  ShoppingBag, 
  ShoppingCart, 
  DollarSign, 
  Users,
  TrendingUp,
  Package,
  BarChart3,
  Award,
  TrendingDown,
  Zap
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const AdminOverview = () => {
  const { products, orders, customers } = useData();

  const totalRevenue = orders
    ? orders.reduce((sum, order) => sum + order.total, 0)
    : 0;

  const totalCustomers = customers.length;

  // Calculate the frequency of product purchases (most popular sellers)
  const getTopSellingProducts = () => {
    if (!orders || orders.length === 0 || !products || products.length === 0) return [];
    
    // Count the frequency of each product in orders
    const productSales = {};
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (productSales[item.productId]) {
            productSales[item.productId] += item.quantity || 1;
          } else {
            productSales[item.productId] = item.quantity || 1;
          }
        });
      }
    });
    
    // Match product IDs with product names
    const productData = Object.keys(productSales).map(productId => {
      const product = products.find(p => p.id.toString() === productId.toString()) || { name: `Product ${productId}` };
      return {
        name: product.name,
        value: productSales[productId],
        color: product.color
      };
    });
    
    // Sort by highest selling and limit to top 6
    return productData.sort((a, b) => b.value - a.value).slice(0, 6);
  };

  const topSellingProducts = getTopSellingProducts();
  const COLORS = ['#4BC0C0', '#FF8042', '#FFBB28', '#A259FF', '#0088FE', '#00C49F'];

  // Create sample data if no real sales data exists
  const sampleTopProducts = topSellingProducts.length > 0 ? topSellingProducts : [
    { name: "Sample Product 1", value: 42 },
    { name: "Sample Product 2", value: 28 },
    { name: "Sample Product 3", value: 23 },
    { name: "Sample Product 4", value: 26 }
    
  ];
  
  // Calculate revenue trend (30-day intervals)
  const getRevenueTrend = () => {
    if (!orders || orders.length === 0) return [];
    
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    
    const currentMonth = orders
      .filter(order => new Date(order.date) >= oneMonthAgo)
      .reduce((sum, order) => sum + order.total, 0);
      
    const previousMonth = orders
      .filter(order => new Date(order.date) >= twoMonthsAgo && new Date(order.date) < oneMonthAgo)
      .reduce((sum, order) => sum + order.total, 0);
      
    const twoMonthsBack = orders
      .filter(order => new Date(order.date) >= threeMonthsAgo && new Date(order.date) < twoMonthsAgo)
      .reduce((sum, order) => sum + order.total, 0);
    
    return [
      { name: "2 Months Ago", revenue: twoMonthsBack },
      { name: "Last Month", revenue: previousMonth },
      { name: "This Month", revenue: currentMonth }
    ];
  };

  const revenueTrend = getRevenueTrend();
  
  // Sample revenue trend if no real data exists
  const sampleRevenueTrend = revenueTrend.length > 0 && revenueTrend.some(item => item.revenue > 0) 
    ? revenueTrend 
    : [
      { name: "2 Months Ago", revenue: 4200 },
      { name: "Last Month", revenue: 5800 },
      { name: "This Month", revenue: 7500 }
    ];

  const dashboardMetrics = [
    {
      title: "Total Products",
      value: products.length,
      description: "Products in catalog",
      color: "from-blue-500 to-blue-600",
      icon: <Package className="h-6 w-6 text-white" />
    },
    {
      title: "Total Orders",
      value: orders ? orders.length : 0,
      description: "Orders placed",
      color: "from-green-500 to-green-600",
      icon: <ShoppingCart className="h-6 w-6 text-white" />
    },
    {
      title: "Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      description: "Total revenue",
      color: "from-yellow-500 to-amber-600",
      icon: <DollarSign className="h-6 w-6 text-white" />
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      description: "Customers in your system",
      color: "from-purple-500 to-purple-600",
      icon: <Users className="h-6 w-6 text-white" />
    },
  ];

  return (
    <div className="min-h-screen py-10 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center mb-8">
        <div className="bg-white p-3 rounded-full shadow-md mr-4">
          <TrendingUp className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome to your e-commerce analytics center</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <Card key={metric.title} className="shadow-lg rounded-xl overflow-hidden border-none transition-all duration-300 hover:shadow-xl">
            <div className={`bg-gradient-to-r ${metric.color} p-5 text-white`}>
              <div className="flex justify-between items-center">
                <div>
                  <CardDescription className="text-white/80 text-sm font-medium">{metric.description}</CardDescription>
                  <CardTitle className="text-3xl font-bold mt-1 text-white">{metric.value}</CardTitle>
                </div>
                <div className="p-3 rounded-full bg-white/20">
                  {metric.icon}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 mt-10 md:grid-cols-2">
        <Card className="shadow-lg rounded-xl overflow-hidden border-none transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle className="text-xl font-semibold text-gray-800">Top Selling Products</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-500">Products with highest purchase frequency</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sampleTopProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.substring(0, 15)}${name.length > 15 ? '...' : ''}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sampleTopProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} units sold`, 'Sales']} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl overflow-hidden border-none transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
              <CardTitle className="text-xl font-semibold text-gray-800">Revenue Trend</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-500">Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleRevenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-10 md:grid-cols-2">
        <Card className="shadow-lg rounded-xl overflow-hidden border-none transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 text-indigo-600 mr-2" />
              <CardTitle className="text-xl font-semibold text-gray-800">Recent Products</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-500">Latest products added to your catalog</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div>
              {products.slice(0, 5).map((product, index) => (
                <div key={product.id} className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${index !== products.slice(0, 5).length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 shadow-sm">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=Product";
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm font-semibold text-indigo-600">${Number(product.price).toFixed(2)}</p>
                      {product.stock && (
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 font-medium">
                    {product.category || 'Uncategorized'}
                  </span>
                </div>
              ))}

              {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">No products available</p>
                  <p className="text-sm text-gray-400">Add some products to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl overflow-hidden border-none transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
              <CardTitle className="text-xl font-semibold text-gray-800">Recent Orders</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-500">Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div>
              {orders && orders.slice(0, 5).map((order, index) => (
                <div
                  key={order.id}
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${index !== orders.slice(0, 5).length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      order.status === 'completed' ? 'bg-green-100' : 
                      order.status === 'processing' ? 'bg-blue-100' : 
                      'bg-yellow-100'
                    }`}>
                      <ShoppingCart className={`h-5 w-5 ${
                        order.status === 'completed' ? 'text-green-600' : 
                        order.status === 'processing' ? 'text-blue-600' : 
                        'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                    <p className="font-medium text-green-600 ml-3">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}

              {(!orders || orders.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">No orders yet</p>
                  <p className="text-sm text-gray-400">Orders will appear here once customers start purchasing</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-10 md:grid-cols-1">
        <Card className="shadow-lg rounded-xl overflow-hidden border-none transition-all duration-300 hover:shadow-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-purple-600 mr-2" />
              <CardTitle className="text-xl font-semibold text-gray-800">Recent Customers</CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-500">Latest customers in your system</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid gap-2 md:grid-cols-3">
              {customers.slice(0, 6).map((customer, index) => (
                <div key={customer.id} className={`flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors`}>
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 shadow-md">
                    <div className="h-full w-full flex items-center justify-center text-white font-medium">
                      {customer.name[0].toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    {customer.orderCount && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {customer.orderCount} orders
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {customers.length === 0 && (
                <div className="col-span-3 flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Users className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">No customers available</p>
                  <p className="text-sm text-gray-400">Start getting orders to see customers here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;