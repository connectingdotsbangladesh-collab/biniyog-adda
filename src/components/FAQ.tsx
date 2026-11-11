import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { eventConfig } from '../config/event';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: 'অনুষ্ঠানটি কবে, কখন এবং কোথায় অনুষ্ঠিত হবে?',
      a: `অনুষ্ঠানটি আগামী ${eventConfig.dateFormattedBn} (${eventConfig.dayOfWeekBn}), সকাল ৯:৩০টা থেকে বিকেল ৩:০০টা পর্যন্ত অনুষ্ঠিত হবে। ভেন্যু: ${eventConfig.venueName} (${eventConfig.venueLandmark}), ঠিকানা: ${eventConfig.venueAddress}।`,
    },
    {
      q: 'এন্ট্রি ফি কত এবং কীভাবে পরিশোধ করব?',
      a: `অনুষ্ঠানের এন্ট্রি ফি ৩৯০ টাকা। আমাদের পার্সোনাল বিকাশ বা নগদ নম্বর ${eventConfig.payment.personalNumber}-এ ৩৯০ টাকা Send Money করে নিবন্ধন ফর্মে আপনার প্রেরকের নম্বর এবং ট্রানজ্যাকশন আইডি (Transaction ID) জমা দিতে হবে।`,
    },
    {
      q: 'প্রোগ্রামে সকালের নাস্তা, দুপুরের খাবার ও নামাজের বিরতি কি থাকবে?',
      a: 'হ্যাঁ। সকাল ৯:৩০টায় ভেন্যুতে প্রবেশ করেই থাকছে সকালের নাস্তা (Breakfast)। এছাড়া দুপুর ১:০০টা থেকে ১:৩০টা পর্যন্ত জোহরের নামাজের বিরতি এবং ১:৩০টা থেকে ২:০০টা পর্যন্ত দুপুরের খাবার (Lunch)-এর ব্যবস্থা থাকবে।',
    },
    {
      q: 'অনুষ্ঠানে কারা বক্তব্য রাখবেন এবং প্রশ্নোত্তর পর্ব কি থাকবে?',
      a: 'সকাল ১০:০০–১১:০০টা আরিফুল ইসলাম ভাই, ১১:০০–১২:০০টা মোহাম্মদ একরাম ভাই এবং ১২:০০–১:০০টা গাজি মোহাম্মদ তানজিল ভাই (বিষয়: ব্যবসায় নজর এর প্রভাব ও এর থেকে মুক্তির উপায়) বক্তব্য রাখবেন। এরপর দুপুর ২:০০টা থেকে ৩:০০টা পর্যন্ত সরাসরি প্রশ্নোত্তর পর্ব (Q&A Session) অনুষ্ঠিত হবে।',
    },
    {
      q: 'টাকা পাঠিয়ে ফর্ম পূরণের পর আসন কীভাবে নিশ্চিত হবে?',
      a: 'আপনি ফর্মে ট্রানজ্যাকশন আইডি ও নম্বর জমা দেওয়ার পর আমাদের আয়োজক টিম পেমেন্টটি যাচাই করে আপনার মোবাইল/WhatsApp নম্বরে আসন নিশ্চিতকরণ বার্তা পৌঁছে দেবেন।',
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
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bengali font-bold text-white">
            সাধারণ প্রশ্ন ও উত্তর
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#D1E2D9]">
            সময়সূচি, ভেন্যু ও পেমেন্ট সম্পর্কিত প্রয়োজনীয় তথ্যাবলি
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
                  <span className="text-lg sm:text-xl font-bengali font-bold text-white group-hover:text-[#F7E7CD] transition-colors leading-snug">
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
