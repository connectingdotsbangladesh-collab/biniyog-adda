import React from 'react';

export const Topics: React.FC = () => {
  const topics = [
    {
      number: '০১',
      title: 'প্যাসিভ ইনকামের ধারণা',
      description: 'একটি আয়ের উৎস তৈরি করতে শুরুতে কী ধরনের প্রস্তুতি ও কাজ প্রয়োজন, তা নিয়ে আলোচনা।',
      focus: 'বাস্তবধর্মী ভিত্তি ও প্রত্যাশা',
    },
    {
      number: '০২',
      title: 'নিজের জন্য সুযোগ বাছাই',
      description: 'সময়, দক্ষতা, পুঁজি ও সম্ভাব্য ঝুঁকি বিবেচনায় কোন বিষয়গুলো যাচাই করবেন।',
      focus: 'সুযোগ ও ঝুঁকি মূল্যায়ন',
    },
    {
      number: '০৩',
      title: 'অভিজ্ঞতা ও প্রশ্নোত্তর',
      description: 'আরিফুল ইসলামের অভিজ্ঞতা শুনুন এবং নিজের প্রশ্নগুলো সরাসরি করার সুযোগ নিন।',
      focus: 'খোলামেলা মতবিনিময়',
    },
    {
      number: '০৪',
      title: 'পরবর্তী পদক্ষেপের খসড়া',
      description: 'আলোচনা থেকে নিজের জন্য একটি প্রাথমিক কর্মপরিকল্পনা ভাবার অনুশীলন।',
      focus: 'ব্যক্তিগত প্রাথমিক পরিকল্পনা',
    },
  ];

  return (
    <section id="topics" className="py-12 sm:py-24 border-b border-brand-divider/70 bg-brand-ivory">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16 pb-6 sm:pb-8 border-b border-brand-divider/70">
          <div>
            <div className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-brand-gold-deep mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
              <span>সিলেবাস ও আলোচনার পরিধি</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-serif-bn font-bold text-brand-forest tracking-tight">
              কী নিয়ে আলোচনা হবে?
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-brand-secondary/90 leading-relaxed">
            বাস্তবধর্মী দৃষ্টিভঙ্গি ও অভিজ্ঞতার আলোকে সাজানো মূল আলোচনার বিষয়গুলো।
          </p>
        </div>

        {/* Editorial Syllabus List (Masterclass / Salon Style) */}
        <div className="divide-y divide-brand-divider/70 border-y border-brand-divider/70">
          {topics.map((t, idx) => (
            <div
              key={idx}
              className="py-6 sm:py-10 group hover:bg-brand-ivory-light/70 transition-colors px-1 sm:px-6 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-8 items-start">
                
                {/* Numeral & Focus Tag (3 cols) */}
                <div className="md:col-span-3 flex items-center md:items-start justify-between md:flex-col gap-2">
                  <span className="font-serif-bn text-2xl sm:text-4xl font-bold text-brand-gold-deep/80 group-hover:text-brand-gold transition-colors">
                    {t.number}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-brand-secondary/90 bg-brand-forest/5 px-2.5 py-1 rounded border border-brand-forest/10">
                    {t.focus}
                  </span>
                </div>

                {/* Title (4 cols) */}
                <div className="md:col-span-4 mt-1 md:mt-0">
                  <h3 className="text-lg sm:text-2xl font-serif-bn font-bold text-brand-forest group-hover:text-brand-forest-soft transition-colors leading-snug">
                    {t.title}
                  </h3>
                </div>

                {/* Description (5 cols) */}
                <div className="md:col-span-5">
                  <p className="text-sm sm:text-[17px] text-brand-text/85 leading-relaxed font-normal">
                    {t.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
