import React from 'react';
import { ShoppingBag, CheckCircle2, MessageCircle, Search, User, Truck } from 'lucide-react';
import { ActiveTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenWhatsApp: (customMessage?: string) => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  isDetailView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenWhatsApp,
  onOpenSearch,
  onOpenProfile,
  isDetailView = false,
}) => {
  const { currentUser } = useAuth();
  const getSubtitle = () => {
    if (isDetailView) return 'Product Detail';
    switch (activeTab) {
      case 'home':
        return 'Home Storefront';
      case 'products':
        return 'Product Catalog';
      case 'deals':
        return 'Exclusive Deals';
      case 'admin':
        return 'Admin Portal';
      case 'tracking':
        return 'Order Status';
      default:
        return 'Home Storefront';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-2.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Lockup */}
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                Uttarbanger Shad
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {getSubtitle()}
            </p>
          </div>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* WhatsApp Direct Icon Button */}
          <button
            onClick={() => onOpenWhatsApp()}
            className="w-9 h-9 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#075E54] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Chat with Merchant on WhatsApp"
            aria-label="WhatsApp Direct Chat"
          >
            <MessageCircle className="w-5 h-5 fill-[#25D366] text-[#075E54]" />
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
            title="Search Products"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Track Order Status Button */}
          <button
            onClick={() => onTabChange('tracking')}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              activeTab === 'tracking'
                ? 'bg-emerald-100 text-emerald-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Track Order Status"
            aria-label="Track Order"
          >
            <Truck className="w-5 h-5" />
          </button>

          {/* Profile / Login / Admin Switcher Button */}
          <button
            onClick={onOpenProfile}
            className={`relative rounded-full flex items-center justify-center transition-all ${
              currentUser
                ? 'w-9 h-9 bg-emerald-700 text-white font-bold text-xs shadow-xs hover:bg-emerald-800'
                : 'w-9 h-9 bg-slate-800 text-white hover:bg-slate-900'
            }`}
            title={currentUser ? `${currentUser.name} (${currentUser.role})` : 'লগইন / Profile'}
            aria-label="Account"
          >
            {currentUser ? (
              <>
                <span>{currentUser.avatar || currentUser.name.charAt(0)}</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
              </>
            ) : (
              <User className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
