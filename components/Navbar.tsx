import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

type EventType = 'BBU' | 'Tracksix' | null;

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<EventType>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const openModal = (event: EventType) => {
    setActiveModal(event);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 md:py-8 bg-syncra-black/90 backdrop-blur-sm">
        <div className="flex items-start justify-between w-full">
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
                    onClick={() => openModal('BBU')}
                    className="w-full text-left px-6 py-3 text-sm tracking-wide hover:bg-syncra-lime/10 transition-colors"
                  >
                    BBU
                  </button>
                  <button
                    onClick={() => openModal('Tracksix')}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-20 bg-syncra-black z-40 p-6 flex flex-col gap-6">
            {/* Our Events with submenu */}
            <div>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="text-xl font-mono uppercase border-b border-syncra-lime/20 pb-4 w-full text-left flex items-center justify-between"
              >
                Our Events
                <ChevronDown size={20} className={`transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileDropdownOpen && (
                <div className="pl-4 mt-4 space-y-4">
                  <button
                    onClick={() => openModal('BBU')}
                    className="block text-lg font-mono uppercase text-syncra-lime/80 hover:text-syncra-lime"
                  >
                    BBU
                  </button>
                  <button
                    onClick={() => openModal('Tracksix')}
                    className="block text-lg font-mono uppercase text-syncra-lime/80 hover:text-syncra-lime"
                  >
                    Tracksix
                  </button>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => scrollToSection('gallery')} 
              className="text-xl font-mono uppercase border-b border-syncra-lime/20 pb-4 text-left"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-xl font-mono uppercase border-b border-syncra-lime/20 pb-4 text-left"
            >
              Contact
            </button>
          </div>
        )}
      </nav>

      {/* Event Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-syncra-black border-2 border-syncra-lime/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-syncra-lime hover:opacity-70 transition-opacity"
            >
              <X size={32} />
            </button>

            {/* Modal Body */}
            <div className="p-8 md:p-12">
              {activeModal === 'BBU' ? (
                <>
                  <h2 className="text-3xl md:text-5xl font-mono uppercase text-syncra-lime mb-6">
                    Boughton Backyard Ultra
                  </h2>
                  <div className="space-y-6 text-syncra-lime/90">
                    <p className="text-lg">
                      Event details coming soon...
                    </p>
                    <div className="border-t border-syncra-lime/20 pt-6">
                      <h3 className="text-xl font-mono uppercase mb-4">Event Information</h3>
                      <p>Add your event details here: date, location, registration info, etc.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl md:text-5xl font-mono uppercase text-syncra-lime mb-6">
                    Tracksix
                  </h2>
                  <div className="space-y-6 text-syncra-lime/90">
                    <p className="text-lg">
                      Event details coming soon...
                    </p>
                    <div className="border-t border-syncra-lime/20 pt-6">
                      <h3 className="text-xl font-mono uppercase mb-4">Event Information</h3>
                      <p>Add your event details here: date, location, registration info, etc.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}