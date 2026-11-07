# বিনিয়োগ আড্ডা (Biniyog Adda) — Landing Page & Registration System

**বিনিয়োগ আড্ডা** হলো আরিফুল ইসলামের সঙ্গে প্যাসিভ ইনকাম ও আয়ের একাধিক উৎস নিয়ে অফলাইন কর্মশালা ও আলোচনার অফিসিয়াল ল্যান্ডিং পেজ ও প্রাথমিক আগ্রহ নিবন্ধন প্ল্যাটফর্ম।

---

## ১. প্রজেক্টের বৈশিষ্ট্যসমূহ (Features)

- **মোবাইল-ফার্স্ট বাংলা ইন্টারফেস**: ১০০% বাংলা কনটেন্ট, অপ্টিমাইজড টাইপোগ্রাফি (Hind Siliguri / Noto Sans Bengali), রেসপনসিভ ডিজাইন (৩৬০px থেকে ১৪৪০px+)।
- **নিখুঁত ব্র্যান্ডিং**: অফিসিয়াল লোগো, ফরেস্ট গ্রিন (`#173E35`), ওয়ার্ম আইভরি (`#F6F2E9`) এবং গোল্ড অ্যাকসেন্ট (`#B99554`) কালার স্কিম।
- **সুরক্ষিত আগ্রহ নিবন্ধন ফর্ম**:
  - বাংলা ও ইংরেজি উভয় ডিজিটের মোবাইল নম্বর ইনপুট ও স্বয়ংক্রিয় নরমালাইজেশন (`01XXXXXXXXX`)।
  - স্পষ্ট ও দ্ব্যর্থহীন সম্মতি (Consent) যাচাই।
  - অদৃশ্য স্প্যাম বট প্রতিরোধী হানিপট (Honeypot)।
  - পুনরাবৃত্তি রোধ (Idempotent submission safeguard)।
  - প্রিভিউ ও প্রোডাকশন উভয় মোডে ত্রুটিহীন ও সৎ ফিডব্যাক (সিস্টেম সংযোগ ছাড়া মিথ্যা সফল মেসেজ দেবে না)।
- **আয়োজক অ্যাডমিন ড্যাশবোর্ড (`/#admin`)**:
  - সুরক্ষিত আয়োজক প্রবেশ ও সেশন কন্ট্রোল।
  - মোট আগ্রহ, পেশাভিত্তিক বিভাজন ও স্ট্যাটাস ট্র্যাকিং (`interested`, `contacted`, `confirmed`, `cancelled`)।
  - নাম ও মোবাইল নম্বর দিয়ে সার্চ এবং রিয়েল-টাইম ফিল্টারিং।
  - বিস্তারিত মতামত দেখার মডাল।
  - স্প্রেডশিট ফর্মুলা ইনজেকশন মুক্ত নিরাপদ ও UTF-8 BOM যুক্ত বাংলা CSV এক্সপোর্ট।
- **স্বতন্ত্র কনফিগারেশন মডিউল (`src/config/event.ts`)**:
  - ভেন্যু, সময়, ফি ও ক্ষমতার মতো অপ্রকাশিত প্রস্তাবনাগুলো নিরাপদে ফলব্যাক টেক্সট ("চূড়ান্ত হলে জানানো হবে") সহ প্রদর্শিত হয়।

---

## ২. ফাইল ও ফোল্ডার কাঠামো

```
biniyog-adda/
├── public/
│   └── biniyog-adda-logo.png          # অনুমোদিত ব্র্যান্ড লোগো
├── src/
│   ├── config/
│   │   └── event.ts                   # ইভেন্টের কেন্দ্রীয় কনফিগারেশন ও বাংলা ফলব্যাক
│   ├── components/
│   │   ├── Header.tsx                 # লোগো, নেভিগেশন ও মূল CTA
│   │   ├── Hero.tsx                   # হিরো সেকশন ও প্রস্তাবিত তারিখ প্যানেল
│   │   ├── Topics.tsx                 # আলোচনার মূল ৪টি বিষয়
│   │   ├── WhoFor.tsx                 # কারা অংশ নিতে পারেন (৪টি গ্রুপ)
│   │   ├── SpeakerAndDetails.tsx      # আলোচক পরিচিতি ও বর্তমান আয়োজনের তথ্য
│   │   ├── RegistrationForm.tsx       # ভ্যালিডেশন ও হানিপট সহ আগ্রহ নিবন্ধন ফর্ম
│   │   ├── FAQ.tsx                    # ৫টি অনুমোদিত প্রশ্নোত্তর একর্ডিয়ন
│   │   ├── Footer.tsx                 # ফুটার ও আয়োজক লিংক
│   │   ├── StickyMobileCta.tsx        # মোবাইলে স্বয়ংক্রিয় ভাসমান বাটন
│   │   └── AdminDashboard.tsx         # কোড-স্প্লিট করা সুরক্ষিত আয়োজক প্যানেল
│   ├── lib/
│   │   └── supabase.ts                # Supabase ক্লায়েন্ট, RPC কল ও ডাটাবেজ হ্যান্ডলিং
│   ├── utils/
│   │   ├── phone.ts                   # বাংলা ও আন্তর্জাতিক মোবাইল নরমালাইজার
│   │   └── csv.ts                     # ফর্মুলা ইনজেকশন মুক্ত CSV জেনারেটর
│   ├── App.tsx                        # রুট রাউটার ও লেজি লোডিং
│   ├── main.tsx
│   └── index.css                      # টেলউইন্ড ও বাংলা ফন্ট স্টাইলিং
├── supabase/
│   └── migrations/
│       └── 20261107_init.sql          # সম্পূর্ণ ডাটাবেজ স্কিমা, RLS পলিসি ও সিকিউর RPC
├── .env.example                       # প্রয়োজনীয় এনভায়রনমেন্ট ভ্যারিয়েবল টেমপ্লেট
├── package.json
└── vite.config.ts
```

