import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const CookiePolicy: React.FC = () => {
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
            Cookie Policy
          </h1>
          <p className="text-syncra-lime/60 mb-12">
            Effective Date: 17th December 2024
          </p>

          {/* Content Sections */}
          <div className="space-y-12 text-syncra-lime/90">
            {/* Introduction */}
            <section>
              <p className="text-lg leading-relaxed mb-4">
                This Cookie Policy explains how Endline Events Ltd ("we", "us", "our") uses cookies and similar tracking technologies when you visit our website www.endlineevents.co.uk (the "Website"). It should be read together with our{' '}
                <Link to="/privacy" className="underline hover:opacity-70">
                  Privacy Policy
                </Link>.
              </p>
              <p className="text-lg leading-relaxed">
                By continuing to use the Website, you consent to our use of cookies as described here. You can adjust your cookie preferences at any time using your browser settings.
              </p>
            </section>

            {/* What Are Cookies */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                What Are Cookies
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                Cookies are small text files stored on your device when you browse a website. They help improve functionality, personalise your experience, and provide insight into how the Website is used.
              </p>
            </section>

            {/* How We Use Cookies */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                How We Use Cookies
              </h2>
              <p className="mb-6 text-syncra-lime/80">We use cookies for the following purposes:</p>

              {/* Essential Cookies */}
              <div className="mb-8">
                <h3 className="text-xl font-mono uppercase mb-3 text-syncra-lime">
                  Essential Cookies
                </h3>
                <p className="text-syncra-lime/80 leading-relaxed">
                  These are required for the Website to function properly and enable core features. You cannot disable these through the Website.
                </p>
              </div>

              {/* Analytics and Performance Cookies */}
              <div className="mb-8">
                <h3 className="text-xl font-mono uppercase mb-3 text-syncra-lime">
                  Analytics and Performance Cookies
                </h3>
                <p className="text-syncra-lime/80 leading-relaxed mb-3">
                  Used to understand how visitors interact with the Website, improve user experience, and fix issues. We use:
                </p>
                <ul className="list-disc list-inside text-syncra-lime/80">
                  <li>Google Analytics</li>
                </ul>
              </div>

              {/* Marketing and Advertising Cookies */}
              <div className="mb-8">
                <h3 className="text-xl font-mono uppercase mb-3 text-syncra-lime">
                  Marketing and Advertising Cookies
                </h3>
                <p className="text-syncra-lime/80 leading-relaxed mb-3">
                  Used to track your browsing habits to deliver relevant advertising on other platforms. We use:
                </p>
                <ul className="list-disc list-inside text-syncra-lime/80 space-y-1">
                  <li>Meta Pixel (Facebook/Instagram)</li>
                  <li>TikTok Pixel</li>
                </ul>
              </div>

              {/* Third-Party Cookies */}
              <div>
                <h3 className="text-xl font-mono uppercase mb-3 text-syncra-lime">
                  Third-Party Cookies
                </h3>
                <p className="text-syncra-lime/80 leading-relaxed mb-4">
                  Some cookies are set by external service providers on our behalf to support analytics and marketing activities. We do not control these cookies directly.
                </p>
                <p className="text-syncra-lime/80 mb-3">For more information, you may review:</p>
                <ul className="list-disc list-inside text-syncra-lime/80 space-y-2">
                  <li>
                    Google:{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-70"
                    >
                      https://policies.google.com/privacy
                    </a>
                  </li>
                  <li>
                    Meta (Facebook/Instagram):{' '}
                    <a
                      href="https://www.facebook.com/policy.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-70"
                    >
                      https://www.facebook.com/policy.php
                    </a>
                  </li>
                  <li>
                    TikTok:{' '}
                    <a
                      href="https://www.tiktok.com/legal/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:opacity-70"
                    >
                      https://www.tiktok.com/legal/privacy-policy
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Managing Cookies */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Managing Cookies
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed mb-4">
                You can control and delete cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-syncra-lime/80 space-y-2 mb-4">
                <li>Block cookies entirely</li>
                <li>Block specific types of cookies</li>
                <li>Delete existing cookies</li>
              </ul>
              <p className="text-syncra-lime/80 leading-relaxed">
                <strong className="text-syncra-lime">Note:</strong> If you block essential cookies, some parts of the Website may not function correctly.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Changes to This Policy
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                We may update this Cookie Policy from time to time. Updates will be posted on this page with a new effective date.
              </p>
            </section>

            {/* Contact Information */}
            <section className="border-t border-syncra-lime/20 pt-12">
              <h2 className="text-2xl md:text-3xl font-mono uppercase mb-6 text-syncra-lime">
                Contact
              </h2>
              <p className="text-syncra-lime/80 leading-relaxed">
                If you have any questions about this Cookie Policy, please contact:
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
