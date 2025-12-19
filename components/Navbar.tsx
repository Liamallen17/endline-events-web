import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navigateToBBU = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/events/bbu');
  };

  const navigateToTracksix = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/events/tracksix');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-6 md:py-8 bg-syncra-black/90 backdrop-blur-sm">
        <div className="container flex items-start justify-between">
          {/* Logo Text - Links back to top */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-sm font-normal tracking-wide uppercase hover:opacity-70 transition-opacity"
          >
            ENDLINE EVENTS
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {/* OUR EVENTS Dropdown */}
            <div 
              className="relative pt-2"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="text-sm font-normal tracking-wide hover:opacity-70 transition-opacity flex items-center gap-1">
                OUR EVENTS
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 bg-syncra-black/95 backdrop-blur-sm border border-syncra-lime/20 rounded-lg overflow-hidden min-w-[160px]">
                  <button
                    onClick={navigateToBBU}
                    className="w-full text-left px-6 py-3 text-sm tracking-wide hover:bg-syncra-lime/10 transition-colors"
                  >
                    BBU
                  </button>
                  <button
                    onClick={navigateToTracksix}
                    className="w-full text-left px-6 py-3 text-sm tracking-wide hover:bg-syncra-lime/10 transition-colors border-t border-syncra-lime/10"
                  >
                    Tracksix
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => scrollToSection('gallery')} 
              className="text-sm font-normal tracking-wide hover:opacity-70 transition-opacity"
            >
              GALLERY
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-sm font-normal tracking-wide hover:opacity-70 transition-opacity"
            >
              CONTACT
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-syncra-lime"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </nav>

      {/* Mobile Menu - Outside nav for proper layering */}
      {mobileMenuOpen && (
        <div 
          className="fixed left-0 right-0 bottom-0 z-[100] p-6 flex flex-col gap-6 md:hidden"
          style={{ top: '72px', backgroundColor: '#0a0a0a' }}
        >
          {/* Our Events with submenu */}
          <div>
            <button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="text-xl font-mono uppercase border-b border-syncra-lime/20 pb-4 w-full text-left flex items-center justify-between text-syncra-lime"
            >
              Our Events
              <ChevronDown size={20} className={`transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileDropdownOpen && (
              <div className="pl-4 mt-4 space-y-4">
                <button
                  onClick={navigateToBBU}
                  className="block text-lg font-mono uppercase text-syncra-lime/80 hover:text-syncra-lime"
                >
                  BBU
                </button>
                <button
                  onClick={navigateToTracksix}
                  className="block text-lg font-mono uppercase text-syncra-lime/80 hover:text-syncra-lime"
                >
                  Tracksix
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => scrollToSection('gallery')} 
            className="text-xl font-mono uppercase border-b border-syncra-lime/20 pb-4 text-left text-syncra-lime"
          >
            Gallery
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="text-xl font-mono uppercase border-b border-syncra-lime/20 pb-4 text-left text-syncra-lime"
          >
            Contact
          </button>
        </div>
      )}

    </>
  );
}