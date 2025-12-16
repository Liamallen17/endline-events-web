import React from 'react';

export const BrandingBar: React.FC = () => {
  return (
    <section className="w-full overflow-hidden pb-12 pt-4 md:pb-24 bg-syncra-black flex flex-col">
      <div className="w-full flex flex-col items-center">
        <h2 className="font-display text-[8vw] md:text-[9vw] leading-[0.8] text-syncra-lime select-none max-w-4xl w-full pointer-events-none flex flex-col gap-4">
          
          {/* ENDLINE - Static, no animation */}
          <div className="flex justify-center w-full tracking-wider scale-x-125">
            ENDLINE
          </div>

          {/* EVENTS - Static, no animation */}
          <div className="flex justify-center w-full tracking-wider scale-x-125">
            EVENTS
          </div>

        </h2>
      </div>
    </section>
  );
};