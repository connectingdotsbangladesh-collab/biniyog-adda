export interface EventConfig {
  eventName: string;
  speakerName: string;
  speakerLabel: string;
  speakerBio: string;
  topic: string;
  eventDate: string; // ISO date '2026-11-14'
  dateFormattedBn: string;
  dayOfWeekBn: string;
  dateStatus: 'proposed' | 'confirmed';
  timezone: string;
  timeLabel: string | null;
  venueStatus: 'pending' | 'confirmed';
  venueName: string | null;
  venueAddress: string | null;
  mapUrl: string | null;
  feeAmountBdt: number | null;
  capacity: number | null;
  registrationMode: 'interest' | 'paid_confirmed';
  registrationOpen: boolean;
  contactPhone: string | null;
  contactEmail: string | null;
  speakerPhoto: string | null;
  organizerName: string | null;
}

export const eventConfig: EventConfig = {
  eventName: 'বিনিয়োগ আড্ডা',
  speakerName: 'আরিফুল ইসলাম',
  speakerLabel: 'আলোচনায়',
  speakerBio: 'প্যাসিভ ইনকাম ও আয়ের একাধিক উৎস নিয়ে নিজের অভিজ্ঞতা তুলে ধরবেন এবং অংশগ্রহণকারীদের সঙ্গে আলোচনা করবেন।',
  topic: 'প্যাসিভ ইনকাম ও আয়ের একাধিক উৎস',
  eventDate: '2026-11-14',
  dateFormattedBn: '১৪ নভেম্বর ২০২৬',
  dayOfWeekBn: 'শনিবার',
  dateStatus: 'proposed', // 'proposed' ensures 'প্রস্তাবিত' is explicitly shown
  timezone: 'Asia/Dhaka',
  timeLabel: null, // null will render 'চূড়ান্ত হলে জানানো হবে'
  venueStatus: 'pending', // 'pending'
  venueName: null, // null will render 'চূড়ান্ত হলে জানানো হবে'
  venueAddress: null,
  mapUrl: null,
  feeAmountBdt: null, // null will render 'চূড়ান্ত হলে জানানো হবে'
  capacity: null,
  registrationMode: 'interest',
  registrationOpen: true,
  contactPhone: null,
  contactEmail: null,
  speakerPhoto: null,
  organizerName: null,
};

// Bengali Fallback Helpers
export const getEventStatusLabels = (config: EventConfig = eventConfig) => {
  return {
    dateLabel: config.dateStatus === 'proposed' 
      ? `প্রস্তাবিত: ${config.dateFormattedBn}, ${config.dayOfWeekBn}`
      : `${config.dateFormattedBn}, ${config.dayOfWeekBn}`,
    dateBadge: config.dateStatus === 'proposed' ? 'প্রস্তাবিত তারিখ' : 'তারিখ',
    timeLabel: config.timeLabel || 'চূড়ান্ত হলে জানানো হবে',
    venueLabel: config.venueName 
      ? (config.venueAddress ? `${config.venueName}, ${config.venueAddress}` : config.venueName)
      : 'চূড়ান্ত হলে জানানো হবে',
    feeLabel: config.feeAmountBdt !== null 
      ? `৳${config.feeAmountBdt.toLocaleString('bn-BD')}`
      : 'চূড়ান্ত হলে জানানো হবে',
    capacityLabel: config.capacity !== null 
      ? `${config.capacity.toLocaleString('bn-BD')} জন`
      : 'নির্দিষ্ট আসনসংখ্যা চূড়ান্ত হলে জানানো হবে',
    registrationLabel: config.registrationMode === 'interest' 
      ? 'প্রাথমিক আগ্রহ নিবন্ধন' 
      : 'চূড়ান্ত আসন নিশ্চিতকরণ',
  };
};
