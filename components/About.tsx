import React from 'react';
import { ArrowDown } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 relative bg-syncra-black">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Text Block */}
        <div className="flex gap-6 items-start">
          <div className="w-4 h-4 bg-syncra-lime mt-2 shrink-0" />
          <div className="text-xl md:text-3xl lg:text-4xl leading-snug font-mono uppercase">
            We build stages for ordinary people to do extraordinary things. Our races break comfort, build courage, and celebrate the relentless pursuit of progress.
          </div>
        </div>

        {/* Empty col for layout spacing (or image if needed later) */}
        <div className="hidden lg:block"></div>
      </div>

      <div className="mt-32 flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer hover:opacity-70">
        Services Index <ArrowDown size={16} />
      </div>
    </section>
  );
}