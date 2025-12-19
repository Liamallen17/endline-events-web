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
import { TracksixEvent } from './pages/TracksixEvent';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { CookiePolicy } from './pages/CookiePolicy';
import { ScrollToTop } from './components/ScrollToTop';

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
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/bbu" element={<BBUEvent />} />
        <Route path="/events/tracksix" element={<TracksixEvent />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
      </Routes>
    </BrowserRouter>
  );
}