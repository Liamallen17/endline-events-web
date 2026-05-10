import React, { useState, useEffect } from 'react';

const images = [
  { src: '/endline-events-web/FTP-639.JPG', alt: 'Event atmosphere' },
  { src: '/endline-events-web/FTP-623.JPG', alt: 'Event atmosphere' },
  { src: '/endline-events-web/BBU-26-1.JPG', alt: 'Event atmosphere' },
  { src: '/endline-events-web/BBU-25-1.JPG', alt: 'Event atmosphere' },
];

export const Contact: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    enquiryType: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.email.trim() || !formData.enquiryType) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://submit.saltburn.tech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
          email: formData.email.trim(),
          enquiry_type: formData.enquiryType,
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit form');

      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', enquiryType: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-syncra-lime/20">
      <div className="container">
        {/* Mobile: image carousel above heading */}
        <div className="relative mb-8 md:hidden">
          <div className="relative aspect-square rounded-3xl overflow-hidden">
            {images.map((img, i) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: i === activeIndex ? 1 : 0 }}
              />
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ backgroundColor: i === activeIndex ? '#dfff87' : 'rgba(223,255,135,0.3)' }}
              />
            ))}
          </div>
        </div>

        <h2 className="font-display text-2xl md:text-3xl uppercase text-syncra-lime mb-16 tracking-widest">CONTACT US</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Info */}
          <div>
            <div className="sticky top-24">
              <div className="w-4 h-4 bg-syncra-lime mb-8" />
              <h3 className="text-lg md:text-xl font-mono uppercase leading-snug mb-8">
                Feel free to contact us via email or fill out the form to discuss sponsorship opportunities, vendor involvement, volunteering, collaborations, or general enquiries. We're excited to connect and explore how we can work together.
              </h3>

              {/* Desktop: 2×2 grid */}
              <div className="hidden md:grid grid-cols-2 gap-3 mt-12">
                {images.map((img) => (
                  <div key={img.src} className="aspect-square rounded-3xl overflow-hidden">
                    <img src={img.src} className="w-full h-full object-cover" alt={img.alt} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="font-mono text-sm">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-syncra-lime mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-syncra-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl uppercase mb-4">Thank You!</h4>
                <p className="opacity-80 uppercase">We'll be in touch soon.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 px-8 py-3 border border-syncra-lime text-syncra-lime uppercase tracking-widest hover:bg-syncra-lime hover:text-syncra-black transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block mb-2 uppercase opacity-80">Name (Required)</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-transparent border-b border-syncra-lime/40 py-3 text-syncra-lime focus:outline-none focus:border-syncra-lime transition-colors placeholder:text-syncra-lime/30 uppercase"
                    />
                  </div>
                  <div className="group md:mt-8">
                    <label className="block mb-2 uppercase opacity-80 md:hidden">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-transparent border-b border-syncra-lime/40 py-3 text-syncra-lime focus:outline-none focus:border-syncra-lime transition-colors placeholder:text-syncra-lime/30 uppercase"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block mb-2 uppercase opacity-80">Email (Required)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-syncra-lime/40 py-3 text-syncra-lime focus:outline-none focus:border-syncra-lime transition-colors uppercase"
                  />
                </div>

                <div className="group">
                  <label className="block mb-4 uppercase opacity-80">Enquiry Type (Required)</label>
                  <div className="flex flex-wrap gap-3">
                    {['Sponsor', 'Vendor', 'Volunteer', 'Collaboration', 'General Enquiry'].map((type) => (
                      <label key={type} className="cursor-pointer">
                        <input
                          type="radio"
                          name="enquiryType"
                          className="hidden peer"
                          checked={formData.enquiryType === type}
                          onChange={() => setFormData({ ...formData, enquiryType: type })}
                        />
                        <span className="inline-block px-6 py-2 rounded-full border border-syncra-lime text-syncra-lime peer-checked:bg-syncra-lime peer-checked:text-syncra-black transition-colors hover:bg-syncra-lime/10">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <label className="block mb-2 uppercase opacity-80">Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-syncra-lime/40 py-3 text-syncra-lime focus:outline-none focus:border-syncra-lime transition-colors uppercase resize-none placeholder:text-syncra-lime/30"
                    placeholder="Tell us more about your enquiry"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 uppercase">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-12 py-4 border border-syncra-lime text-syncra-lime uppercase tracking-widest hover:bg-syncra-lime hover:text-syncra-black transition-colors w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending...' : 'Submit'}
                </button>
                <p className="mt-4 text-syncra-lime/80 uppercase tracking-wide">
                  or email us at: <a href="mailto:endlineevents@gmail.com" className="underline hover:text-syncra-lime">endlineevents@gmail.com</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
