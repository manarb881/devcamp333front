import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useData, Product } from "@/contexts/DataContext"; // Adjust path if needed
import { cn } from "@/lib/utils"; // Import cn if you use it

// --- Configuration ---
const SCROLL_SPEED_PIXELS_PER_FRAME = 0.5;
const CARD_WIDTH_PX = 250;
const CARD_GAP_PX = 24;
const CARD_TOTAL_WIDTH_PX = CARD_WIDTH_PX + CARD_GAP_PX;
const CARD_IMAGE_HEIGHT_CLASS = "h-36";
const CARD_CONTAINER_HEIGHT_CLASS = "h-auto";
// --- End Configuration ---

export default function ProductCarousel() {
  const { products } = useData();
  console.log("Products in Carousel Component:", products); // Log products on render
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const totalWidthOfOneSet = useMemo(() => {
    const width = products && products.length > 0
      ? products.length * CARD_TOTAL_WIDTH_PX
      : 0;
    // console.log("Calculated totalWidthOfOneSet:", width); // Optional log
    return width;
  }, [products]);

  useEffect(() => {
    const container = scrollRef.current; // Get ref value

    // --- LOG 1: CONTAINER DIMENSIONS ---
    // Log dimensions when effect runs (after render/update)
    if (container) {
       console.log(
         `Carousel Effect RUNNING - Dimensions: scrollWidth=${container.scrollWidth}, clientWidth=${container.clientWidth}`
       ); // <-- ADD THIS LOG HERE
    } else {
       console.log("Carousel Effect RUNNING - Container ref not ready yet.");
    }
    // --- END LOG 1 ---

    // Conditions to stop or not start the animation
    if (isPaused || !container || !products || products.length === 0 || totalWidthOfOneSet === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      console.log("Carousel Effect: Conditions not met or paused, stopping/skipping animation start.");
      return; // Exit the effect
    }

    // Main animation loop function
    const scroll = () => {
      // Use current ref value inside loop
      const currentContainer = scrollRef.current;
      if (!currentContainer || isPaused) {
          // Keep requesting frames even if paused, to resume later
          animationFrameRef.current = requestAnimationFrame(scroll);
          return; // Skip scrolling calculation if paused or ref lost
      }

      let newScrollLeft = currentContainer.scrollLeft + SCROLL_SPEED_PIXELS_PER_FRAME;

      if (newScrollLeft >= totalWidthOfOneSet) {
        newScrollLeft = newScrollLeft - totalWidthOfOneSet;
        currentContainer.scrollLeft = newScrollLeft; // Teleport
      } else {
        currentContainer.scrollLeft = newScrollLeft; // Normal scroll
      }

      // --- LOG 2: SCROLLLEFT AFTER SETTING ---
      console.log(`Scroll func: Set scrollLeft to ${currentContainer.scrollLeft.toFixed(2)}`); // <-- ADD THIS LOG HERE
      // --- END LOG 2 ---

      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    // Start the animation
    console.log("Carousel Effect: Starting animation loop.");
     if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current); // Clear previous frame just in case
     }
     // Reset scroll position slightly if resuming from pause & potentially over-scrolled
     if (container.scrollLeft >= totalWidthOfOneSet) {
          container.scrollLeft = container.scrollLeft % totalWidthOfOneSet;
     }
     animationFrameRef.current = requestAnimationFrame(scroll);


    // Cleanup function
    return () => {
       console.log("Carousel Effect CLEANUP"); // Log cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPaused, products, totalWidthOfOneSet]); // Dependencies

  // --- Handle loading or empty state ---
  if (!products || products.length === 0) {
    return <div className="py-8 text-center text-gray-500">Loading products...</div>;
  }

  const allProducts = [...products, ...products, ...products];

  return (
    <div
      className={`relative overflow-hidden py-8 mt-100 ${CARD_CONTAINER_HEIGHT_CLASS}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden whitespace-nowrap"
      >
        {allProducts.map((product: Product, index: number) => ( // Keep types for .tsx
          <div
            key={`${product.id}-${index}`}
            className="flex-shrink-0 "
            style={{ width: `${CARD_WIDTH_PX}px` }} 
          >
             <Link to={`/products/${product.id}`} className="block h-full group">
              <Card className="h-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
                 <div className={`${CARD_IMAGE_HEIGHT_CLASS} w-full overflow-hidden bg-gray-100 flex-shrink-0`}>
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/250x150?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/250x150?text=Image+Error";
                    }}
                  />
                </div>
                <div className="p-3 flex flex-col flex-grow">
                  <h4
                    className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors"
                    title={product.name}
                  >
                    {product.name}
                  </h4>
                  <p className="text-sm font-bold text-indigo-700 mt-auto pt-1">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
       {/* Optional: Edge fades */}
       <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
       <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
    </div>
  );
}