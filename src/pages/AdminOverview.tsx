import React, { useEffect, useMemo } from "react"; // Import useEffect and useMemo
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
  // Get state and functions from the context
  const { predictions, isLoading, isRefreshing, fetchPredictions, error } = useData();

  // --- **** START: Add useEffect for auto-refresh on mount **** ---
  useEffect(() => {
    console.log("[AdminOverview] Component mounted, triggering initial data fetch/refresh.");
    // Call fetchPredictions when the component mounts.
    // The isLoading state from context should prevent double-fetching if
    // the context already fetched data very recently.
    // The fetchPredictions function itself handles the loading state.
    fetchPredictions();

    // No cleanup needed here unless fetchPredictions returned a cancellation function
  }, [fetchPredictions]); // Dependency array includes fetchPredictions
  // This ensures we use the latest version of the function from context
  // and the effect runs primarily on mount.
  // --- **** END: Add useEffect for auto-refresh on mount **** ---


  // --- Data Processing (wrapped in useMemo for efficiency) ---
  const processedData = useMemo(() => {
    // Default structure if no predictions
    if (!predictions || predictions.length === 0) {
      return {
        totalPredictedProducts: 0,
        estimatedRevenue: '0.00',
        lowStockProductsCount: 0,
        highStockProductsCount: 0,
        stockByProductAggregated: [],
        topStocksAggregated: [],
        latestPredictionsForTable: [],
      };
    }

    // --- Find the LATEST prediction for each unique product ---
    const latestPredictionsMap = new Map<string | number, {
        name: string;
        stock: number;
        date: Date;
        id: string | number;
        product: string | number;
        prediction_date: string;
    }>();
    predictions.forEach((pred) => {
      const productId = pred.product;
      const currentPredDate = new Date(pred.prediction_date);
      const existing = latestPredictionsMap.get(productId);
      if (!existing || currentPredDate >= existing.date) {
        latestPredictionsMap.set(productId, {
          name: pred.name || `Product ${productId}`,
          stock: pred.stock || 0,
          date: currentPredDate,
          id: pred.id,
          product: productId,
          prediction_date: pred.prediction_date,
        });
      }
    });
    const latestPredictionsArray = Array.from(latestPredictionsMap.values());

    // --- Calculate Metrics based on LATEST ---
    const totalPredictedProducts = latestPredictionsArray.length;
    const estimatedRevenueCalc = latestPredictionsArray
      .reduce((sum, pred) => sum + pred.stock * 10, 0)
      .toFixed(2);
    const lowStockProductsCount = latestPredictionsArray.filter((pred) => pred.stock <= 10).length;
    const highStockProductsCount = latestPredictionsArray.filter((pred) => pred.stock >= 50).length;

    // --- Prepare Chart Data ---
    const stockByProductAggregated = latestPredictionsArray.map(pred => ({
        name: pred.name,
        stock: pred.stock,
    })).sort((a, b) => a.name.localeCompare(b.name));

    const topStocksAggregated = latestPredictionsArray
        .sort((a, b) => b.stock - a.stock)
        .slice(0, 5)
        .map(pred => ({
            name: pred.name,
            value: pred.stock,
        }));

    // --- Prepare Table Data ---
    const latestPredictionsForTable = predictions
      ?.slice()
      ?.sort((a, b) => new Date(b.prediction_date).getTime() - new Date(a.prediction_date).getTime())
      ?.slice(0, 5) ?? [];

    return {
        totalPredictedProducts,
        estimatedRevenue: estimatedRevenueCalc,
        lowStockProductsCount,
        highStockProductsCount,
        stockByProductAggregated,
        topStocksAggregated,
        latestPredictionsForTable
    };

  }, [predictions]); // Recalculate processed data only when predictions change

  // Destructure the processed data
  const {
    totalPredictedProducts,
    estimatedRevenue,
    lowStockProductsCount,
    highStockProductsCount,
    stockByProductAggregated,
    topStocksAggregated,
    latestPredictionsForTable
  } = processedData;


  const PIE_COLORS = ["#f59e0b", "#4338ca", "#059669", "#475569", "#a855f7"];

  // --- Dashboard Metrics Array (uses processed data) ---
   const dashboardMetrics = [
    {
      title: "Estimated Revenue",
      value: `$${estimatedRevenue}`,
      description: "Based on latest stock ($10/unit)",
      color: "from-amber-500 to-amber-700",
      icon: <TrendingUp className="h-6 w-6 text-white" />,
    },
    {
      title: "Predicted Products",
      value: totalPredictedProducts,
      description: "Unique products with predictions",
      color: "from-indigo-600 to-indigo-800",
      icon: <BarChartIcon className="h-6 w-6 text-white" />,
    },
    {
      title: "Low Stock Products",
      value: lowStockProductsCount,
      description: "Products with ≤ 10 units (latest)",
      color: "from-slate-600 to-slate-800",
      icon: <AlertTriangle className="h-6 w-6 text-white" />,
    },
    {
      title: "High Stock Products",
      value: highStockProductsCount,
      description: "Products with ≥ 50 units (latest)",
      color: "from-emerald-600 to-emerald-800",
      icon: <TrendingUp className="h-6 w-6 text-white" />,
    },
  ];

  // --- Manual Refresh Handler ---
  const handleRefresh = () => {
    console.log("[AdminOverview] Manual Refresh button clicked.");
    fetchPredictions(); // Call the same function
  };

  // --- Loading UI (uses isLoading from context) ---
  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
             <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 dark:text-amber-400" />
             <span className="ml-3 text-gray-500 dark:text-gray-400">Loading Dashboard...</span>
        </div>
    );
  }

  // --- Error UI (uses error from context) ---
  if (error) {
     return (
        <div className="min-h-screen py-10 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Failed to Load Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            {/* Manual refresh button is still useful here */}
            <Button onClick={handleRefresh} variant="destructive" size="sm" disabled={isRefreshing}>
                 {isRefreshing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Try Again
            </Button>
        </div>
     );
  }

  // --- Main Component Render (using processed data) ---
  return (
    <div className="min-h-screen py-10 px-4 md:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
         {/* Title Area */}
         <div className="flex items-center">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-md mr-4 flex-shrink-0">
               <BarChartIcon className="h-8 w-8 text-indigo-600 dark:text-amber-400" />
            </div>
            <div>
               <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Stock Prediction Dashboard</h1>
               <p className="text-gray-500 dark:text-gray-400">Monitor your dairy stock predictions</p>
            </div>
         </div>
         {/* Manual Refresh Button */}
         <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 min-w-[120px]"
            aria-label="Refresh dashboard data"
         >
           {isRefreshing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
           {isRefreshing ? "Refreshing..." : "Refresh"}
         </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {dashboardMetrics.map((metric) => (
           <Card key={metric.title} className="shadow-lg rounded-xl overflow-hidden border-none transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
               <div className={`bg-gradient-to-br ${metric.color} p-5 text-white`}>
                   <div className="flex justify-between items-center">
                      <div>
                         <CardDescription className="text-white/80 text-sm font-medium">{metric.description}</CardDescription>
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
        {/* Bar Chart Card (Uses aggregated data) */}
        <Card className="shadow-lg rounded-xl overflow-hidden border dark:border-gray-700 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
           <CardHeader className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-4 px-5">
              <div className="flex items-center"><BarChartIcon className="h-5 w-5 text-indigo-600 dark:text-amber-400 mr-2 flex-shrink-0" /><CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">Latest Stock by Product</CardTitle></div>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-7">Latest predicted stock per unique product</CardDescription>
           </CardHeader>
           <CardContent className="pt-6 px-2 sm:px-4">
              {stockByProductAggregated.length > 0 ? (
                 <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                       <ReBarChart data={stockByProductAggregated} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ transform: 'translate(0, 5)' }} interval={0} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', fontSize: '12px'}} itemStyle={{ color: 'hsl(var(--foreground))' }} labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} formatter={(value) => [`${value} units`, 'Latest Stock']} />
                          <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                       </ReBarChart>
                    </ResponsiveContainer>
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center h-72 px-4 text-center"><BarChartIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" /><p className="text-gray-500 dark:text-gray-400 mb-2">No prediction data available</p><p className="text-sm text-gray-400 dark:text-gray-500">Click Refresh or add predictions.</p></div>
              )}
           </CardContent>
        </Card>

        {/* Pie Chart Card (Uses aggregated data) */}
        <Card className="shadow-lg rounded-xl overflow-hidden border dark:border-gray-700 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
           <CardHeader className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-4 px-5">
              <div className="flex items-center"><PieChartIcon className="h-5 w-5 text-indigo-600 dark:text-amber-400 mr-2 flex-shrink-0" /><CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">Top Latest Stock Distribution</CardTitle></div>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-7">Top 5 products by latest predicted stock</CardDescription>
           </CardHeader>
           <CardContent className="pt-6 px-2 sm:px-4 flex items-center justify-center">
              {topStocksAggregated.length > 0 ? (
                 <div className="h-72 w-full max-w-sm">
                    <ResponsiveContainer width="100%" height="100%">
                       <RePieChart>
                          <Pie data={topStocksAggregated} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} fill="#8884d8" paddingAngle={2} labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} >{topStocksAggregated.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="hsl(var(--background))" strokeWidth={1} />))}</Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', fontSize: '12px' }} itemStyle={{ color: 'hsl(var(--foreground))' }} labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} formatter={(value, name) => [`${value} units`, name]} />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "11px", color: "hsl(var(--muted-foreground))", marginTop: "10px" }} iconSize={10}/>
                       </RePieChart>
                    </ResponsiveContainer>
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center h-72 px-4 text-center"><PieChartIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" /><p className="text-gray-500 dark:text-gray-400 mb-2">No stock data for top products</p><p className="text-sm text-gray-400 dark:text-gray-500">Click Refresh or add predictions.</p></div>
              )}
           </CardContent>
        </Card>
      </div>

      {/* Predictions Table (Uses raw, sorted predictions) */}
      <Card className="shadow-lg rounded-xl overflow-hidden border dark:border-gray-700 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800">
           <CardHeader className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-4 px-5">
              <div className="flex items-center"><TableIcon className="h-5 w-5 text-indigo-600 dark:text-amber-400 mr-2 flex-shrink-0" /><CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">Raw Predictions Feed</CardTitle></div>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-7">Most recent prediction entries (Top 5 shown)</CardDescription>
           </CardHeader>
           <CardContent className="p-0">
             {latestPredictionsForTable.length > 0 ? (
               <div className="divide-y divide-gray-100 dark:divide-gray-700">
                 {latestPredictionsForTable.map((pred, index) => (
                   <div key={pred.id || `pred-raw-${index}`} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                     <div className="flex items-center gap-3 min-w-0">
                       <div className="p-2 rounded-full bg-indigo-100 dark:bg-gray-700 flex-shrink-0"><BarChartIcon className="h-5 w-5 text-indigo-600 dark:text-amber-400" /></div>
                       <div className="min-w-0"><p className="font-medium text-gray-800 dark:text-gray-200 truncate">{pred.name || `Product ${pred.product}`}</p></div>
                     </div>
                     <div className="flex-shrink-0 pl-4 text-right">
                       <p className="font-semibold text-gray-700 dark:text-gray-300">{(pred.stock || 0).toLocaleString()} units</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(pred.prediction_date).toLocaleDateString()}</p>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
                 <div className="flex flex-col items-center justify-center py-12 px-4 text-center"><TableIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" /><p className="text-gray-500 dark:text-gray-400 mb-2">No predictions yet</p><p className="text-sm text-gray-400 dark:text-gray-500">Click Refresh or add predictions.</p></div>
             )}
          </CardContent>
        </Card>

    </div> // End main container
  );
};

export default AdminOverview;