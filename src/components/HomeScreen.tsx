import React, { useState } from 'react';
import {
  Zap,
  ArrowRight,
  Truck,
  CheckCircle,
  MessageCircle,
  ShieldCheck,
  Star,
  Users,
  Wallet,
  Clock,
  MapPin,
  Share2,
  Mail,
  CheckCheck
} from 'lucide-react';
import { Product, ProductCategory, ReviewChat } from '../types';

interface HomeScreenProps {
  products: Product[];
  reviews: ReviewChat[];
  onSelectProduct: (product: Product) => void;
  onNavigateToProducts: (category?: ProductCategory) => void;
  onOpenWhatsApp: (product?: Product) => void;
  onNavigateToTracking?: (orderId?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  reviews,
  onSelectProduct,
  onNavigateToProducts,
  onOpenWhatsApp,
  onNavigateToTracking,
}) => {
  const [selectedAisle, setSelectedAisle] = useState<string>('All Items');

  const aisles = [
    { label: 'All Items', category: 'All' as ProductCategory },
    { label: 'Organic Honey & Ghee', category: 'Grocery & Pantry' as ProductCategory },
    { label: 'Handloom Panjabi', category: 'Fashion' as ProductCategory },
    { label: 'Artisan Crafts', category: 'Artisan Crafts' as ProductCategory },
    { label: 'Tea & Beverage', category: 'Tea & Drink' as ProductCategory },
  ];

  // Pick top 4 products for Handpicked Essentials
  const curatedProducts = products.slice(0, 4);

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Hero Banner */}
      <section className="px-4 pt-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#045C37] via-[#046A38] to-[#034A29] p-5 text-white shadow-xl shadow-emerald-950/20">
          {/* Subtle Organic Background Glow */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Micro Pill Kicker */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-400/30 text-emerald-200 text-[11px] font-semibold tracking-wide uppercase mb-3.5 backdrop-blur-xs">
            <Zap className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
            <span>WhatsApp Direct Shopping</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug mb-2.5 text-balance">
            Authentic Lifestyle & Organic Goods Delivered
          </h1>

          {/* Subtitle */}
          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-5 max-w-sm">
            Order directly via WhatsApp in seconds. Zero account hassle, transparent BDT pricing, and trusted Cash on Delivery across Bangladesh.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => onNavigateToProducts('All')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#034626] hover:bg-[#02331c] border border-emerald-400/30 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] mb-5"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-400" />
            <span>Shop Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* 3 Features Badges Strip */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-600/40 text-center">
            <div className="bg-emerald-800/40 border border-emerald-500/20 rounded-xl p-2 flex flex-col items-center">
              <Truck className="w-4 h-4 text-emerald-300 mb-1" />
              <span className="text-[11px] font-bold text-white leading-tight">Fast Delivery</span>
              <span className="text-[9px] text-emerald-200 mt-0.5">Dhaka 24–48h</span>
            </div>

            <div className="bg-emerald-800/40 border border-emerald-500/20 rounded-xl p-2 flex flex-col items-center">
              <CheckCircle className="w-4 h-4 text-emerald-300 mb-1" />
              <span className="text-[11px] font-bold text-white leading-tight">100% Genuine</span>
              <span className="text-[9px] text-emerald-200 mt-0.5">Direct Farm & Loom</span>
            </div>

            <div className="bg-emerald-800/40 border border-emerald-500/20 rounded-xl p-2 flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-300 mb-1" />
              <span className="text-[11px] font-bold text-white leading-tight">WhatsApp Verified</span>
              <span className="text-[9px] text-emerald-200 mt-0.5">Instant Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Order Tracking Banner */}
      <section className="px-4">
        <div
          onClick={() => onNavigateToTracking && onNavigateToTracking()}
          className="bg-white hover:bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0">
              <Truck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900">অর্ডার ট্র্যাক করুন (Track Order)</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">Live</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                অর্ডার আইডি দিয়ে লাইভ ডেলিভারি স্ট্যাটাস দেখুন
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </section>

      {/* 2. Explore Artisan Aisles */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Explore Artisan Aisles
          </h2>
          <span className="text-xs text-slate-500 font-medium">Slide to view</span>
        </div>

        {/* Horizontal Scroll Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {aisles.map((aisle) => {
            const isSelected = selectedAisle === aisle.label;
            return (
              <button
                key={aisle.label}
                onClick={() => {
                  setSelectedAisle(aisle.label);
                  if (aisle.category !== 'All') {
                    onNavigateToProducts(aisle.category);
                  }
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#046A38] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {aisle.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Handpicked Essentials Grid */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Handpicked Essentials
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                4 Curated
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct from local artisans & certified harvest hubs
            </p>
          </div>
        </div>

        {/* 2-Column Product Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {curatedProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Stock Tag Top Left */}
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
                    In Stock
                  </span>
                </div>

                {/* Rating Badge Top Right */}
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center gap-1 bg-white/95 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{prod.rating.toFixed(1)}</span>
                  </span>
                </div>
              </div>

              {/* Product Content Details */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
                    {prod.region}
                  </span>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {prod.name}
                  </h3>
                </div>

                {/* Price Row */}
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                    ৳{prod.price.toLocaleString()}
                  </span>
                  {prod.originalPrice > prod.price && (
                    <span className="text-[11px] text-slate-400 line-through tabular-nums">
                      ৳{prod.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Order Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenWhatsApp(prod);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#046A38] hover:bg-[#03552d] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Order via WhatsApp? Card Section */}
      <section className="px-4">
        <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-emerald-50/50 rounded-3xl p-5 border border-indigo-100/80 space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Conversational Commerce</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Why Order via WhatsApp?
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Designed for speed, absolute transparency, and genuine human service.
            </p>
          </div>

          <div className="space-y-3">
            {/* Card 1 */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-5 h-5 fill-emerald-600 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">No Complex Accounts</h3>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Skip long checkout forms and forgotten passwords. Send 1 tap message to place your order immediately.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Chat with Real Humans</h3>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Ask questions about sizes, batch dates, or customized packaging directly with our Dhaka merchant team.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                <Wallet className="w-5 h-5 text-sky-700" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Pay Upon Inspection</h3>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  Cash on Delivery everywhere in Bangladesh, or instant mobile payment via bKash, Nagad, and Rocket.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Happy Customer Chats (Verified Buyers) */}
      <section className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Happy Customer Chats
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Verified Buyers</span>
        </div>

        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {rev.authorInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900">{rev.authorName}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">{rev.location}</span>
              </div>

              {/* Chat bubble body */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                “{rev.message}”
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 not-italic mt-1.5 font-sans">
                  <span>{rev.timeAgo}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DeshiMart / Uttarbanger Shad Footer */}
      <footer className="px-4 pt-4 border-t border-slate-200/80">
        <div className="bg-slate-100/80 rounded-3xl p-5 space-y-4 text-xs text-slate-600">
          <div>
            <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-sm mb-1">
              <span>Uttarbanger Shad</span>
              <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Bangladesh’s premier conversational commerce hub for verified artisanal staples, handloom textiles, and organic agro products.
            </p>
          </div>

          <div className="space-y-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>House 42, Road 11, Banani Block D, Dhaka 1213, Bangladesh</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>Support Hours: Saturday – Thursday (9:00 AM – 11:00 PM)</span>
            </div>
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-semibold text-emerald-800">WhatsApp Direct: +880 1712–345678</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-[11px]">
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Aisles</h4>
              <ul className="space-y-1 text-slate-500">
                <li>Sundarbans Forest Honey</li>
                <li>Tangail Handlooms</li>
                <li>Chittagong Clay Pots</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Assurance</h4>
              <ul className="space-y-1 text-slate-500">
                <li>bKash Merchant Pay</li>
                <li>Courier Return Policy</li>
                <li>Artisan Verification</li>
              </ul>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenWhatsApp()}
              className="p-2 rounded-full bg-white shadow-xs text-slate-600 hover:text-emerald-700"
              aria-label="Direct message"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="p-2 rounded-full bg-white shadow-xs text-slate-600 hover:text-emerald-700"
              aria-label="Share store"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                window.location.href = 'mailto:support@uttarbangershad.com.bd';
              }}
              className="p-2 rounded-full bg-white shadow-xs text-slate-600 hover:text-emerald-700"
              aria-label="Email support"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">
            <p>© 2025 DeshiMart Bangladesh. All rights reserved.</p>
            <p>Conversational commerce engine powered by Uttarbanger Shad.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
