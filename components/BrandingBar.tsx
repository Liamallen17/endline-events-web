import React from 'react';

export const BrandingBar: React.FC = () => {
  return (
    <section className="w-full pb-12 pt-4 md:pb-24 bg-syncra-black overflow-hidden">
      <h2 className="font-display text-[clamp(2.5rem,11vw,11rem)] leading-none text-syncra-lime text-center tracking-wider select-none pointer-events-none px-5 md:px-12">
        ENDLINE<br />EVENTS
      </h2>
    </section>
  );
};