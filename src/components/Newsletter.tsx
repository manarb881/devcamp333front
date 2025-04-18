
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Stay Updated
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-gray-300 mb-8"
          >
            Subscribe to our newsletter for exclusive deals, new arrivals, and style inspiration.
          </motion.p>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="py-3 px-6 rounded-full text-gray-900 flex-grow max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary hover:bg-blue-700 py-3 px-8 rounded-full font-semibold flex items-center justify-center gap-2"
              type="submit"
            >
              Subscribe <Send size={16} />
            </motion.button>
          </motion.form>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-gray-400 text-sm mt-4"
          >
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </motion.p>
        </div>
      </div>
    </section>
  );
}