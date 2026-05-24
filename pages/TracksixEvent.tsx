import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { TracksixRulesModal } from '../components/TracksixRulesModal';
import { TracksixTermsModal } from '../components/TracksixTermsModal';
import { TracksixRaceFinderModal } from '../components/TracksixRaceFinderModal';

const COMING_SOON = true;

const TracksixComingSoon: React.FC = () => (
  <div className="min-h-screen bg-syncra-black text-white tracksix flex flex-col">
    <Link
      to="/"
      className="fixed top-6 left-6 md:top-8 md:left-12 z-50 flex items-center gap-2 text-white hover:opacity-70 transition-opacity bg-syncra-black/80 backdrop-blur-sm px-4 py-2 rounded-full"
    >
      <ArrowLeft size={20} />
      <span className="text-sm font-mono uppercase">Back</span>
    </Link>

    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-syncra-black">
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}TRACKSIX.png)` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, #0a0a0a 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, #0a0a0a 0%, transparent 25%, transparent 75%, #0a0a0a 100%)',
        }}
      />
    </div>

    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl md:text-7xl font-mono uppercase accent-blue">COMING SOON</h1>
      <p className="text-lg text-white/60 font-mono mt-4">Something fast is on its way. Stay tuned.</p>
    </div>
  </div>
);

export const TracksixEvent: React.FC = () => {
  if (COMING_SOON) return <TracksixComingSoon />;

  const [showRules, setShowRules] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const winCategories = [
    {
      icon: Trophy,
      title: 'Most Laps',
      description: 'Your team against every other team on the track.',
    },
    {
      icon: Zap,
      title: 'Fastest Mile',
      description: 'One runner, one shot, a prize worth running for.',
    },
  ];

  return (
    <div className="min-h-screen bg-syncra-black text-white tracksix">
      {/* Back Navigation */}
      <Link
        to="/"
        className="fixed top-6 left-6 md:top-8 md:left-12 z-50 flex items-center gap-2 text-white hover:opacity-70 transition-opacity bg-syncra-black/80 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-mono uppercase">Back</span>
      </Link>

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-syncra-black">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}TRACKSIX.png)` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, #0a0a0a 70%)',
          }}
        />
        {/* Left/right edge fade */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, #0a0a0a 0%, transparent 25%, transparent 75%, #0a0a0a 100%)',
          }}
        />
      </div>

      {/* Gradient Divider */}
      <div className="gradient-divider w-full" />

      {/* Event Overview Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left - The Event */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-4xl md:text-5xl font-mono uppercase mb-6 accent-blue">
                The Event
              </h2>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                Six hours. One mile loops. Teams of 4. Every lap counts. Every rotation matters.
                The team with the most laps at the end wins. Simple format. Anything but easy.
              </p>
            </motion.div>

            {/* Right - How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-2xl font-mono uppercase mb-6 accent-blue">How It Works</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                You run your mile. You tag your teammate. You recover. You do it again.
                For six hours. Pace it wrong and you'll feel it when it matters most.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider w-full max-w-4xl mx-auto" />

      {/* Decorative Pulse Element */}
      <div className="flex justify-center py-8">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-3 h-3 rounded-full bg-[#38BDF8]"
        />
      </div>

      {/* Winning Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-4xl md:text-5xl font-mono uppercase mb-12 text-center accent-blue"
          >
            Winning Categories
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            {winCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="border-2 border-[#38BDF8] rounded-xl p-6 md:p-8 text-center hover:bg-white/5 transition-colors"
              >
                <category.icon size={40} className="mx-auto mb-4 accent-blue" />
                <h3 className="text-xl font-mono uppercase mb-3 accent-purple">{category.title}</h3>
                <p className="text-white/70 leading-relaxed">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider w-full max-w-4xl mx-auto" />

      {/* Strategy Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-mono uppercase mb-8 accent-blue">
              Strategy Counts
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              You don't just need fast runners. You need smart ones. Rotate well, pace right,
              and bring a team that's actually trained for this.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="register" className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 via-transparent to-[#A855F7]/10" />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono uppercase mb-4 accent-blue">
              ONE TEAM. SIX HOURS. ALL SPEED.
            </h2>
            <p className="text-lg text-white/70 mb-8">Who's taking the win?</p>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-10 py-4 text-lg font-mono uppercase transition-all rounded-lg border-2 border-[#38BDF8] hover:bg-white/10"
              style={{ color: 'var(--tracksix-blue)' }}
            >
              Build your team
            </button>
          </motion.div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider w-full" />

      {/* Footer Meta Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
            <button
              onClick={() => setShowRules(true)}
              className="px-8 py-3 font-mono uppercase transition-all rounded-lg border-2 border-[#38BDF8] hover:bg-white/10"
              style={{ color: 'var(--tracksix-blue)' }}
            >
              Timings & Rules
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="px-8 py-3 font-mono uppercase transition-all rounded-lg border-2 border-[#38BDF8] hover:bg-white/10"
              style={{ color: 'var(--tracksix-blue)' }}
            >
              Terms & Conditions
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Calendar size={20} className="accent-blue" />
                <span className="font-mono uppercase text-sm accent-purple">Date</span>
              </div>
              <p className="text-lg text-white/80">Coming Soon</p>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <MapPin size={20} className="accent-blue" />
                <span className="font-mono uppercase text-sm accent-purple">Venue</span>
              </div>
              <p className="text-lg text-white/80">Northants, NN14</p>
            </div>

            <div>
              <span className="font-mono uppercase text-sm accent-purple">FAQs</span>
              <p className="text-lg text-white/80 mt-2">Coming Soon</p>
            </div>

            <div>
              <span className="font-mono uppercase text-sm accent-purple">Contact</span>
              <p className="mt-2">
                <a
                  href="mailto:endlineevents@gmail.com"
                  className="text-lg hover:underline accent-blue"
                >
                  endlineevents@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <TracksixRulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <TracksixTermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <TracksixRaceFinderModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  );
};
