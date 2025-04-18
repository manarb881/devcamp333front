import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "@/components/Contact";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Newsletter } from "@/components/Newsletter";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials";
import { GradientCarousel } from "@/components/GradientCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import Hero from"@/components/Hero.tsx";

// Placeholder SVG Blob Shapes
const Blob1 = () => (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" width="100%">
    <path
      fill="#DBEAFE"
      d="M428,296.5Q418,343,385.5,381Q353,419,301.5,433.5Q250,448,199.5,440Q149,432,101.5,400Q54,368,41.5,309Q29,250,43.5,195.5Q58,141,100.5,97.5Q143,54,196.5,35.5Q250,17,300.5,31Q351,45,390,81.5Q429,118,441.5,184Q454,250,428,296.5Z"
    ></path>
  </svg>
);

const Blob2 = () => (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" width="100%">
    <path
      fill="#C7D2FE"
      d="M423.1,311.3Q396.3,372.6,342.1,414.3Q287.9,456,224.9,441.9Q161.9,427.8,109.5,399.2Q57.1,370.6,42.3,310.3Q27.5,250,55.3,199.9Q83.1,149.8,124.5,106.9Q165.9,64,221.9,48.6Q277.9,33.2,337.4,57.9Q396.9,82.6,428.5,138.8Q460.1,195,449.9,252.5Q439.7,310,423.1,311.3Z"
    ></path>
  </svg>
);

const PlaceholderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const Index = () => {
  const features = [
    { icon: <PlaceholderIcon />, title: "Dark/Light Mode", description: "...", link: "#" },
    { icon: <PlaceholderIcon />, title: "Authentication", description: "...", link: "/auth" },
    { icon: <PlaceholderIcon />, title: "Rich Text Editor", description: "...", link: "/rich-text-editor" },
    { icon: <PlaceholderIcon />, title: "QR Code Generator", description: "...", link: "/qr-generator" },
    { icon: <PlaceholderIcon />, title: "AI Integration", description: "...", link: "#" },
    { icon: <PlaceholderIcon />, title: "Shadcn UI", description: "...", link: "https://ui.shadcn.com/" },
  ];

  const sectionOptions = { triggerOnce: true, threshold: 0.1 };
  const { ref: productsRef, inView: productsInView } = useInView(sectionOptions);
  const { ref: TestimonialsRef, inView: TestimonialsInView } = useInView(sectionOptions);

  const sectionAnimationClasses = "transition-all duration-[2000ms] ease-in-out delay-300";
  const sectionHiddenStateClasses = "opacity-0 translate-y-10";
  const sectionVisibleStateClasses = "opacity-100 translate-y-0";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Hero />

      <section
        ref={productsRef}
        className={cn(
          "py-16 bg-muted/50",
          sectionAnimationClasses,
          productsInView ? sectionVisibleStateClasses : sectionHiddenStateClasses
        )}
      >
        <div className="container-custom">
          <ProductCarousel />
        </div>
      </section>

      <PromoBanner id="predict" />

      <section
        ref={TestimonialsRef}
        className={cn(
          "py-16",
          sectionAnimationClasses,
          TestimonialsInView ? sectionVisibleStateClasses : sectionHiddenStateClasses
        )}
      >
        <Testimonials />
      </section>

      <Newsletter />
    </div>
  );
};

export default Index;
