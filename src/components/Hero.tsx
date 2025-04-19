import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link

const backgroundImages = [
  "/exempl1.jpg", // Milk splash
  "/exampl2.jpg", // Dairy farm
  "/exampl3.jpg", // Dairy products
];

const carouselSubtitles = [
  {
    subtitle: "Ensure Freshness Always",
    cta: "Explore Predictions",
    link: "/admin",
  },
  {
    subtitle: "Minimize Waste Efficiently",
    cta: "Optimize Now",
    link: "/pricing",
  },
  {
    subtitle: "Predict with Precision",
    cta: "Sign UP",
    link: "/auth/signup",
  },
];

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visualDirection, setVisualDirection] = useState(1);

  // Carousel interval logic
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % backgroundImages.length;
      setVisualDirection(1);
      setActiveIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const currentSubtitle = carouselSubtitles[activeIndex];

  // Animation variants for subtitle
  const subtitleVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { delay: 0.2, duration: 0.6 },
    },
    exit: (dir) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  return (
    <section className="relative w-full min-h-[80vh] md:min-h-screen flex items-center justify-center pt-20 md:pt-24 px-4 overflow-hidden">
      {/* Background Image Carousel with **REDUCED** opacity */}
      <AnimatePresence initial={false} custom={visualDirection}>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} // AnimatePresence handles the fade, opacity class sets the max opacity
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          // --- CHANGE opacity-50 to opacity-40 (or opacity-30 etc.) ---
          className="absolute inset-0 bg-cover bg-center opacity-40"
          // --- END CHANGE ---
          style={{
            backgroundImage: `url(${backgroundImages[activeIndex]})`,
          }}
        >
          {/* Optional: Adjust overlay if needed due to lower image opacity */}
          {/* <div className="absolute inset-0 bg-black/10" /> */}
        </motion.div>
      </AnimatePresence>
       {/* Dark overlay to boost contrast - Placed outside AnimatePresence if you want it constant */}
       {/* Or keep it inside if you want it tied to the image instance */}
       <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent pointer-events-none" aria-hidden="true" />


      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
        {/* Heading */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-shadow-md"
        >
          Grow More<br />
          <span className="  ">Know More , <span className="font-aurora h-2 text-amber-400"> Earn More</span></span>
        </motion.h1>

        {/* Animated Subtitle Container */}
        <div className="relative h-12 overflow-hidden mb-8">
          <AnimatePresence mode="wait" custom={visualDirection}>
            <motion.p
              key={activeIndex}
              custom={visualDirection}
              variants={subtitleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-x-0 text-lg md:text-xl"
            >
              {currentSubtitle.subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link
            to={currentSubtitle.link}
            className="inline-block bg-amber-400 text-gray-900 hover:bg-amber-500 font-semibold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-black/50"
          >
            {currentSubtitle.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;