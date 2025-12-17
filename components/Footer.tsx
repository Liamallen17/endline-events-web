import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-20 px-6 md:px-12 border-t border-syncra-lime/20 text-sm md:text-xs tracking-wide uppercase font-mono">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Col 1 - Mission */}
        <div className="flex gap-4 items-start">
          <div className="w-3 h-3 bg-syncra-lime mt-1 shrink-0" />
          <p className="leading-relaxed opacity-80">
            WE BUILD STAGES FOR ORDINARY PEOPLE TO DO EXTRAORDINARY THINGS. OUR RACES BREAK COMFORT, BUILD COURAGE, AND CELEBRATE THE RELENTLESS PURSUIT OF PROGRESS.
          </p>
        </div>

        {/* Col 2 - Contact */}
        <div className="space-y-4">
          <h4 className="font-bold mb-4">Contact</h4>
          <p className="opacity-80">ENDLINEEVENTS@GMAIL.COM</p>

        </div>

        {/* Col 3 - Explore */}
        <div className="space-y-4">
          <h4 className="font-bold mb-4">Explore</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline underline-offset-4 decoration-1">Information</a></li>
            <li><a href="#" className="hover:underline underline-offset-4 decoration-1">Weddings</a></li>
            <li><a href="#" className="hover:underline underline-offset-4 decoration-1">Corporate</a></li>
            <li><a href="#" className="hover:underline underline-offset-4 decoration-1">Private Parties</a></li>
            <li><a href="#" className="hover:underline underline-offset-4 decoration-1">Contact</a></li>
          </ul>
        </div>

        {/* Col 4 - Follow */}
        <div className="space-y-4">
          <h4 className="font-bold mb-4">Follow</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline underline-offset-4 decoration-1">Instagram</a></li>
            <li><a href="#" className="hover:underline underline-offset-4 decoration-1">Youtube</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};