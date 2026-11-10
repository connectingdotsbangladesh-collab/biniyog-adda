import React from 'react';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="py-12 sm:py-16 bg-[#040C09] text-posh-text-primary border-t border-[#1F4738]/60 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-16 relative z-10">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left">
          
          {/* Logo & Tagline */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <img
                src="./orthalaap-logo.png"
                alt="অর্থালাপ"
                className="h-9 sm:h-11 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-xl sm:text-2xl font-serif-bn font-bold tracking-tight text-posh-sand">অর্থালাপ</span>
            </div>
            <p className="text-xs sm:text-[15px] text-posh-text-muted max-w-md font-normal">
              প্যাসিভ ইনকাম ও আয়ের একাধিক উৎস নিয়ে আলোচনা।
            </p>
          </div>

          {/* Organizer & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-posh-text-muted">
            <span>© ২০২৬ অর্থালাপ। সর্বস্বত্ব সংরক্ষিত।</span>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="hover:text-posh-gold transition-colors underline underline-offset-4 min-h-[36px] inline-flex items-center"
              >
                আয়োজক প্রবেশদ্বারে যান
              </button>
            )}
          </div>

        </div>
      </div>
    </footer>
  );
};
