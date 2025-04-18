
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const backgrounds = [
  "linear-gradient(to right, #ee9ca7, #ffdde1)",
  "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
  "linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)",
  "linear-gradient(to right, #243949 0%, #517fa4 100%)",
  "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
  "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)",
];

const carouselContent = [
  {
    title: "Summer Collection",
    subtitle: "Explore our new summer styles",
    cta: "Shop Now"
  },
  {
    title: "Limited Edition",
    subtitle: "Exclusive items for a limited time",
    cta: "View Collection"
  },
  {
    title: "Special Deals",
    subtitle: "Up to 50% off on selected items",
    cta: "See Offers"
  },
  {
    title: "Premium Selection",
    subtitle: "Luxury items for discerning tastes",
    cta: "Discover"
  },
  {
    title: "New Arrivals",
    subtitle: "The latest additions to our catalog",
    cta: "Explore"
  },
  {
    title: "Trending Now",
    subtitle: "What everyone's talking about",
    cta: "Shop Trending"
  }
];

export function GradientCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        // Switch direction when reaching the end
        if (current === backgrounds.length - 1) {
          setDirection(-1);
          return current - 1;
        } else if (current === 0 && direction === -1) {
          setDirection(1);
          return current + 1;
        } else {
          return current + direction;
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [direction]);

  const currentContent = carouselContent[activeIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden mt-[60%]  h-700 ">
      <motion.div
        animate={{
          background: backgrounds[activeIndex],
        }}
        transition={{ duration: 1.5 }}
        className="h-full w-full flex items-center justify-center"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 }
            }}
            className="text-center text-white absolute inset-0 flex flex-col items-center justify-center px-4"
          >
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              {currentContent.title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl mb-8"
            >
              {currentContent.subtitle}
            </motion.p>
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
            >
              {currentContent.cta}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}