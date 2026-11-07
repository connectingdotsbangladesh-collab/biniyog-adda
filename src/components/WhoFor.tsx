import React from 'react';

export const WhoFor: React.FC = () => {
  const groups = [
    {
      title: 'চাকরিজীবী',
      subtitle: 'ক্যারিয়ারের পাশাপাশি টেকসই ভিত্তি',
      desc: 'কর্মজীবনের ব্যস্ততার পাশাপাশি একটি নির্ভরযোগ্য অতিরিক্ত আয়ের পথ তৈরি করতে আগ্রহী যাঁরা।',
    },
    {
      title: 'ব্যবসায়ী ও উদ্যোক্তা',
      subtitle: 'পোর্টফোলিও ও বহুমুখী ক্যাশ-ফ্লো',
      desc: 'মূল ব্যবসার সমান্তরালে অতিরিক্ত পুঁজি ও সুযোগকে কার্যকরী বিকল্প আয়ে রূপান্তর করতে চান।',
    },
    {
      title: 'ফ্রিল্যান্সার ও পেশাজীবী',
      subtitle: 'সময়-নির্ভর মডেলের বাইরে নিজস্ব সম্পদ',
      desc: 'শুধুমাত্র ক্লায়েন্ট প্রজেক্ট বা সময়ের বিনিময়ে আয়ের সীমাবদ্ধতা কাটিয়ে স্থায়ী কাঠামো গড়তে আগ্রহী।',
    },
    {
      title: 'শিক্ষার্থী ও নতুন উদ্যোক্তা',
      subtitle: 'শুরু থেকেই দূরদর্শী আর্থিক সচেতনতা',
      desc: 'ভবিষ্যতের জন্য বাস্তবসম্মত সুযোগ ও ঝুঁকি বিশ্লেষণের মাধ্যমে আয়ের নতুন ভিত্তি বুঝতে চান।',
    },
  ];

  return (
    <section id="audience" className="py-16 sm:py-24 border-b border-brand-divider/70 bg-brand-ivory-warm/40">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="text-xs uppercase tracking-widest font-semibold text-brand-gold-deep mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
            <span>অংশগ্রহণকারী প্রোফাইল</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif-bn font-bold text-brand-forest tracking-tight">
            কারা অংশ নিতে পারেন?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-brand-secondary/90 leading-relaxed">
            নতুন কিছু শেখা, অভিজ্ঞতা যাচাই ও বাস্তবসম্মত পদক্ষেপ নেওয়ার মানসিকতা যাঁদের রয়েছে।
          </p>
        </div>

        {/* 4 Cohorts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {groups.map((group, idx) => (
            <div
              key={idx}
              className="bg-brand-surface rounded-xl p-6 sm:p-7 border border-brand-divider/70 flex flex-col justify-between hover:border-brand-gold/60 transition-all duration-200 shadow-[0_2px_12px_-4px_rgba(23,62,53,0.04)]"
            >
              <div>
                <span className="text-xs font-mono text-brand-gold-deep/80 block mb-2 font-medium">
                  COHORT 0{idx + 1}
                </span>
                <h3 className="text-xl font-serif-bn font-bold text-brand-forest mb-1.5">
                  {group.title}
                </h3>
                <span className="text-xs font-medium text-brand-secondary/80 block mb-3.5 pb-3 border-b border-brand-divider/50">
                  {group.subtitle}
                </span>
                <p className="text-sm text-brand-text/80 leading-relaxed">
                  {group.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
