import React from 'react';
import { motion, Variants } from 'framer-motion';

export const Hero: React.FC = () => {
  // 1) Abstract start -> Focus + Accelerate (Ease In) -> Snap
  const logoVariants: Variants = {
    initial: { 
      filter: "blur(25px)", 
      opacity: 0, 
      scale: 0.9 
    },
    animate: { 
      filter: "blur(0px)", 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 1.2,
        // Custom bezier for "focus + accelerate": starts slow, speeds up significantly, snaps at end.
        ease: [0.55, 0.055, 0.675, 0.19], 
      }
    }
  };

  return (
    <section className="relative pt-32 pb-4">
      {/* Container for content */}
      <div className="container relative flex flex-col items-center justify-center">
        {/* Decorative Squares - Absolute Left/Right Center */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-syncra-lime hidden md:block" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-syncra-lime hidden md:block" />

        {/* Content */}
        <div className="max-w-3xl mx-auto text-center z-10 flex flex-col items-center gap-10">
          {/* H1 Text - Static, appears immediately */}
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed font-mono uppercase tracking-wide text-syncra-lime text-center">
            Our mission is to make every event unforgettable.
          </h1>

          {/* Logo Container - The Main Event */}
          <div className="flex flex-col items-center gap-6">
            <motion.div 
              className="w-full max-w-[200px]"
              initial="initial"
              animate="animate"
              variants={logoVariants}
            >
              <div className="w-full aspect-[4/3] bg-transparent flex items-center justify-center p-2">
                <svg viewBox="0 0 170 120" className="w-full h-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#a3e635" />
                    </linearGradient>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a3e635" />
                      <stop offset="100%" stopColor="#dfff87" />
                    </linearGradient>
                  </defs>
                  
                  {/* Three-bar logo with forward-slanting parallelograms */}
                  <path d="M50 9 H150 L138 35 H38 Z" fill="url(#grad1)" />
                  <path d="M32.5 47 H107.5 L95.5 73 H20.5 Z" fill="url(#grad2)" />
                  <path d="M15 85 H115 L127 111 H3 Z" fill="url(#grad3)" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
