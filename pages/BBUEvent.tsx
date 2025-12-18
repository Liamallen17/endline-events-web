import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Users, User, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { RulesModal } from '../components/RulesModal';
import { TermsModal } from '../components/TermsModal';

export const BBUEvent: React.FC = () => {
  const [showRules, setShowRules] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const categories = [
    {
      title: 'Last Man Standing',
      icon: User,
      description: 'The ultimate individual test - run 6.7km every single hour. Pure grit and determination.',
    },
    {
      title: 'Full Pair (24 Hours)',
      icon: Users,
      description: 'Tag-team endurance - partners alternate hourly laps across the full 24-hour window. Strategy meets stamina.',
    },
    {
      title: 'Half Solo (12 Hours)',
      icon: User,
      description: 'A 12-hour solo gauntlet. The perfect entry point into the world of endurance sport—challenging, relentless, and unforgettable.',
    },
    {
      title: 'Half Pair (12 Hours)',
      icon: Users,
      description: 'Twelve hours shared between two. A gateway into endurance sport built on trust, timing, and teamwork.',
    },
  ];

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
          style={{ backgroundImage: 'url(/FTP-623.JPG)' }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-syncra-black/40 via-transparent to-syncra-black" />

        {/* Hero Content */}
        <div className="container relative h-full flex flex-col justify-center items-center text-center py-8 md:py-0">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black/30 backdrop-blur-sm rounded-lg px-4 sm:px-8 py-3 sm:py-4 mb-4 sm:mb-6"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white">
              Boughton <span className="text-syncra-lime">Backyard</span> Ultra
            </h1>
          </motion.div>

          {/* Location & Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 justify-center mb-3 sm:mb-4"
          >
            <div className="flex items-center gap-2 text-base sm:text-xl md:text-2xl text-white bg-black/30 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2">
              <MapPin size={20} className="text-syncra-lime shrink-0" />
              <span>Boughton Estate, Northamptonshire</span>
            </div>
            <div className="flex items-center gap-2 text-base sm:text-xl md:text-2xl text-white bg-black/30 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2">
              <Calendar size={20} className="text-syncra-lime shrink-0" />
              <span>May 2nd, 2026</span>
            </div>
          </motion.div>

          {/* Distance & Terrain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 justify-center"
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 text-center">
              <span className="text-xl sm:text-2xl md:text-4xl font-bold text-white">Distance</span>
              <span className="text-base sm:text-xl md:text-2xl text-syncra-lime/90 ml-2 sm:ml-3">4.2 mile loop</span>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2 text-center">
              <span className="text-xl sm:text-2xl md:text-4xl font-bold text-white">Terrain</span>
              <span className="text-base sm:text-xl md:text-2xl text-syncra-lime/90 ml-2 sm:ml-3">Flat trail with natural obstacles</span>
            </div>
          </motion.div>
        </div>
      </div>

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

      {/* Four Categories Section */}
      <section className="py-16 md:py-24 bg-syncra-black">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-5xl md:text-6xl font-mono uppercase mb-12 text-center"
          >
            Four Categories
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="border border-syncra-lime/20 rounded-xl p-6 md:p-8 hover:border-syncra-lime/40 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <category.icon size={32} className="text-syncra-lime" />
                <h3 className="text-3xl md:text-4xl font-mono uppercase">{category.title}</h3>
              </div>
              <p className="text-xl text-syncra-lime/70 leading-relaxed">{category.description}</p>
            </motion.div>
          ))}
          </div>
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
              <span>Boughton Estate, Northamptonshire, UK</span>
            </p>
            <p>
              Contact:{' '}
              <a
                href="mailto:boughtonbackyardultra@gmail.com"
                className="text-syncra-lime hover:underline"
              >
                boughtonbackyardultra@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
};

