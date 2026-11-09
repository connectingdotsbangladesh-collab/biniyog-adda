import React from 'react';
import { eventConfig, getEventStatusLabels } from '../config/event';
import { ArrowDown, MapPin, Users, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const statusLabels = getEventStatusLabels(eventConfig);

  return (
    <section className="relative pt-10 sm:pt-20 pb-16 sm:pb-28 border-b border-[#204E3C]/60 overflow-hidden">
      
      {/* Subtle organic radial glows */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#1E523F]/35 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Headlines & Editorial Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Glowing Pill Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full posh-glow-badge">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A66B] animate-pulse" />
              <span className="text-xs sm:text-[13px] uppercase tracking-widest font-semibold text-[#F7E7CD]">
                আরিফুল ইসলামের সঙ্গে অফলাইন কর্মশালা
              </span>
            </div>

            {/* Main Headline & Supporting Heading with High-Contrast Gradient */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[58px] font-serif-bn font-bold tracking-tight leading-[1.2] text-white">
                আয়ের নতুন উৎস নিয়ে ভাবছেন?
              </h1>
              <h2 className="text-2xl sm:text-4xl lg:text-[46px] font-serif-bn font-bold tracking-tight leading-[1.25] text-gold-gradient">
                শুরু হোক অর্থালাপে।
              </h2>
            </div>

            {/* Editorial Description */}
            <p className="text-base sm:text-lg lg:text-[20px] text-[#D8E8DF] leading-relaxed max-w-xl font-normal">
              প্যাসিভ ইনকাম ও আয়ের একাধিক উৎস নিয়ে অভিজ্ঞতা, খোলামেলা আলোচনা এবং নিজের পরবর্তী পদক্ষেপ ভাবার একটি আয়োজন।
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#registration"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#06130E] text-base sm:text-lg font-bold px-8 py-4 rounded-xl shadow-button-gold hover:brightness-110 transition-all duration-300 active:translate-y-[1px] focus-visible:outline-[#C9A66B] min-h-[52px]"
              >
                <span>আগ্রহ নিবন্ধন করুন</span>
                <ArrowDown className="w-4 h-4 text-[#06130E] flex-shrink-0" />
              </a>

              <a
                href="#topics"
                className="inline-flex items-center justify-center text-[#E2EBE6] hover:text-white text-sm sm:text-base font-medium px-5 py-3 rounded-xl border border-[#204E3C] hover:border-[#C9A66B]/60 bg-white/[0.04] transition-all duration-200 focus-visible:outline-[#C9A66B] min-h-[48px]"
              >
                কী নিয়ে আলোচনা হবে?
              </a>
            </div>

            {/* Sub-note with subtle illuminated dot */}
            <div className="pt-1 flex items-start gap-2.5 text-xs sm:text-sm text-[#B4CCC1]">
              <span className="w-2 h-2 rounded-full bg-[#C9A66B] flex-shrink-0 mt-2 shadow-[0_0_8px_#C9A66B]"></span>
              <p className="leading-relaxed">
                <strong className="text-white font-semibold">প্রাথমিক আগ্রহ নিবন্ধন চলছে।</strong> সময়, ভেন্যু ও ফি চূড়ান্ত হলে জানানো হবে।
              </p>
            </div>

          </div>

          {/* Right Column: Posh Glass Event Docket Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative posh-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-9 space-y-6">
              
              {/* Top Accent Strip */}
              <div className="flex items-center justify-between border-b border-[#204E3C]/60 pb-5">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#C9A66B]">
                    আয়োজন বিবরণী
                  </span>
                  <div className="text-xs text-[#95B2A4] font-mono tracking-wider mt-0.5">
                    EVENT PASS · PROPOSED
                  </div>
                </div>

                <span className="inline-block px-3.5 py-1 bg-[#C9A66B]/15 text-[#F0DFBE] border border-[#C9A66B]/35 text-xs font-semibold rounded-full shadow-inner">
                  {statusLabels.dateBadge}
                </span>
              </div>

              {/* Main Date Display with Luxury Gold Gradient */}
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-serif-bn font-bold text-gold-gradient tracking-tight">
                  {eventConfig.dateFormattedBn}
                </div>
                <div className="text-base text-[#D1E2D9] font-medium">
                  {eventConfig.dayOfWeekBn}
                </div>
              </div>

              {/* Clean Editorial Metadata Table */}
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-[15px] pt-2 border-t border-[#204E3C]/60">
                
                <div className="flex items-center justify-between py-2 border-b border-[#204E3C]/40 gap-2">
                  <span className="text-[#A9C4B7] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#C9A66B] flex-shrink-0" />
                    <span>ধরন</span>
                  </span>
                  <span className="font-semibold text-white text-right">
                    অফলাইন আয়োজন
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#204E3C]/40 gap-2">
                  <span className="text-[#A9C4B7] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C9A66B] flex-shrink-0" />
                    <span>সময়</span>
                  </span>
                  <span className="font-medium text-[#E2EBE6] text-right">
                    {statusLabels.timeLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#204E3C]/40 gap-2">
                  <span className="text-[#A9C4B7] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C9A66B] flex-shrink-0" />
                    <span>ভেন্যু</span>
                  </span>
                  <span className="font-medium text-[#E2EBE6] text-right">
                    {statusLabels.venueLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 gap-2">
                  <span className="text-[#A9C4B7] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C9A66B] flex-shrink-0" />
                    <span>ফি</span>
                  </span>
                  <span className="font-medium text-[#E2EBE6] text-right">
                    {statusLabels.feeLabel}
                  </span>
                </div>

              </div>

              {/* Footnote */}
              <div className="pt-4 border-t border-dashed border-[#204E3C]/80 text-xs sm:text-[13px] text-[#95B2A4] leading-relaxed">
                * তারিখটি প্রস্তাবিত। চূড়ান্ত সিদ্ধান্ত ও ভেন্যুর বিস্তারিত সময়মতো সকল আগ্রহীকে জানানো হবে।
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
