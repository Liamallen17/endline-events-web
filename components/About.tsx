import React from 'react';
import { ArrowDown } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 relative bg-syncra-black">
      <div className="max-w-5xl mx-auto">
        
        {/* Mission Statement - Centered */}
        <div className="flex gap-6 items-start justify-center">
          <div className="w-4 h-4 bg-syncra-lime mt-2 shrink-0" />
          <div className="text-xl md:text-3xl lg:text-4xl leading-relaxed font-mono uppercase text-center max-w-4xl">
            We build stages for ordinary people to do extraordinary things. Our races break comfort, build courage, and celebrate the relentless pursuit of progress.
          </div>
        </div>
      </div>

      {/* Services Index - Centered */}
      <div className="mt-32 flex items-center justify-center gap-2 text-sm uppercase tracking-widest cursor-pointer hover:opacity-70">
        Services Index <ArrowDown size={16} />
      </div>
    </section>
  );
}