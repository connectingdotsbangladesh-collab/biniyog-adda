import React from 'react';
import { eventConfig, getEventStatusLabels } from '../config/event';
import { Calendar, Clock, MapPin, Ticket, ShieldCheck, Award } from 'lucide-react';

export const SpeakerAndDetails: React.FC = () => {
  const statusLabels = getEventStatusLabels(eventConfig);

  return (
    <section id="details" className="py-16 sm:py-28 border-b border-[#1F4738]/60 relative">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Speaker Profile (Literary & Posh Salon Tribute) - 5 cols */}
          <div className="lg:col-span-5 posh-glass-card rounded-2xl p-6 sm:p-9 relative overflow-hidden">
            
            {/* Top Seal */}
            <div className="flex items-center justify-between border-b border-[#1F4738]/60 pb-4 mb-6">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-posh-gold">
                {eventConfig.speakerLabel}
              </span>
              <span className="text-[11px] font-mono text-posh-text-muted">
                SPEAKER DISPATCH
              </span>
            </div>

            {/* Typographic Monogram & Name */}
            <div className="flex items-center gap-4 sm:gap-5 mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#081712] flex items-center justify-center font-serif-bn font-bold text-2xl shadow-button-gold flex-shrink-0">
                আ
              </div>
              <div>
                <h3 className="text-xl sm:text-3xl font-serif-bn font-bold text-posh-text-primary tracking-tight">
                  {eventConfig.speakerName}
                </h3>
                <span className="text-xs font-semibold text-posh-gold tracking-wide uppercase mt-0.5 block">
                  আলোচক ও সঞ্চালক
                </span>
              </div>
            </div>

            {/* Bio with subtle quote styling */}
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-posh-text-secondary leading-relaxed font-normal border-t border-[#1F4738]/60 pt-5">
              <p className="italic font-serif-bn text-base sm:text-lg text-posh-sand">
                “{eventConfig.speakerBio}”
              </p>
            </div>

            {/* Footnote */}
            <div className="mt-6 pt-5 border-t border-[#1F4738]/60 flex items-center gap-2.5 text-xs text-posh-text-muted">
              <Award className="w-4 h-4 text-posh-gold flex-shrink-0" />
              <span>খোলামেলা মতবিনিময় ও সরাসরি প্রশ্নোত্তর পর্ব অন্তর্ভুক্ত।</span>
            </div>
          </div>

          {/* Event Docket & Schedule Details - 7 cols */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div>
              <div className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-posh-gold mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-posh-gold shadow-[0_0_8px_#C9A66B]"></span>
                <span>আয়োজনের তথ্যপঞ্জি</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-serif-bn font-bold text-posh-text-primary tracking-tight">
                সময়, ভেন্যু ও আনুষঙ্গিক বিবরণ
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-posh-text-secondary leading-relaxed">
                বর্তমানে প্রাথমিক পরিকল্পনা চূড়ান্ত করার কাজ চলছে। সকল তথ্য চূড়ান্ত হওয়া মাত্রই নিবন্ধিত আগ্রহীদের সরাসরি জানিয়ে দেওয়া হবে।
              </p>
            </div>

            {/* Minimalist Docket List in Glass Container */}
            <div className="posh-glass-card rounded-2xl border border-[#1F4738]/70 divide-y divide-[#1F4738]/60 overflow-hidden">
              
              {/* Date */}
              <div className="p-4 sm:p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-posh-gold/10 border border-posh-gold/20 text-posh-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-posh-text-muted mb-0.5">তারিখ</span>
                  <span className="text-base sm:text-lg font-serif-bn font-bold text-posh-sand break-words">
                    {statusLabels.dateLabel}
                  </span>
                </div>
              </div>

              {/* Time */}
              <div className="p-4 sm:p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-posh-gold/10 border border-posh-gold/20 text-posh-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-posh-text-muted mb-0.5">সময়</span>
                  <span className="text-sm sm:text-base font-medium text-posh-text-secondary break-words">
                    {statusLabels.timeLabel}
                  </span>
                </div>
              </div>

              {/* Venue */}
              <div className="p-4 sm:p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-posh-gold/10 border border-posh-gold/20 text-posh-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-posh-text-muted mb-0.5">ভেন্যু</span>
                  <span className="text-sm sm:text-base font-medium text-posh-text-secondary break-words">
                    {statusLabels.venueLabel}
                  </span>
                </div>
              </div>

              {/* Fee */}
              <div className="p-4 sm:p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-posh-gold/10 border border-posh-gold/20 text-posh-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Ticket className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-posh-text-muted mb-0.5">অংশগ্রহণ ফি</span>
                  <span className="text-sm sm:text-base font-medium text-posh-text-secondary break-words">
                    {statusLabels.feeLabel}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 sm:p-5 flex items-start gap-4 bg-posh-gold/[0.04]">
                <div className="w-10 h-10 rounded-xl bg-posh-gold/20 border border-posh-gold/30 text-posh-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider font-semibold text-posh-text-muted mb-0.5">নিবন্ধন স্ট্যাটাস</span>
                  <span className="text-sm sm:text-base font-semibold text-gold-gradient break-words">
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
