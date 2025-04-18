
import { motion } from "framer-motion";

export function PromoBanner() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 -z-10" />
      
      <div className="absolute inset-0 opacity-20 -z-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5"
            d="M0,0 L100,0 L100,100 L0,100 Z" 
          />
          <path 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5"
            d="M0,0 L100,100 M100,0 L0,100" 
          />
        </svg>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2 text-white mb-10 md:mb-0"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Predict you product's stocks! <br />
             
            </h2>
            <p className="text-xl mb-8 text-white/80">
              get an estimation of you future stocks by clicking predict 
            </p>
            <div >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full shadow-md ml-50"
              >
                Predict
              </motion.button>

            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative md:w-1/2"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl transform -translate-x-10 translate-y-10" />
              <motion.img 
                src="/gruyere.jpg" 
                alt="Promotional image"
                className="rounded-3xl shadow-2xl relative z-10 transform"
                style={{ 
                  borderRadius: "30% 70% 70% 30% / 30% 40% 60% 70%",
                  objectFit: "cover",
                  width: "100%",
                  height: "100%"
                }}
                animate={{ 
                  borderRadius: [
                    "30% 70% 70% 30% / 30% 40% 60% 70%",
                    "60% 40% 30% 70% / 60% 30% 70% 40%",
                    "30% 70% 70% 30% / 30% 40% 60% 70%"
                  ]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}