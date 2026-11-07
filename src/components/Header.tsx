import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onAdminClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-brand-ivory/95 backdrop-blur-md border-b border-brand-divider/70 transition-all">
      <div className="max-w-[1160px] mx-auto px-3.5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Masthead / Logo */}
        <a 
          href="#" 
          className="flex items-center gap-2.5 sm:gap-3.5 group focus-visible:outline-brand-gold py-1 min-h-[44px]"
          aria-label="বিনিয়োগ আড্ডা হোমপেজ"
        >
          <img
            src="/biniyog-adda-logo.png"
            alt="বিনিয়োগ আড্ডা লোগো"
            className="h-8 sm:h-11 w-auto max-w-[150px] sm:max-w-none object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('brand-text-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div id="brand-text-fallback" className="hidden items-center gap-1.5 font-serif-bn font-bold text-xl sm:text-2xl text-brand-forest">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold inline-block"></span>
            বিনিয়োগ আড্ডা
          </div>
        </a>

        {/* Curated Editorial Navigation for Desktop */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-9 text-brand-text/80 text-[15px] font-medium tracking-wide">
          <a
            href="#topics"
            className="hover:text-brand-forest transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-gold hover:after:w-full after:transition-all focus-visible:outline-brand-gold"
          >
            আলোচনার বিষয়
          </a>
          <a
            href="#audience"
            className="hover:text-brand-forest transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-gold hover:after:w-full after:transition-all focus-visible:outline-brand-gold"
          >
            অংশগ্রহণকারী
          </a>
          <a
            href="#details"
            className="hover:text-brand-forest transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-gold hover:after:w-full after:transition-all focus-visible:outline-brand-gold"
          >
            আয়োজনের তথ্য
          </a>
          <a
            href="#faq"
            className="hover:text-brand-forest transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-gold hover:after:w-full after:transition-all focus-visible:outline-brand-gold"
          >
            জিজ্ঞাসা
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {onAdminClick && (
            <button
              onClick={onAdminClick}
              className="hidden lg:inline-flex items-center text-xs text-brand-secondary/80 hover:text-brand-forest px-3 py-1.5 rounded border border-brand-divider/70 hover:border-brand-forest/40 transition-colors min-h-[36px]"
            >
              আয়োজক প্রবেশ
            </button>
          )}

          <a
            href="#registration"
            className="group relative inline-flex items-center gap-1.5 sm:gap-2 bg-brand-forest hover:bg-brand-forest-soft text-brand-ivory text-xs sm:text-base font-semibold px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-200 shadow-sm active:translate-y-[1px] focus-visible:outline-brand-gold min-h-[40px] sm:min-h-[44px]"
          >
            <span>আগ্রহ নিবন্ধন</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

      </div>
    </header>
  );
};
