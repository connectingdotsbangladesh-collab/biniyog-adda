import React from 'react';
import { Compass, Lightbulb, MessageSquare, Milestone } from 'lucide-react';

export const Topics: React.FC = () => {
  const topics = [
    {
      number: '০১',
      title: 'প্যাসিভ ইনকামের ধারণা',
      description: 'একটি আয়ের উৎস তৈরি করতে শুরুতে কী ধরনের প্রস্তুতি ও কাজ প্রয়োজন, তা নিয়ে আলোচনা।',
      focus: 'বাস্তবধর্মী ভিত্তি ও প্রত্যাশা',
      icon: Lightbulb,
    },
    {
      number: '০২',
      title: 'নিজের জন্য সুযোগ বাছাই',
      description: 'সময়, দক্ষতা, পুঁজি ও সম্ভাব্য ঝুঁকি বিবেচনায় কোন বিষয়গুলো যাচাই করবেন।',
      focus: 'সুযোগ ও ঝুঁকি মূল্যায়ন',
      icon: Compass,
    },
    {
      number: '০৩',
      title: 'অভিজ্ঞতা ও প্রশ্নোত্তর',
      description: 'আরিফুল ইসলামের অভিজ্ঞতা শুনুন এবং নিজের প্রশ্নগুলো সরাসরি করার সুযোগ নিন।',
      focus: 'খোলামেলা মতবিনিময়',
      icon: MessageSquare,
    },
    {
      number: '০৪',
      title: 'পরবর্তী পদক্ষেপের খসড়া',
      description: 'আলোচনা থেকে নিজের জন্য একটি প্রাথমিক কর্মপরিকল্পনা ভাবার অনুশীলন।',
      focus: 'ব্যক্তিগত প্রাথমিক পরিকল্পনা',
      icon: Milestone,
    },
  ];

  return (
    <section id="topics" className="py-16 sm:py-28 border-b border-[#1F4738]/60 relative">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header with Gradient Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16 pb-6 sm:pb-8 border-b border-[#1F4738]/60">
          <div>
            <div className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-posh-gold mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-posh-gold shadow-[0_0_8px_#C9A66B]"></span>
              <span>সিলেবাস ও আলোচনার পরিধি</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-serif-bn font-bold text-posh-text-primary tracking-tight">
              কী নিয়ে আলোচনা হবে?
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-posh-text-secondary leading-relaxed">
            বাস্তবধর্মী দৃষ্টিভঙ্গি ও অভিজ্ঞতার আলোকে সাজানো মূল আলোচনার বিষয়গুলো।
          </p>
        </div>

        {/* 4 Posh Glass Cards with Luxury Gradient Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {topics.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="posh-glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between group transition-all duration-300"
              >
                <div>
                  {/* Top Bar with Number & Focus Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-serif-bn text-3xl sm:text-4xl font-bold text-gold-gradient">
                      {t.number}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#1F4738]/80 text-[11px] sm:text-xs font-medium text-posh-gold-light">
                      <Icon className="w-3.5 h-3.5 text-posh-gold" />
                      <span>{t.focus}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-serif-bn font-bold text-posh-sand mb-3 group-hover:text-posh-gold-light transition-colors leading-snug">
                    {t.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-posh-text-secondary leading-relaxed font-normal">
                    {t.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1F4738]/50 flex items-center justify-between text-xs text-posh-text-muted">
                  <span>কর্মশালার মডিউল 0{idx + 1}</span>
                  <span className="text-posh-gold/80 group-hover:translate-x-1 transition-transform">অংশগ্রহণভিত্তিক আলোচনা →</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
