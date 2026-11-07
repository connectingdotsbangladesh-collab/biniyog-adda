import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: 'এটি কি অনলাইন আয়োজন?',
      a: 'এটি সরাসরি অংশগ্রহণভিত্তিক অফলাইন আয়োজনের পরিকল্পনা।',
    },
    {
      q: 'সময় ও ভেন্যু কোথায় জানতে পারব?',
      a: 'চূড়ান্ত হলে পেজে জানানো হবে এবং নিবন্ধিত আগ্রহীদের সঙ্গে যোগাযোগ করা হবে।',
    },
    {
      q: 'এখন কি কোনো ফি দিতে হবে?',
      a: 'না। এই ফর্মে শুধু প্রাথমিক আগ্রহ নেওয়া হচ্ছে। অংশগ্রহণ ফি নির্ধারিত হলে জানানো হবে।',
    },
    {
      q: 'ফর্ম পূরণ করলেই কি আসন নিশ্চিত?',
      a: 'না। বিস্তারিত জানার পর অংশগ্রহণ নিশ্চিত করার পরবর্তী ধাপ জানানো হবে।',
    },
    {
      q: 'আগে অভিজ্ঞতা থাকা প্রয়োজন?',
      a: 'নিজের পেশা ও জানতে আগ্রহী বিষয় ফর্মে উল্লেখ করুন, যাতে আলোচনার প্রস্তুতিতে তা বিবেচনা করা যায়।',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-28 border-b border-[#1F4738]/60 relative">
      <div className="max-w-[840px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-posh-gold mb-2 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-posh-gold shadow-[0_0_8px_#C9A66B]"></span>
            <span>সচরাচর জিজ্ঞাসা</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif-bn font-bold text-posh-text-primary tracking-tight">
            সাধারণ প্রশ্ন ও উত্তর
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-posh-text-secondary">
            আয়োজন ও প্রাথমিক নিবন্ধন সম্পর্কিত প্রয়োজনীয় তথ্যাবলি
          </p>
        </div>

        {/* Minimalist Editorial Accordion */}
        <div className="divide-y divide-[#1F4738]/60 border-y border-[#1F4738]/60">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="py-5 sm:py-7 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-3 sm:gap-6 focus-visible:outline-posh-gold group py-1 min-h-[48px]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-xl font-serif-bn font-bold text-posh-sand group-hover:text-posh-gold-light transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-posh-gold/30 bg-posh-gold/10 flex items-center justify-center flex-shrink-0 text-posh-gold group-hover:border-posh-gold transition-colors">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="pt-3 pb-2 sm:pt-4 pr-4 sm:pr-12 text-sm sm:text-base text-posh-text-secondary leading-relaxed font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
