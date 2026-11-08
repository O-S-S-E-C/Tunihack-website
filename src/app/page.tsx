import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import CountdownTimer from '@/components/sections/CountdownTimer';
import AboutTuniHack from '@/components/sections/AboutTuniHack';
import PreviousEditions from '@/components/sections/PreviousEditions';
import EventSections from '@/components/sections/EventSections';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/ui/Loader';

export default function Home() {
  return (
    <main className="min-h-screen site-shell">
      <Loader />
      <Navbar />
      <Hero />
      <div className="page-sheet relative z-10 bg-background">
        <CountdownTimer />
        <AboutTuniHack />
        <PreviousEditions />
        <EventSections />
        <Footer />
      </div>
    </main>
  );
}
