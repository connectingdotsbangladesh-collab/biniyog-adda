import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onAdminClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#06130E]/85 backdrop-blur-xl border-b border-[#204E3C]/60 transition-all">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 h-18 sm:h-22 py-3 flex items-center justify-between">
        
        {/* Brand Masthead / Logo in Posh Glass Wrapper */}
        <a 
          href="#" 
          className="flex items-center gap-3 group focus-visible:outline-posh-gold min-h-[44px]"
          aria-label="অর্থালাপ হোমপেজ"
        >
          <div className="bg-white/[0.06] hover:bg-white/[0.1] px-3.5 sm:px-4 py-2 rounded-xl border border-white/[0.12] hover:border-[#C9A66B]/50 transition-all duration-300 backdrop-blur-md shadow-inner flex items-center">
            <img
              src="./orthalaap-logo.png"
              alt="অর্থালাপ লোগো"
              className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_4px_16px_rgba(32,78,60,0.6)] drop-shadow-[0_2px_8px_rgba(201,166,107,0.35)] transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = document.getElementById('brand-text-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div id="brand-text-fallback" className="hidden items-center gap-2 font-serif-bn font-bold text-xl sm:text-2xl text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A66B] inline-block"></span>
              অর্থালাপ</div>
          </div>
        </a>

        {/* Curated Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[15px] font-medium tracking-wide">
          <a
            href="#topics"
            className="text-[#D1E2D9] hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A66B] hover:after:w-full after:transition-all focus-visible:outline-[#C9A66B]"
          >
            আলোচনার বিষয়
          </a>
          <a
            href="#audience"
            className="text-[#D1E2D9] hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A66B] hover:after:w-full after:transition-all focus-visible:outline-[#C9A66B]"
          >
            অংশগ্রহণকারী
          </a>
          <a
            href="#details"
            className="text-[#D1E2D9] hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A66B] hover:after:w-full after:transition-all focus-visible:outline-[#C9A66B]"
          >
            আয়োজনের তথ্য
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
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A66B] via-[#E5CE9F] to-[#9A773F] text-[#06130E] text-xs sm:text-[15px] font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-300 shadow-button-gold hover:brightness-110 active:translate-y-[1px] focus-visible:outline-[#C9A66B] min-h-[42px] sm:min-h-[46px]"
          >
            <span>আগ্রহ নিবন্ধন</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#06130E] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

      </div>
    </header>
  );
};
