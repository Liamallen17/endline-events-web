import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Users, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { RulesModal } from '../components/RulesModal';
import { TermsModal } from '../components/TermsModal';
import RaceFinderModal from '../components/RaceFinderModal';

export const BBUEvent: React.FC = () => {
  const [showRules, setShowRules] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [bbuDropdownOpen, setBbuDropdownOpen] = useState(false);
  const bbuDropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => setBbuDropdownOpen(false);

  const BBU_EVENTS = [
    { label: 'BBU 26.2', date: '26 Sep 2026', past: false },
    { label: 'BBU 26.1', date: '2 May 2026', past: true },
    { label: 'BBU 25.1', date: '27 Sep 2025', past: true },
  ];

  useEffect(() => {
    if (!bbuDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!bbuDropdownRef.current?.contains(e.target as Node)) closeDropdown();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [bbuDropdownOpen]);


  return (
    <div className="min-h-screen bg-syncra-black text-syncra-lime">
      {/* Back Navigation */}
      <Link
        to="/"
        className="fixed top-6 left-6 md:top-8 md:left-12 z-50 flex items-center gap-2 text-syncra-lime hover:opacity-70 transition-opacity bg-syncra-black/80 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-mono uppercase">Back</span>
      </Link>

      {/* Hero Section */}
      <div className="relative min-h-[85vh] md:h-[80vh] overflow-hidden pt-16 pb-8 md:pt-0 md:pb-0">
        {/* Background Image with Grayscale */}
        <div
          className="absolute inset-0 bg-cover bg-center grayscale"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}FTP-623.JPG)` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-syncra-black/40 via-transparent to-syncra-black" />

        {/* Hero Content */}
        <div className="container relative h-full flex flex-col justify-center items-center text-center py-8 md:py-0">
          {/* Main Title */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 sm:px-8 py-3 sm:py-4 mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white">
              <span className="text-syncra-lime">B</span>oughton <span className="text-syncra-lime">B</span>ackyard <span className="text-syncra-lime">U</span>ltra
            </h1>
          </div>

          {/* Pills */}
          <div className="flex flex-col md:flex-row md:flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
            <div className="flex items-center justify-center gap-2 text-base sm:text-xl md:text-2xl text-white bg-black/30 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2">
              <MapPin size={20} className="text-syncra-lime shrink-0" />
              <span>Northamptonshire</span>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center sm:items-center gap-1">
              <span className="text-xl sm:text-2xl md:text-4xl font-bold text-white">Distance</span>
              <span className="text-base sm:text-xl md:text-2xl text-syncra-lime/90">4.2 mile loop</span>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center sm:items-center gap-1">
              <span className="text-xl sm:text-2xl md:text-4xl font-bold text-white">Terrain</span>
              <span className="text-base sm:text-xl md:text-2xl text-syncra-lime/90">Flat trail with natural obstacles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <section className="pt-16 pb-8 md:pt-24 md:pb-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-center"
          >
            <div className="flex flex-col items-center" ref={bbuDropdownRef}>
              <button
                onClick={() => bbuDropdownOpen ? closeDropdown() : setBbuDropdownOpen(true)}
                className="px-10 py-4 bg-syncra-lime text-syncra-black font-mono text-base uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity"
              >
                BOOK NOW ▾
              </button>
              {bbuDropdownOpen && (
                <div className="mt-2 bg-syncra-black border border-syncra-lime/30 rounded-lg w-[240px] max-h-64 overflow-y-auto divide-y divide-syncra-lime/20">
                  {BBU_EVENTS.map((event) =>
                    event.past ? (
                      <div
                        key={event.label}
                        className="w-full text-left px-5 py-4 font-mono text-base text-white opacity-35 cursor-not-allowed select-none"
                      >
                        <span className="block text-syncra-lime text-sm tracking-widest uppercase mb-1">{event.label}</span>
                        {event.date}
                      </div>
                    ) : (
                      <button
                        key={event.label}
                        onClick={() => { closeDropdown(); setIsFinderOpen(true); }}
                        className="w-full text-left px-5 py-4 font-mono text-base text-white hover:bg-syncra-lime/10 transition-colors"
                      >
                        <span className="block text-syncra-lime text-sm tracking-widest uppercase mb-1">{event.label}</span>
                        {event.date}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Description Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
          <h2 className="text-4xl md:text-5xl font-mono uppercase mb-8">
            A Fast & Exciting Woodland Loop
          </h2>
          <p className="text-xl md:text-2xl text-syncra-lime/80 leading-relaxed">
            A flat, fast 4.2-mile (6.7km) loop through Boughton Estate. The course runs through woodland and across a former WWII airfield, following historic runways within a working rural landscape. Designed for speed, with light natural obstacles and minimal elevation change to maintain rhythm and efficiency. The mix of forestry trail and open terrain provides consistent pacing while requiring focus throughout each lap.
          </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Info Section */}
      <section className="py-16 md:py-20 border-t border-syncra-lime/20">
        <div className="container">
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
            <button
              onClick={() => setShowRules(true)}
              className="px-8 py-3 border-2 border-syncra-lime text-syncra-lime font-mono uppercase hover:bg-syncra-lime hover:text-syncra-black transition-colors rounded-lg"
            >
              Timings & Rules
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="px-8 py-3 border-2 border-syncra-lime text-syncra-lime font-mono uppercase hover:bg-syncra-lime hover:text-syncra-black transition-colors rounded-lg"
            >
              Terms & Conditions
            </button>
          </div>

          {/* Contact Info */}
          <div className="text-center space-y-4 text-lg text-syncra-lime/70">
            <p className="flex items-center justify-center gap-2">
              <MapPin size={20} className="text-syncra-lime" />
              <span>Northamptonshire, UK</span>
            </p>
            <p>
              Contact:{' '}
              <a
                href="mailto:boughtonbackyardultra@gmail.com"
                className="text-syncra-lime hover:underline"
              >
                endlineevents@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <RaceFinderModal
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
        eventSlug="bbu-26-2"
        eventLabel="BBU 26.2 — 26 Sep 2026"
      />
    </div>
  );
};

