import { createFileRoute, useLocation } from '@tanstack/react-router';
import NavBar from '#/components/landing-page/Navbar/Navbar';
import Hero from '#/components/landing-page/Hero-section/Hero';
import About from '#/components/landing-page/About/About';
import Features from '#/components/landing-page/Features/Features';
import Benefits from '#/components/landing-page/Benefits/Benefits';
import Pricing from '#/components/landing-page/Pricing/Pricing';
import ContactUs from '#/components/landing-page/ContactUs/ContactUs';
import Footer from '#/components/landing-page/Footer/Footer';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const { theme, setTheme } = useTheme()
  const location = useLocation();
  useEffect(() => {
    if ((['/', '/auth/login', '/auth/register'].includes(location.pathname)) && theme !== 'light') {
      setTheme('light');
    }
  }, [theme, setTheme]);
  return (
    <div className="light relative bg-transparent min-h-screen">
      <NavBar />
      <Hero />
      <About />
      <Features />
      <Benefits />
      <Pricing />
      <ContactUs />
      <Footer />
    </div>
  );
}