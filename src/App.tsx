import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Topics } from './components/Topics';
import { WhoFor } from './components/WhoFor';
import { SpeakerAndDetails } from './components/SpeakerAndDetails';
import { RegistrationForm } from './components/RegistrationForm';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { StickyMobileCta } from './components/StickyMobileCta';

const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((mod) => ({ default: mod.AdminDashboard }))
);

export function App() {
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    // Check initial path or hash
    const checkRoute = () => {
      const isPathAdmin = window.location.pathname.startsWith('/admin');
      const isHashAdmin = window.location.hash === '#admin';
      setIsAdminView(isPathAdmin || isHashAdmin);
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminView(true);
  };

  const navigateToSite = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  if (isAdminView) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#081712] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-posh-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <AdminDashboard onBackToSite={navigateToSite} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#081712] text-posh-text-primary selection:bg-posh-gold/30 selection:text-posh-sand relative">
      {/* Header */}
      <Header onAdminClick={navigateToAdmin} />

      {/* Main Content */}
      <main className="flex-1">
        <Hero />
        <Topics />
        <WhoFor />
        <SpeakerAndDetails />
        <RegistrationForm />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer onAdminClick={navigateToAdmin} />

      {/* Sticky Mobile Registration CTA */}
      <StickyMobileCta />
    </div>
  );
}

export default App;
