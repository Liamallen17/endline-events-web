import React from 'react';
import { Camera, ExternalLink } from 'lucide-react';

export const EventGallery: React.FC = () => {
  return (
    <section id="gallery" className="py-24 border-t border-syncra-lime/20">
      <div className="container">
        <a 
          href="https://David-Lester.pixieset.com/boughtonbackyardultra/" 
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
            {/* Background image with hover effects */}
            <img 
              src="/FTP-428.JPG" 
              alt="Event Gallery"
              className="absolute inset-0 w-full h-full object-cover brightness-50 scale-100 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out"
            />
            
            {/* Dark overlay - fades on hover */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 md:p-8">
              {/* Camera Icon */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                <Camera 
                  className="w-full h-full text-syncra-lime drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                />
              </div>
              
              {/* Title */}
              <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-mono uppercase text-syncra-lime text-center leading-tight">
                View Events Gallery
              </h3>
              
              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-syncra-lime/90 text-center font-mono">
                Click to see all photos from our events
              </p>
              
              {/* Glassmorphism CTA Button */}
              <button className="mt-2 sm:mt-4 px-6 sm:px-8 py-2 sm:py-3 bg-syncra-lime/10 backdrop-blur-md border border-syncra-lime/30 rounded-full text-syncra-lime uppercase tracking-widest font-mono text-xs sm:text-sm flex items-center gap-2 sm:gap-3 group-hover:bg-syncra-lime/20 group-hover:border-syncra-lime/50 transition-all duration-300 group-hover:scale-105">
                <span>Open Gallery</span>
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};
