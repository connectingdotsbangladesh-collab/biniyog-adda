import React, { useState, useEffect, useMemo } from 'react';
import {
  getStoredApplicants,
  updateApplicantStatusLocally,
  saveApplicantLocally,
  type StoredApplicant,
  isBackendConfigured,
  supabase,
} from '../lib/supabase';
import { exportToCsv } from '../utils/csv';
import {
  Users,
  Search,
  Download,
  LogOut,
  ArrowLeft,
  Eye,
  KeyRound,
  RefreshCw,
  PhoneCall,
  MessageCircle,
  X,
  Briefcase,
  MapPin,
  Mail,
  UserPlus
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

const ORGANIZER_PASSCODES = ['orthalaap2026', 'biniyog2026'];
const AUTH_STORAGE_KEY = 'biniyog_adda_admin_auth_v1';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [loginMode, setLoginMode] = useState<'passcode' | 'supabase'>('passcode');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [applicants, setApplicants] = useState<StoredApplicant[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [occupationFilter, setOccupationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal state
  const [selectedApplicant, setSelectedApplicant] = useState<StoredApplicant | null>(null);

  // Manual Add Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newApplicantForm, setNewApplicantForm] = useState({
    name: '',
    phone: '',
    occupation: 'চাকরিজীবী',
    area: '',
    email: '',
    interest: '',
  });

  // Load applicants
  const loadApplicants = async () => {
    setIsLoadingData(true);

    // 1. Load from local durable storage first
    let list = getStoredApplicants();

    // 2. If Supabase is configured, fetch from cloud
    if (isBackendConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          list = data as StoredApplicant[];
        }
      } catch (err) {
        console.warn('Supabase fetch error, using local:', err);
      }
    }

    setApplicants(list);
    setIsLoadingData(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadApplicants();
    }
  }, [isAuthenticated]);

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ORGANIZER_PASSCODES.includes(enteredPasscode.trim().toLowerCase())) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setAuthError('');
    } else {
      setAuthError('ভুল পাসকোড! সঠিক আয়োজক পাসকোড প্রদান করুন।');
    }
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBackendConfigured() || !supabase) {
      setAuthError('Supabase সংযোগ সক্রিয় নয়। দয়া করে পাসকোড দিয়ে প্রবেশ করুন।');
      return;
    }

    setIsLoggingIn(true);
    setAuthError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    setIsLoggingIn(false);

    if (error) {
      setAuthError('লগইন ব্যর্থ হয়েছে। সঠিক ইমেইল ও পাসওয়ার্ড প্রদান করুন।');
    } else {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
  };

  // Change Applicant Status
  const handleStatusChange = async (
    id: string,
    newStatus: 'interested' | 'contacted' | 'confirmed' | 'cancelled'
  ) => {
    // 1. Update locally
    updateApplicantStatusLocally(id, newStatus);

    // 2. Update state
    setApplicants((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus, status_updated_at: new Date().toISOString() }
          : item
      )
    );

    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant((prev) =>
        prev
          ? { ...prev, status: newStatus, status_updated_at: new Date().toISOString() }
          : null
      );
    }

    // 3. Update in Supabase if connected
    if (isBackendConfigured() && supabase) {
      try {
        await supabase
          .from('registrations')
          .update({
            status: newStatus,
            status_updated_at: new Date().toISOString(),
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Could not sync status update to Supabase:', err);
      }
    }
  };

  // Handle Manual Add Applicant
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicantForm.name.trim() || !newApplicantForm.phone.trim()) {
      alert('নাম ও মোবাইল নম্বর দেওয়া আবশ্যক।');
      return;
    }

    const saved = saveApplicantLocally({
      eventId: 'biniyog-adda-2026-11-14',
      name: newApplicantForm.name,
      phoneNormalized: newApplicantForm.phone.replace(/[^0-9]/g, ''),
      occupation: newApplicantForm.occupation,
      area: newApplicantForm.area || 'ঢাকা',
      email: newApplicantForm.email,
      interest: newApplicantForm.interest,
      consentGiven: true,
      source: 'manual',
    });

    setApplicants((prev) => [saved, ...prev]);
    setIsAddModalOpen(false);
    setNewApplicantForm({
      name: '',
      phone: '',
      occupation: 'চাকরিজীবী',
      area: '',
      email: '',
      interest: '',
    });
  };

  // Filtered List
  const filteredApplicants = useMemo(() => {
    return applicants.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone_normalized.includes(searchQuery);

      const matchOccupation = occupationFilter === 'all' || item.occupation === occupationFilter;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchSearch && matchOccupation && matchStatus;
    });
  }, [applicants, searchQuery, occupationFilter, statusFilter]);

  // Export CSV with UTF-8 BOM
  const handleExportCsv = () => {
    const headers = [
      'আইডি',
      'নাম',
      'মোবাইল নম্বর',
      'পেশা',
      'এলাকা/জেলা',
      'ইমেইল',
      'আগ্রহ ও প্রশ্ন',
      'বর্তমান স্ট্যাটাস',
      'নিবন্ধনের সময় (UTC)',
    ];

    const rows = filteredApplicants.map((item) => [
      item.id,
      item.name,
      item.phone_normalized,
      item.occupation,
      item.area,
      item.email || '',
      item.interest || '',
      item.status,
      item.created_at,
    ]);

    const timestamp = new Date().toISOString().slice(0, 10);
    exportToCsv(`orthalaap_applicants_${timestamp}.csv`, headers, rows);
  };

  // WhatsApp quick chat helper
  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanNumber = phone.startsWith('0') ? '88' + phone : phone;
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম ${name} ভাই/আপু, অর্থালাপ (১৪ নভেম্বর ২০২৬) অফলাইন কর্মশালায় আপনার প্রাথমিক আগ্রহ নিবন্ধনের জন্য ধন্যবাদ। বিস্তারিত আলোচনার জন্য যোগাযোগ করছি।`
    );
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  // If NOT authenticated, show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06130E] text-[#F8F5EE] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1E523F]/30 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="w-full max-w-md posh-glass-card rounded-2xl p-7 sm:p-9 shadow-luxury-glow relative z-10 border border-[#204E3C]">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#06130E] rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-button-gold">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-serif-bn font-bold text-white">
              আয়োজক অ্যাডমিন প্যানেল
            </h1>
            <p className="text-xs sm:text-sm text-[#A9C4B7] mt-1">
              অর্থালাপ — আবেদনকারী তালিকা ও ব্যবস্থাপনা
            </p>
          </div>

          {/* Login Tabs */}
          <div className="flex rounded-xl bg-black/40 p-1 mb-5 border border-[#204E3C]/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginMode('passcode');
                setAuthError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                loginMode === 'passcode'
                  ? 'bg-gradient-to-r from-[#C9A66B] to-[#9A773F] text-[#06130E] font-bold shadow'
                  : 'text-[#A9C4B7] hover:text-white'
              }`}
            >
              পাসকোড লগইন
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('supabase');
                setAuthError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                loginMode === 'supabase'
                  ? 'bg-gradient-to-r from-[#C9A66B] to-[#9A773F] text-[#06130E] font-bold shadow'
                  : 'text-[#A9C4B7] hover:text-white'
              }`}
            >
              Supabase অ্যাকাউন্ট
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs">
              {authError}
            </div>
          )}

          {loginMode === 'passcode' ? (
            <form onSubmit={handlePasscodeLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  আয়োজক মাস্টার পাসকোড
                </label>
                <input
                  type="password"
                  required
                  placeholder="পাসকোড লিখুন..."
                  value={enteredPasscode}
                  onChange={(e) => setEnteredPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#204E3C] bg-[#05140F] text-white text-base focus:border-[#C9A66B] focus:ring-1 focus:ring-[#C9A66B] transition-all"
                />
                <span className="text-[11px] text-[#A9C4B7] block mt-1">
                  ডিফল্ট পাসকোড: <code className="text-[#C9A66B] font-mono">orthalaap2026</code> (অথবা <code className="text-[#C9A66B]/80 font-mono">biniyog2026</code>)
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#06130E] font-bold text-sm rounded-xl shadow-button-gold hover:brightness-110 active:translate-y-[1px] transition-all"
              >
                প্যানেলে প্রবেশ করুন
              </button>
            </form>
          ) : (
            <form onSubmit={handleSupabaseLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  আয়োজক ইমেইল
                </label>
                <input
                  type="email"
                  required
                  placeholder="organizer@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#204E3C] bg-[#05140F] text-white text-base focus:border-[#C9A66B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  required
                  placeholder="পাসওয়ার্ড লিখুন..."
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#204E3C] bg-[#05140F] text-white text-base focus:border-[#C9A66B]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-gradient-to-r from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#06130E] font-bold text-sm rounded-xl shadow-button-gold hover:brightness-110 active:translate-y-[1px] transition-all"
              >
                {isLoggingIn ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[#204E3C]/60 text-center">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A9C4B7] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>মূল ওয়েবসাইটে ফিরে যান</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard View
  return (
    <div className="min-h-screen bg-[#06130E] text-[#F8F5EE] pb-20 relative overflow-x-hidden">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#06130E]/90 backdrop-blur-xl border-b border-[#204E3C] shadow-lg">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBackToSite}
              className="p-2 rounded-xl bg-white/[0.04] border border-[#204E3C] hover:border-[#C9A66B]/50 text-[#D1E2D9] hover:text-white transition-colors"
              title="ওয়েবসাইটে যান"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-bengali font-bold text-white">অর্থালাপ</span>
                <span className="text-[10px] sm:text-xs font-mono font-bold bg-[#C9A66B]/20 text-[#F5E5C9] border border-[#C9A66B]/40 px-2 py-0.5 rounded-full">
                  ADMIN PORTAL
                </span>
              </div>
              <span className="text-xs text-[#A9C4B7] hidden sm:block">
                আবেদনকারী তথ্য ও যোগাযোগ নিয়ন্ত্রণ প্যানেল
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-[#204E3C] hover:border-[#C9A66B]/50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all"
            >
              <UserPlus className="w-4 h-4 text-[#C9A66B]" />
              <span className="hidden md:inline">নতুন আবেদন যোগ</span>
            </button>

            <button
              onClick={loadApplicants}
              disabled={isLoadingData}
              className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-[#204E3C] hover:border-[#C9A66B]/50 text-[#D1E2D9] hover:text-white transition-colors"
              title="তথ্য রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-8 pt-8 space-y-6 sm:space-y-8 relative z-10">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="posh-glass-card p-5 sm:p-6 rounded-2xl border border-[#204E3C]">
            <span className="text-xs uppercase tracking-wider text-[#A9C4B7] font-semibold block">
              মোট আবেদনকারী
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-serif-bn text-white mt-1">
              {applicants.length}
            </div>
            <span className="text-[11px] text-[#A9C4B7] mt-1 block">নিবন্ধিত আগ্রহ</span>
          </div>

          <div className="posh-glass-card p-5 sm:p-6 rounded-2xl border border-[#204E3C]">
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold block">
              প্রাথমিক আগ্রহী (Interested)
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-serif-bn text-sky-300 mt-1">
              {applicants.filter((a) => a.status === 'interested').length}
            </div>
            <span className="text-[11px] text-[#A9C4B7] mt-1 block">যোগাযোগ অপেক্ষমান</span>
          </div>

          <div className="posh-glass-card p-5 sm:p-6 rounded-2xl border border-[#204E3C]">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
              যোগাযোগ সম্পন্ন (Contacted)
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-serif-bn text-amber-300 mt-1">
              {applicants.filter((a) => a.status === 'contacted').length}
            </div>
            <span className="text-[11px] text-[#A9C4B7] mt-1 block">আলোচনা চলছে</span>
          </div>

          <div className="posh-glass-card p-5 sm:p-6 rounded-2xl border border-[#204E3C]">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
              আসন নিশ্চিত (Confirmed)
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-serif-bn text-emerald-300 mt-1">
              {applicants.filter((a) => a.status === 'confirmed').length}
            </div>
            <span className="text-[11px] text-[#A9C4B7] mt-1 block">অংশগ্রহণকারী চূড়ান্ত</span>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="posh-glass-card p-4 sm:p-5 rounded-2xl border border-[#204E3C] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#A9C4B7] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#204E3C] bg-[#05140F] text-white focus:border-[#C9A66B] placeholder:text-[#88A698]"
              />
            </div>

            {/* Occupation Filter */}
            <div className="w-full sm:w-48">
              <select
                value={occupationFilter}
                onChange={(e) => setOccupationFilter(e.target.value)}
                className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-[#204E3C] bg-[#05140F] text-white focus:border-[#C9A66B]"
              >
                <option value="all">সব পেশা</option>
                <option value="চাকরিজীবী">চাকরিজীবী</option>
                <option value="ব্যবসায়ী বা উদ্যোক্তা">ব্যবসায়ী বা উদ্যোক্তা</option>
                <option value="ফ্রিল্যান্সার">ফ্রিল্যান্সার</option>
                <option value="শিক্ষার্থী">শিক্ষার্থী</option>
                <option value="অন্যান্য">অন্যান্য</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-44">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-[#204E3C] bg-[#05140F] text-white focus:border-[#C9A66B]"
              >
                <option value="all">সব স্ট্যাটাস</option>
                <option value="interested">Interested</option>
                <option value="contacted">Contacted</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCsv}
            disabled={filteredApplicants.length === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#06130E] text-sm font-bold rounded-xl shadow-button-gold hover:brightness-110 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#06130E]" />
            <span>CSV এক্সপোর্ট ({filteredApplicants.length})</span>
          </button>

        </div>

        {/* Applicants Table */}
        <div className="posh-glass-card rounded-2xl border border-[#204E3C] overflow-hidden shadow-luxury-glow">
          
          {isLoadingData ? (
            <div className="p-16 text-center text-[#D1E2D9]">
              <div className="w-8 h-8 border-2 border-[#C9A66B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <span>আবেদনকারী তথ্য লোড হচ্ছে...</span>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="p-16 text-center text-[#A9C4B7]">
              <Users className="w-12 h-12 text-[#204E3C] mx-auto mb-3" />
              <p className="text-base font-semibold text-white">কোনো আবেদনকারী পাওয়া যায়নি</p>
              <p className="text-xs mt-1">সার্চ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#E2EBE6]">
                <thead className="bg-[#05140F] text-xs uppercase tracking-wider text-[#A9C4B7] border-b border-[#204E3C]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">আবেদনকারীর নাম ও এলাকা</th>
                    <th className="px-5 py-4 font-semibold">মোবাইল ও দ্রুত যোগাযোগ</th>
                    <th className="px-5 py-4 font-semibold">পেশা</th>
                    <th className="px-5 py-4 font-semibold">বর্তমান স্ট্যাটাস</th>
                    <th className="px-5 py-4 font-semibold">তারিখ</th>
                    <th className="px-5 py-4 font-semibold text-right">বিস্তারিত</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#204E3C]/60">
                  {filteredApplicants.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                      
                      {/* Name & Area */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-base">{item.name}</div>
                        <div className="text-xs text-[#A9C4B7] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#C9A66B]" />
                          <span>{item.area}</span>
                        </div>
                      </td>

                      {/* Phone & Direct Quick Actions */}
                      <td className="px-5 py-4 font-mono text-sm">
                        <div className="text-white font-semibold">{item.phone_normalized}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <a
                            href={`tel:${item.phone_normalized}`}
                            className="inline-flex items-center gap-1 text-[11px] text-[#A9C4B7] hover:text-white"
                            title="সরাসরি কল দিন"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-[#C9A66B]" />
                            <span>কল</span>
                          </a>
                          <a
                            href={getWhatsAppLink(item.phone_normalized, item.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                            title="হোয়াটসঅ্যাপে চ্যাট করুন"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </td>

                      {/* Occupation */}
                      <td className="px-5 py-4 text-xs">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/[0.06] border border-[#204E3C] text-white font-medium">
                          {item.occupation}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="px-5 py-4 text-xs">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id,
                              e.target.value as 'interested' | 'contacted' | 'confirmed' | 'cancelled'
                            )
                          }
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-colors ${
                            item.status === 'confirmed'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60'
                              : item.status === 'contacted'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-600/60'
                              : item.status === 'cancelled'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-600/60'
                              : 'bg-sky-950/80 text-sky-300 border-sky-600/60'
                          }`}
                        >
                          <option value="interested" className="bg-[#06130E] text-sky-300">Interested (আগ্রহী)</option>
                          <option value="contacted" className="bg-[#06130E] text-amber-300">Contacted (যোগাযোগকৃত)</option>
                          <option value="confirmed" className="bg-[#06130E] text-emerald-300">Confirmed (নিশ্চিত)</option>
                          <option value="cancelled" className="bg-[#06130E] text-rose-300">Cancelled (বাতিল)</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-[#A9C4B7] whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedApplicant(item)}
                          className="p-2 hover:bg-white/[0.08] text-[#C9A66B] hover:text-[#F5E5C9] rounded-lg transition-colors border border-transparent hover:border-[#204E3C]"
                          title="সম্পূর্ণ বিস্তারিত দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="posh-glass-card rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#204E3C] relative">
            
            <div className="flex items-start justify-between border-b border-[#204E3C] pb-4">
              <div>
                <h3 className="text-2xl font-serif-bn font-bold text-white">
                  {selectedApplicant.name}
                </h3>
                <span className="text-sm font-mono text-[#C9A66B] mt-0.5 block">
                  {selectedApplicant.phone_normalized}
                </span>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1.5 text-[#A9C4B7] hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${selectedApplicant.phone_normalized}`}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-[#204E3C] text-sm font-semibold transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#C9A66B]" />
                <span>সরাসরি কল দিন</span>
              </a>

              <a
                href={getWhatsAppLink(selectedApplicant.phone_normalized, selectedApplicant.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp মেসেজ</span>
              </a>
            </div>

            {/* Detailed info */}
            <div className="space-y-3.5 text-sm pt-2">
              <div className="flex items-center justify-between py-2 border-b border-[#204E3C]/50">
                <span className="text-[#A9C4B7] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#C9A66B]" />
                  <span>পেশা</span>
                </span>
                <span className="font-semibold text-white">{selectedApplicant.occupation}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#204E3C]/50">
                <span className="text-[#A9C4B7] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A66B]" />
                  <span>এলাকা / জেলা</span>
                </span>
                <span className="font-semibold text-white">{selectedApplicant.area}</span>
              </div>

              {selectedApplicant.email && (
                <div className="flex items-center justify-between py-2 border-b border-[#204E3C]/50">
                  <span className="text-[#A9C4B7] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#C9A66B]" />
                    <span>ইমেইল</span>
                  </span>
                  <span className="font-mono text-white text-xs">{selectedApplicant.email}</span>
                </div>
              )}

              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#A9C4B7] block mb-1.5">
                  জানতে আগ্রহী বিষয় / প্রশ্ন
                </span>
                <p className="bg-[#05140F] p-3.5 rounded-xl text-white text-sm border border-[#204E3C] whitespace-pre-wrap leading-relaxed">
                  {selectedApplicant.interest || 'কোনো নির্দিষ্ট বিষয় উল্লেখ করা হয়নি।'}
                </p>
              </div>

              <div className="pt-2 border-t border-[#204E3C]/50 text-xs text-[#A9C4B7] space-y-1">
                <div>নিবন্ধনের সময়: {new Date(selectedApplicant.created_at).toLocaleString('bn-BD')}</div>
                <div>সম্মতি সংস্করণ: {selectedApplicant.consent_version} (স্বীকৃত)</div>
                {selectedApplicant.status_updated_at && (
                  <div>স্ট্যাটাস আপডেট: {new Date(selectedApplicant.status_updated_at).toLocaleString('bn-BD')}</div>
                )}
              </div>
            </div>

            {/* Status change actions */}
            <div className="pt-4 border-t border-[#204E3C] flex items-center justify-between">
              <span className="text-xs text-[#A9C4B7]">স্ট্যাটাস আপডেট:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedApplicant.id, 'contacted')}
                  className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-600/60 text-amber-300 text-xs font-bold hover:bg-amber-900"
                >
                  Contacted
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedApplicant.id, 'confirmed')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-600/60 text-emerald-300 text-xs font-bold hover:bg-emerald-900"
                >
                  Confirmed
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Manual Add Applicant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="posh-glass-card rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#204E3C] relative">
            
            <div className="flex items-start justify-between border-b border-[#204E3C] pb-3">
              <div>
                <h3 className="text-xl font-serif-bn font-bold text-white">
                  নতুন আবেদনকারী যোগ করুন
                </h3>
                <span className="text-xs text-[#A9C4B7]">
                  সরাসরি বা ফোনে যোগাযোগকারীকে তালিকায় অন্তর্ভুক্ত করুন
                </span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#A9C4B7] hover:text-white rounded-lg hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  আবেদনকারীর নাম <span className="text-[#C9A66B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ কামরুল হাসান"
                  value={newApplicantForm.name}
                  onChange={(e) =>
                    setNewApplicantForm({ ...newApplicantForm, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#204E3C] bg-[#05140F] text-white focus:border-[#C9A66B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  মোবাইল নম্বর <span className="text-[#C9A66B]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={newApplicantForm.phone}
                  onChange={(e) =>
                    setNewApplicantForm({ ...newApplicantForm, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#204E3C] bg-[#05140F] text-white focus:border-[#C9A66B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">পেশা</label>
                <select
                  value={newApplicantForm.occupation}
                  onChange={(e) =>
                    setNewApplicantForm({ ...newApplicantForm, occupation: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#204E3C] bg-[#05140F] text-white focus:border-[#C9A66B]"
                >
                  <option value="চাকরিজীবী">চাকরিজীবী</option>
                  <option value="ব্যবসায়ী বা উদ্যোক্তা">ব্যবসায়ী বা উদ্যোক্তা</option>
                  <option value="ফ্রিল্যান্সার">ফ্রিল্যান্সার</option>
                  <option value="শিক্ষার্থী">শিক্ষার্থী</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">এলাকা / জেলা</label>
                <input
                  type="text"
                  placeholder="যেমন: ধানমন্ডি, ঢাকা"
                  value={newApplicantForm.area}
                  onChange={(e) =>
                    setNewApplicantForm({ ...newApplicantForm, area: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#204E3C] bg-[#05140F] text-white focus:border-[#C9A66B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">ইমেইল (ঐচ্ছিক)</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={newApplicantForm.email}
                  onChange={(e) =>
                    setNewApplicantForm({ ...newApplicantForm, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#204E3C] bg-[#05140F] text-white focus:border-[#C9A66B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#204E3C] text-sm text-[#A9C4B7] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C9A66B] via-[#E2C899] to-[#9A773F] text-[#06130E] font-bold text-sm shadow-button-gold hover:brightness-110"
                >
                  তালিকায় যুক্ত করুন
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
