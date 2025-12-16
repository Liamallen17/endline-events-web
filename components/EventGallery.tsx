import React from 'react';
import { Camera, ExternalLink } from 'lucide-react';

export const EventGallery: React.FC = () => {
  return (
    <section id="gallery" className="py-24 px-6 md:px-12 border-t border-syncra-lime/20">
      <div className="max-w-5xl mx-auto">
        <a 
          href="https://David-Lester.pixieset.com/boughtonbackyardultra/" 
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
            {/* Background image with hover effects */}
            <img 
              src="/FTP-428.JPG" 
              alt="Event Gallery"
              className="absolute inset-0 w-full h-full object-cover brightness-50 scale-100 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out"
            />
            
            {/* Dark overlay - fades on hover */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
              {/* Camera Icon */}
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                <Camera 
                  size={80} 
                  className="text-syncra-lime drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-mono uppercase text-syncra-lime text-center leading-tight">
                View Events Gallery
              </h3>
              
              {/* Subtitle */}
              <p className="text-sm md:text-base text-syncra-lime/90 text-center font-mono">
                Click to see all photos from our events
              </p>
              
              {/* Glassmorphism CTA Button */}
              <button className="mt-4 px-8 py-3 bg-syncra-lime/10 backdrop-blur-md border border-syncra-lime/30 rounded-full text-syncra-lime uppercase tracking-widest font-mono text-sm flex items-center gap-3 group-hover:bg-syncra-lime/20 group-hover:border-syncra-lime/50 transition-all duration-300 group-hover:scale-105">
                <span>Open Gallery</span>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};
