import React from 'react';
import { X } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-syncra-black border-2 border-syncra-lime/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-syncra-lime hover:opacity-70 transition-opacity z-10"
        >
          <X size={32} />
        </button>

        {/* Modal Body */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-mono uppercase text-syncra-lime mb-8">
            Timings & Rules
          </h2>

          <div className="space-y-8 text-syncra-lime/90">
            {/* Race Schedule */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 text-syncra-lime">Race Schedule</h3>
              <ul className="space-y-3 list-disc list-inside text-syncra-lime/80">
                <li>The race starts at 12:00pm on race day</li>
                <li>Athletes must be lined up and ready to start by 11:59am</li>
                <li>You must be back at the line, prepared to go again, by :59 every hour that follows</li>
                <li>The bell will ring on the hour to signal the start of each new lap</li>
              </ul>
            </section>

            {/* Race Rules */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 text-syncra-lime">Race Rules</h3>
              <ul className="space-y-3 list-disc list-inside text-syncra-lime/80">
                <li>If you fail to complete a lap within the hour, you will receive a DNF (Did Not Finish) and your race ends there</li>
                <li>If you fail to start on the hour, you will lose your place in the event</li>
                <li>If you voluntarily withdraw from the race, you will lose your place in the event</li>
              </ul>
            </section>

            {/* Categories */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 text-syncra-lime">Category Rules</h3>
              <div className="space-y-4 text-syncra-lime/80">
                <div>
                  <strong className="text-syncra-lime">Last Man Standing:</strong>
                  <p className="mt-1">Individual athlete completes every lap until only one remains.</p>
                </div>
                <div>
                  <strong className="text-syncra-lime">Half Solo (12 Hours):</strong>
                  <p className="mt-1">Individual athlete competes for 12 hours. Furthest distance wins.</p>
                </div>
              </div>
            </section>

            {/* Pairs */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 text-syncra-lime">Pairs</h3>
              <div className="space-y-4 text-syncra-lime/80">
                <div>
                  <strong className="text-syncra-lime">Full Pair (24 Hours) & Half Pair (12 Hours):</strong>
                  <p className="mt-1">Partners must alternate laps and cannot run consecutive laps. If one partner is unable to continue, the team will be marked as DNF. Plan your pacing and rest to support each other throughout the race.</p>
                </div>
              </div>
            </section>

            {/* General Rules */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 text-syncra-lime">General Rules</h3>
              <ul className="space-y-3 list-disc list-inside text-syncra-lime/80">
                <li>No pacers, support crew, or outside assistance on the course</li>
                <li>Headphones are allowed but must be at a safe volume</li>
                <li>Athletes must carry their own nutrition and hydration</li>
                <li>Aid station support is provided at the start/finish area only</li>
                <li>All athletes must respect fellow competitors and event staff</li>
                <li>The Race Director's decision is final on all matters</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

