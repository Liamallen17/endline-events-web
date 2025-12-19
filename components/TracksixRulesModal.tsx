import React from 'react';
import { X } from 'lucide-react';

interface TracksixRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TracksixRulesModal: React.FC<TracksixRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-syncra-black border-2 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto tracksix gradient-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 hover:opacity-70 transition-opacity z-10 accent-blue"
        >
          <X size={32} />
        </button>

        {/* Modal Body */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-mono uppercase mb-8 gradient-text">
            Timings & Rules
          </h2>

          <div className="space-y-8 text-white/90">
            {/* Event Schedule */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Event Schedule</h3>
              <ul className="space-y-3 list-disc list-inside text-white/80">
                <li>The event runs for 6 hours continuously</li>
                <li>Teams rotate through runners in relay format</li>
                <li>Each runner completes 1 mile (4 laps) per turn</li>
                <li>Changeovers happen in the designated relay zone</li>
              </ul>
            </section>

            {/* Team Rules */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Team Rules</h3>
              <ul className="space-y-3 list-disc list-inside text-white/80">
                <li>Teams must consist of 4-6 runners</li>
                <li>All team members must be registered before the event</li>
                <li>Team captains are responsible for coordinating rotations</li>
                <li>Substitutions are not permitted after registration closes</li>
              </ul>
            </section>

            {/* Relay Rules */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Relay Rules</h3>
              <ul className="space-y-3 list-disc list-inside text-white/80">
                <li>Changeovers must occur in the designated relay zone</li>
                <li>The outgoing runner must tag the incoming runner to complete the handoff</li>
                <li>Runners may complete their mile at any pace</li>
                <li>Teams may rotate runners in any order they choose</li>
                <li>A runner may run consecutive miles if the team chooses</li>
              </ul>
            </section>

            {/* Scoring */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Scoring</h3>
              <div className="space-y-4 text-white/80">
                <div>
                  <strong className="accent-purple">Winning Team (4 Runners):</strong>
                  <p className="mt-1">The 4-person team with the most total laps completed wins.</p>
                </div>
                <div>
                  <strong className="accent-purple">Winning Team (6 Runners):</strong>
                  <p className="mt-1">The 6-person team with the most total laps completed wins.</p>
                </div>
                <div>
                  <strong className="accent-purple">Fastest Mile:</strong>
                  <p className="mt-1">The individual with the fastest single mile of the day wins a special prize.</p>
                </div>
              </div>
            </section>

            {/* General Rules */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">General Rules</h3>
              <ul className="space-y-3 list-disc list-inside text-white/80">
                <li>No outside assistance or pacing from non-team members</li>
                <li>Stay in your designated lane during running</li>
                <li>Headphones are allowed but must be at a safe volume</li>
                <li>Athletes must carry their own nutrition and hydration</li>
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
