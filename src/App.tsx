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
import { BackgroundPatterns } from './components/BackgroundPatterns';
import { StandaloneRegistration } from './components/StandaloneRegistration';

const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((mod) => ({ default: mod.AdminDashboard }))
);

type ViewMode = 'site' | 'admin' | 'register';

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('site');

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (path.endsWith('/admin') || path.includes('/admin/') || hash === '#admin') {
        setViewMode('admin');
      } else if (
        path.endsWith('/register') ||
        path.includes('/register/') ||
        hash === '#register' ||
        hash === '#reg' ||
        search.includes('page=register')
      ) {
        setViewMode('register');
      } else {
        setViewMode('site');
      }
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
    setViewMode('admin');
  };

  const navigateToSite = () => {
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname + '#');
    } else {
      window.location.hash = '';
    }
    setViewMode('site');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'admin') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#06130E] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#C9A66B] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <AdminDashboard onBackToSite={navigateToSite} />
      </Suspense>
    );
  }

  if (viewMode === 'register') {
    return <StandaloneRegistration onBackToSite={navigateToSite} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#06130E] text-[#F8F5EE] selection:bg-[#C9A66B]/30 selection:text-[#FFFFFF] relative overflow-x-hidden">
      {/* Background Decorative Patterns */}
      <BackgroundPatterns />

      {/* Main Content Layers */}
      <div className="relative z-10 flex flex-col min-h-screen">
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
    </div>
  );
}

export default App;
