import React, { useState, useEffect, useMemo } from 'react';
import { supabase, isBackendConfigured } from '../lib/supabase';
import { exportToCsv } from '../utils/csv';
import {
  Users,
  Search,
  Download,
  LogOut,
  ArrowLeft,
  Eye,
  AlertCircle,
  KeyRound,
  RefreshCw
} from 'lucide-react';

export interface RegistrationRecord {
  id: string;
  name: string;
  phone_normalized: string;
  occupation: string;
  area: string;
  email: string | null;
  interest: string | null;
  consent_version: string;
  consented_at: string;
  status: 'interested' | 'contacted' | 'confirmed' | 'cancelled';
  status_updated_at?: string | null;
  source: string;
  created_at: string;
}

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [occupationFilter, setOccupationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal state
  const [selectedItem, setSelectedItem] = useState<RegistrationRecord | null>(null);

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const backendReady = isBackendConfigured();

  // Check existing session
  useEffect(() => {
    if (backendReady && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAuthenticated(true);
          fetchRegistrations();
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(Boolean(session));
        if (session) fetchRegistrations();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [backendReady]);

  const fetchRegistrations = async () => {
    if (!supabase) return;

    setIsLoadingData(true);
    setLoadError('');

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setLoadError(`তথ্য লোড করা যায়নি: ${error.message}`);
      } else if (data) {
        setRegistrations(data as RegistrationRecord[]);
      }
    } catch (err: unknown) {
      setLoadError('সার্ভার থেকে তথ্য আনতে ব্যর্থ হয়েছে।');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backendReady || !supabase) {
      setAuthError('ডাটাবেজ সংযোগ সক্রিয় নয়। প্রথমে .env কনফিগার করুন।');
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
      fetchRegistrations();
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  };

  // Update Status handler
  const handleStatusChange = async (id: string, newStatus: 'interested' | 'contacted' | 'confirmed' | 'cancelled') => {
    if (!supabase) return;

    setUpdatingId(id);
    const nowIso = new Date().toISOString();

    const { error } = await supabase
      .from('registrations')
      .update({
        status: newStatus,
        status_updated_at: nowIso,
      })
      .eq('id', id);

    setUpdatingId(null);

    if (!error) {
      setRegistrations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus, status_updated_at: nowIso } : item
        )
      );
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem((prev) => (prev ? { ...prev, status: newStatus, status_updated_at: nowIso } : null));
      }
    } else {
      alert(`স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে: ${error.message}`);
    }
  };

  // Filtered registrations
  const filteredData = useMemo(() => {
    return registrations.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone_normalized.includes(searchQuery);

      const matchOccupation = occupationFilter === 'all' || item.occupation === occupationFilter;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchSearch && matchOccupation && matchStatus;
    });
  }, [registrations, searchQuery, occupationFilter, statusFilter]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'নিবন্ধন আইডি',
      'নাম',
      'মোবাইল নম্বর',
      'পেশা',
      'এলাকা/জেলা',
      'ইমেইল',
      'আগ্রহ ও মতামত',
      'স্ট্যাটাস',
      'সম্মতি ভার্সন',
      'নিবন্ধনের সময় (UTC)',
    ];

    const rows = filteredData.map((item) => [
      item.id,
      item.name,
      item.phone_normalized,
      item.occupation,
      item.area,
      item.email || '',
      item.interest || '',
      item.status,
      item.consent_version,
      item.created_at,
    ]);

    const timestamp = new Date().toISOString().slice(0, 10);
    exportToCsv(`biniyog_adda_registrations_${timestamp}.csv`, headers, rows);
  };

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-brand-divider shadow-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-brand-forest text-brand-ivory rounded-xl flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6 text-brand-gold" />
            </div>
            <h1 className="text-2xl font-bold text-brand-forest">
              আয়োজক ড্যাশবোর্ড
            </h1>
            <p className="text-sm text-brand-secondary mt-1">
              বিনিয়োগ আড্ডা নিবন্ধনের ব্যবস্থাপনা প্যানেল
            </p>
          </div>

          {!backendReady ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 mb-6">
              <p className="font-semibold text-sm flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                ডাটাবেজ সেটআপ প্রয়োজন
              </p>
              <p>
                ড্যাশবোর্ড ব্যবহারের জন্য আপনার Supabase প্রজেক্ট তৈরি করে `.env` ফাইলে ক্রেডেনশিয়াল যুক্ত করুন।
              </p>
              <div className="bg-white/80 p-2.5 rounded font-mono text-[11px] overflow-x-auto">
                VITE_SUPABASE_URL=...<br />
                VITE_SUPABASE_ANON_KEY=...
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  আয়োজক ইমেইল
                </label>
                <input
                  type="email"
                  required
                  placeholder="organizer@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-divider text-sm text-brand-text focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-forest mb-1">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-divider text-sm text-brand-text focus:border-brand-gold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-brand-forest hover:bg-brand-forest-light text-brand-ivory font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoggingIn ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-brand-divider text-center">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-secondary hover:text-brand-forest"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>মূল ওয়েবসাইটে ফিরে যান</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory/60 pb-16">
      
      {/* Top Navigation */}
      <header className="bg-brand-forest text-brand-ivory sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="ওয়েবসাইটে যান"
            >
              <ArrowLeft className="w-5 h-5 text-brand-ivory" />
            </button>
            <div>
              <span className="text-base font-bold text-brand-ivory">বিনিয়োগ আড্ডা</span>
              <span className="text-xs text-brand-gold ml-2 font-mono">আয়োজক প্যানেল</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRegistrations}
              disabled={isLoadingData}
              className="p-2 rounded-lg hover:bg-white/10 text-brand-ivory/80 hover:text-white transition-colors"
              title="তথ্য রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-brand-ivory/80 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-brand-divider shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">মোট আগ্রহ নিবন্ধন</span>
            <div className="text-2xl sm:text-3xl font-bold text-brand-forest mt-1">
              {registrations.length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-brand-divider shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">প্রাথমিক আগ্রহী (Interested)</span>
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 mt-1">
              {registrations.filter((r) => r.status === 'interested').length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-brand-divider shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">যোগাযোগ সম্পন্ন (Contacted)</span>
            <div className="text-2xl sm:text-3xl font-bold text-amber-700 mt-1">
              {registrations.filter((r) => r.status === 'contacted').length}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-brand-divider shadow-sm">
            <span className="text-xs text-brand-secondary font-medium">আসন নিশ্চিত (Confirmed)</span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">
              {registrations.filter((r) => r.status === 'confirmed').length}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-brand-divider shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-brand-secondary absolute left-3 top-3" />
              <input
                type="text"
                placeholder="নাম বা মোবাইল দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-brand-divider focus:border-brand-gold text-brand-text"
              />
            </div>

            {/* Occupation Filter */}
            <div className="w-full sm:w-48">
              <select
                value={occupationFilter}
                onChange={(e) => setOccupationFilter(e.target.value)}
                className="w-full py-2 px-3 text-sm rounded-lg border border-brand-divider bg-white text-brand-text focus:border-brand-gold"
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
                className="w-full py-2 px-3 text-sm rounded-lg border border-brand-divider bg-white text-brand-text focus:border-brand-gold"
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
            disabled={filteredData.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-forest hover:bg-brand-forest-light text-brand-ivory text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-brand-gold" />
            <span>CSV এক্সপোর্ট ({filteredData.length})</span>
          </button>

        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-brand-divider shadow-sm overflow-hidden">
          {loadError && (
            <div className="p-4 bg-rose-50 text-rose-800 text-sm border-b border-rose-200">
              {loadError}
            </div>
          )}

          {isLoadingData ? (
            <div className="p-12 text-center text-brand-secondary">
              <div className="w-8 h-8 border-2 border-brand-forest border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <span>তথ্য লোড করা হচ্ছে...</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center text-brand-secondary">
              <Users className="w-12 h-12 text-brand-divider mx-auto mb-3" />
              <p className="text-base font-semibold text-brand-forest">কোনো নিবন্ধন পাওয়া যায়নি</p>
              <p className="text-xs mt-1">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-brand-text">
                <thead className="bg-brand-ivory text-xs uppercase text-brand-secondary border-b border-brand-divider">
                  <tr>
                    <th className="px-4 py-3.5 font-semibold">নাম ও এলাকা</th>
                    <th className="px-4 py-3.5 font-semibold">মোবাইল</th>
                    <th className="px-4 py-3.5 font-semibold">পেশা</th>
                    <th className="px-4 py-3.5 font-semibold">স্ট্যাটাস</th>
                    <th className="px-4 py-3.5 font-semibold">তারিখ</th>
                    <th className="px-4 py-3.5 font-semibold text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-divider">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-ivory/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-brand-forest">{item.name}</div>
                        <div className="text-xs text-brand-secondary">{item.area}</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs">
                        {item.phone_normalized}
                        {item.email && (
                          <div className="text-[11px] text-brand-secondary truncate max-w-[160px]">
                            {item.email}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <span className="inline-block px-2 py-0.5 rounded bg-brand-forest/5 text-brand-forest font-medium">
                          {item.occupation}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id,
                              e.target.value as 'interested' | 'contacted' | 'confirmed' | 'cancelled'
                            )
                          }
                          className="py-1 px-2 rounded text-xs font-semibold border border-brand-divider bg-white"
                        >
                          <option value="interested">Interested</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-brand-secondary whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="p-1.5 hover:bg-brand-forest/10 text-brand-forest rounded-md transition-colors"
                          title="বিস্তারিত দেখুন"
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

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-brand-divider">
            <div className="flex items-start justify-between border-b border-brand-divider pb-3">
              <div>
                <h3 className="text-xl font-bold text-brand-forest">{selectedItem.name}</h3>
                <span className="text-xs text-brand-secondary font-mono">{selectedItem.phone_normalized}</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-brand-secondary hover:text-brand-forest rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-brand-secondary block font-semibold">পেশা</span>
                <span>{selectedItem.occupation}</span>
              </div>
              <div>
                <span className="text-xs text-brand-secondary block font-semibold">এলাকা / জেলা</span>
                <span>{selectedItem.area}</span>
              </div>
              {selectedItem.email && (
                <div>
                  <span className="text-xs text-brand-secondary block font-semibold">ইমেইল</span>
                  <span>{selectedItem.email}</span>
                </div>
              )}
              <div>
                <span className="text-xs text-brand-secondary block font-semibold">জানতে আগ্রহী বিষয় / প্রশ্ন</span>
                <p className="bg-brand-ivory/50 p-3 rounded-lg text-brand-text whitespace-pre-wrap text-xs sm:text-sm mt-1">
                  {selectedItem.interest || 'কোনো নির্দিষ্ট বিষয় উল্লেখ করা হয়নি।'}
                </p>
              </div>
              <div className="pt-2 border-t border-brand-divider text-xs text-brand-secondary space-y-1">
                <div>নিবন্ধনের সময়: {new Date(selectedItem.created_at).toLocaleString('bn-BD')}</div>
                <div>সম্মতি সংস্করণ: {selectedItem.consent_version} (স্বীকৃত)</div>
                {selectedItem.status_updated_at && (
                  <div>স্ট্যাটাস আপডেট: {new Date(selectedItem.status_updated_at).toLocaleString('bn-BD')}</div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-brand-divider flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-brand-forest text-brand-ivory rounded-lg text-sm font-semibold hover:bg-brand-forest-light"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
