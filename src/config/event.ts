export interface SpeakerInfo {
  id: string;
  name: string;
  sessionTime: string;
  slotNumber: string;
  photo: string;
  bio: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  type: 'hospitality' | 'session' | 'break' | 'qa';
  speaker?: string;
  note?: string;
}

export interface EventConfig {
  eventId: string;
  eventName: string;
  topic: string;
  eventDate: string;
  dateFormattedBn: string;
  dayOfWeekBn: string;
  dateStatus: 'proposed' | 'confirmed';
  timezone: string;
  timeLabel: string;
  venueStatus: 'pending' | 'confirmed';
  venueName: string;
  venueLandmark: string;
  venueAddress: string;
  mapUrl: string;
  feeAmountBdt: number;
  feeLabel: string;
  capacity: number | null;
  registrationMode: 'interest' | 'paid_confirmed';
  registrationOpen: boolean;
  presentedBy: string;
  poweredBy: string;
  payment: {
    personalNumber: string;
    personalNumberBn: string;
    methods: ('bKash' | 'Nagad')[];
    amountBdt: number;
  };
  speakers: SpeakerInfo[];
  schedule: ScheduleItem[];
  contactPhone: string;
  contactEmail: string | null;
}

export const eventConfig: EventConfig = {
  eventId: 'orthalaap-2026-11-21',
  eventName: 'অর্থালাপ',
  topic: 'প্যাসিভ ও বহুমাত্রিক আয়ের গুরুত্ব এবং পদ্ধতি',
  eventDate: '2026-11-21',
  dateFormattedBn: '২১ নভেম্বর ২০২৬',
  dayOfWeekBn: 'শনিবার',
  dateStatus: 'confirmed',
  timezone: 'Asia/Dhaka',
  timeLabel: 'সকাল ৯:৩০টা – বিকেল ৩:০০টা',
  venueStatus: 'confirmed',
  venueName: 'মেহফিল কনভেনশন হলের বিল্ডিং',
  venueLandmark: 'শেওড়াপাড়া মেট্রো স্টেশনের পাশে',
  venueAddress: '965/1/A, Salam Abid Complex, Begum Rokeya, East Shewrapara, Dhaka 1216',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=965%2F1%2FA+Salam+Abid+Complex+East+Shewrapara+Dhaka+1216',
  feeAmountBdt: 390,
  feeLabel: '৳৩৯০ (তিনশত নব্বই টাকা)',
  capacity: null,
  registrationMode: 'paid_confirmed',
  registrationOpen: true,
  presentedBy: 'Shopan',
  poweredBy: 'Soil and Soul',
  payment: {
    personalNumber: '01790062298',
    personalNumberBn: '০১৭৯০০৬২২৯৮',
    methods: ['bKash', 'Nagad'],
    amountBdt: 390,
  },
  speakers: [
    {
      id: 'ariful',
      name: 'আরিফুল ইসলাম',
      sessionTime: 'সকাল ১০:০০ – ১১:০০টা',
      slotNumber: 'সেশন ০১',
      photo: './speakers/ariful-islam.jpg',
      bio: 'প্যাসিভ ইনকামের মূল ভিত্তি, মানসিক প্রস্তুতি ও বাস্তব অভিজ্ঞতা নিয়ে উদ্বোধনী সেশন।',
    },
    {
      id: 'ekram',
      name: 'মোহাম্মদ একরাম',
      sessionTime: 'সকাল ১১:০০ – ১২:০০টা',
      slotNumber: 'সেশন ০২',
      photo: './speakers/mohammad-ekram.jpg',
      bio: 'বহুমাত্রিক আয়ের আধুনিক সুযোগ, সঠিক পদ্ধতি ও টেকসই কাঠামো গড়ার কৌশল।',
    },
    {
      id: 'gazi',
      name: 'গাজী মোহাম্মদ',
      sessionTime: 'দুপুর ১২:০০ – ১:০০টা',
      slotNumber: 'সেশন ০৩',
      photo: './speakers/gazi-muhammad.jpg',
      bio: 'আয়ের নতুন উৎস তৈরি, ঝুঁকি ব্যবস্থাপনা এবং ধারাবাহিক অগ্রগতির বাস্তব রূপরেখা।',
    },
  ],
  schedule: [
    {
      time: '০৯:৩০ AM – ১০:০০ AM',
      title: 'প্রবেশ ও সকালের নাস্তা (Breakfast)',
      type: 'hospitality',
      note: 'আসন গ্রহণ এবং প্রবেশের পরপরই সকালের নাস্তা',
    },
    {
      time: '১০:০০ AM – ১১:০০ AM',
      title: 'আরিফুল ইসলাম ভাইয়ের বক্তব্য',
      type: 'session',
      speaker: 'আরিফুল ইসলাম',
    },
    {
      time: '১১:০০ AM – ১২:০০ PM',
      title: 'মোহাম্মদ একরাম ভাইয়ের বক্তব্য',
      type: 'session',
      speaker: 'মোহাম্মদ একরাম',
    },
    {
      time: '১২:০০ PM – ০১:০০ PM',
      title: 'গাজী মোহাম্মদ ভাইয়ের বক্তব্য',
      type: 'session',
      speaker: 'গাজী মোহাম্মদ',
    },
    {
      time: '০১:০০ PM – ০১:৩০ PM',
      title: 'নামাজের বিরতি',
      type: 'break',
      note: 'জোহরের নামাজের বিরতি',
    },
    {
      time: '০১:৩০ PM – ০২:০০ PM',
      title: 'দুপুরের খাবার (Lunch)',
      type: 'hospitality',
      note: 'সকল অংশগ্রহণকারীর জন্য মধ্যাহ্নভোজ',
    },
    {
      time: '০২:০০ PM – ০৩:০০ PM',
      title: 'প্রশ্নোত্তর পর্ব (Q&A Session) ও প্রোগ্রাম সমাপ্তি',
      type: 'qa',
      note: 'বক্তাদের সাথে সরাসরি প্রশ্নোত্তর এবং বিকেল ৩:০০টায় সমাপ্তি',
    },
  ],
  contactPhone: '01790062298',
  contactEmail: null,
};

export const getEventStatusLabels = (config: EventConfig = eventConfig) => {
  return {
    dateLabel:
      config.dateStatus === 'proposed'
        ? `প্রস্তাবিত: ${config.dateFormattedBn}, ${config.dayOfWeekBn}`
        : `${config.dateFormattedBn}, ${config.dayOfWeekBn}`,
    dateBadge: config.dateStatus === 'proposed' ? 'প্রস্তাবিত তারিখ' : 'চূড়ান্ত তারিখ',
    timeLabel: config.timeLabel,
    venueLabel: `${config.venueName} (${config.venueLandmark}) — ${config.venueAddress}`,
    feeLabel: `৳৩৯০ · বিকাশ ও নগদ`,
    capacityLabel: 'ব্রেকফাস্ট ও লাঞ্চ অন্তর্ভুক্ত',
    registrationLabel:
      config.registrationMode === 'paid_confirmed'
        ? 'আসন নিবন্ধন চলছে (৳৩৯০ এন্ট্রি ফি)'
        : 'প্রাথমিক আগ্রহ নিবন্ধন',
  };
};
