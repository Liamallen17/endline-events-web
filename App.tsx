import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandingBar } from './components/BrandingBar';
import { ImageBanner } from './components/ImageBanner';
import { About } from './components/About';
import { ServicesIndex } from './components/ServicesIndex';
import { EventGallery } from './components/EventGallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BBUEvent } from './pages/BBUEvent';

// Homepage component with all sections
const HomePage: React.FC = () => {
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
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/bbu" element={<BBUEvent />} />
      </Routes>
    </BrowserRouter>
  );
}