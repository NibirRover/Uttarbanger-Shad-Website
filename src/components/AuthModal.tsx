import React, { useState } from 'react';
import { X, LogIn, UserPlus, Phone, Mail, Lock, User, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setErrorMsg('মোবাইল নম্বর বা ইমেইল প্রদান করুন (Please enter phone or email)');
      return;
    }
    setErrorMsg('');
    login(phoneOrEmail, role, name || undefined);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneOrEmail.trim()) {
      setErrorMsg('নাম এবং মোবাইল নম্বর আবশ্যক (Name and phone required)');
      return;
    }
    setErrorMsg('');
    register({
      name,
      phone: phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
      address: address || 'Dhaka, Bangladesh',
      city: 'Dhaka',
      role,
    });
  };

  const handleQuickDemoLogin = (userKey: 'customer' | 'customer2' | 'admin') => {
    const u = DEMO_USERS[userKey];
    login(u.phone, u.role, u.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#046A38] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <LogIn className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {tab === 'login' ? 'লগইন করুন / Login' : 'নতুন একাউন্ট / Sign Up'}
              </h3>
              <p className="text-[11px] text-emerald-100">Uttarbanger Shad Account</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              tab === 'login'
                ? 'border-emerald-700 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            লগইন (Login)
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              tab === 'register'
                ? 'border-emerald-700 text-emerald-800 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            রেজিস্টার (Sign Up)
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs text-slate-700">
          {errorMsg && (
            <div className="bg-rose-50 text-rose-700 p-2.5 rounded-xl border border-rose-200 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {tab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  মোবাইল নম্বর / ইমেইল (Phone / Email)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="017XXXXXXXX or email"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  পাসওয়ার্ড / WhatsApp OTP (Password / Code)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••• (Any password for test)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 bg-[#046A38] hover:bg-[#03522b] text-white py-2.5 rounded-xl font-bold transition-all shadow-xs active:scale-[0.99] mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন (Login)</span>
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  আপনার নাম (Full Name)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Shahriar"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  মোবাইল নম্বর (Phone Number)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="01712-XXXXXX"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ডেলিভারি ঠিকানা (Delivery Address)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Area, Dhaka"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 bg-[#046A38] hover:bg-[#03522b] text-white py-2.5 rounded-xl font-bold transition-all shadow-xs active:scale-[0.99] mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>একাউন্ট তৈরি করুন (Register)</span>
              </button>
            </form>
          )}

          {/* 1-Tap Quick Demo Logins Strip */}
          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block mb-2">
              ⚡ দ্রুত ডেমো লগইন (1-Tap Instant Demo Login):
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="w-full p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                    TS
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Tanvir Shahriar</span>
                    <span className="text-[10px] text-slate-500">Customer • Dhanmondi, Dhaka</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer2')}
                className="w-full p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center">
                    NA
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">Nusrat Anjum</span>
                    <span className="text-[10px] text-slate-500">Customer • Uttara, Dhaka</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="w-full p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-900 font-bold text-[10px] flex items-center justify-center">
                    UB
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Nahid (Store Manager)</span>
                    <span className="text-[10px] text-slate-300">Admin Portal Access • Banani</span>
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
