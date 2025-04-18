import React from 'react';

interface CircularImageProps {
  src: string;
  alt: string;
  className?: string;
  size: 'sm' | 'md' | 'lg';
  delay: number;
  loaded: boolean;
}

const CircularImage: React.FC<CircularImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  size, 
  delay,
  loaded
}) => {
  // Size mapping for different dimensions
  const sizeClasses = {
    sm: 'w-24 h-24 md:w-32 md:h-32',
    md: 'w-32 h-32 md:w-40 md:h-40',
    lg: 'w-40 h-40 md:w-56 md:h-56'
  };
  
  // Animation classes based on loaded state
  const animationClass = loaded 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-16';
    
  return (
    <div 
      className={`
        ${className} 
        ${sizeClasses[size]} 
        rounded-full overflow-hidden shadow-lg border-4 border-white 
        ${animationClass}
        transition-all duration-1000 ease-out
      `}
      style={{ transitionDelay: `${delay}ms` }}
      aria-hidden="true" // Decorative images
    >
      {/* Image with proper loading attributes */}
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
        loading="eager" // Load quickly for hero section
      />
    </div>
  );
};

export default CircularImage;