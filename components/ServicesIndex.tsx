import React from 'react';
import { Link } from 'react-router-dom';

export const ServicesIndex: React.FC = () => {
  return (
    <section className="py-24 border-t border-syncra-lime/20 relative bg-syncra-black">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative">

        {/* Vertical divider - only visible on md+ screens */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-syncra-lime/20 -translate-x-1/2" />

        {/* Left Card - Boughton Backyard Ultra */}
        <div className="flex flex-col items-center text-center space-y-8">
          <h3 className="text-xl md:text-3xl lg:text-4xl leading-snug font-mono uppercase">
            Boughton Backyard Ultra
          </h3>

          <div className="w-full max-w-xs max-h-64 flex items-center justify-center coin-spin-container">
            <img
              src={`${import.meta.env.BASE_URL}BBU Medal Transparent.png`}
              alt="Boughton Backyard Ultra Medal"
              className="w-full h-full object-contain coin-spin"
            />
          </div>

          <Link
            to="/events/bbu"
            className="px-6 py-2.5 bg-syncra-lime text-syncra-black font-mono text-sm uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity"
          >
            Find Your Race
          </Link>
        </div>

        {/* Right Card - Tracksix */}
        <div className="flex flex-col items-center text-center space-y-8">
          <h3 className="text-xl md:text-3xl lg:text-4xl leading-snug font-mono uppercase">
            Tracksix
          </h3>

          <div className="w-full max-w-xs max-h-64 flex items-center justify-center coin-spin-container">
            <img
              src={`${import.meta.env.BASE_URL}Tracksix1.jpg`}
              alt="Tracksix"
              className="w-full h-full object-contain coin-spin"
            />
          </div>

          <span className="px-6 py-2.5 bg-syncra-lime/30 text-syncra-black/50 font-mono text-sm uppercase tracking-widest rounded-full cursor-not-allowed select-none">
            Coming Soon
          </span>
        </div>

        </div>
      </div>
    </section>
  );
};
