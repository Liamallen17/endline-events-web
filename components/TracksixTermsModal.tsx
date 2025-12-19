import React from 'react';
import { X } from 'lucide-react';

interface TracksixTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TracksixTermsModal: React.FC<TracksixTermsModalProps> = ({ isOpen, onClose }) => {
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
          <h2 className="text-3xl md:text-4xl font-mono uppercase mb-2 gradient-text">
            Terms & Conditions
          </h2>
          <p className="text-white/70 mb-8">
            Tracksix - Northants, NN14
          </p>

          <div className="space-y-8 text-white/90">
            {/* Entry & Registration */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Entry & Registration</h3>
              <ul className="space-y-3 list-disc list-inside text-white/80">
                <li>All participants must be 18 years of age or older on race day</li>
                <li>Teams must register as a complete group of 4-6 runners</li>
                <li>Entry fees are non-refundable and non-transferable</li>
                <li>Team captain is responsible for all team member registrations</li>
                <li>All participants must complete the online registration and waiver forms</li>
                <li>False information on registration may result in disqualification</li>
              </ul>
            </section>

            {/* Health & Safety */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Health & Safety</h3>
              <ul className="space-y-3 list-disc list-inside text-white/80">
                <li>Participants enter at their own risk and are responsible for their own health and fitness</li>
                <li>You must be medically fit to compete in a running event</li>
                <li>We recommend consulting a medical professional if you have concerns about your ability to participate</li>
                <li>The organiser reserves the right to withdraw any participant on medical grounds</li>
                <li>First aid will be available but participants are responsible for their own wellbeing</li>
                <li>Any pre-existing medical conditions must be disclosed at registration</li>
                <li>Follow event rules and instructions from staff; non-compliance may result in disqualification</li>
              </ul>
            </section>

            {/* Liability */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Liability</h3>
              <ul className="space-y-3 list-disc list-inside text-white/80">
                <li>Endline Events Ltd accepts no liability for loss, damage, or injury</li>
                <li>The venue and all associated staff are not liable for travel costs or weather-related issues</li>
                <li>Participants are responsible for their own property and belongings</li>
                <li>Participants agree to indemnify the organisers against any claims</li>
                <li>Event insurance does not cover personal injury or loss of property</li>
              </ul>
            </section>

            {/* Media & Photography */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Media & Photography</h3>
              <ul className="space-y-3 list-disc list-inside text-white/80">
                <li>Participants consent to being photographed and filmed during the event</li>
                <li>Images may be used for promotional purposes without compensation</li>
                <li>Participants grant perpetual rights for use of their likeness</li>
              </ul>
            </section>

            {/* Event Changes */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Event Changes & Cancellation</h3>
              <ul className="space-y-3 list-disc list-inside text-white/80">
                <li>The organiser reserves the right to modify the course or format</li>
                <li>If postponed or cancelled, entries carry over to a future event</li>
                <li>In case of cancellation due to circumstances beyond our control, refunds are not guaranteed</li>
                <li>Weather conditions may affect the event but will not automatically result in cancellation</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h3 className="text-xl font-mono uppercase mb-4 accent-blue">Contact</h3>
              <p className="text-white/80">
                For any questions regarding these terms, please contact us at{' '}
                <a
                  href="mailto:endlineevents@gmail.com"
                  className="accent-blue hover:underline"
                >
                  endlineevents@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
