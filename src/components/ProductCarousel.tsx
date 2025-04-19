import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useData, Product } from "@/contexts/DataContext"; // Make sure Product type is correct
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- Predefined Fallback Product Data ---
// Add your desired fallback products here, matching the Product interface
const predefinedProducts: Product[] = [
    { id: "predef-1", name: "Fresh Milk", imageUrl: "/gruyere.jpg" },
    { id: "predef-2", name: "Artisan Cheddar", imageUrl: "/Danone.jpg" },
    { id: "predef-3", name: "Greek Yogurt", imageUrl: "/agro.jpg" },
    { id: "predef-4", name: "Organic Butter", imageUrl: "/cheese.jpg" },

    // Add more as needed
];
// Make sure the placeholder image paths (e.g., /placeholders/milk.jpg) exist in your public folder

// --- Configuration (Keep as is) ---
const SCROLL_SPEED_PIXELS_PER_FRAME = 1.5;
const CARD_WIDTH_PX = 220;
const CARD_GAP_PX = 24;
const CARD_TOTAL_WIDTH_PX = CARD_WIDTH_PX + CARD_GAP_PX;
const CARD_IMAGE_HEIGHT_CLASS = "h-36";
const CARD_CONTAINER_HEIGHT_CLASS = "h-auto";

export default function ProductCarousel() {
  // Get data, loading, and error state from context
  const { products: fetchedProducts, isLoading, error } = useData(); // Rename to avoid conflict

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  // --- Determine which product list to display ---
  const productsToDisplay = useMemo(() => {
    // Prioritize fetched data if loading is finished, there's no error, and data exists
    if (!isLoading && !error && fetchedProducts && fetchedProducts.length > 0) {
      console.log("Using fetched products");
      return fetchedProducts;
    }
    // Otherwise, use predefined products as fallback (if fetch failed, returned empty, or still loading but we need *something*)
    // Note: If you ONLY want fallback on ERROR or EMPTY FETCH, adjust this condition.
    // Current logic shows predefined if fetch is empty OR errored OR potentially during the initial load phase before fetchedProducts populates.
    console.log("Using predefined products");
    return predefinedProducts;
  }, [isLoading, error, fetchedProducts]); // Recalculate when these change

  // --- Calculations based on the *chosen* data source ---
  const totalWidthOfOneSet = useMemo(
    () => (productsToDisplay?.length || 0) * CARD_TOTAL_WIDTH_PX,
    [productsToDisplay] // Depend on the chosen list
  );

  // --- Scrolling Effect ---
  useEffect(() => {
    const container = scrollRef.current;
    // Use productsToDisplay for the check
    if (!container || isPaused || !productsToDisplay?.length || !totalWidthOfOneSet) {
      animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null; // Clear ref explicitly
      return;
    }
    const scroll = () => {
        // Keep null checks inside the loop
        const currentContainer = scrollRef.current;
      if (!currentContainer || isPaused) {
        animationFrameRef.current = requestAnimationFrame(scroll);
        return;
      }
      let newLeft = currentContainer.scrollLeft + SCROLL_SPEED_PIXELS_PER_FRAME;
      if (newLeft >= totalWidthOfOneSet) {
        // Loop smoothly
        currentContainer.scrollLeft = newLeft - totalWidthOfOneSet;
      } else {
        currentContainer.scrollLeft = newLeft;
      }
      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    // Cancel any existing frame before starting new one
    animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);

    // Reset scroll position if needed (e.g., after data change)
    if (container.scrollLeft >= totalWidthOfOneSet) {
      container.scrollLeft %= totalWidthOfOneSet;
    }
    // Start scrolling
    animationFrameRef.current = requestAnimationFrame(scroll);

    // Cleanup function
    return () => {
      animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null; // Clear ref on cleanup
    };
    // Depend on the chosen data source for width calculations
  }, [isPaused, productsToDisplay, totalWidthOfOneSet]);

  // --- Scroll Handlers (no change) ---
  const scrollAmount = CARD_TOTAL_WIDTH_PX * 2;
  const handleScrollLeft = () => scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  const handleScrollRight = () => scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });

  // --- Loading State (Show only during initial fetch) ---
  // If we decide to show predefined immediately, this might be less prominent
  if (isLoading && (!fetchedProducts || fetchedProducts.length === 0)) {
     // Show loading only if we don't have *any* data yet (fetched or predefined)
     // Or adjust this logic based on desired UX (e.g., always show loading spinner first?)
     // return <div className="py-16 text-center text-gray-500">Loading products...</div>;
     // For demo, maybe skip loading and go straight to predefined?
  }

  // --- Error State (Optional: show error *above* fallback data?) ---
  // if (error) {
  //   console.error("Error loading data:", error);
  //   // You could display a small error indicator somewhere, while still showing predefined products
  // }

  // --- Final Check: If BOTH fetched AND predefined are empty ---
  if (!productsToDisplay || productsToDisplay.length === 0) {
    return <div className="py-16 text-center text-gray-500">No products available to display.</div>;
  }

  // --- Duplicate the chosen list for display ---
  const allProductsToDisplay = [...productsToDisplay, ...productsToDisplay, ...productsToDisplay];

  // --- Render Carousel ---
  return (
    <div
      className={`group relative overflow-hidden py-12 bg-white dark:bg-gray-900 ${CARD_CONTAINER_HEIGHT_CLASS}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Title */}
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Our Products
        </h2>
         {/* Optional: Indicate if showing fallback data */}
         {productsToDisplay === predefinedProducts && !isLoading && (
             <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">(Showing featured products)</p>
         )}
         {error && (
             <p className="text-xs text-center text-red-500 dark:text-red-400 mt-1">Could not load live data: {error}</p>
         )}
      </div>

      {/* Carousel Container */}
      <div className="relative"> {/* Added relative container for arrows */}
        {/* Scrollable Area */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-hidden whitespace-nowrap scroll-smooth px-4"> {/* Added padding to scroll area */}
          {allProductsToDisplay.map((product: Product, idx: number) => (
            <div key={`${product.id}-${idx}`} className="flex-shrink-0" style={{ width: `${CARD_WIDTH_PX}px` }}>
              {/* Use a generic link path or remove link for predefined data if destination doesn't exist */}
              <Link
                to={typeof product.id === 'string' && product.id.startsWith('predef-') ? '#' : `/products/${product.id}`}
                className="block h-full group/card focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded-lg"
                // Prevent navigation for predefined items if desired
                onClick={(e) => { if (typeof product.id === 'string' && product.id.startsWith('predef-')) e.preventDefault(); }}
              >
                <Card className="h-full rounded-lg shadow transition-shadow duration-300 hover:shadow-xl overflow-hidden flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className={`${CARD_IMAGE_HEIGHT_CLASS} w-full overflow-hidden bg-gray-100 dark:bg-gray-700`}>
                    <img
                      // Use a more generic placeholder for error state if /placeholder.png is also fallback
                      src={product.imageUrl || "/image-placeholder.svg"} // Use fallback image URL
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/image-placeholder-error.svg"; }} // Different error image
                    />
                  </div>
                  <div className="p-3 flex-grow flex items-center justify-center">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate text-center group-hover/card:text-amber-600 dark:group-hover/card:text-amber-400 transition-colors">
                      {product.name}
                    </h4>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* Fades and Arrows remain largely the same, potentially adjust absolute positioning based on container padding */}
        {/* Left Fade */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent dark:from-gray-900 dark:to-transparent pointer-events-none z-10" />
        {/* Right Fade */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-gray-900 dark:to-transparent pointer-events-none z-10" />

        {/* Arrows */}
        <button
          onClick={handleScrollLeft}
          aria-label="Scroll Left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 ml-1 // Adjusted positioning
                     w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800
                     backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105
                     flex items-center justify-center
                     focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
                     opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300" // Ensure opacity transition
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-gray-100" />
        </button>

        <button
          onClick={handleScrollRight}
          aria-label="Scroll Right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 mr-1 // Adjusted positioning
                     w-10 h-10 md:w-12 md:h-12 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800
                     backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105
                     flex items-center justify-center
                     focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
                     opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300" // Ensure opacity transition
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-gray-100" />
        </button>
      </div> {/* End relative container for arrows */}
    </div> // End Main container
  );
}