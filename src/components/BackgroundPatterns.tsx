import React from 'react';

export const BackgroundPatterns: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Subtle luxury geometric dot grid overlay across entire screen */}
      <div className="absolute inset-0 luxury-pattern-dots opacity-40"></div>

      {/* 2. Top-center radiant emerald ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#1E523F]/40 to-transparent rounded-full blur-[140px]"></div>

      {/* 3. Right-side champagne gold ambient warmth */}
      <div className="absolute top-[28%] -right-32 w-[500px] h-[500px] bg-[#C9A66B]/[0.08] rounded-full blur-[120px]"></div>

      {/* 4. Left-side deep emerald luminous pool */}
      <div className="absolute top-[55%] -left-32 w-[550px] h-[550px] bg-[#143B2C]/40 rounded-full blur-[130px]"></div>

      {/* 5. Bottom gold warmth */}
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#C9A66B]/[0.06] rounded-full blur-[130px]"></div>

      {/* 6. Concentric Circles SVG (Direct tribute to the circular radar/growth motif in the reference image) */}
      <svg
        className="absolute top-24 -right-44 w-[650px] h-[650px] opacity-[0.07] text-[#C9A66B]"
        viewBox="0 0 600 600"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="300" cy="300" r="80" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="300" cy="300" r="140" strokeWidth="1" />
        <circle cx="300" cy="300" r="200" strokeWidth="1.2" strokeDasharray="6 6" />
        <circle cx="300" cy="300" r="260" strokeWidth="1" />
        <circle cx="300" cy="300" r="320" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="0" y1="300" x2="600" y2="300" strokeWidth="0.8" opacity="0.5" />
        <line x1="300" y1="0" x2="300" y2="600" strokeWidth="0.8" opacity="0.5" />
      </svg>

      {/* 7. Organic botanical leaf line pattern (Inspired by the organic leaves in the reference image) */}
      <svg
        className="absolute top-[48%] -left-20 w-[420px] h-[420px] opacity-[0.06] text-[#7DA594]"
        viewBox="0 0 400 400"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M200 40 C 280 120, 320 240, 200 360 C 80 240, 120 120, 200 40 Z"
          strokeWidth="1.5"
        />
        <path d="M200 40 L 200 360" strokeWidth="1.2" />
        <path d="M200 120 Q 250 140 280 180" strokeWidth="1" />
        <path d="M200 180 Q 260 210 270 260" strokeWidth="1" />
        <path d="M200 120 Q 150 140 120 180" strokeWidth="1" />
        <path d="M200 180 Q 140 210 130 260" strokeWidth="1" />
      </svg>
    </div>
  );
};
