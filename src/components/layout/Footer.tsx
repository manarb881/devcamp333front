
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AGRoyale</h3>
            <p className="text-gray-400 mb-4">
              This is You solution for optimized logistics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">New Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Our Partners</a></li>

            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Shipping & Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Store Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Payment Methods</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-gray-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">123 HIS ben redouane, SC 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-400" />
                <span className="text-gray-400">info@devteam.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025 AGRoyale. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
  );
}