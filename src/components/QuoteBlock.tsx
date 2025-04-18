import React from 'react';
import { Leaf } from 'lucide-react';

interface QuoteBlockProps {
  visible: boolean;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ visible }) => {
  // Animation classes based on visibility state
  const animationClass = visible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-8';
  
  return (
    <div className="relative left-50">
      {/* Pre-title */}

      {/* Main heading */}
      <h1 
        className={`
          text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight
          ${animationClass} transition-all duration-700 ease-out
        `}
        style={{ transitionDelay: '300ms', fontFamily: 'Poppins, sans-serif' }}
      >
        Optimize <span className="text-primary">Your Stokes</span>
      </h1>
      
      {/* Quote paragraph */}
      <p 
        className={`
          text-lg md:text-xl text-gray-700 mb-8 leading-relaxed
          ${animationClass} transition-all duration-700 ease-out
        `} 
        style={{ transitionDelay: '500ms', fontFamily: 'Poppins, sans-serif' }}
      >
        "The earth provides everything we need to thrive. Our commitment is to bring these pure."
      </p>
      <div className='flex flex-row  justify-between w-[350px] '>
      {/* CTA button */}
      <button
        className={`
          bg-gray-900 hover:bg-green-800 text-white px-8 py-3 rounded-full 
          shadow-md hover:shadow-lg transition-all duration-300 text-lg
          ${animationClass} transition-all duration-700 ease-out
        `}
        style={{ transitionDelay: '700ms', fontFamily: 'Poppins, sans-serif' }}
      >
        Explore Pricings
      </button>

      <button
        className={`
          bg-gray-900 hover:bg-green-800 text-white px-8 py-3 rounded-full 
          shadow-md hover:shadow-lg transition-all duration-300 text-lg
          ${animationClass} transition-all duration-700 ease-out
        `}
        style={{ transitionDelay: '800ms', fontFamily: 'Poppins, sans-serif' }}
      >
        Sign Up
      </button>
      </div>
    </div>
  );
};

export default QuoteBlock;