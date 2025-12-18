import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="py-20 border-t border-syncra-lime/20 text-sm md:text-xs tracking-wide uppercase font-mono">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6 md:gap-8 lg:gap-12">
          {/* Mission - left side */}
          <div className="flex gap-4 items-start max-w-xs mx-auto lg:mx-0 text-center lg:text-left">
            <div className="w-3 h-3 bg-syncra-lime mt-1 shrink-0 hidden lg:block" />
            <p className="leading-relaxed opacity-80">
              WE BUILD STAGES FOR ORDINARY PEOPLE TO DO EXTRAORDINARY THINGS. OUR RACES BREAK COMFORT, BUILD COURAGE, AND CELEBRATE THE RELENTLESS PURSUIT OF PROGRESS.
            </p>
          </div>

          {/* Right side - Contact, Follow, Legal grouped */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 lg:gap-8">
            {/* Contact */}
            <div className="text-center">
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="opacity-80">ENDLINEEVENTS@GMAIL.COM</p>
            </div>

            {/* Follow */}
            <div className="text-center">
              <h4 className="font-bold mb-4">Follow</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.instagram.com/boughtonbackyardultra" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="opacity-80 hover:opacity-100 hover:underline underline-offset-4 decoration-1 transition-opacity"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-center">
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/privacy" 
                    className="opacity-80 hover:opacity-100 hover:underline underline-offset-4 decoration-1 transition-opacity"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cookies" 
                    className="opacity-80 hover:opacity-100 hover:underline underline-offset-4 decoration-1 transition-opacity"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-syncra-lime/10 text-center opacity-60">
          <p>© 2025 Endline Events Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
