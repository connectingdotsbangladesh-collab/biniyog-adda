import React from 'react';
import { eventConfig, getEventStatusLabels } from '../config/event';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ShieldCheck,
  Utensils,
  MessageSquare,
  Mic2,
  ExternalLink,
  Coffee,
  Sparkles,
} from 'lucide-react';

export const SpeakerAndDetails: React.FC = () => {
  const statusLabels = getEventStatusLabels(eventConfig);

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case 'hospitality':
        return Utensils;
      case 'break':
        return Coffee;
      case 'qa':
        return MessageSquare;
      default:
        return Mic2;
    }
  };

  return (
    <section className="py-16 sm:py-28 border-b border-[#204E3C]/60 relative">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 space-y-20 sm:space-y-28 relative z-10">
        
        {/* PART 1: 3 Featured Speakers */}
        <div id="speakers" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-14 pb-6 border-b border-[#204E3C]/60">
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold text-[#C9A66B] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
                <span>আলোচক ও সেশন পরিচিতি</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bengali font-bold text-white">
                আমাদের সম্মানিত আলোচকবৃন্দ
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#D1E2D9] max-w-md leading-relaxed">
              সকাল ১০:০০টা থেকে দুপুর ১:০০টা পর্যন্ত পরপর তিনটি একক সেশনে অভিজ্ঞতা ও পদ্ধতি শেয়ার করবেন আমাদের তিনজন অতিথি বক্তা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {eventConfig.speakers.map((speaker) => (
              <div
                key={speaker.id}
                className="posh-glass-card rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col group transition-all duration-300"
              >
                {/* Portrait Photo */}
                <div className="relative aspect-[4/4] sm:aspect-[4/3.6] overflow-hidden bg-[#040C09] border-b border-[#204E3C]/70">
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081712] via-transparent to-transparent opacity-80"></div>

                  {/* Top Session Slot Badge */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#06130E]/85 backdrop-blur-md border border-[#C9A66B]/45 text-[11px] font-mono font-semibold text-[#F5E5C9]">
                    {speaker.slotNumber}
                  </div>

                  {/* Bottom Floating Time Tag */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#06130E]/90 backdrop-blur-md border border-[#204E3C] text-xs font-semibold text-[#F5E5C9]">
                      <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
                      {speaker.sessionTime}
                    </span>
                  </div>
                </div>

                {/* Speaker Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bengali font-bold text-white group-hover:text-[#F5E5C9] transition-colors">
                      {speaker.name}
                    </h3>
                    <p className="mt-2.5 text-sm sm:text-[15px] text-[#D4E4DC] leading-relaxed">
                      {speaker.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PART 2: Full Program Schedule & Venue Docket */}
        <div id="schedule" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start scroll-mt-24">
          
          {/* Left Column: Complete Day Schedule (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold text-[#C9A66B] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
                <span>পূর্ণাঙ্গ সময়সূচি</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bengali font-bold text-white">
                অনুষ্ঠান সূচি (সকাল ৯:৩০ – বিকেল ৩:০০)
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#D1E2D9]">
                সময়মতো উপস্থিত হয়ে ব্রেকফাস্ট গ্রহণের অনুরোধ রইলো। সকাল ১০:০০টায় মূল বক্তব্য শুরু হবে।
              </p>
            </div>

            <div className="posh-glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#204E3C] space-y-3">
              {eventConfig.schedule.map((item, idx) => {
                const Icon = getScheduleIcon(item.type);
                const isSession = item.type === 'session';
                const isQa = item.type === 'qa';

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 p-3.5 sm:p-4 rounded-xl border transition-colors ${
                      isQa
                        ? 'bg-[#C9A66B]/[0.1] border-[#C9A66B]/40'
                        : isSession
                        ? 'bg-white/[0.04] border-[#204E3C]/80 hover:border-[#C9A66B]/40'
                        : 'bg-[#05140F]/60 border-[#204E3C]/40'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isQa
                          ? 'bg-[#C9A66B] text-[#06130E]'
                          : isSession
                          ? 'bg-[#C9A66B]/15 border border-[#C9A66B]/30 text-[#C9A66B]'
                          : 'bg-[#122D23] border border-[#204E3C] text-[#A9C4B7]'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-[#C9A66B] tracking-wide">
                          {item.time}
                        </span>
                        {item.speaker && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#C9A66B]/15 text-[#F5E5C9] border border-[#C9A66B]/30">
                            {item.speaker}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base sm:text-lg font-bengali font-bold text-white mt-1">
                        {item.title}
                      </h4>
                      {item.note && (
                        <p className="text-xs sm:text-sm text-[#A9C4B7] mt-0.5">{item.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Venue, Location & Sponsor Attribution (5 cols) */}
          <div id="details" className="lg:col-span-5 space-y-6 scroll-mt-24">
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold text-[#C9A66B] mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
                <span>ভেন্যু ও এন্ট্রি বিবরণী</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bengali font-bold text-white">
                লোকেশন ও আয়োজক তথ্য
              </h2>
            </div>

            <div className="posh-glass-card rounded-2xl sm:rounded-3xl border border-[#204E3C] divide-y divide-[#204E3C]/70 overflow-hidden">
              
              {/* Date */}
              <div className="p-4 sm:p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9A66B]/15 border border-[#C9A66B]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs uppercase tracking-wider font-semibold text-[#A9C4B7] mb-0.5">তারিখ ও সময়</span>
                  <span className="text-base sm:text-lg font-bengali font-bold text-white block">
                    {statusLabels.dateLabel}
                  </span>
                  <span className="text-sm text-[#F5E5C9] font-medium block mt-0.5">
                    {statusLabels.timeLabel}
                  </span>
                </div>
              </div>

              {/* Venue Address + Map Link */}
              <div className="p-4 sm:p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9A66B]/15 border border-[#C9A66B]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <span className="block text-xs uppercase tracking-wider font-semibold text-[#A9C4B7]">অনুষ্ঠানের লোকেশন</span>
                  <div>
                    <span className="text-base font-bold text-white block">
                      {eventConfig.venueName}
                    </span>
                    <span className="text-xs font-semibold text-[#C9A66B] block mt-0.5">
                      ({eventConfig.venueLandmark})
                    </span>
                    <span className="text-xs sm:text-sm text-[#D1E2D9] block mt-1 leading-relaxed font-mono">
                      {eventConfig.venueAddress}
                    </span>
                  </div>
                  <a
                    href={eventConfig.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#06130E] bg-[#C9A66B] hover:bg-[#E2C899] px-3.5 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <span>Google Maps-এ দেখুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Entry Fee & Payment */}
              <div className="p-4 sm:p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9A66B]/15 border border-[#C9A66B]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Ticket className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs uppercase tracking-wider font-semibold text-[#A9C4B7] mb-0.5">এন্ট্রি ফি ও পেমেন্ট</span>
                  <span className="text-lg font-bold text-gold-gradient block">
                    {eventConfig.feeLabel}
                  </span>
                  <p className="text-xs sm:text-sm text-[#D1E2D9] mt-1 leading-relaxed">
                    বিকাশ ও নগদ পার্সোনাল: <strong className="font-mono text-white">{eventConfig.payment.personalNumber}</strong>
                  </p>
                </div>
              </div>

              {/* Sponsors: Presented by Shopan, Powered by Soil and Soul */}
              <div className="p-4 sm:p-5 bg-[#C9A66B]/[0.08] flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C9A66B]/25 border border-[#C9A66B]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <span className="block text-xs uppercase tracking-wider font-semibold text-[#A9C4B7]">আয়োজন ও পৃষ্ঠপোষকতায়</span>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="px-3 py-1 rounded-lg bg-[#06130E]/80 border border-[#C9A66B]/40 text-xs sm:text-sm text-[#F5E5C9]">
                      Presented by <strong className="text-white">{eventConfig.presentedBy}</strong>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-[#06130E]/80 border border-[#C9A66B]/40 text-xs sm:text-sm text-[#F5E5C9]">
                      Powered by <strong className="text-white">{eventConfig.poweredBy}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Registration CTA Row */}
              <div className="p-4 sm:p-5 bg-white/[0.02] flex items-center gap-3 text-xs text-[#B9D8CA]">
                <ShieldCheck className="w-4 h-4 text-[#C9A66B] flex-shrink-0" />
                <span>পেমেন্টের পর ফর্মে ট্রানজ্যাকশন আইডি দিয়ে আসন নিবন্ধন সম্পন্ন করুন।</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
