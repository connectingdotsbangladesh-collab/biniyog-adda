import React, { useState, useRef } from 'react';
import { eventConfig } from '../config/event';
import { normalizePhoneNumber, isValidBdMobile } from '../utils/phone';
import { submitRegistration } from '../lib/supabase';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Info,
  Copy,
  Check,
  Wallet,
  Receipt,
} from 'lucide-react';

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    occupation: 'চাকরিজীবী',
    area: '',
    email: '',
    paymentMethod: 'bKash' as 'bKash' | 'Nagad',
    paymentSenderPhone: '',
    transactionId: '',
    interest: '',
    consent: false,
    honeypot: '',
  });

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submittedSummary, setSubmittedSummary] = useState<{
    name: string;
    phone: string;
    paymentMethod: string;
    paymentSenderPhone: string;
    transactionId: string;
  } | null>(null);
  const [generalErrorMessage, setGeneralErrorMessage] = useState('');

  // Refs for focusing first invalid input
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const senderPhoneRef = useRef<HTMLInputElement>(null);
  const trxRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const statusHeadingRef = useRef<HTMLHeadingElement>(null);

  const handleCopyPaymentNumber = async () => {
    try {
      await navigator.clipboard.writeText(eventConfig.payment.personalNumber);
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2500);
    } catch {
      // Fallback ignored
    }
  };

  if (!eventConfig.registrationOpen) {
    return (
      <section id="registration" className="py-16 sm:py-28 border-b border-[#204E3C]/60">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="posh-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#204E3C] shadow-luxury-glow">
            <Info className="w-10 h-10 sm:w-12 sm:h-12 text-[#C9A66B] mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-3xl font-bengali font-bold text-white mb-2 sm:mb-3">
              নিবন্ধন বন্ধ রয়েছে
            </h2>
            <p className="text-base text-[#D1E2D9]">
              এই অনুষ্ঠানের আসন নিবন্ধন আপাতত বন্ধ রয়েছে। পরবর্তী ঘোষণার জন্য অপেক্ষা করুন।
            </p>
          </div>
        </div>
      </section>
    );
  }

  const validate = () => {
    const errors: Record<string, string> = {};

    const cleanName = formData.name.trim();
    if (!cleanName || cleanName.length < 2) {
      errors.name = 'আপনার সঠিক নাম লিখুন (কমপক্ষে ২ অক্ষর)।';
    } else if (cleanName.length > 100) {
      errors.name = 'নাম সর্বোচ্চ ১০০ অক্ষরের মধ্যে লিখুন।';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'মোবাইল / WhatsApp নম্বর দেওয়া আবশ্যক।';
    } else if (!isValidBdMobile(formData.phone)) {
      errors.phone = 'সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন।';
    }

    if (!formData.occupation) {
      errors.occupation = 'আপনার পেশা নির্বাচন করুন।';
    }

    const cleanArea = formData.area.trim();
    if (!cleanArea) {
      errors.area = 'আপনার এলাকা বা জেলা উল্লেখ করুন।';
    } else if (cleanArea.length > 120) {
      errors.area = 'এলাকা বা জেলা সর্বোচ্চ ১২০ অক্ষরের মধ্যে লিখুন।';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'সঠিক ইমেইল ঠিকানা দিন অথবা ফাঁকা রাখুন।';
      }
    }

    if (!formData.paymentSenderPhone.trim()) {
      errors.paymentSenderPhone = 'যে নম্বর থেকে ৩৯০ টাকা পাঠিয়েছেন, সেই নম্বরটি লিখুন।';
    } else if (!isValidBdMobile(formData.paymentSenderPhone)) {
      errors.paymentSenderPhone = 'সঠিক ১১ ডিজিটের বাংলাদেশি বিকাশ/নগদ নম্বর লিখুন।';
    }

    const cleanTrx = formData.transactionId.trim();
    if (!cleanTrx || cleanTrx.length < 4) {
      errors.transactionId = 'সঠিক ট্রানজ্যাকশন আইডি (Transaction ID) লিখুন।';
    } else if (cleanTrx.length > 40) {
      errors.transactionId = 'সঠিক ট্রানজ্যাকশন আইডি দিন (সর্বোচ্চ ৪০ অক্ষর)।';
    }

    if (formData.interest.length > 800) {
      errors.interest = 'সর্বোচ্চ ৮০০ অক্ষরের মধ্যে লিখুন।';
    }

    if (!formData.consent) {
      errors.consent = 'সম্মতি চেকবক্সে টিক চিহ্ন দেওয়া আবশ্যক।';
    }

    setFieldErrors(errors);

    if (errors.name && nameRef.current) nameRef.current.focus();
    else if (errors.phone && phoneRef.current) phoneRef.current.focus();
    else if (errors.area && areaRef.current) areaRef.current.focus();
    else if (errors.email && emailRef.current) emailRef.current.focus();
    else if (errors.paymentSenderPhone && senderPhoneRef.current) senderPhoneRef.current.focus();
    else if (errors.transactionId && trxRef.current) trxRef.current.focus();
    else if (errors.consent && consentRef.current) consentRef.current.focus();

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralErrorMessage('');
    setSubmitStatus('idle');

    const canonicalPhone = normalizePhoneNumber(formData.phone);
    const canonicalSenderPhone = normalizePhoneNumber(formData.paymentSenderPhone);
    const cleanTrx = formData.transactionId.trim().toUpperCase();

    const result = await submitRegistration({
      eventId: eventConfig.eventId,
      name: formData.name,
      phoneNormalized: canonicalPhone,
      occupation: formData.occupation,
      area: formData.area,
      email: formData.email,
      interest: formData.interest,
      paymentMethod: formData.paymentMethod,
      paymentSenderPhone: canonicalSenderPhone,
      transactionId: cleanTrx,
      consentGiven: formData.consent,
      honeypot: formData.honeypot,
      source: 'direct',
    });

    setIsSubmitting(false);

    if (result.success) {
      setSubmittedSummary({
        name: formData.name.trim(),
        phone: canonicalPhone,
        paymentMethod: formData.paymentMethod,
        paymentSenderPhone: canonicalSenderPhone,
        transactionId: cleanTrx,
      });
      setSubmitStatus('success');
      setTimeout(() => {
        statusHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } else {
      setSubmitStatus('error');
      setGeneralErrorMessage(
        result.error || 'তথ্য জমা হয়নি। আপনার লেখা তথ্য রেখে দেওয়া হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
      );
    }
  };

  return (
    <section id="registration" className="py-16 sm:py-28 border-b border-[#204E3C]/60 relative scroll-mt-20">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#14392B]/35 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[780px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Form Container (Posh Glass RSVP Card) */}
        <div className="posh-glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-11 shadow-luxury-glow relative">
          
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b border-[#204E3C]/60">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#C9A66B] mb-2 inline-block">
              আসন নিবন্ধন ও পেমেন্ট ফর্ম
            </span>
            <h2 className="text-2xl sm:text-4xl font-bengali font-bold text-white mt-1 mb-2.5">
              {eventConfig.eventName}-এ অংশ নিতে চান?
            </h2>
            <p className="text-sm sm:text-base text-[#D1E2D9] max-w-lg mx-auto leading-relaxed">
              প্রথমে নিচের পার্সোনাল নম্বরে <strong className="text-[#F5E5C9]">৩৯০ টাকা</strong> পাঠান এবং আপনার ট্রানজ্যাকশন আইডিসহ নিচের ফর্মটি পূরণ করুন।
            </p>
          </div>

          {/* Success State */}
          {submitStatus === 'success' && submittedSummary ? (
            <div className="text-center py-6 sm:py-8 px-2 sm:px-4 space-y-5">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C9A66B] to-[#9A773F] text-[#06130E] rounded-full flex items-center justify-center mx-auto shadow-button-gold">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 ref={statusHeadingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bengali font-bold text-white">
                আপনার নিবন্ধন ও পেমেন্ট তথ্য জমা হয়েছে!
              </h3>
              <p className="text-sm sm:text-base text-[#D1E2D9] leading-relaxed max-w-md mx-auto">
                ধন্যবাদ <strong className="text-white">{submittedSummary.name}</strong>। আমাদের টিম ট্রানজ্যাকশনটি যাচাই করে শীঘ্রই আপনার মোবাইল/হোয়াটসঅ্যাপ নম্বরে আসন নিশ্চিতকরণ বার্তা পাঠাবে।
              </p>

              {/* Submitted Receipt Summary */}
              <div className="max-w-md mx-auto bg-[#05140F] border border-[#204E3C] rounded-2xl p-4 sm:p-5 text-left space-y-2.5 text-sm">
                <div className="flex justify-between border-b border-[#204E3C]/50 pb-2">
                  <span className="text-[#A9C4B7]">পেমেন্ট মাধ্যম</span>
                  <span className="font-bold text-[#F5E5C9]">{submittedSummary.paymentMethod} (৳৩৯০)</span>
                </div>
                <div className="flex justify-between border-b border-[#204E3C]/50 pb-2">
                  <span className="text-[#A9C4B7]">প্রেরকের নম্বর</span>
                  <span className="font-mono font-semibold text-white">{submittedSummary.paymentSenderPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A9C4B7]">ট্রানজ্যাকশন আইডি</span>
                  <span className="font-mono font-bold text-emerald-400">{submittedSummary.transactionId}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitStatus('idle');
                    setSubmittedSummary(null);
                    setFormData({
                      name: '',
                      phone: '',
                      occupation: 'চাকরিজীবী',
                      area: '',
                      email: '',
                      paymentMethod: 'bKash',
                      paymentSenderPhone: '',
                      transactionId: '',
                      interest: '',
                      consent: false,
                      honeypot: '',
                    });
                  }}
                  className="text-sm font-semibold text-[#C9A66B] hover:text-[#F5E5C9] underline underline-offset-4 min-h-[44px] inline-flex items-center"
                >
                  প্রয়োজনে আরেকজনের নিবন্ধন করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Payment Instructions Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0F2C21] via-[#091D16] to-[#071510] border border-[#C9A66B]/45 shadow-lg space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#C9A66B]/20 border border-[#C9A66B]/40 flex items-center justify-center text-[#C9A66B]">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bengali font-bold text-white">
                        পেমেন্ট নির্দেশনা (এন্ট্রি ফি: ৳৩৯০)
                      </h3>
                      <p className="text-xs text-[#B9D8CA]">বিকাশ অথবা নগদ — Send Money (Personal)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#E2136E]/20 text-pink-200 border border-[#E2136E]/40 text-xs font-bold">
                      bKash
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#F7941D]/20 text-amber-200 border border-[#F7941D]/40 text-xs font-bold">
                      Nagad
                    </span>
                  </div>
                </div>

                {/* Highlighted Copyable Number Box */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-[#040E0A] border border-[#204E3C]">
                  <div className="text-center sm:text-left">
                    <span className="text-[11px] uppercase tracking-wider text-[#A9C4B7] block">
                      পার্সোনাল বিকাশ ও নগদ নম্বর
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-[#F5E5C9] tracking-wider">
                      {eventConfig.payment.personalNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPaymentNumber}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A66B]/15 hover:bg-[#C9A66B] text-[#F5E5C9] hover:text-[#06130E] border border-[#C9A66B]/45 text-xs sm:text-sm font-bold transition-all min-h-[42px]"
                  >
                    {copiedNumber ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>নম্বর কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-[13px] text-[#D1E2D9] leading-relaxed">
                  উপরের পার্সোনাল নম্বরে <strong className="text-white">৩৯০ টাকা Send Money</strong> করে নিচের ফর্মে আপনার ব্যবহৃত নম্বর এবং <strong className="text-[#F5E5C9]">Transaction ID (TrxID)</strong> সঠিকভাবে লিখুন।
                </p>
              </div>

              {/* Overall Failure Alert */}
              {submitStatus === 'error' && (
                <div role="alert" className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-100 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">ত্রুটি</p>
                    <p className="mt-0.5 text-xs sm:text-[13px]">
                      {generalErrorMessage || 'তথ্য জমা হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'}
                    </p>
                  </div>
                </div>
              )}

              {/* Honeypot field */}
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

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    placeholder="যেমন: মিরপুর, ঢাকা"
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

              {/* PAYMENT DETAILS SUB-CARD */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#04110C] border border-[#204E3C] space-y-5">
                <div className="flex items-center gap-2 border-b border-[#204E3C]/60 pb-3">
                  <Receipt className="w-5 h-5 text-[#C9A66B]" />
                  <h4 className="text-base sm:text-lg font-bengali font-bold text-[#F5E5C9]">
                    পেমেন্ট যাচাইকরণ তথ্য (৳৩৯০)
                  </h4>
                </div>

                {/* Method Picker */}
                <div>
                  <span className="block text-sm font-semibold text-white mb-2">
                    কোন মাধ্যমে টাকা পাঠিয়েছেন? <span className="text-[#C9A66B]">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {(['bKash', 'Nagad'] as const).map((method) => {
                      const active = formData.paymentMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: method })}
                          className={`py-3 px-4 rounded-xl border text-sm sm:text-base font-bold transition-all min-h-[48px] flex items-center justify-center gap-2 ${
                            active
                              ? method === 'bKash'
                                ? 'bg-[#E2136E]/20 border-[#E2136E] text-white shadow-inner'
                                : 'bg-[#F7941D]/20 border-[#F7941D] text-white shadow-inner'
                              : 'bg-[#06130E] border-[#204E3C] text-[#A9C4B7] hover:border-[#C9A66B]/40'
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              active
                                ? method === 'bKash'
                                  ? 'bg-[#E2136E]'
                                  : 'bg-[#F7941D]'
                                : 'bg-[#204E3C]'
                            }`}
                          ></span>
                          <span>{method === 'bKash' ? 'বিকাশ (bKash)' : 'নগদ (Nagad)'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Sender Phone */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="paymentSenderPhone" className="block text-sm font-semibold text-white">
                        যে নম্বর থেকে পাঠানো হয়েছে <span className="text-[#C9A66B]">*</span>
                      </label>
                      {formData.phone && isValidBdMobile(formData.phone) && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, paymentSenderPhone: formData.phone });
                            if (fieldErrors.paymentSenderPhone) {
                              setFieldErrors({ ...fieldErrors, paymentSenderPhone: '' });
                            }
                          }}
                          className="text-[11px] font-semibold text-[#C9A66B] hover:text-[#F5E5C9] underline"
                        >
                          নিজের নম্বরটি বসান
                        </button>
                      )}
                    </div>
                    <input
                      ref={senderPhoneRef}
                      id="paymentSenderPhone"
                      type="tel"
                      required
                      inputMode="tel"
                      placeholder="01XXXXXXXXX"
                      value={formData.paymentSenderPhone}
                      onChange={(e) => {
                        setFormData({ ...formData, paymentSenderPhone: e.target.value });
                        if (fieldErrors.paymentSenderPhone) {
                          setFieldErrors({ ...fieldErrors, paymentSenderPhone: '' });
                        }
                      }}
                      className={`w-full px-4 py-3.5 rounded-xl border text-base text-white placeholder:text-[#88A698] transition-all min-h-[48px] bg-[#06130E] font-mono ${
                        fieldErrors.paymentSenderPhone
                          ? 'border-rose-500 bg-rose-950/20'
                          : 'border-[#204E3C] focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]'
                      }`}
                    />
                    {fieldErrors.paymentSenderPhone && (
                      <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.paymentSenderPhone}</p>
                    )}
                  </div>

                  {/* Transaction ID */}
                  <div>
                    <label htmlFor="transactionId" className="block text-sm font-semibold text-white mb-1.5">
                      ট্রানজ্যাকশন আইডি (TrxID) <span className="text-[#C9A66B]">*</span>
                    </label>
                    <input
                      ref={trxRef}
                      id="transactionId"
                      type="text"
                      required
                      placeholder="যেমন: BKA7X92MP1"
                      value={formData.transactionId}
                      onChange={(e) => {
                        setFormData({ ...formData, transactionId: e.target.value });
                        if (fieldErrors.transactionId) {
                          setFieldErrors({ ...fieldErrors, transactionId: '' });
                        }
                      }}
                      className={`w-full px-4 py-3.5 rounded-xl border text-base text-white placeholder:text-[#88A698] transition-all min-h-[48px] bg-[#06130E] font-mono uppercase ${
                        fieldErrors.transactionId
                          ? 'border-rose-500 bg-rose-950/20'
                          : 'border-[#204E3C] focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B]'
                      }`}
                    />
                    {fieldErrors.transactionId && (
                      <p className="mt-1.5 text-xs text-rose-400 font-medium">{fieldErrors.transactionId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Question / Interest textarea (Optional) */}
              <div>
                <label htmlFor="interest" className="block text-sm sm:text-[15px] font-semibold text-white mb-1.5">
                  প্রশ্নোত্তর পর্ব (Q&A)-এর জন্য কোনো প্রশ্ন বা প্রত্যাশা <span className="text-xs text-[#A9C4B7] font-normal">(ঐচ্ছিক)</span>
                </label>
                <textarea
                  id="interest"
                  rows={3}
                  maxLength={800}
                  placeholder="প্রোগ্রামে কোনো নির্দিষ্ট বিষয়ে প্রশ্ন করতে চাইলে আগে থেকেই এখানে লিখে রাখতে পারেন..."
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-[#204E3C] bg-[#05140F] focus:bg-[#081E16] text-base text-white placeholder:text-[#88A698] focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B] transition-all"
                />
                <span className="text-xs text-[#95B2A4] block text-right mt-1">
                  {formData.interest.length}/৮০০ অক্ষর
                </span>
              </div>

              {/* Explicit Consent Checkbox */}
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
                    আমি <strong className="font-mono text-[#F5E5C9]">{eventConfig.payment.personalNumber}</strong> নম্বরে ৩৯০ টাকা পাঠিয়ে সঠিক ট্রানজ্যাকশন আইডি দিয়েছি এবং অনুষ্ঠানের যোগাযোগের জন্য আমার তথ্য ব্যবহারে সম্মতি দিচ্ছি। <span className="text-[#C9A66B] font-bold">*</span>
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
                  আপনার প্রদত্ত ট্রানজ্যাকশন ও ব্যক্তিগত তথ্য শুধুমাত্র অর্থালাপ প্রোগ্রামের আসন নিশ্চিতকরণ ও যোগাযোগের জন্য সংরক্ষিত থাকবে।
                </p>
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
                    <span>নিবন্ধন জমা হচ্ছে…</span>
                  </>
                ) : (
                  <>
                    <span>নিবন্ধন ও পেমেন্ট তথ্য জমা দিন</span>
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
