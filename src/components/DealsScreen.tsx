import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles, MessageCircle, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { Product } from '../types';

interface DealsScreenProps {
  products: Product[];
  onOpenWhatsApp: (product?: Product, customMessage?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const DealsScreen: React.FC<DealsScreenProps> = ({
  products,
  onOpenWhatsApp,
  onSelectProduct,
}) => {
  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bundles = [
    {
      id: 'bundle-1',
      title: 'Sundarbans Wild Honey & Tangail Khadi Set',
      subtitle: 'Pure single-origin mangrove honey + handspun breathable cotton kurta',
      badge: 'Heritage Combo • Save ৳600',
      price: 2100,
      originalPrice: 2790,
      image: products[0]?.image || '',
      items: ['Sundarbans Wild Honey (500g Jar)', 'Tangail Handloom Khadi Kurta'],
    },
    {
      id: 'bundle-2',
      title: 'Grandmother’s Kitchen Pure Duo',
      subtitle: 'Cold pressed extra virgin mustard oil + sun cured Rajshahi mango achar',
      badge: 'Foodie Favourite • Save ৳150',
      price: 590,
      originalPrice: 740,
      image: products[3]?.image || '',
      items: ['Cold Pressed Mustard Oil 1L', 'Premium Rajshahi Mango Pickle 400g'],
    },
    {
      id: 'bundle-3',
      title: 'Tea Garden & Earthenware Set',
      subtitle: 'Sreemangal black tea tin with handmade terracotta clay teapot & 4 cups',
      badge: 'Tea Lover Gift • Save ৳220',
      price: 940,
      originalPrice: 1160,
      image: products[2]?.image || '',
      items: ['Sreemangal Black Tea Tin 250g', 'Terracotta Ceramic Tea Set (4 Cups)'],
    },
  ];

  const handleOrderBundle = (bundle: typeof bundles[0]) => {
    const message = `Hello DeshiMart / Uttarbanger Shad! I would like to order this exclusive deal bundle:

🎁 *${bundle.title}*
🏷️ Deal Price: ৳${bundle.price} (Regular: ৳${bundle.originalPrice})
✨ Included: ${bundle.items.join(' + ')}

Please confirm stock and arrange delivery to Dhaka/BD with COD!`;
    onOpenWhatsApp(undefined, message);
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-24 text-slate-800">
      {/* 1. Flash Deals Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 p-5 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-200">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Limited Artisan Combos</span>
          </div>
          <span className="text-[11px] text-amber-100 font-semibold">Dhaka & Nationwide</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
          Save Up to ৳600 on Handcrafted Bundle Packs
        </h1>

        <p className="text-xs text-amber-100 leading-relaxed">
          Direct from certified rural beekeepers and handloom cooperatives. Packaged in reusable jute bags.
        </p>

        {/* Live Flash Timer */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/20">
          <Clock className="w-4 h-4 text-amber-200" />
          <span className="text-xs font-medium text-amber-100">Deal expires in:</span>
          <div className="flex items-center gap-1 font-mono text-xs font-bold bg-black/40 px-2.5 py-1 rounded-lg tabular-nums">
            <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
            <span>:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
            <span>:</span>
            <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        </div>
      </div>

      {/* 2. Bundle Cards List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Curated Artisanal Hampers
          </h2>
          <span className="text-xs text-slate-500 font-medium">Free Jute Gift Bag</span>
        </div>

        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs p-3.5 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={bundle.image}
                  alt={bundle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="inline-block bg-amber-50 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200 mb-1">
                  {bundle.badge}
                </span>

                <h3 className="font-bold text-xs text-slate-900 leading-tight">
                  {bundle.title}
                </h3>

                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {bundle.subtitle}
                </p>

                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-base font-black text-slate-900 tabular-nums">
                    ৳{bundle.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    ৳{bundle.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Gift className="w-3 h-3 text-emerald-600" />
                <span>Package Inclusions:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                {bundle.items.map((item, idx) => (
                  <li key={idx} className="truncate">{item}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleOrderBundle(bundle)}
              className="w-full flex items-center justify-center gap-2 bg-[#046A38] hover:bg-[#03522b] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Order Combo on WhatsApp</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
