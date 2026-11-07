import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const StickyMobileCta: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById('registration');
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-[#081712] via-[#081712]/95 to-transparent pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] transition-all duration-300 pointer-events-none"
    >
      <div className="max-w-md mx-auto pointer-events-auto">
        <a
          href="#registration"
          className="w-full bg-gradient-to-r from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#081712] py-3.5 px-5 rounded-xl font-bold text-base shadow-button-gold flex items-center justify-center gap-2 active:translate-y-[1px] min-h-[48px]"
        >
          <span>আগ্রহ নিবন্ধন করুন</span>
          <ArrowUpRight className="w-4 h-4 text-[#081712]" />
        </a>
      </div>
    </div>
  );
};
