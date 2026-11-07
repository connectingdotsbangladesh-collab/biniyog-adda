import React from 'react';
import { eventConfig, getEventStatusLabels } from '../config/event';
import { Calendar, Clock, MapPin, Ticket, ShieldCheck } from 'lucide-react';

export const SpeakerAndDetails: React.FC = () => {
  const statusLabels = getEventStatusLabels(eventConfig);

  return (
    <section id="details" className="py-12 sm:py-24 border-b border-brand-divider/70 bg-brand-ivory">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Speaker Profile (Editorial Literary Salon Tribute) - 5 cols */}
          <div className="lg:col-span-5 bg-brand-surface rounded-xl p-5 sm:p-10 border border-brand-divider/70 shadow-[0_4px_24px_-8px_rgba(23,62,53,0.05)] relative overflow-hidden">
            
            {/* Top Seal */}
            <div className="flex items-center justify-between border-b border-brand-divider/70 pb-4 sm:pb-6 mb-5 sm:mb-7">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-brand-gold-deep">
                {eventConfig.speakerLabel}
              </span>
              <span className="text-[11px] font-mono text-brand-secondary/70">
                SPEAKER DISPATCH
              </span>
            </div>

            {/* Typographic Monogram & Name */}
            <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-7">
              <div className="w-13 h-13 sm:w-16 sm:h-16 w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-brand-forest text-brand-ivory flex items-center justify-center font-serif-bn font-bold text-xl sm:text-2xl shadow-inner border border-brand-gold/30 flex-shrink-0">
                আ
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-serif-bn font-bold text-brand-forest tracking-tight">
                  {eventConfig.speakerName}
                </h3>
                <span className="text-xs font-semibold text-brand-gold-deep tracking-wide uppercase mt-0.5 block">
                  আলোচক ও সঞ্চালক
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-brand-text/85 leading-relaxed font-normal border-t border-brand-divider/60 pt-5 sm:pt-6">
              <p className="italic font-serif-bn text-base sm:text-lg text-brand-forest/90">
                “{eventConfig.speakerBio}”
              </p>
            </div>

            {/* Subtle verification footnote */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-brand-divider/60 flex items-start sm:items-center gap-2.5 text-xs text-brand-secondary/80">
              <ShieldCheck className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>খোলামেলা মতবিনিময় ও সরাসরি প্রশ্নোত্তর পর্ব অন্তর্ভুক্ত।</span>
            </div>
          </div>

          {/* Event Docket & Schedule Details - 7 cols */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div>
              <div className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-brand-gold-deep mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                <span>আয়োজনের তথ্যপঞ্জি</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-serif-bn font-bold text-brand-forest tracking-tight">
                সময়, ভেন্যু ও আনুষঙ্গিক বিবরণ
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-brand-secondary/90 leading-relaxed">
                বর্তমানে প্রাথমিক পরিকল্পনা চূড়ান্ত করার কাজ চলছে। সকল তথ্য চূড়ান্ত হওয়া মাত্রই নিবন্ধিত আগ্রহীদের সরাসরি জানিয়ে দেওয়া হবে।
              </p>
            </div>

            {/* Minimalist Docket List */}
            <div className="bg-brand-surface rounded-xl border border-brand-divider/70 divide-y divide-brand-divider/60 shadow-[0_4px_24px_-8px_rgba(23,62,53,0.04)] overflow-hidden">
              
              {/* Date */}
              <div className="p-4 sm:p-6 flex items-start gap-3.5 sm:gap-5 hover:bg-brand-ivory-light/40 transition-colors">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-forest/5 text-brand-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-brand-forest" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-brand-secondary/80 mb-0.5">তারিখ</span>
                  <span className="text-base sm:text-lg font-serif-bn font-bold text-brand-forest break-words">
                    {statusLabels.dateLabel}
                  </span>
                </div>
              </div>

              {/* Time */}
              <div className="p-4 sm:p-6 flex items-start gap-3.5 sm:gap-5 hover:bg-brand-ivory-light/40 transition-colors">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-forest/5 text-brand-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-forest" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-brand-secondary/80 mb-0.5">সময়</span>
                  <span className="text-sm sm:text-base font-medium text-brand-text/90 break-words">
                    {statusLabels.timeLabel}
                  </span>
                </div>
              </div>

              {/* Venue */}
              <div className="p-4 sm:p-6 flex items-start gap-3.5 sm:gap-5 hover:bg-brand-ivory-light/40 transition-colors">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-forest/5 text-brand-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-forest" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-brand-secondary/80 mb-0.5">ভেন্যু</span>
                  <span className="text-sm sm:text-base font-medium text-brand-text/90 break-words">
                    {statusLabels.venueLabel}
                  </span>
                </div>
              </div>

              {/* Fee */}
              <div className="p-4 sm:p-6 flex items-start gap-3.5 sm:gap-5 hover:bg-brand-ivory-light/40 transition-colors">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-forest/5 text-brand-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-brand-forest" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-brand-secondary/80 mb-0.5">অংশগ্রহণ ফি</span>
                  <span className="text-sm sm:text-base font-medium text-brand-text/90 break-words">
                    {statusLabels.feeLabel}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 sm:p-6 flex items-start gap-3.5 sm:gap-5 bg-brand-ivory-light/20">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-brand-gold/15 text-brand-gold-deep flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-brand-secondary/80 mb-0.5">নিবন্ধন স্ট্যাটাস</span>
                  <span className="text-sm sm:text-base font-semibold text-brand-gold-deep break-words">
                    {statusLabels.registrationLabel}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
