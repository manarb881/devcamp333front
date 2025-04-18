import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useData, Product } from "@/contexts/DataContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SCROLL_SPEED_PIXELS_PER_FRAME = 0.5;
const CARD_WIDTH_PX = 220;
const CARD_GAP_PX = 24;
const CARD_TOTAL_WIDTH_PX = CARD_WIDTH_PX + CARD_GAP_PX;
const CARD_IMAGE_HEIGHT_CLASS = "h-36";
const CARD_CONTAINER_HEIGHT_CLASS = "h-auto";

export default function ProductCarousel() {
  const { products, isLoading, error } = useData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const totalWidthOfOneSet = useMemo(
    () => (products?.length || 0) * CARD_TOTAL_WIDTH_PX,
    [products]
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isPaused || !products?.length || !totalWidthOfOneSet) {
      animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
      return;
    }
    const scroll = () => {
      if (!container || isPaused) {
        animationFrameRef.current = requestAnimationFrame(scroll);
        return;
      }
      let newLeft = container.scrollLeft + SCROLL_SPEED_PIXELS_PER_FRAME;
      if (newLeft >= totalWidthOfOneSet) {
        container.scrollLeft = newLeft - totalWidthOfOneSet;
      } else {
        container.scrollLeft = newLeft;
      }
      animationFrameRef.current = requestAnimationFrame(scroll);
    };
    animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
    if (container.scrollLeft >= totalWidthOfOneSet) {
      container.scrollLeft %= totalWidthOfOneSet;
    }
    animationFrameRef.current = requestAnimationFrame(scroll);
    return () => {
      animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [isPaused, products, totalWidthOfOneSet]);

  const scrollAmount = CARD_TOTAL_WIDTH_PX * 2;
  const handleScrollLeft = () => scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  const handleScrollRight = () => scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });

  if (isLoading) return <div className="py-16 text-center text-gray-500">Loading products...</div>;
  if (error)      return <div className="py-16 text-center text-red-500">Error loading data: {error}</div>;
  if (!products?.length) return <div className="py-16 text-center text-gray-500">No products to display.</div>;

  const allProductsToDisplay = [...products, ...products, ...products];

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
      </div>

      {/* Carousel */}
      <div ref={scrollRef} className="flex gap-6 overflow-x-hidden whitespace-nowrap scroll-smooth">
        {allProductsToDisplay.map((product: Product, idx: number) => (
          <div key={`${product.id}-${idx}`} className="flex-shrink-0" style={{ width: CARD_WIDTH_PX }}>
            <Link
              to={`/products/${product.id}`}
              className="block h-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded-lg"
            >
              <Card className="h-full rounded-lg shadow transition-shadow duration-300 hover:shadow-xl overflow-hidden flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className={`${CARD_IMAGE_HEIGHT_CLASS} w-full overflow-hidden bg-gray-100 dark:bg-gray-700`}>
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                  />
                </div>
                <div className="p-3 flex-grow flex items-center justify-center">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate text-center">
                    {product.name}
                  </h4>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* Left Fade */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent dark:from-gray-900 dark:to-transparent pointer-events-none z-10" />
      {/* Right Fade */}
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent dark:from-gray-900 dark:to-transparent pointer-events-none z-10" />

      {/* Arrows */}
      <button
        onClick={handleScrollLeft}
        aria-label="Scroll Left"
        className="
          absolute left-4 top-1/2 -translate-y-1/2 z-20
          w-12 h-12 bg-white/80 dark:bg-gray-800/80
          hover:bg-white/100 dark:hover:bg-gray-800/100
          backdrop-blur-sm rounded-full
          flex items-center justify-center
          shadow-lg hover:shadow-2xl
          transition transform hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
        "
      >
        <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-100" />
      </button>

      <button
        onClick={handleScrollRight}
        aria-label="Scroll Right"
        className="
          absolute right-4 top-1/2 -translate-y-1/2 z-20
          w-12 h-12 bg-white/80 dark:bg-gray-800/80
          hover:bg-white/100 dark:hover:bg-gray-800/100
          backdrop-blur-sm rounded-full
          flex items-center justify-center
          shadow-lg hover:shadow-2xl
          transition transform hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
        "
      >
        <ChevronRight className="w-6 h-6 text-gray-800 dark:text-gray-100" />
      </button>
    </div>
  );
}
