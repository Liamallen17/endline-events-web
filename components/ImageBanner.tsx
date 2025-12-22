import React from 'react';

export const ImageBanner: React.FC = () => {
  return (
    <section className="w-full overflow-hidden bg-syncra-black">
      <div className="w-full opacity-60">
        <img 
          src={`${import.meta.env.BASE_URL}EEwebpic.jpg`} 
          className="w-full h-auto object-contain grayscale"
          alt="Crowd background"
        />
      </div>
    </section>
  );
}