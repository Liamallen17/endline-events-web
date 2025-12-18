import React from 'react';
import { X } from 'lucide-react';

interface TracksixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TracksixModal: React.FC<TracksixModalProps> = ({ isOpen, onClose }) => {
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
        </div>
      </div>
    </div>
  );
};
