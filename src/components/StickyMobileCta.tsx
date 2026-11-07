import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const StickyMobileCta: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById('registration');
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide when form comes into view
        setShow(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.05,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-brand-ivory via-brand-ivory/90 to-transparent pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] transition-all duration-300 pointer-events-none"
    >
      <div className="max-w-md mx-auto pointer-events-auto">
        <a
          href="#registration"
          className="w-full bg-brand-forest hover:bg-brand-forest-soft text-brand-ivory py-3.5 px-5 rounded-xl font-bold text-base shadow-[0_8px_24px_rgba(23,62,53,0.35)] flex items-center justify-center gap-2 border border-brand-gold/40 active:translate-y-[1px] min-h-[48px]"
        >
          <span>আগ্রহ নিবন্ধন করুন</span>
          <ArrowUpRight className="w-4 h-4 text-brand-gold" />
        </a>
      </div>
    </div>
  );
};
