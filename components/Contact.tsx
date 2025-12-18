import React from 'react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 border-t border-syncra-lime/20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Info */}
          <div>
            <div className="sticky top-24">
              <div className="w-4 h-4 bg-syncra-lime mb-8" />
              <h3 className="text-lg md:text-xl font-mono uppercase leading-snug mb-8">
                Feel free to contact us via email or fill out the form to discuss sponsorship opportunities, vendor involvement, volunteering, collaborations, or general enquiries. We're excited to connect and explore how we can work together.
              </h3>
              
              <div className="w-full aspect-[3/4] mt-12 rounded-2xl md:rounded-3xl overflow-hidden">
                 <img src="/FTP-639.JPG" className="w-full h-full object-cover" alt="Event atmosphere" />
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="font-mono text-sm">
            <form className="space-y-12">
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block mb-2 uppercase opacity-80">Name (Required)</label>
                  <input type="text" placeholder="First Name" className="w-full bg-transparent border-b border-syncra-lime/40 py-3 text-syncra-lime focus:outline-none focus:border-syncra-lime transition-colors placeholder:text-syncra-lime/30 uppercase" />
                </div>
                <div className="group md:mt-8">
                  <label className="block mb-2 uppercase opacity-80 md:hidden">Last Name</label>
                  <input type="text" placeholder="Last Name" className="w-full bg-transparent border-b border-syncra-lime/40 py-3 text-syncra-lime focus:outline-none focus:border-syncra-lime transition-colors placeholder:text-syncra-lime/30 uppercase" />
                </div>
              </div>

              <div className="group">
                <label className="block mb-2 uppercase opacity-80">Email (Required)</label>
                <input type="email" className="w-full bg-transparent border-b border-syncra-lime/40 py-3 text-syncra-lime focus:outline-none focus:border-syncra-lime transition-colors uppercase" />
              </div>

              <div className="group">
                <label className="block mb-4 uppercase opacity-80">Enquiry Type (Required)</label>
                <div className="flex flex-wrap gap-3">
                  {['Sponsor', 'Vendor', 'Volunteer', 'Collaboration', 'General Enquiry'].map((type) => (
                    <label key={type} className="cursor-pointer">
                      <input type="radio" name="enquiryType" className="hidden peer" />
                      <span className="inline-block px-6 py-2 rounded-full border border-syncra-lime text-syncra-lime peer-checked:bg-syncra-lime peer-checked:text-syncra-black transition-colors hover:bg-syncra-lime/10">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block mb-2 uppercase opacity-80">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-syncra-lime/40 py-3 text-syncra-lime focus:outline-none focus:border-syncra-lime transition-colors uppercase resize-none placeholder:text-syncra-lime/30" placeholder="Tell us more about your enquiry"></textarea>
              </div>

              <button className="px-12 py-4 border border-syncra-lime text-syncra-lime uppercase tracking-widest hover:bg-syncra-lime hover:text-syncra-black transition-colors w-full md:w-auto">
                Submit
              </button>
              <p className="mt-4 text-syncra-lime/80 uppercase tracking-wide">
                or email us at: <a href="mailto:endlineevents@gmail.com" className="underline hover:text-syncra-lime">endlineevents@gmail.com</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
