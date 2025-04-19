// frontend/src/components/PromoBanner.tsx

import React, { useState, useEffect } from "react"; // Added useEffect for potential animation trigger
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react"; // Import a loader icon

interface PredictionFormPayload {
    product_id: number;
    date: string;
    store_id: string;
    total_price: number;
    base_price: number;
    is_featured_sku: boolean;
    is_display_sku: boolean;
}


const PromoBanner = () => {
  const { products, submitPrediction } = useData();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<Omit<PredictionFormPayload, 'product_id'> & { product_id: number | string }>({
    product_id: "", date: "", store_id: "",
    total_price: 0, base_price: 0,
    is_featured_sku: false, is_display_sku: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false); // State for animation trigger

  // Trigger animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPredictionResult(null);
    setIsLoading(true);

    // --- Frontend Validation ---
    if (!formData.product_id || formData.product_id === "") {
      setError("Please select a product."); setIsLoading(false); return;
    }
    // ...(keep other validations as they are)...
    if (!formData.date) {
      setError("Please select a date."); setIsLoading(false); return;
    }
    if (!formData.store_id) {
      setError("Please enter a store ID."); setIsLoading(false); return;
    }
    const totalPrice = parseFloat(formData.total_price.toString());
    const basePrice = parseFloat(formData.base_price.toString());
    if (isNaN(totalPrice) || totalPrice <= 0) {
      setError("Total price must be a number greater than 0."); setIsLoading(false); return;
    }
    if (isNaN(basePrice) || basePrice <= 0) {
      setError("Base price must be a number greater than 0."); setIsLoading(false); return;
    }


    // --- Prepare Payload ---
    const payload: PredictionFormPayload = {
      product_id: parseInt(formData.product_id.toString(), 10),
      date: formData.date,
      store_id: formData.store_id,
      total_price: totalPrice,
      base_price: basePrice,
      is_featured_sku: formData.is_featured_sku,
      is_display_sku: formData.is_display_sku,
    };
    console.log("[PromoBanner] Submitting form payload:", payload);


    // --- Call Context API Function ---
    try {
      const predictionResponse = await submitPrediction(payload);
      console.log("[PromoBanner] Received response:", predictionResponse);

      const predictedValue = predictionResponse?.predicted_stock;
      if (typeof predictedValue === 'number' && !isNaN(predictedValue)) {
         const displayStock = Math.round(predictedValue);
         setPredictionResult(displayStock);
         // Optional: Clear error on success if it was used for success message
         // setError(null);
      } else {
         console.error("[PromoBanner] ERROR: Invalid predicted_stock:", predictedValue);
         setError("Prediction submitted, but result format was unexpected.");
      }

      // Reset Form only on successful processing (maybe keep data if error?)
      setFormData({
        product_id: "", date: "", store_id: "",
        total_price: 0, base_price: 0,
        is_featured_sku: false, is_display_sku: false,
      });

    } catch (err: any) {
      console.error("[PromoBanner] Submission error:", err);
      let errorMsg = "Failed to submit prediction.";
      // ...(keep error message formatting as is)...
       const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
         errorMsg += " Details: " + Object.entries(backendErrors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('; ');
      } else if (err.message) {
          errorMsg += ` Message: ${err.message}`;
      }
      setError(errorMsg);
      setPredictionResult(null);
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
      navigate('/admin'); // Or your dashboard route
  };

  // --- Render Form ---
  return (
    // --- Themed Background ---
    <div className="bg-gradient-to-br from-gray-900 to-black text-gray-200 py-16 px-6 overflow-hidden">
      {/* --- Content Container with Animation --- */}
      <div className={`max-w-4xl mx-auto transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* --- Section Header --- */}
        <h2 className="text-4xl font-bold mb-4 text-center lg:text-left">
            Predict Your <span className="text-amber-400">Stock Needs</span>
        </h2>
        <p className="text-lg text-gray-400 mb-8 text-center lg:text-left">
          Use our AI-powered tool to forecast your inventory requirements.
        </p>

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/30 p-6 md:p-8 rounded-lg shadow-xl border border-gray-700/50">
          {/* --- Grid Layout for Inputs --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Select */}
            <div>
              <Label htmlFor="product" className="text-gray-400 font-medium">Product</Label>
              <Select
                value={formData.product_id.toString()}
                onValueChange={(value) => { setFormData({ ...formData, product_id: value }); }}
                required
                disabled={isLoading}
              >
                <SelectTrigger id="product" className="w-full mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-100">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()} className="focus:bg-amber-500/20">
                        {product.name} (ID: {product.id})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>Loading products...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Date Input */}
            <div>
              <Label htmlFor="date" className="text-gray-400 font-medium">Date</Label>
              <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required disabled={isLoading}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-amber-500 focus:ring-amber-500"
                placeholder="YYYY-MM-DD"
                // Style date picker indicator if possible (browser dependent)
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Store ID Input */}
            <div>
              <Label htmlFor="store_id" className="text-gray-400 font-medium">Store ID</Label>
              <Input id="store_id" type="text" value={formData.store_id} onChange={(e) => setFormData({ ...formData, store_id: e.target.value })} required disabled={isLoading}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-amber-500 focus:ring-amber-500"
                placeholder="e.g., 77 or ST123"
              />
            </div>

            {/* Total Price Input */}
            <div>
              <Label htmlFor="total_price" className="text-gray-400 font-medium">Total Price</Label>
              <Input id="total_price" type="number" step="0.01" min="0.01" value={formData.total_price} onChange={(e) => setFormData({ ...formData, total_price: parseFloat(e.target.value) || 0 })} required disabled={isLoading}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-amber-500 focus:ring-amber-500"
                placeholder="e.g., 700.00"
              />
            </div>

            {/* Base Price Input */}
            <div>
              <Label htmlFor="base_price" className="text-gray-400 font-medium">Base Price</Label>
              <Input id="base_price" type="number" step="0.01" min="0.01" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })} required disabled={isLoading}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-amber-500 focus:ring-amber-500"
                placeholder="e.g., 690.00"
              />
            </div>

            {/* Checkboxes Column Span or separate row */}
            <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0 mt-2">
                {/* Featured SKU Checkbox */}
                <div className="flex items-center space-x-2">
                    <Checkbox id="is_featured_sku" checked={formData.is_featured_sku} onCheckedChange={(checked) => setFormData({ ...formData, is_featured_sku: !!checked })} disabled={isLoading}
                        className="border-gray-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="is_featured_sku" className="text-gray-300 cursor-pointer">Featured SKU</Label>
                </div>
                {/* Display SKU Checkbox */}
                <div className="flex items-center space-x-2">
                    <Checkbox id="is_display_sku" checked={formData.is_display_sku} onCheckedChange={(checked) => setFormData({ ...formData, is_display_sku: !!checked })} disabled={isLoading}
                        className="border-gray-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="is_display_sku" className="text-gray-300 cursor-pointer">Display SKU</Label>
                </div>
            </div>
          </div> {/* End Grid */}

          {/* Error Display Area */}
          {error && (
            <p className="text-red-400 bg-red-900/30 p-3 rounded border border-red-700/50 mt-4 text-sm">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <div className="pt-2"> {/* Added padding top for spacing */}
            <Button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-md transition duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Prediction"
              )}
            </Button>
          </div>
        </form>

        {/* --- Display Prediction Result --- */}
        {predictionResult !== null && (
          <div className="mt-10 p-6 bg-gray-800/50 border border-amber-500/30 rounded-lg text-center shadow-lg animate-fadeIn">
            <h3 className="text-xl font-semibold mb-3 text-amber-400">Prediction Result</h3>
            <p className="text-5xl font-bold mb-3 text-white">{predictionResult}</p>
            <p className="text-base text-gray-400 mb-6">(Estimated Units Over the next Week )</p>
            <Button
              onClick={handleGoToDashboard}
              variant="outline" // Use outline style for secondary action
              className="border-amber-500 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 px-6 py-2 transition duration-300"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div> {/* End Content Container */}
    </div> // End Outer Div
  );
};

export default PromoBanner;