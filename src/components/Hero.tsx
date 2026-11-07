import React from 'react';
import { eventConfig, getEventStatusLabels } from '../config/event';
import { ArrowDown, MapPin, Users, Clock, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const statusLabels = getEventStatusLabels(eventConfig);

  return (
    <section className="relative pt-6 sm:pt-16 pb-12 sm:pb-24 border-b border-brand-divider/70 overflow-hidden paper-texture">
      
      {/* Subtle editorial watermark lines */}
      <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-brand-gold/[0.03] blur-3xl pointer-events-none"></div>

      <div className="max-w-[1160px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Dispatch & Headlines (7 cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7">
            
            {/* Curated Eyebrow */}
            <div className="inline-flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0"></span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-semibold text-brand-secondary/90">
                আরিফুল ইসলামের সঙ্গে অফলাইন কর্মশালা
              </span>
            </div>

            {/* Headline and Supporting Heading */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-[26px] sm:text-4xl lg:text-[52px] font-serif-bn font-bold text-brand-forest tracking-tight leading-[1.25] break-words">
                আয়ের নতুন উৎস নিয়ে ভাবছেন?
              </h1>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif-bn font-semibold text-brand-gold-deep tracking-tight leading-[1.3] break-words">
                শুরু হোক বিনিয়োগ আড্ডায়।
              </h2>
            </div>

            {/* Editorial Description */}
            <p className="text-base sm:text-lg lg:text-[19px] text-brand-text/90 leading-relaxed max-w-xl font-normal">
              প্যাসিভ ইনকাম ও আয়ের একাধিক উৎস নিয়ে অভিজ্ঞতা, খোলামেলা আলোচনা এবং নিজের পরবর্তী পদক্ষেপ ভাবার একটি আয়োজন।
            </p>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#registration"
                className="inline-flex items-center justify-center gap-2 bg-brand-forest hover:bg-brand-forest-soft text-brand-ivory text-base sm:text-lg font-semibold px-6 sm:px-8 py-3.5 sm:py-3.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 active:translate-y-[1px] focus-visible:outline-brand-gold min-h-[48px]"
              >
                <span>আগ্রহ নিবন্ধন করুন</span>
                <ArrowDown className="w-4 h-4 text-brand-gold flex-shrink-0" />
              </a>

              <a
                href="#topics"
                className="inline-flex items-center justify-center text-brand-forest hover:text-brand-gold-deep text-sm sm:text-base font-medium px-4 py-2.5 sm:py-3 transition-colors underline underline-offset-8 decoration-brand-divider hover:decoration-brand-gold focus-visible:outline-brand-gold min-h-[44px]"
              >
                কী নিয়ে আলোচনা হবে?
              </a>
            </div>

            {/* Note badge */}
            <div className="pt-1 flex items-start gap-2 text-xs sm:text-sm text-brand-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0 mt-2"></span>
              <p className="leading-relaxed">
                <strong>প্রাথমিক আগ্রহ নিবন্ধন চলছে।</strong> সময়, ভেন্যু ও ফি চূড়ান্ত হলে জানানো হবে।
              </p>
            </div>

          </div>

          {/* Right Column: Bespoke Salon Docket / Pass (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative bg-brand-ivory-light rounded-xl p-5 sm:p-9 border border-brand-divider shadow-[0_4px_24px_-8px_rgba(23,62,53,0.06)] space-y-5 sm:space-y-6">
              
              {/* Top Accent Strip */}
              <div className="flex items-center justify-between border-b border-brand-divider/70 pb-4 sm:pb-5">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-brand-gold-deep">
                    আয়োজন বিবরণী
                  </span>
                  <div className="text-[11px] text-brand-secondary font-mono">
                    EVENT PASS · PROPOSED
                  </div>
                </div>

                <span className="inline-block px-2.5 sm:px-3 py-1 bg-brand-forest/5 text-brand-forest border border-brand-forest/15 text-xs font-semibold rounded">
                  {statusLabels.dateBadge}
                </span>
              </div>

              {/* Main Date Display */}
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-2xl sm:text-4xl font-serif-bn font-bold text-brand-forest tracking-tight">
                  {eventConfig.dateFormattedBn}
                </div>
                <div className="text-sm sm:text-base text-brand-secondary font-medium">
                  {eventConfig.dayOfWeekBn}
                </div>
              </div>

              {/* Clean Editorial Metadata Table */}
              <div className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm pt-2 border-t border-brand-divider/70">
                
                <div className="flex items-center justify-between py-1.5 border-b border-brand-divider/40 gap-2">
                  <span className="text-brand-secondary flex items-center gap-1.5 sm:gap-2">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold flex-shrink-0" />
                    <span>ধরন</span>
                  </span>
                  <span className="font-semibold text-brand-forest text-right">
                    অফলাইন আয়োজন
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-brand-divider/40 gap-2">
                  <span className="text-brand-secondary flex items-center gap-1.5 sm:gap-2">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold flex-shrink-0" />
                    <span>সময়</span>
                  </span>
                  <span className="font-medium text-brand-text/90 text-right">
                    {statusLabels.timeLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-brand-divider/40 gap-2">
                  <span className="text-brand-secondary flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold flex-shrink-0" />
                    <span>ভেন্যু</span>
                  </span>
                  <span className="font-medium text-brand-text/90 text-right">
                    {statusLabels.venueLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 gap-2">
                  <span className="text-brand-secondary flex items-center gap-1.5 sm:gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold flex-shrink-0" />
                    <span>ফি</span>
                  </span>
                  <span className="font-medium text-brand-text/90 text-right">
                    {statusLabels.feeLabel}
                  </span>
                </div>

              </div>

              {/* Perforation / Docket Footnote */}
              <div className="pt-3.5 sm:pt-4 border-t border-dashed border-brand-divider text-[11px] sm:text-xs text-brand-secondary/80 leading-relaxed">
                * তারিখটি প্রস্তাবিত। চূড়ান্ত সিদ্ধান্ত ও ভেন্যুর বিস্তারিত সময়মতো সকল আগ্রহীকে জানানো হবে।
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
