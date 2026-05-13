import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';

const GALLERY_CARDS = [
  {
    image: `${import.meta.env.BASE_URL}BBU-25-1.JPG`,
    title: 'BBU 25.1',
    subtitle: 'Boughton Backyard Ultra · 2025',
    href: 'https://david-lester.pixieset.com/boughtonbackyardultra/',
  },
  {
    image: `${import.meta.env.BASE_URL}BBU-26-1.JPG`,
    title: 'BBU 26.1',
    subtitle: 'Boughton Backyard Ultra · 2026',
    href: 'https://david-lester.pixieset.com/boughtonbackyardultra2026/',
  },
];

export const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-syncra-black text-syncra-lime selection:bg-syncra-lime selection:text-syncra-black">
      <Link
        to="/"
        className="fixed top-6 left-6 md:top-8 md:left-12 z-50 flex items-center gap-2 text-syncra-lime hover:opacity-70 transition-opacity bg-syncra-black/80 backdrop-blur-sm px-4 py-2 rounded-full"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-mono uppercase">Back</span>
      </Link>

      <main className="pt-32 pb-24">
        <div className="container text-center mb-16">
          <h1 className="font-display text-4xl md:text-6xl text-syncra-lime uppercase tracking-wide mb-4">
            Event Gallery
          </h1>
          <p className="font-mono text-sm md:text-base text-syncra-lime/60 uppercase tracking-widest">
            Photos from past Endline events
          </p>
        </div>

        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GALLERY_CARDS.map(({ image, title, subtitle, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border border-syncra-lime/20 rounded-xl overflow-hidden hover:border-syncra-lime/50 transition-all duration-300"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-6 bg-syncra-black">
                  <p className="font-display text-xl md:text-2xl text-syncra-lime uppercase mb-1">
                    {title}
                  </p>
                  <p className="font-mono text-xs md:text-sm text-syncra-lime/60 uppercase tracking-widest mb-4">
                    {subtitle}
                  </p>
                  <span className="font-mono text-xs text-syncra-lime uppercase tracking-widest group-hover:opacity-70 transition-opacity">
                    View Gallery →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
