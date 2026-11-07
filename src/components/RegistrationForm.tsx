import React, { useState, useRef } from 'react';
import { eventConfig } from '../config/event';
import { normalizePhoneNumber, isValidBdMobile } from '../utils/phone';
import { submitRegistration, isBackendConfigured } from '../lib/supabase';
import { CheckCircle2, AlertCircle, ArrowRight, Lock, Info } from 'lucide-react';

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    occupation: 'চাকরিজীবী',
    area: '',
    email: '',
    interest: '',
    consent: false,
    honeypot: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [generalErrorMessage, setGeneralErrorMessage] = useState('');

  // Refs for focusing first invalid input
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const statusHeadingRef = useRef<HTMLHeadingElement>(null);

  const backendReady = isBackendConfigured();

  // If registration is closed via configuration
  if (!eventConfig.registrationOpen) {
    return (
      <section id="registration" className="py-16 sm:py-28 border-b border-[#204E3C]/60">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="posh-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#204E3C] shadow-luxury-glow">
            <Info className="w-10 h-10 sm:w-12 sm:h-12 text-[#C9A66B] mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-3xl font-serif-bn font-bold text-white mb-2 sm:mb-3">
              অংশ নিতে আগ্রহী?
            </h2>
            <p className="text-base text-[#D1E2D9]">
              প্রাথমিক নিবন্ধন আপাতত বন্ধ রয়েছে। পরবর্তী ঘোষণার জন্য অপেক্ষা করুন।
            </p>
          </div>
        </div>
      </section>
    );
  }

  const validate = () => {
    const errors: Record<string, string> = {};

    // 1. Name
    const cleanName = formData.name.trim();
    if (!cleanName || cleanName.length < 2) {
      errors.name = 'আপনার সঠিক নাম লিখুন (কমপক্ষে ২ অক্ষর)।';
    } else if (cleanName.length > 100) {
      errors.name = 'নাম সর্বোচ্চ ১০০ অক্ষরের মধ্যে লিখুন।';
    }

    // 2. Phone
    if (!formData.phone.trim()) {
      errors.phone = 'মোবাইল / WhatsApp নম্বর দেওয়া আবশ্যক।';
    } else if (!isValidBdMobile(formData.phone)) {
      errors.phone = 'সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন।';
    }

    // 3. Occupation
    if (!formData.occupation) {
      errors.occupation = 'আপনার পেশা নির্বাচন করুন।';
    }

    // 4. Area
    const cleanArea = formData.area.trim();
    if (!cleanArea) {
      errors.area = 'আপনার এলাকা বা জেলা উল্লেখ করুন।';
    } else if (cleanArea.length > 120) {
      errors.area = 'এলাকা বা জেলা সর্বোচ্চ ১২০ অক্ষরের মধ্যে লিখুন।';
    }

    // 5. Email (Optional)
    if (formData.email.trim()) {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'সঠিক ইমেইল ঠিকানা দিন অথবা ফাঁকা রাখুন।';
      }
    }

    // 6. Interest length
    if (formData.interest.length > 800) {
      errors.interest = 'সর্বোচ্চ ৮০০ অক্ষরের মধ্যে লিখুন।';
    }

    // 7. Consent
    if (!formData.consent) {
      errors.consent = 'সম্মতি চেকবক্সে টিক চিহ্ন দেওয়া আবশ্যক।';
    }

    setFieldErrors(errors);

    // Focus the first invalid element
    if (errors.name && nameRef.current) nameRef.current.focus();
    else if (errors.phone && phoneRef.current) phoneRef.current.focus();
    else if (errors.area && areaRef.current) areaRef.current.focus();
    else if (errors.email && emailRef.current) emailRef.current.focus();
    else if (errors.consent && consentRef.current) consentRef.current.focus();

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!backendReady) {
      setSubmitStatus('error');
      setGeneralErrorMessage('ডাটাবেজ সংযোগ এখনো সক্রিয় করা হয়নি। অনুগ্রহ করে আয়োজকের সাথে যোগাযোগ করুন।');
      return;
    }

    setIsSubmitting(true);
    setGeneralErrorMessage('');
    setSubmitStatus('idle');

    const canonicalPhone = normalizePhoneNumber(formData.phone);

    const result = await submitRegistration({
      eventId: 'biniyog-adda-2026-11-14',
      name: formData.name,
      phoneNormalized: canonicalPhone,
      occupation: formData.occupation,
      area: formData.area,
      email: formData.email,
      interest: formData.interest,
      consentGiven: formData.consent,
      honeypot: formData.honeypot,
      source: 'direct',
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmitStatus('success');
      setTimeout(() => {
        statusHeadingRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      setSubmitStatus('error');
      setGeneralErrorMessage(result.error || 'তথ্য জমা হয়নি। আপনার লেখা তথ্য রেখে দেওয়া হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <section id="registration" className="py-16 sm:py-28 border-b border-[#204E3C]/60 relative scroll-mt-20">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#14392B]/35 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[760px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Form Container (Posh Glass RSVP Card) */}
        <div className="posh-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-luxury-glow relative">
          
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-[#204E3C]/60">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C9A66B] mb-2 inline-block">
              প্রাথমিক আগ্রহ নিবন্ধন
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif-bn font-bold text-white mt-1 mb-2 sm:mb-3">
              অংশ নিতে আগ্রহী?
            </h2>
            <p className="text-base sm:text-lg text-[#D1E2D9] max-w-lg mx-auto leading-relaxed">
              নিচের ফর্মে আপনার তথ্য দিন। আয়োজনের বিস্তারিত চূড়ান্ত হলে আপনার সঙ্গে যোগাযোগ করা হবে।
            </p>
          </div>

          {/* Backend Status Notice if not configured */}
          {!backendReady && (
            <div className="mb-6 sm:mb-8 p-4 rounded-xl bg-[#143026]/90 border border-[#C9A66B]/35 text-[#F5E5C9] text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#C9A66B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">ডাটাবেজ সংযোগ অপেক্ষমান</p>
                <p className="text-[#D1E2D9] text-xs sm:text-[13px] mt-1 leading-relaxed">
                  সিস্টেমের সততা বজায় রাখতে কোনো কৃত্রিম বার্তা দেখানো হচ্ছে না। `.env` ফাইলে Supabase ক্রেডেনশিয়াল যুক্ত করামাত্র আগ্রহ সরাসরি আপনার ডাটাবেজে জমা হবে।
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {submitStatus === 'success' ? (
            <div className="text-center py-8 sm:py-10 px-2 sm:px-4 space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C9A66B] to-[#9A773F] text-[#06130E] rounded-full flex items-center justify-center mx-auto shadow-button-gold">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 ref={statusHeadingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-serif-bn font-bold text-white">
                আপনার আগ্রহ নিবন্ধিত হয়েছে।
              </h3>
              <p className="text-base sm:text-lg text-[#D1E2D9] leading-relaxed max-w-md mx-auto">
                আয়োজনের বিস্তারিত চূড়ান্ত হলে যোগাযোগ করা হবে। এটি আসন নিশ্চিতকরণ নয়।
              </p>
              <div className="pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitStatus('idle');
                    setFormData({
                      name: '',
                      phone: '',
                      occupation: 'চাকরিজীবী',
                      area: '',
                      email: '',
                      interest: '',
                      consent: false,
                      honeypot: '',
                    });
                  }}
                  className="text-sm font-semibold text-[#C9A66B] hover:text-[#F5E5C9] underline underline-offset-4 min-h-[44px] inline-flex items-center"
                >
                  প্রয়োজনে আরেকটি তথ্য জমা দিন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
              
              {/* Overall Failure Alert */}
              {submitStatus === 'error' && (
                <div role="alert" className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-100 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">ত্রুটি</p>
                    <p className="mt-0.5 text-xs sm:text-[13px]">
                      {generalErrorMessage || 'তথ্য জমা হয়নি। আপনার লেখা তথ্য রেখে দেওয়া হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'}
                    </p>
                  </div>
                </div>
              )}

              {/* Honeypot field (hidden from screen reader & visuals) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_url">Website URL (leave blank)</label>
                <input
                  id="website_url"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              {/* 1. Name */}
              <div>
                <label htmlFor="name" className="block text-sm sm:text-[15px] font-semibold text-white mb-1.5">
                  আপনার নাম <span className="text-[#C9A66B] font-bold" aria-label="আবশ্যক">*</span>
                </label>
                <input
                  ref={nameRef}
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="যেমন: মোঃ কামরুল হাসান"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl border text-base text-white placeholder:text-[#88A698] transition-all min-h-[48px] bg-[#05140F] focus:bg-[#081E16] ${
                    fieldErrors.name 
                      ? 'border-rose-500 bg-rose-950/20' 
                      : 'border-[#204E3C] focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.name}</p>
                )}
              </div>

              {/* 2. Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm sm:text-[15px] font-semibold text-white mb-1.5">
                  মোবাইল / WhatsApp নম্বর <span className="text-[#C9A66B] font-bold" aria-label="আবশ্যক">*</span>
                </label>
                <input
                  ref={phoneRef}
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl border text-base text-white placeholder:text-[#88A698] transition-all min-h-[48px] bg-[#05140F] focus:bg-[#081E16] ${
                    fieldErrors.phone 
                      ? 'border-rose-500 bg-rose-950/20' 
                      : 'border-[#204E3C] focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]'
                  }`}
                />
                <span className="text-xs text-[#95B2A4] block mt-1">
                  বাংলা বা ইংরেজি উভয় সংখ্যা গ্রহণযোগ্য (যেমন: 01712345678 বা ০১৭১২৩৪৫৬৭৮)
                </span>
                {fieldErrors.phone && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.phone}</p>
                )}
              </div>

              {/* 3. Occupation */}
              <div>
                <label htmlFor="occupation" className="block text-sm sm:text-[15px] font-semibold text-white mb-1.5">
                  আপনার পেশা <span className="text-[#C9A66B] font-bold" aria-label="আবশ্যক">*</span>
                </label>
                <select
                  id="occupation"
                  required
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#204E3C] bg-[#05140F] text-base text-white focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B] transition-all min-h-[48px]"
                >
                  <option value="চাকরিজীবী" className="bg-[#06130E] text-white">চাকরিজীবী</option>
                  <option value="ব্যবসায়ী বা উদ্যোক্তা" className="bg-[#06130E] text-white">ব্যবসায়ী বা উদ্যোক্তা</option>
                  <option value="ফ্রিল্যান্সার" className="bg-[#06130E] text-white">ফ্রিল্যান্সার</option>
                  <option value="শিক্ষার্থী" className="bg-[#06130E] text-white">শিক্ষার্থী</option>
                  <option value="অন্যান্য" className="bg-[#06130E] text-white">অন্যান্য</option>
                </select>
                {fieldErrors.occupation && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.occupation}</p>
                )}
              </div>

              {/* 4. Area / District */}
              <div>
                <label htmlFor="area" className="block text-sm sm:text-[15px] font-semibold text-white mb-1.5">
                  এলাকা / জেলা <span className="text-[#C9A66B] font-bold" aria-label="আবশ্যক">*</span>
                </label>
                <input
                  ref={areaRef}
                  id="area"
                  type="text"
                  required
                  placeholder="যেমন: ধানমন্ডি, ঢাকা"
                  value={formData.area}
                  onChange={(e) => {
                    setFormData({ ...formData, area: e.target.value });
                    if (fieldErrors.area) setFieldErrors({ ...fieldErrors, area: '' });
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl border text-base text-white placeholder:text-[#88A698] transition-all min-h-[48px] bg-[#05140F] focus:bg-[#081E16] ${
                    fieldErrors.area 
                      ? 'border-rose-500 bg-rose-950/20' 
                      : 'border-[#204E3C] focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]'
                  }`}
                />
                {fieldErrors.area && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.area}</p>
                )}
              </div>

              {/* 5. Email (Optional) */}
              <div>
                <label htmlFor="email" className="block text-sm sm:text-[15px] font-semibold text-white mb-1.5">
                  ইমেইল <span className="text-xs text-[#A9C4B7] font-normal">(ঐচ্ছিক)</span>
                </label>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl border text-base text-white placeholder:text-[#88A698] transition-all min-h-[48px] bg-[#05140F] focus:bg-[#081E16] ${
                    fieldErrors.email 
                      ? 'border-rose-500 bg-rose-950/20' 
                      : 'border-[#204E3C] focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* 6. Interest textarea (Optional) */}
              <div>
                <label htmlFor="interest" className="block text-sm sm:text-[15px] font-semibold text-white mb-1.5">
                  কোন বিষয়টি জানতে বেশি আগ্রহী? <span className="text-xs text-[#A9C4B7] font-normal">(ঐচ্ছিক)</span>
                </label>
                <textarea
                  id="interest"
                  rows={3}
                  maxLength={800}
                  placeholder="আপনার কোনো নির্দিষ্ট প্রশ্ন বা জানার বিষয় থাকলে এখানে লিখতে পারেন..."
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#204E3C] bg-[#05140F] focus:bg-[#081E16] text-base text-white placeholder:text-[#88A698] focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B] transition-all"
                />
                <span className="text-xs text-[#95B2A4] block text-right mt-1">
                  {formData.interest.length}/৮০০ অক্ষর
                </span>
              </div>

              {/* 7. Explicit Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer select-none min-h-[44px]">
                  <input
                    ref={consentRef}
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => {
                      setFormData({ ...formData, consent: e.target.checked });
                      if (fieldErrors.consent) setFieldErrors({ ...fieldErrors, consent: '' });
                    }}
                    className="mt-1 w-5 h-5 rounded border-[#204E3C] bg-[#05140F] text-[#C9A66B] focus:ring-[#C9A66B] cursor-pointer flex-shrink-0"
                  />
                  <span className="text-sm sm:text-[15px] text-[#D8E8DF] leading-relaxed">
                    এই আয়োজনের বিস্তারিত জানাতে আমার সঙ্গে যোগাযোগ করা যাবে। এটি প্রাথমিক আগ্রহ নিবন্ধন এবং এতে আসন নিশ্চিত হচ্ছে না—তা বুঝেছি। <span className="text-[#C9A66B] font-bold">*</span>
                  </span>
                </label>
                {fieldErrors.consent && (
                  <p className="mt-1 text-xs text-rose-400 font-medium pl-8">{fieldErrors.consent}</p>
                )}
              </div>

              {/* Privacy Note */}
              <div className="p-4 bg-white/[0.04] rounded-xl text-xs sm:text-[13px] text-[#B4CCC1] flex items-start gap-3 border border-[#204E3C]/60">
                <Lock className="w-4 h-4 text-[#C9A66B] flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  আপনার দেওয়া তথ্য শুধু এই আয়োজনের যোগাযোগ ও প্রস্তুতির কাজে ব্যবহার করা হবে। নিবন্ধনের তথ্য প্রকাশ্যে দেখানো হবে না।
                </p>
              </div>

              {/* Pre-submit Note */}
              <div className="text-center text-sm sm:text-base font-bold text-[#F7E7CD] px-2">
                এখন কোনো অর্থ দিতে হবে না। এটি আসন নিশ্চিতকরণ নয়।
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all duration-300 shadow-button-gold min-h-[52px] ${
                  isSubmitting
                    ? 'bg-[#C9A66B]/60 text-[#06130E] cursor-wait'
                    : 'bg-gradient-to-r from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#06130E] hover:brightness-110 active:translate-y-[1px]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#06130E] border-t-transparent rounded-full animate-spin"></span>
                    <span>তথ্য পাঠানো হচ্ছে…</span>
                  </>
                ) : (
                  <>
                    <span>আগ্রহ নিবন্ধন করুন</span>
                    <ArrowRight className="w-4 h-4 text-[#06130E] flex-shrink-0" />
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
