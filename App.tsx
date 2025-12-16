import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandingBar } from './components/BrandingBar';
import { ImageBanner } from './components/ImageBanner';
import { About } from './components/About';
import { ServicesIndex } from './components/ServicesIndex';
import { EventGallery } from './components/EventGallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-syncra-black text-syncra-lime selection:bg-syncra-lime selection:text-syncra-black">
      <Navbar />
      <main>
        <Hero />
        <BrandingBar />
        <ImageBanner />
        <About />
        <ServicesIndex />
        <EventGallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}