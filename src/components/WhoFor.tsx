import React from 'react';
import { Briefcase, Building2, Laptop, GraduationCap } from 'lucide-react';

export const WhoFor: React.FC = () => {
  const groups = [
    {
      title: 'চাকরিজীবী',
      subtitle: 'ক্যারিয়ারের পাশাপাশি টেকসই ভিত্তি',
      desc: 'কর্মজীবনের ব্যস্ততার পাশাপাশি একটি নির্ভরযোগ্য অতিরিক্ত আয়ের পথ তৈরি করতে আগ্রহী যাঁরা।',
      icon: Briefcase,
    },
    {
      title: 'ব্যবসায়ী ও উদ্যোক্তা',
      subtitle: 'পোর্টফোলিও ও বহুমুখী ক্যাশ-ফ্লো',
      desc: 'মূল ব্যবসার সমান্তরালে অতিরিক্ত পুঁজি ও সুযোগকে কার্যকরী বিকল্প আয়ে রূপান্তর করতে চান।',
      icon: Building2,
    },
    {
      title: 'ফ্রিল্যান্সার ও পেশাজীবী',
      subtitle: 'সময়-নির্ভর মডেলের বাইরে নিজস্ব সম্পদ',
      desc: 'শুধুমাত্র ক্লায়েন্ট প্রজেক্ট বা সময়ের বিনিময়ে আয়ের সীমাবদ্ধতা কাটিয়ে স্থায়ী কাঠামো গড়তে আগ্রহী।',
      icon: Laptop,
    },
    {
      title: 'শিক্ষার্থী ও নতুন উদ্যোক্তা',
      subtitle: 'শুরু থেকেই দূরদর্শী আর্থিক সচেতনতা',
      desc: 'ভবিষ্যতের জন্য বাস্তবসম্মত সুযোগ ও ঝুঁকি বিশ্লেষণের মাধ্যমে আয়ের নতুন ভিত্তি বুঝতে চান।',
      icon: GraduationCap,
    },
  ];

  return (
    <section id="audience" className="py-16 sm:py-28 border-b border-[#204E3C]/60 relative">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="text-xs uppercase tracking-widest font-semibold text-[#C9A66B] mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
            <span>অংশগ্রহণকারী প্রোফাইল</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-[46px] font-serif-bn font-bold text-white tracking-tight">
            কারা অংশ নিতে পারেন?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#D1E2D9] leading-relaxed">
            নতুন কিছু শেখা, অভিজ্ঞতা যাচাই ও বাস্তবসম্মত পদক্ষেপ নেওয়ার মানসিকতা যাঁদের রয়েছে।
          </p>
        </div>

        {/* 4 Posh Cohort Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {groups.map((group, idx) => {
            const Icon = group.icon;
            return (
              <div
                key={idx}
                className="posh-glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between group transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold text-[#C9A66B] tracking-wider">
                      COHORT 0{idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#C9A66B]/15 border border-[#C9A66B]/30 flex items-center justify-center text-[#F5E5C9]">
                      <Icon className="w-4 h-4 text-[#C9A66B]" />
                    </div>
                  </div>

                  <h3 className="text-xl font-serif-bn font-bold text-white mb-2 group-hover:text-[#F3DFBA] transition-colors">
                    {group.title}
                  </h3>
                  <span className="text-xs sm:text-[13px] font-medium text-[#B9D8CA] block mb-3 pb-3 border-b border-[#204E3C]/60">
                    {group.subtitle}
                  </span>
                  <p className="text-sm sm:text-[15px] text-[#D4E4DC] leading-relaxed">
                    {group.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Posh Pill Feature Bar */}
        <div className="mt-12 sm:mt-16 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#122D23]/90 via-[#0A1D15]/95 to-[#122D23]/90 border border-[#204E3C] flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-sm sm:text-base font-semibold text-white shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
            <span>বাস্তবধর্মী বিশ্লেষণ</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
            <span>সরাসরি প্রশ্নোত্তর</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></span>
            <span>পরবর্তী রূপরেখা অনুশীলন</span>
          </div>
        </div>

      </div>
    </section>
  );
};
