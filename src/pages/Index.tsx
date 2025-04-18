import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
//import ProductCarousel from "@/components/ProductCarousel";
import  { useState} from "react";
import { Contact } from "@/components/Contact";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import {Newsletter} from "@/components/Newsletter";
import { PromoBanner } from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials";
import { GradientCarousel } from "@/components/GradientCarousel";
import ProductCarousel from "@/components/ProductCarousel";


// --- Feature Icons (Placeholder - Replace with your actual icons) ---
const PlaceholderIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>;
// --- End Feature Icons ---

const Index = () => {
  const features = [
    // ... (your features array remains the same) ...
     {
      icon: <PlaceholderIcon />, title: "Dark/Light Mode", description: "...", link: "#",
    },
    {
      icon: <PlaceholderIcon />, title: "Authentication", description: "...", link: "/auth",
    },
    {
      icon: <PlaceholderIcon />, title: "Rich Text Editor", description: "...", link: "/rich-text-editor",
    },
    {
      icon: <PlaceholderIcon />, title: "QR Code Generator", description: "...", link: "/qr-generator",
    },
    {
      icon: <PlaceholderIcon />, title: "AI Integration", description: "...", link: "#",
    },
    {
      icon: <PlaceholderIcon />, title: "Shadcn UI", description: "...", link: "https://ui.shadcn.com/",
    },
  ];

  // ---- Intersection Observer Hooks ----
  const sectionOptions = {
    triggerOnce: true,
    threshold: 0.1, // Start animation when 10% of the section is visible
  };
  // --- Staggered Animation Options for Cards ---
  const cardAnimationOptions = {
    duration: 500, // Duration for each card animation (in ms)
    delayIncrement: 100, // Delay increment between cards (in ms)
  };
  // --- End Staggered Options ---


  const { ref: productsRef, inView: productsInView } = useInView(sectionOptions);
  // Keep useInView for the features section container to trigger the card animations

  const { ref: TestimonialsRef, inView: TestimonialsInView } = useInView(sectionOptions);
  const { ref: ctaRef, inView: ctaInView } = useInView(sectionOptions);
  const [isForm,setIsform]=useState("false")

  // --- Re-use the slow animation classes for other sections ---
  const sectionAnimationClasses = "transition-all duration-[2000ms] ease-in-out delay-300";
  const sectionHiddenStateClasses = "opacity-0 translate-y-10";
  const sectionVisibleStateClasses = "opacity-100 translate-y-0";
  // ---

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* --- Hero Section (unchanged) --- */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fadeIn">
              <span className="text-primary">AGRoyal</span> 
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl animate-slideUp">
              Your ultimate solution for stock prediction ...
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center animate-slideUp" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" asChild><Link to="/#predict">Predict Now</Link></Button>
              <Button size="lg" variant="outline" asChild><a href="/auth/login" target="_blank" rel="noopener noreferrer">Sign </a></Button>
            </div>
          </div>
        </div>
      </section>
 
      {/* --- Productes Section (using slow animation) --- */}
      <section
        ref={productsRef}
        className={cn(
          "py-16 bg-muted/50",
          sectionAnimationClasses,
          productsInView ? sectionVisibleStateClasses : sectionHiddenStateClasses
        )}
      >
        <div className="container-custom">
          {/* ... product carousel content ... */}
            <div className="text-center mb-12">
                
                
            </div>
            
        </div>
      </section>

      
     {/* products carousel  */ }
     
     


      {/* --- Features Section (Container triggers staggered cards) --- */}
   
      <PromoBanner id="predict"></PromoBanner>
      {/* --- Contact Section (using slow animation) --- */}
      <ProductCarousel></ProductCarousel>


      {/* --- Testimonials Section (using slow animation) --- */}
      <section
        ref={TestimonialsRef}
        className={cn(
          "py-16",
          sectionAnimationClasses,
          TestimonialsInView ? sectionVisibleStateClasses : sectionHiddenStateClasses
        )}
       >
      
      <Testimonials></Testimonials>
      </section>


      {/* --- CTA Section (using slow animation) --- */}

      <Newsletter></Newsletter>
    </div>
  );
};

export default Index;