import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Phone,
  MapPin,
  User as UserIcon,
  LogIn,
  LogOut,
  Package,
  Clock,
  CheckCircle2,
  ChevronRight,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToAdmin: () => void;
  onOpenWhatsApp: () => void;
  onTrackOrder?: (orderNumber: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onSwitchToAdmin,
  onOpenWhatsApp,
  onTrackOrder,
}) => {
  const { currentUser, logout, openAuthModal, orders } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    setLogoutConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm">
              {currentUser ? 'আমার একাউন্ট / Account' : 'লগইন ও একাউন্ট / Profile'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Logged In */}
        {currentUser ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-700">
            {/* User Banner Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-3.5 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-black text-base flex items-center justify-center shadow-xs">
                {currentUser.avatar || currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm truncate">
                    {currentUser.name}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-600 truncate">{currentUser.phone}</p>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentUser.role === 'admin'
                      ? 'bg-slate-900 text-emerald-400'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {currentUser.role === 'admin' ? 'Store Manager (Admin)' : 'Verified Customer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile vs Orders Tab switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                একাউন্ট তথ্য (Profile)
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                  activeTab === 'orders'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>অর্ডার হিস্টোরি (Orders)</span>
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full text-[10px]">
                  {orders.length}
                </span>
              </button>
            </div>

            {activeTab === 'profile' ? (
              /* Profile Details */
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2 text-[11px]">
                  <div className="flex items-start justify-between">
                    <span className="text-slate-500">Address / ডেলিভারি ঠিকানা</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[60%]">
                      {currentUser.address || 'Dhaka, Bangladesh'}
                    </span>
                  </div>
                  {currentUser.email && (
                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                      <span className="text-slate-500">Email</span>
                      <span className="font-semibold text-slate-800">{currentUser.email}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span className="text-slate-500">Authentication</span>
                    <span className="font-semibold text-emerald-700">Active (Phone Verified)</span>
                  </div>
                </div>

                {/* If Admin Role, quick access button */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      onClose();
                      onSwitchToAdmin();
                    }}
                    className="w-full flex items-center justify-between bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-2xl font-bold transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Manage WhatsApp Catalog (Admin)</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}

                <button
                  onClick={() => {
                    onClose();
                    onOpenWhatsApp();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#046A38] hover:bg-[#03522b] text-white py-2.5 rounded-xl font-bold transition-colors"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Contact Merchant WhatsApp</span>
                </button>

                {/* Logout Action Area */}
                <div className="pt-2 border-t border-slate-200">
                  {logoutConfirm ? (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl space-y-2">
                      <p className="font-bold text-rose-800 text-xs">
                        লগআউট করতে চান? (Are you sure you want to log out?)
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleLogout}
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded-lg font-bold text-xs"
                        >
                          হ্যাঁ, লগআউট (Yes, Logout)
                        </button>
                        <button
                          onClick={() => setLogoutConfirm(false)}
                          className="flex-1 bg-white border border-slate-300 text-slate-700 py-1.5 rounded-lg font-semibold text-xs"
                        >
                          বাতিল (Cancel)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setLogoutConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2.5 rounded-xl font-bold text-xs transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট করুন (Log Out)</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Order History List */
              <div className="space-y-2.5">
                {orders.length > 0 ? (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-800 text-[11px]">
                          {ord.orderNumber}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ord.status === 'Delivered' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Truck className="w-3 h-3 text-blue-600" />
                          )}
                          {ord.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{ord.productName}</h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                          <span>Qty: {ord.quantity}</span>
                          <span className="font-bold text-slate-900 tabular-nums">
                            ৳{ord.totalPrice.toLocaleString()} ({ord.paymentMethod})
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-2 rounded-xl border border-slate-200/80 text-[10px] text-slate-600 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-700 block">কুরিয়ার ট্র্যাকিং:</span>
                          <span className="font-mono font-bold text-emerald-700">
                            {ord.courierTracking || 'Processing'}
                          </span>
                        </div>
                        {onTrackOrder && (
                          <button
                            onClick={() => {
                              onClose();
                              onTrackOrder(ord.orderNumber);
                            }}
                            className="inline-flex items-center gap-1 bg-[#046A38] hover:bg-[#03522b] text-white px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors"
                          >
                            <Truck className="w-3 h-3" />
                            <span>ট্র্যাক করুন</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-400 space-y-1">
                    <Package className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">কোনো অর্ডার এখনো পাওয়া যায়নি</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* If Logged Out */
          <div className="p-5 text-center space-y-4 text-xs text-slate-600">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <UserIcon className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900">
                আপনি লগইন অবস্থায় নেই (Not Logged In)
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                আপনার অর্ডার ট্র্যাক করতে এবং দ্রুত WhatsApp অর্ডার করতে লগইন করুন।
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                openAuthModal();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#046A38] hover:bg-[#03522b] text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-900/10 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন / রেজিস্টার করুন (Sign In / Register)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenWhatsApp();
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>গেস্ট হিসেবে WhatsApp এ যোগাযোগ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
