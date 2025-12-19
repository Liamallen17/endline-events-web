import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Users, Clock, Trophy, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { TracksixRulesModal } from '../components/TracksixRulesModal';
import { TracksixTermsModal } from '../components/TracksixTermsModal';

export const TracksixEvent: React.FC = () => {
  const [showRules, setShowRules] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const steps = [
    {
      number: 1,
      title: 'Create Your Team',
      description: 'Assemble a squad of 4-6 runners. Mix experience levels, balance strengths, and prepare for a true team challenge.',
    },
    {
      number: 2,
      title: 'Run the Mile',
      description: 'Each runner completes 4 laps (1 mile) around the track. Push your pace—every second counts toward the team total.',
    },
    {
      number: 3,
      title: 'Relay Changeover',
      description: 'Tag your next teammate in the relay zone. Smooth transitions keep momentum high and the laps flowing.',
    },
    {
      number: 4,
      title: 'Repeat for 6 Hours',
      description: 'Rotate through your team continuously for the full 6-hour event. Strategy and endurance determine the winner.',
    },
  ];

  const winCategories = [
    {
      icon: Trophy,
      title: 'Winning Team (4 Runners)',
      description: 'The 4-person team with the most total laps completed takes the crown.',
    },
    {
      icon: Trophy,
      title: 'Winning Team (6 Runners)',
      description: 'The 6-person team with the most total laps completed earns the victory.',
    },
    {
      icon: Zap,
      title: 'Bonus Win - Fastest Mile',
      description: 'The individual with the fastest single mile of the day claims a special prize.',
    },
  ];

  const strategies = [
    'Rotate runners strategically to maintain consistent lap times',
    'Consider your team composition—mix sprinters with endurance runners',
    'Plan rest intervals to keep everyone fresh throughout the 6 hours',
    'Track your competitors and adjust your pace accordingly',
    'Save energy for a strong final push in the last hour',
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
        {/* Background Image - contain to prevent upscaling blur */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/Tracksix1.jpg)' }}
        />
        {/* Radial vignette for seamless edge blend */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'radial-gradient(ellipse at center, transparent 30%, #0a0a0a 70%)' 
          }}
        />
      </div>

      {/* Gradient Divider */}
      <div className="gradient-divider w-full" />

      {/* Event Overview Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-4xl md:text-5xl font-mono uppercase mb-6 gradient-text">
                The Event
              </h2>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                Tracksix is a 6-hour team relay event designed to test endurance, strategy, and teamwork.
                Teams of 4-6 runners take turns completing mile-long stints (4 laps per runner) around the track,
                rotating continuously throughout the event. The goal is simple: rack up as many total laps as possible.
                Whether you're a seasoned runner or new to the sport, Tracksix offers a unique challenge where
                every teammate matters.
              </p>
            </motion.div>

            {/* Right - Key Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="gradient-border rounded-xl p-6 md:p-8"
            >
              <h3 className="text-2xl font-mono uppercase mb-6 accent-blue">Key Details</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <Users size={24} className="accent-purple shrink-0" />
                  <span className="text-lg text-white/90">Teams of 4-6 runners</span>
                </li>
                <li className="flex items-center gap-4">
                  <Target size={24} className="accent-purple shrink-0" />
                  <span className="text-lg text-white/90">1 mile per runner (4 laps)</span>
                </li>
                <li className="flex items-center gap-4">
                  <Zap size={24} className="accent-purple shrink-0" />
                  <span className="text-lg text-white/90">Relay-style format</span>
                </li>
                <li className="flex items-center gap-4">
                  <Clock size={24} className="accent-purple shrink-0" />
                  <span className="text-lg text-white/90">6-hour total event</span>
                </li>
                <li className="flex items-center gap-4">
                  <Trophy size={24} className="accent-purple shrink-0" />
                  <span className="text-lg text-white/90">Objective: Maximum total laps</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider w-full max-w-4xl mx-auto" />

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-4xl md:text-5xl font-mono uppercase mb-12 text-center gradient-text"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="gradient-border rounded-xl p-6 hover:bg-white/5 transition-colors"
              >
                <div className="text-5xl font-bold mb-4 gradient-text">{step.number}</div>
                <h3 className="text-xl font-mono uppercase mb-3 accent-blue">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider w-full max-w-4xl mx-auto" />

      {/* Winning Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-4xl md:text-5xl font-mono uppercase mb-12 text-center gradient-text"
          >
            Winning Categories
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {winCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="gradient-border rounded-xl p-6 md:p-8 text-center hover:bg-white/5 transition-colors"
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
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-mono uppercase mb-8 text-center gradient-text">
              Strategy Counts
            </h2>
            <p className="text-lg text-white/80 text-center mb-8">
              Victory goes to the team that balances speed, endurance, and smart rotation.
            </p>
            <ul className="space-y-4">
              {strategies.map((strategy, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#A855F7] shrink-0" />
                  <span className="text-lg text-white/80">{strategy}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="register" className="py-16 md:py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 via-transparent to-[#A855F7]/10" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-mono uppercase mb-6 gradient-text">
              Build Your Team. Take the Track.
            </h2>
            <p className="text-lg text-white/70 mb-8">Limited team places available</p>
            <a
              href="#"
              className="inline-block px-10 py-4 text-lg font-mono uppercase transition-all rounded-lg gradient-border hover:bg-white/10"
              style={{ color: 'var(--tracksix-blue)' }}
            >
              Register Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider w-full" />

      {/* Footer Meta Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
            <button
              onClick={() => setShowRules(true)}
              className="px-8 py-3 font-mono uppercase transition-all rounded-lg gradient-border hover:bg-white/10"
              style={{ color: 'var(--tracksix-blue)' }}
            >
              Timings & Rules
            </button>
            <button
              onClick={() => setShowTerms(true)}
              className="px-8 py-3 font-mono uppercase transition-all rounded-lg gradient-border hover:bg-white/10"
              style={{ color: 'var(--tracksix-blue)' }}
            >
              Terms & Conditions
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
            {/* Date */}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Calendar size={20} className="accent-blue" />
                <span className="font-mono uppercase text-sm accent-purple">Date</span>
              </div>
              <p className="text-lg text-white/80">Coming Soon</p>
            </div>

            {/* Venue */}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <MapPin size={20} className="accent-blue" />
                <span className="font-mono uppercase text-sm accent-purple">Venue</span>
              </div>
              <p className="text-lg text-white/80">Northants, NN14</p>
            </div>

            {/* FAQs */}
            <div>
              <span className="font-mono uppercase text-sm accent-purple">FAQs</span>
              <p className="text-lg text-white/80 mt-2">Coming Soon</p>
            </div>

            {/* Contact */}
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
    </div>
  );
};
