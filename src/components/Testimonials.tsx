
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: "1",
    name: "Emily Johnson",
    role: "Fashion Enthusiast",
    content: "I've been shopping here for years and the quality never disappoints. Their customer service is exceptional and shipping is always fast!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Tech Reviewer",
    content: "As someone who reviews electronics for a living, I'm extremely impressed with the selection and quality. My new headphones exceeded expectations.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "3",
    name: "Sarah Williams",
    role: "Interior Designer",
    content: "Their home decor collection is absolutely stunning. I've sourced numerous items for my clients and they're always thrilled with the results.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  }
];

export default function Testimonials() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      clearInterval(interval);
      api.destroy();
    };
  }, [api]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Read what our satisfied customers have to say about their shopping experience
          </motion.p>
        </div>
        
        <div className="relative px-12">
          <Carousel 
            setApi={setApi}
            className="w-full max-w-5xl mx-auto"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id}>
                  <motion.div
                    animate={{
                      scale: current === index ? 1 : 0.9,
                      opacity: current === index ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-md relative"
                  >
                    <div className="absolute -top-4 -left-4 bg-blue-500 text-white p-3 rounded-full">
                      <Quote size={20} />
                    </div>
                    
                    <p className="text-gray-700 mb-6 italic pt-4">"{testimonial.content}"</p>
                    
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}