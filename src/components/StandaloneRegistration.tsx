import React from 'react';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { eventConfig } from '../config/event';
import { BackgroundPatterns } from './BackgroundPatterns';
import { RegistrationForm } from './RegistrationForm';

interface StandaloneRegistrationProps {
  onBackToSite: () => void;
}

export const StandaloneRegistration: React.FC<StandaloneRegistrationProps> = ({
  onBackToSite,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#06130E] text-[#F8F5EE] selection:bg-[#C9A66B]/30 selection:text-[#FFFFFF] relative overflow-x-hidden">
      <BackgroundPatterns />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Minimal Focused Header (Logo + Event Strip Only) */}
        <header className="bg-[#06130E]/90 backdrop-blur-xl border-b border-[#204E3C]/60 py-3.5 px-4 sm:px-8">
          <div className="max-w-[780px] mx-auto flex items-center justify-between gap-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBackToSite();
              }}
              className="flex items-center gap-2 focus-visible:outline-[#C9A66B]"
              aria-label="অর্থালাপ"
            >
              <img
                src="./orthalaap-logo.png"
                alt="অর্থালাপ"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </a>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C9A66B]/15 border border-[#C9A66B]/35 text-[11px] sm:text-xs font-semibold text-[#F5E5C9]">
                অফিশিয়াল রেজিস্ট্রেশন পাতা
              </span>
            </div>
          </div>
        </header>

        {/* Compact Event Context Bar so standalone visitors know date/time/venue at a glance */}
        <div className="bg-[#091D16]/80 border-b border-[#204E3C]/50 py-3 px-4 sm:px-8">
          <div className="max-w-[780px] mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-x-5 gap-y-2 text-xs sm:text-[13px] text-[#D1E2D9]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C9A66B]" />
              <strong className="text-white">{eventConfig.dateFormattedBn}, {eventConfig.dayOfWeekBn}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{eventConfig.timeLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{eventConfig.venueName}, পূর্ব শেওড়াপাড়া</span>
            </span>
          </div>
        </div>

        {/* Focused Registration Form Only */}
        <main className="flex-1 -mt-6 sm:-mt-12">
          <RegistrationForm />
        </main>

        {/* Minimal Footer */}
        <footer className="py-6 px-4 sm:px-8 bg-[#040C09] border-t border-[#1F4738]/60 text-center space-y-2.5">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#F5E5C9]">
            <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-[#204E3C]">
              Presented by <strong className="text-white">{eventConfig.presentedBy}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-[#204E3C]">
              Powered by <strong className="text-white">{eventConfig.poweredBy}</strong>
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-[#6A8778]">
            <span>© ২০২৬ অর্থালাপ</span>
            <span>·</span>
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1 text-[#A9C4B7] hover:text-[#C9A66B] transition-colors underline underline-offset-4"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>বিস্তারিত ওয়েবসাইট দেখুন</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
