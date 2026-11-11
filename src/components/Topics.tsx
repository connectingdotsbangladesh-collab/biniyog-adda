import React from 'react';
import { Compass, Lightbulb, MessageSquare, Layers } from 'lucide-react';
import { eventConfig } from '../config/event';

export const Topics: React.FC = () => {
  const topics = [
    {
      number: '০১',
      title: 'প্যাসিভ ইনকামের গুরুত্ব ও ভিত্তি',
      description: 'কেন শুধুমাত্র একমুখী আয়ের ওপর নির্ভর না করে প্যাসিভ ইনকামের ভিত্তি তৈরি করা জরুরি, তার বাস্তবসম্মত বিশ্লেষণ।',
      focus: 'আরিফুল ইসলাম · সকাল ১০:০০ – ১১:০০টা',
      icon: Lightbulb,
    },
    {
      number: '০২',
      title: 'বহুমাত্রিক আয়ের কৌশল ও পদ্ধতি',
      description: 'সময়, দক্ষতা ও পুঁজির সঠিক সমন্বয়ে কীভাবে একাধিক নির্ভরযোগ্য আয়ের উৎস তৈরি করা যায়।',
      focus: 'মোহাম্মদ একরাম · সকাল ১১:০০ – ১২:০০টা',
      icon: Layers,
    },
    {
      number: '০৩',
      title: 'সুযোগ যাচাই ও ধারাবাহিক অগ্রগতি',
      description: 'সম্ভাব্য ঝুঁকি মূল্যায়ন, সঠিক পথ নির্বাচন এবং দীর্ঘমেয়াদে আয়ের উৎস সচল রাখার কার্যকর প্রক্রিয়া।',
      focus: 'গাজী মোহাম্মদ · দুপুর ১২:০০ – ১:০০টা',
      icon: Compass,
    },
    {
      number: '০৪',
      title: 'সরাসরি প্রশ্নোত্তর পর্ব (Q&A)',
      description: 'নিজের অবস্থান, পুঁজি বা পরিকল্পনা সম্পর্কিত প্রশ্নগুলো সরাসরি আলোচকদের সামনে তুলে ধরার উন্মুক্ত সেশন।',
      focus: 'সকল বক্তা · দুপুর ২:০০ – ৩:০০টা',
      icon: MessageSquare,
    },
  ];

  return (
    <section id="topics" className="py-16 sm:py-28 border-b border-[#204E3C]/60 relative">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header with High Contrast */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-[#204E3C]/60">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-[#C9A66B] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
              <span>অনুষ্ঠানের মূল বিষয়</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bengali font-bold text-white">
              {eventConfig.topic}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#D1E2D9] max-w-md font-normal leading-relaxed">
            তিনটি বিষয়ভিত্তিক সেশন ও উন্মুক্ত প্রশ্নোত্তর পর্বের মাধ্যমে সাজানো পুরো দিনের কার্যকর কর্মশালা।
          </p>
        </div>

        {/* 4 Posh Editorial Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {topics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <div
                key={idx}
                className="posh-glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between group transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-bold text-gold-gradient">
                      {topic.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#C9A66B]/15 border border-[#C9A66B]/30 flex items-center justify-center text-[#F5E5C9]">
                      <Icon className="w-5 h-5 text-[#C9A66B]" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bengali font-bold text-white mb-3 group-hover:text-[#F3DFBA] transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-[#D4E4DC] leading-relaxed font-normal">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#204E3C]/60">
                  <span className="inline-block text-xs font-semibold text-[#F5E5C9] bg-[#C9A66B]/15 px-3 py-1 rounded-full border border-[#C9A66B]/30">
                    {topic.focus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
