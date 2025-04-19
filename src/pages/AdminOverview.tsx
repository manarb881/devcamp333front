import React, { useEffect } from "react"; // useEffect, useMemo no longer needed here directly for this purpose
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext"; // Use the hook to get context data/functions
import {
  BarChart as BarChartIcon,
  AlertTriangle,
  TrendingUp,
  PieChart as PieChartIcon,
  Table as TableIcon,
  RefreshCw // Import Refresh icon
} from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as RePieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button"; // Import Button component

const AdminOverview = () => {
  // Get state and functions from the context using the hook
  // Use isRefreshing specifically for the refresh button state
  const { predictions, isLoading, isRefreshing, fetchPredictions, error } = useData();

  // --- Data Processing ---
  // Using optional chaining (?.) and nullish coalescing (??) for safety
  // These calculations will run on every render, but are generally fast.
  // If performance becomes an issue with huge datasets, wrap these in useMemo with [predictions] dependency.
  const totalPredictions = predictions?.length ?? 0;
  const estimatedRevenue = predictions
    ?.reduce((sum, pred) => sum + (pred.stock || 0) * 10, 0) // Default stock to 0 if undefined
    ?.toFixed(2) ?? '0.00';
  const lowStockProducts = predictions?.filter((pred) => (pred.stock || 0) <= 10)?.length ?? 0;
  const highStockProducts = predictions?.filter((pred) => (pred.stock || 0) >= 50)?.length ?? 0;

  // Ensure 'name' and 'stock' exist, provide defaults
  const stockByProduct = predictions?.map((pred) => ({
    name: pred.name || `Product ${pred.product}`, // Use provided name or fallback
    stock: pred.stock || 0,
  })) ?? [];

  // Ensure 'name' and 'stock' exist, provide defaults
  const topStocks = predictions
    ?.slice() // Create copy before sorting
    ?.sort((a, b) => (b.stock || 0) - (a.stock || 0)) // Handle potentially undefined stock
    ?.slice(0, 5)
    ?.map((pred) => ({
      name: pred.name || `Product ${pred.product}`,
      value: pred.stock || 0, // Use 'value' for Pie chart dataKey
    })) ?? [];

  const PIE_COLORS = ["#f59e0b", "#4338ca", "#059669", "#475569", "#a855f7"];

  const dashboardMetrics = [
    {
      title: "Estimated Revenue",
      value: `$${estimatedRevenue}`,
      description: "Based on predicted stock ($10/unit)",
      color: "from-amber-500 to-amber-700",
      icon: <TrendingUp className="h-6 w-6 text-white" />,
    },
    {
      title: "Total Predictions",
      value: totalPredictions,
      description: "Stock predictions made",
      color: "from-indigo-600 to-indigo-800",
      icon: <BarChartIcon className="h-6 w-6 text-white" />,
    },
    {
      title: "Low Stock Products",
      value: lowStockProducts,
      description: "Products with ≤ 10 units",
      color: "from-slate-600 to-slate-800",
      icon: <AlertTriangle className="h-6 w-6 text-white" />,
    },
    {
      title: "High Stock Products",
      value: highStockProducts,
      description: "Products with ≥ 50 units",
      color: "from-emerald-600 to-emerald-800",
      icon: <TrendingUp className="h-6 w-6 text-white" />,
    },
  ];
  // --- End Dat  
  useEffect(()=>{
   console.log("we are here ")
  },[]
  )

  // --- Handle Refresh Click ---
  const handleRefresh = () => {
    console.log("[AdminOverview] Refresh button clicked.");
    // Call the function from context to trigger the fetch
    // The context handles the loading state (isRefreshing)
    fetchPredictions();
  };

  // --- Loading State UI (For initial load) ---
  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
             <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 dark:text-amber-400" />
             <span className="ml-3 text-gray-500 dark:text-gray-400">Loading Dashboard...</span>
        </div>
    );
  }

  // --- Error State UI ---
  if (error) {
     return (
        <div className="min-h-screen py-10 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Failed to Load Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button onClick={handleRefresh} variant="destructive" size="sm" disabled={isRefreshing}>
                 {isRefreshing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                 ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                 )}
                Try Again
            </Button>
        </div>
     );
  }

  // --- Main Component Render ---
  return (
    <div className="min-h-screen py-10 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-md mr-4 flex-shrink-0">
            <BarChartIcon className="h-8 w-8 text-indigo-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
              Stock Prediction Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Monitor your dairy stock predictions</p>
          </div>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing} // Use the specific refresh loading state
          className="flex items-center gap-2 min-w-[120px]" // Added min-width
          aria-label="Refresh dashboard data"
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {dashboardMetrics.map((metric) => (
            <Card
                key={metric.title}
                className="shadow-lg rounded-xl overflow-hidden border-none transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800"
            >
                <div className={`bg-gradient-to-br ${metric.color} p-5 text-white`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardDescription className="text-white/80 text-sm font-medium">
                                {metric.description}
                            </CardDescription>
                            {/* Ensure value exists or show placeholder */}
                            <CardTitle className="text-3xl font-bold mt-1 text-white">{metric.value || '0'}</CardTitle>
                        </div>
                        <div className="p-3 rounded-full bg-white/20">{metric.icon}</div>
                    </div>
                </div>
            </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        {/* Bar Chart Card */}
        <Card className="shadow-lg rounded-xl overflow-hidden border dark:border-gray-700 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
           <CardHeader className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-4 px-5">
             <div className="flex items-center">
               <BarChartIcon className="h-5 w-5 text-indigo-600 dark:text-amber-400 mr-2 flex-shrink-0" />
               <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                 Predicted Stock by Product
               </CardTitle>
             </div>
             <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-7">
               Stock predictions per product
             </CardDescription>
           </CardHeader>
          <CardContent className="pt-6 px-2 sm:px-4">
            {stockByProduct.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={stockByProduct} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ transform: 'translate(0, 5)' }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', fontSize: '12px'}}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                        labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                        formatter={(value) => [`${value} units`, 'Stock']}
                     />
                    {/* Ensure primary color is defined in your CSS variables */}
                    <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-72 px-4 text-center">
                <BarChartIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No prediction data available</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Click Refresh or add predictions.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart Card */}
        <Card className="shadow-lg rounded-xl overflow-hidden border dark:border-gray-700 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
           <CardHeader className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-4 px-5">
             <div className="flex items-center">
               <PieChartIcon className="h-5 w-5 text-indigo-600 dark:text-amber-400 mr-2 flex-shrink-0" />
               <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                 Top Stock Distribution
               </CardTitle>
             </div>
             <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-7">
               Top 5 products by predicted stock
             </CardDescription>
           </CardHeader>
          <CardContent className="pt-6 px-2 sm:px-4 flex items-center justify-center">
            {topStocks.length > 0 ? (
              <div className="h-72 w-full max-w-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={topStocks}
                      dataKey="value" // Matches the key in topStocks map
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8" // Default fill (overridden by Cell)
                      paddingAngle={2}
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%` }
                    >
                      {topStocks.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="hsl(var(--background))" strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', fontSize: '12px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                         labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                        formatter={(value, name) => [`${value} units`, name]}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: "11px", color: "hsl(var(--muted-foreground))", marginTop: "10px" }}
                        iconSize={10}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-72 px-4 text-center">
                <PieChartIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">No stock data for top products</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Click Refresh or add predictions.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Predictions Table */}
      <Card className="shadow-lg rounded-xl overflow-hidden border dark:border-gray-700 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
           <CardHeader className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-4 px-5">
            <div className="flex items-center">
              <TableIcon className="h-5 w-5 text-indigo-600 dark:text-amber-400 mr-2 flex-shrink-0" />
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                Recent Predictions
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-7">
              Latest stock predictions (Top 5 shown)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             {predictions && predictions.length > 0 ? (
               <div className="divide-y divide-gray-100 dark:divide-gray-700">
                 {predictions.slice(0, 5).map((pred, index) => (
                   <div
                     // Use prediction ID if available and unique, otherwise fallback to index
                     key={pred.id || `pred-${index}`}
                     className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                   >
                     <div className="flex items-center gap-3 min-w-0">
                       <div className="p-2 rounded-full bg-indigo-100 dark:bg-gray-700 flex-shrink-0">
                         <BarChartIcon className="h-5 w-5 text-indigo-600 dark:text-amber-400" />
                       </div>
                       <div className="min-w-0">
                          {/* Ensure name exists or provide fallback */}
                         <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{pred.name || `Product ${pred.product}`}</p>
                       </div>
                     </div>
                     <div className="flex-shrink-0 pl-4">
                        {/* Ensure stock exists or provide fallback */}
                       <p className="font-semibold text-gray-700 dark:text-gray-300">{(pred.stock || 0).toLocaleString()} units</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                   <TableIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                   <p className="text-gray-500 dark:text-gray-400 mb-2">No predictions yet</p>
                   <p className="text-sm text-gray-400 dark:text-gray-500">
                     Click Refresh or add predictions.
                   </p>
                </div>
             )}
          </CardContent>
        </Card>

    </div> // End main container
  );
};

export default AdminOverview;