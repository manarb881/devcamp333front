
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./product-card";

// Sample product data
const products = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Clothing",
    isNew: true,
    rating: 4.5
  },
  {
    id: "2",
    name: "Designer Leather Bag",
    price: 99.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    isSale: true,
    rating: 4.8
  },
  {
    id: "3",
    name: "Minimalist Watch",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    rating: 4.3
  },
  {
    id: "4",
    name: "Wireless Headphones",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    isSale: true,
    rating: 4.7
  },
  {
    id: "5",
    name: "Ceramic Coffee Mug",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    isNew: true,
    rating: 4.1
  },
  {
    id: "6",
    name: "Fitness Smart Watch",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.6
  },
  {
    id: "7",
    name: "Vintage Sunglasses",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    isSale: true,
    rating: 4.2
  },
  {
    id: "8",
    name: "Desk Lamp",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    isNew: true,
    rating: 4.4
  }
];

export function ContinuousSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(true);

  useEffect(() => {
    if (!scrollRef.current || !isScrolling) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    const containerWidth = scrollRef.current.scrollWidth;
    const viewportWidth = scrollRef.current.offsetWidth;

    const scroll = () => {
      if (!scrollRef.current) return;

      scrollPosition += scrollSpeed;
      
      // Reset scroll position once we've scrolled through half the items
      if (scrollPosition >= containerWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollRef.current.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScrolling]);

  // Duplicate products to create seamless loop
  const allProducts = [...products, ...products]; 

  return (
    <div 
      className="relative overflow-hidden py-8"
      onMouseEnter={() => setIsScrolling(false)}
      onMouseLeave={() => setIsScrolling(true)}
    >
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden"
      >
        {allProducts.map((product, index) => (
          <div 
            key={`${product.id}-${index}`} 
            className="flex-shrink-0 w-[250px]"
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}