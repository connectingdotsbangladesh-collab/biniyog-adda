import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onAdminClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#06130E]/85 backdrop-blur-xl border-b border-[#204E3C]/60 transition-all">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 h-18 sm:h-22 py-3 flex items-center justify-between">
        
        {/* Brand Masthead / Logo */}
        <a 
          href="#" 
          className="flex items-center gap-3 group focus-visible:outline-posh-gold min-h-[44px]"
          aria-label="অর্থালাপ হোমপেজ"
        >
          <img
            src="./orthalaap-logo.png"
            alt="অর্থালাপ"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = document.getElementById('brand-text-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div id="brand-text-fallback" className="hidden items-center gap-2 font-bengali font-bold text-xl sm:text-2xl text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A66B] inline-block"></span>
            অর্থালাপ
          </div>
        </a>

        {/* Curated Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[15px] font-medium tracking-wide">
          <a
            href="#topics"
            className="text-[#D1E2D9] hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A66B] hover:after:w-full after:transition-all focus-visible:outline-[#C9A66B]"
          >
            আলোচনার বিষয়
          </a>
          <a
            href="#speakers"
            className="text-[#D1E2D9] hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A66B] hover:after:w-full after:transition-all focus-visible:outline-[#C9A66B]"
          >
            আলোচকবৃন্দ
          </a>
          <a
            href="#schedule"
            className="text-[#D1E2D9] hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A66B] hover:after:w-full after:transition-all focus-visible:outline-[#C9A66B]"
          >
            সময়সূচি ও ভেন্যু
          </a>
          <a
            href="#faq"
            className="text-[#D1E2D9] hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A66B] hover:after:w-full after:transition-all focus-visible:outline-[#C9A66B]"
          >
            জিজ্ঞাসা
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {onAdminClick && (
            <button
              onClick={onAdminClick}
              className="hidden lg:inline-flex items-center text-xs text-[#D1E2D9] hover:text-[#C9A66B] px-3.5 py-2 rounded-lg border border-[#204E3C] hover:border-[#C9A66B]/50 transition-colors min-h-[38px] bg-white/[0.03]"
            >
              আয়োজক প্রবেশ
            </button>
          )}
          <a
            href="#registration"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#06130E] text-xs sm:text-sm font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-button-gold hover:brightness-110 transition-all duration-300 active:translate-y-[1px] focus-visible:outline-[#C9A66B] min-h-[44px]"
          >
            <span>আসন নিশ্চিত করুন</span>
            <ArrowUpRight className="w-4 h-4 text-[#06130E]" />
          </a>
        </div>

      </div>
    </header>
  );
};
