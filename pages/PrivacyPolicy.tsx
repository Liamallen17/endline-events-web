import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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

      {/* Content */}
      <div className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono uppercase mb-4">
            Privacy Policy & GDPR
          </h1>
          <p className="text-syncra-lime/60 mb-12">
            Effective Date: 17th December 2024
          </p>

          {/* Content Sections */}
          <div className="space-y-12 text-syncra-lime/90">
            {/* Introduction */}
            <section>
              <p className="text-lg leading-relaxed">
                ENDLINE EVENTS LTD ("we", "us", "our") operates the website www.endlineevents.co.uk (the "Service"). This Privacy Policy explains how we collect, use, store, and protect your personal information when you interact with our website and our event services. We are committed to complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Information We Collect
              </h2>
              <p className="mb-4">We may collect and process the following personal data:</p>
              <ul className="space-y-3 list-disc list-inside text-syncra-lime/80">
                <li>First name and last name</li>
                <li>Email address</li>
                <li>Phone number (if provided)</li>
                <li>Event registration and enquiry responses</li>
                <li>IP address, browser type, device information, and pages visited</li>
                <li>Payment information is processed by third-party providers such as Stripe. We do not store card details.</li>
              </ul>
            </section>

            {/* How We Use Your Data */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                How We Use Your Data
              </h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="space-y-3 list-disc list-inside text-syncra-lime/80">
                <li>Provide and manage event services and registrations</li>
                <li>Respond to enquiries and communication</li>
                <li>Process payments and bookings</li>
                <li>Improve the performance and security of the website</li>
                <li>Send updates and marketing communications if you have opted in</li>
              </ul>
            </section>

            {/* Marketing Communications */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Marketing Communications
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                You will only receive event updates, helpful tips, and promotional emails if you have provided clear consent. You can unsubscribe at any time by using the link in any email we send.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Cookies and Tracking
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                We use necessary, functional, and analytics cookies to operate and improve the Service. You can manage cookie preferences through your browser settings.
              </p>
            </section>

            {/* Legal Basis for Processing */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Legal Basis for Processing
              </h2>
              <p className="mb-4">We process your personal data on one or more of the following legal bases:</p>
              <ul className="space-y-3 list-disc list-inside text-syncra-lime/80">
                <li>Your consent</li>
                <li>Contractual necessity</li>
                <li>Our legitimate business interests</li>
                <li>Compliance with legal obligations</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Data Retention
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                We retain personal data only for as long as necessary for the purposes outlined in this policy or to meet legal obligations. Marketing data is removed if you unsubscribe.
              </p>
            </section>

            {/* Data Transfers */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Data Transfers
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                Your data may be processed outside the United Kingdom by trusted service providers who must ensure equivalent protection in line with UK GDPR requirements.
              </p>
            </section>

            {/* Your Data Rights */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Your Data Rights
              </h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="space-y-3 list-disc list-inside text-syncra-lime/80">
                <li>Request access to the personal data we hold about you</li>
                <li>Request correction or deletion of your information</li>
                <li>Withdraw consent to marketing at any time</li>
                <li>Request restrictions on how we process your data</li>
                <li>Object to certain types of processing</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
              <p className="mt-4 text-syncra-lime/80">
                To exercise any of your rights, please contact us using the details below. We may need to verify your identity before responding.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Third-Party Services
              </h2>
              <p className="mb-4">We may share limited personal data with service providers who support the operation of our business, such as:</p>
              <ul className="space-y-3 list-disc list-inside text-syncra-lime/80">
                <li>Stripe – payment processing</li>
                <li>Google Analytics – website analytics</li>
                <li>Pixieset – event photo galleries</li>
              </ul>
              <p className="mt-4 text-syncra-lime/80">
                These providers may have access to personal data only to perform services on our behalf and are not permitted to use it for any other purpose.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Children's Privacy
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                Our Service is not designed for individuals under the age of 18 and we do not knowingly collect data from minors. All event participants must be 18 years of age or older.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Changes to This Policy
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                We may update this Privacy Policy from time to time. Updates will be posted on this page with an updated effective date.
              </p>
            </section>

            {/* Contact Information */}
            <section className="border-t border-syncra-lime/20 pt-12">
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Contact Information
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                If you have any questions about this Privacy Policy or would like to exercise your data rights, please contact:
              </p>
              <div className="mt-6 space-y-2 text-syncra-lime">
                <p className="font-mono uppercase">Endline Events Ltd</p>
                <p>
                  Email:{' '}
                  <a
                    href="mailto:endlineevents@gmail.com"
                    className="hover:underline underline-offset-4"
                  >
                    endlineevents@gmail.com
                  </a>
                </p>
                <p>United Kingdom</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
