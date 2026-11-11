import React from 'react';
import { eventConfig, getEventStatusLabels } from '../config/event';
import { ArrowDown, MapPin, Clock, ShieldCheck, Sparkles, Utensils, CalendarCheck2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const statusLabels = getEventStatusLabels(eventConfig);

  return (
    <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-[#204E3C]/60 overflow-hidden">
      
      {/* Subtle organic radial glows */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#1E523F]/35 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headlines & Editorial Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* Sponsor & Event Eyebrow Badge */}
            <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-full posh-glow-badge">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A66B] animate-pulse flex-shrink-0" />
              <span className="text-xs sm:text-[13px] tracking-wide font-semibold text-[#F7E7CD]">
                Presented by <strong className="text-white">{eventConfig.presentedBy}</strong> · Powered by <strong className="text-white">{eventConfig.poweredBy}</strong>
              </span>
            </div>

            {/* Main Headline & Supporting Heading */}
            <div className="space-y-2.5 sm:space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bengali font-bold leading-[1.3] text-white">
                প্যাসিভ ও বহুমাত্রিক আয়ের
              </h1>
              <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-bengali font-bold leading-[1.35] text-gold-gradient block py-1">
                গুরুত্ব এবং পদ্ধতি।
              </h2>
            </div>

            {/* Editorial Description */}
            <p className="text-base sm:text-lg lg:text-[19px] text-[#D8E8DF] leading-relaxed max-w-xl font-normal">
              <strong className="text-white font-semibold">আরিফুল ইসলাম</strong>, <strong className="text-white font-semibold">মোহাম্মদ একরাম</strong> এবং <strong className="text-white font-semibold">গাজী মোহাম্মদ</strong>-এর সঙ্গে দিনব্যাপী বিশেষ অফলাইন কর্মশালা <strong className="text-[#F5E5C9] font-semibold">অর্থালাপ</strong> — যেখানে থাকছে সকালের নাস্তা, দুপুরের খাবার ও সরাসরি প্রশ্নোত্তর পর্ব।
            </p>

            {/* Quick Speaker Avatar Strip */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="flex -space-x-3">
                {eventConfig.speakers.map((sp) => (
                  <img
                    key={sp.id}
                    src={sp.photo}
                    alt={sp.name}
                    className="w-11 h-11 rounded-full object-cover object-top border-2 border-[#C9A66B] shadow-md bg-[#0D241C]"
                  />
                ))}
              </div>
              <div className="text-xs sm:text-sm text-[#D1E2D9] leading-snug">
                <span className="block font-semibold text-white">৩ জন অভিজ্ঞ আলোচক ও সরাসরি Q&A</span>
                <span className="text-[#A9C4B7]">সকাল ৯:৩০টা – বিকেল ৩:০০টা</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#registration"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#06130E] text-base sm:text-lg font-bold px-8 py-4 rounded-xl shadow-button-gold hover:brightness-110 transition-all duration-300 active:translate-y-[1px] focus-visible:outline-[#C9A66B] min-h-[52px]"
              >
                <span>আসন নিশ্চিত করুন (৳৩৯০)</span>
                <ArrowDown className="w-4 h-4 text-[#06130E] flex-shrink-0" />
              </a>

              <a
                href="#schedule"
                className="inline-flex items-center justify-center text-[#E2EBE6] hover:text-white text-sm sm:text-base font-medium px-6 py-3.5 rounded-xl border border-[#204E3C] hover:border-[#C9A66B]/60 bg-white/[0.04] transition-all duration-200 focus-visible:outline-[#C9A66B] min-h-[52px]"
              >
                সময়সূচি ও বক্তাবৃন্দ
              </a>
            </div>

            {/* Sub-note with subtle illuminated dot */}
            <div className="pt-1 flex items-start gap-2.5 text-xs sm:text-sm text-[#B4CCC1]">
              <span className="w-2 h-2 rounded-full bg-[#C9A66B] flex-shrink-0 mt-2 shadow-[0_0_8px_#C9A66B]"></span>
              <p className="leading-relaxed">
                <strong className="text-white font-semibold">নিবন্ধন চলছে।</strong> <span className="font-mono text-[#F5E5C9]">01790062298</span> নম্বরে (বিকাশ/নগদ) ৩৯০ টাকা পাঠিয়ে নিবন্ধন ফর্মে ট্রানজ্যাকশন আইডি জমা দিন।
              </p>
            </div>

          </div>

          {/* Right Column: Posh Glass Event Docket Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative posh-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5">
              
              {/* Top Accent Strip */}
              <div className="flex items-center justify-between border-b border-[#204E3C]/60 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#C9A66B]">
                    আয়োজন বিবরণী
                  </span>
                  <div className="text-xs text-[#95B2A4] font-mono tracking-wider mt-0.5">
                    OFFICIAL PASS · {eventConfig.eventDate}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 text-xs font-semibold rounded-full shadow-inner">
                  <CalendarCheck2 className="w-3.5 h-3.5" />
                  {statusLabels.dateBadge}
                </span>
              </div>

              {/* Main Date Display with Luxury Gold Gradient */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#C9A66B] tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
                  <span>{eventConfig.eventName} · অফলাইন প্রোগ্রাম</span>
                </div>
                <div className="text-3xl sm:text-4xl font-bengali font-bold text-gold-gradient py-0.5">
                  {eventConfig.dateFormattedBn}
                </div>
                <div className="text-base text-[#D1E2D9] font-medium">
                  {eventConfig.dayOfWeekBn}
                </div>
              </div>

              {/* Clean Editorial Metadata Table */}
              <div className="space-y-3 text-sm pt-2 border-t border-[#204E3C]/60">
                
                <div className="flex items-center justify-between py-1.5 border-b border-[#204E3C]/40 gap-2">
                  <span className="text-[#A9C4B7] flex items-center gap-2 flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#C9A66B]" />
                    <span>সময়</span>
                  </span>
                  <span className="font-semibold text-white text-right">
                    {statusLabels.timeLabel}
                  </span>
                </div>

                <div className="flex items-start justify-between py-1.5 border-b border-[#204E3C]/40 gap-3">
                  <span className="text-[#A9C4B7] flex items-center gap-2 flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#C9A66B]" />
                    <span>ভেন্যু</span>
                  </span>
                  <div className="text-right">
                    <span className="font-semibold text-white block">
                      {eventConfig.venueName}
                    </span>
                    <span className="text-xs text-[#B9D8CA] block">
                      {eventConfig.venueLandmark}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#204E3C]/40 gap-2">
                  <span className="text-[#A9C4B7] flex items-center gap-2 flex-shrink-0">
                    <Utensils className="w-4 h-4 text-[#C9A66B]" />
                    <span>আপ্যায়ন</span>
                  </span>
                  <span className="font-medium text-[#E2EBE6] text-right">
                    ব্রেকফাস্ট ও দুপুরের খাবার
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 gap-2">
                  <span className="text-[#A9C4B7] flex items-center gap-2 flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#C9A66B]" />
                    <span>এন্ট্রি ফি</span>
                  </span>
                  <span className="font-bold text-[#F5E5C9] text-right text-base">
                    {statusLabels.feeLabel}
                  </span>
                </div>

              </div>

              {/* Card Bottom Callout */}
              <div className="pt-2">
                <a
                  href="#registration"
                  className="w-full py-3.5 px-4 rounded-xl bg-white/[0.06] hover:bg-[#C9A66B] text-[#F5E5C9] hover:text-[#06130E] border border-[#C9A66B]/40 font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-inner min-h-[44px]"
                >
                  <span>এখনই নিবন্ধন ফর্ম পূরণ করুন</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
