import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onAdminClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#081712]/85 backdrop-blur-xl border-b border-[#1F4738]/60 transition-all">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 h-18 sm:h-22 py-3 flex items-center justify-between">
        
        {/* Brand Masthead / Logo in Posh Glass Wrapper */}
        <a 
          href="#" 
          className="flex items-center gap-3 group focus-visible:outline-posh-gold min-h-[44px]"
          aria-label="বিনিয়োগ আড্ডা হোমপেজ"
        >
          <div className="bg-white/[0.05] hover:bg-white/[0.08] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/[0.08] hover:border-posh-gold/40 transition-all duration-300 backdrop-blur-md shadow-inner flex items-center">
            <img
              src="./biniyog-adda-logo.png"
              alt="বিনিয়োগ আড্ডা লোগো"
              className="h-8 sm:h-10 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(201,166,107,0.3)] transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = document.getElementById('brand-text-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div id="brand-text-fallback" className="hidden items-center gap-1.5 font-serif-bn font-bold text-lg sm:text-2xl text-posh-sand">
              <span className="w-2.5 h-2.5 rounded-full bg-posh-gold inline-block"></span>
              বিনিয়োগ আড্ডা
            </div>
          </div>
        </a>

        {/* Curated Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[15px] font-medium tracking-wide">
          <a
            href="#topics"
            className="text-posh-text-secondary hover:text-posh-sand transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-posh-gold hover:after:w-full after:transition-all focus-visible:outline-posh-gold"
          >
            আলোচনার বিষয়
          </a>
          <a
            href="#audience"
            className="text-posh-text-secondary hover:text-posh-sand transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-posh-gold hover:after:w-full after:transition-all focus-visible:outline-posh-gold"
          >
            অংশগ্রহণকারী
          </a>
          <a
            href="#details"
            className="text-posh-text-secondary hover:text-posh-sand transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-posh-gold hover:after:w-full after:transition-all focus-visible:outline-posh-gold"
          >
            আয়োজনের তথ্য
          </a>
          <a
            href="#faq"
            className="text-posh-text-secondary hover:text-posh-sand transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-posh-gold hover:after:w-full after:transition-all focus-visible:outline-posh-gold"
          >
            জিজ্ঞাসা
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {onAdminClick && (
            <button
              onClick={onAdminClick}
              className="hidden lg:inline-flex items-center text-xs text-posh-text-secondary/80 hover:text-posh-gold px-3.5 py-2 rounded-lg border border-posh-border/70 hover:border-posh-gold/40 transition-colors min-h-[38px] bg-white/[0.02]"
            >
              আয়োজক প্রবেশ
            </button>
          )}

          <a
            href="#registration"
            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A66B] via-[#E5CE9F] to-[#9A773F] text-[#081712] text-xs sm:text-[15px] font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-300 shadow-button-gold hover:brightness-110 active:translate-y-[1px] focus-visible:outline-posh-gold min-h-[42px] sm:min-h-[46px]"
          >
            <span>আগ্রহ নিবন্ধন</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#081712] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

      </div>
    </header>
  );
};