---

## ৩. স্থানীয় প্রিভিউ চালু করার পদ্ধতি (Local Preview)

প্রজেক্ট ডিরেক্টরিতে যান:
```powershell
cd C:\Users\connectingdots3\.gemini\antigravity\scratch\biniyog-adda
```

প্রিভিউ সার্ভার চালু করুন:
```powershell
npm.cmd run preview -- --port 4173
```
ব্রাউজারে খুলুন: **`http://localhost:4173/`**
আয়োজক ড্যাশবোর্ড দেখতে: **`http://localhost:4173/#admin`**

---

## ৪. ডাটাবেজ ও ব্যাকএন্ড সেটআপ (Supabase)

১. [Supabase](https://supabase.com)-এ একটি নতুন প্রজেক্ট তৈরি করুন।
২. Supabase ড্যাশবোর্ডের **SQL Editor**-এ যান।
৩. `supabase/migrations/20261107_init.sql` ফাইলের সম্পূর্ণ কোড পেস্ট করে **Run** চাপুন। এটি তৈরি করবে:
   - `public.registrations` টেবিল
   - `public.admin_users` টেবিল
   - কড়া Row Level Security (RLS) পলিসি
   - নিরাপদ `submit_registration` RPC ফাংশন
৪. Supabase **Authentication** > **Users** এ গিয়ে আপনার আয়োজক ইমেইল ও পাসওয়ার্ড দিয়ে একটি ইউজার তৈরি করুন।
৫. SQL Editor-এ নিচের কুয়েরি চালিয়ে ওই ইউজারকে আয়োজক রোল দিন:
   ```sql
   INSERT INTO public.admin_users (id, email, role)
   VALUES ('YOUR_USER_UUID_FROM_AUTH_USERS', 'your-email@example.com', 'organizer');
   ```
৬. আপনার প্রজেক্টের **Project Settings** > **API** থেকে URL এবং `anon` `public` key সংগ্রহ করে প্রজেক্ট ফোল্ডারে `.env` তৈরি করুন:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
৭. পুনরায় বিল্ড দিন: `npm.cmd run build`।

---

## ৫. ইভেন্টের তথ্য হালনাগাদ করার নিয়ম

সব তথ্য `src/config/event.ts` ফাইলে কেন্দ্রীভূত রয়েছে। যখন কোনো তথ্য চূড়ান্ত হবে:
- **ভেন্যু চূড়ান্ত হলে**: `venueStatus: 'confirmed'`, `venueName: 'Connecting Dots Bangladesh Office'`, `venueAddress: '...'` দিন।
- **সময় চূড়ান্ত হলে**: `timeLabel: 'বিকাল ৩টা – ৬টা'` দিন।
- **ফি নির্ধারিত হলে**: `feeAmountBdt: 1500` দিন।
- **নিবন্ধন বন্ধ করতে চাইলে**: `registrationOpen: false` করে দিলে স্বয়ংক্রিয়ভাবে নোটিশ চলে আসবে।

---

## ৬. ডিপ্লয়মেন্ট গাইডলাইন (Deploying to Production)

প্রিভিউ অনুমোদন পাওয়ার পর এটি Vercel, Netlify অথবা Cloudflare Pages-এ ডিপ্লয় করা যাবে:
1. রিপোজিটরিটি GitHub-এ পুশ করুন।
2. হোস্টিং প্ল্যাটফর্মে ইমপোর্ট করে Build Command দিন: `npm run build`, Output Directory: `dist`।
3. হোস্টিং ড্যাশবোর্ডে `VITE_SUPABASE_URL` এবং `VITE_SUPABASE_ANON_KEY` এনভায়রনমেন্ট ভ্যারিয়েবল সেট করুন।
