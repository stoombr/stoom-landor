import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Challenge from '@/components/Challenge';
import Services from '@/components/Services';
import HowItWorks from '@/components/HowItWorks';
import Benefits from '@/components/Benefits';
import Achievements from '@/components/Achievements';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { ContactModalProvider } from '@/components/ContactModalContext';

export default function Home() {
  return (
    <ContactModalProvider>
      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <About />
        <Challenge />
        <Services />
        <HowItWorks />
        <Benefits />
        <Achievements />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </ContactModalProvider>
  );
}
