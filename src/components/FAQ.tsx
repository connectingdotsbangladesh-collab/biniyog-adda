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
    <section id="faq" className="py-16 sm:py-28 border-b border-[#204E3C]/60 relative">
      <div className="max-w-[840px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-xs uppercase tracking-widest font-semibold text-[#C9A66B] mb-2 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
            <span>সচরাচর জিজ্ঞাসা</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-[46px] font-serif-bn font-bold text-white tracking-tight">
            সাধারণ প্রশ্ন ও উত্তর
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#D1E2D9]">
            আয়োজন ও প্রাথমিক নিবন্ধন সম্পর্কিত প্রয়োজনীয় তথ্যাবলি
          </p>
        </div>

        {/* Minimalist Editorial Accordion */}
        <div className="divide-y divide-[#204E3C]/70 border-y border-[#204E3C]/70">
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
                  className="w-full text-left flex items-center justify-between gap-4 sm:gap-6 focus-visible:outline-[#C9A66B] group py-1 min-h-[48px]"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg sm:text-xl font-serif-bn font-bold text-white group-hover:text-[#F7E7CD] transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-[#C9A66B]/35 bg-[#C9A66B]/10 flex items-center justify-center flex-shrink-0 text-[#F5E5C9] group-hover:border-[#C9A66B] transition-colors">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#C9A66B]" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#C9A66B]" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="pt-3 pb-2 sm:pt-4 pr-4 sm:pr-12 text-base sm:text-[17px] text-[#D8E8DF] leading-relaxed font-normal">
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
