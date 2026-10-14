import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Heart,
  ZoomIn,
  Truck,
  ShieldCheck,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';
import { ImageLightboxModal } from './ImageLightboxModal';

interface ProductDetailScreenProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onOpenWhatsApp: (product?: Product, customMessage?: string, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  allProducts,
  onBack,
  onOpenWhatsApp,
  onSelectProduct,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Accordion state
  const [accordionOpen, setAccordionOpen] = useState<{
    origin: boolean;
    howToOrder: boolean;
    delivery: boolean;
  }>({
    origin: true,
    howToOrder: true,
    delivery: true,
  });

  const toggleAccordion = (key: 'origin' | 'howToOrder' | 'delivery') => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const activeImage = images[selectedImageIndex] || product.image;

  const currentPrice = product.price * quantity;
  const originalTotal = product.originalPrice * quantity;
  const totalSaved = originalTotal - currentPrice;
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const productUrl = `uttarbangershad.com.bd/p/${product.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${productUrl}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Pre-filled WhatsApp message text matching screenshot
  const prefilledMessage = `Hello DeshiMart! I am interested in ordering this product:

🍯 ${product.name}
৳${currentPrice} (Qty: ${quantity} ${product.unit.split(' ')[0] || 'Unit'})
Link: deshimart.com.bd/p/${product.slug}

Please confirm availability and provide delivery details.`;

  // Frequently bought together (other products)
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 2);

  return (
    <div className="pb-28 text-slate-800">
      {/* 1. Top Breadcrumb & Verified Merchant Bar */}
      <div className="px-4 pt-2 pb-2 bg-white border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Verified Merchant
        </span>
      </div>

      <div className="px-4 pt-1.5 pb-2 text-[11px] text-slate-400">
        <span>Home</span>
        <span className="mx-1.5">›</span>
        <span>{product.category}</span>
        <span className="mx-1.5">›</span>
        <span className="text-slate-600 font-medium">{product.name.split(' ')[0]}</span>
      </div>

      <div className="px-4 space-y-4">
        {/* 2. Shareable Product Link Bar */}
        <div className="flex items-center justify-between gap-2 bg-slate-100/90 border border-slate-200/80 rounded-2xl p-2.5 text-xs">
          <div className="flex items-center gap-2 truncate">
            <Share2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block font-medium">Shareable Product Link</span>
              <span className="text-slate-700 font-mono text-[11px] truncate block">{productUrl}</span>
            </div>
          </div>
          <button
            onClick={handleCopyLink}
            className="shrink-0 flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl font-bold text-xs shadow-2xs transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* 3. Main Hero Product Image */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm aspect-square">
          <img
            src={activeImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Badges on Top Left of Image */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 bg-emerald-500/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
              <Sparkles className="w-3 h-3" />
              100% Raw Wild
            </span>
            <span className="inline-flex items-center gap-1 bg-white/95 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
              <MapPin className="w-3 h-3 text-emerald-600" />
              Satkhira Origin
            </span>
          </div>

          {/* Tap to Expand Button on Bottom Right */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-black/60 hover:bg-black/80 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-xs transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Tap to expand</span>
          </button>
        </div>

        {/* 4. Thumbnail Gallery Row */}
        <div className="flex items-center gap-2.5">
          {['Jar View', 'Texture', 'Lab Cert'].map((label, idx) => {
            const isSelected = selectedImageIndex === idx;
            const thumbImg = images[idx] || images[0];
            return (
              <button
                key={label}
                onClick={() => setSelectedImageIndex(idx % images.length)}
                className={`flex-1 flex flex-col items-center gap-1 p-1 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-full h-14 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={thumbImg}
                    alt={label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-500'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 5. Title, Wishlist & Subtitle */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2.5 rounded-full border transition-all ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* 6. Price & Stock Badges */}
        <div className="space-y-2 pt-1">
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-base text-slate-400 line-through tabular-nums">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                Save {discountPercent}% (৳{product.originalPrice - product.price})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              In Stock (Ready for Dispatch)
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
              <Truck className="w-3.5 h-3.5" />
              COD Available
            </span>
          </div>
        </div>

        {/* 7. Order via WhatsApp Card (ONLINE NOW) */}
        <div className="bg-white rounded-3xl border border-emerald-100 p-4 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#075E54]">
                <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#075E54]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Order via WhatsApp</h3>
                <p className="text-[10px] text-slate-500">Instant chat checkout with our merchant team</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online Now
            </span>
          </div>

          {/* Pre-filled Message Preview Box */}
          <div className="bg-indigo-50/50 rounded-2xl p-3 border border-indigo-100/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              <span>Pre-Filled Message Preview</span>
              <span className="text-slate-400 font-normal">Formatted for WhatsApp</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-indigo-100/60 text-xs text-slate-700 leading-relaxed font-sans shadow-2xs whitespace-pre-line">
              {prefilledMessage}
            </div>
          </div>

          {/* Quantity Selector & WhatsApp Actions */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-slate-700">Select Quantity:</span>
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-slate-700 font-bold px-1 hover:text-emerald-700 text-sm"
              >
                -
              </button>
              <span className="text-xs font-bold w-6 text-center tabular-nums">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="text-slate-700 font-bold px-1 hover:text-emerald-700 text-sm"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => onOpenWhatsApp(product, prefilledMessage, quantity)}
            className="w-full flex items-center justify-center gap-2 bg-[#046A38] hover:bg-[#03532c] text-white py-3 rounded-2xl font-bold text-sm shadow-md shadow-emerald-900/20 transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order via WhatsApp</span>
          </button>

          <button
            onClick={() =>
              onOpenWhatsApp(
                product,
                `Hello DeshiMart! I have a question regarding batch purity, shelf life, or delivery timing for ${product.name}.`,
                quantity
              )
            }
            className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-900 border border-indigo-200 py-2.5 rounded-2xl font-bold text-xs transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-indigo-700" />
            <span>Ask a Question on WhatsApp</span>
          </button>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              No upfront payment required
            </span>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Fast replies
            </span>
          </div>
        </div>

        {/* 8. Product Details & Guide Accordion */}
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Product Details & Guide
          </h2>

          {/* Accordion 1: Harvest Origin & Guarantee */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <button
              onClick={() => toggleAccordion('origin')}
              className="w-full p-4 flex items-center justify-between text-left font-bold text-xs text-slate-900 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Harvest Origin & Guarantee</span>
              </div>
              {accordionOpen.origin ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {accordionOpen.origin && (
              <div className="px-4 pb-4 pt-1 text-xs text-slate-600 space-y-3 border-t border-slate-100">
                <p className="leading-relaxed">
                  {product.harvestOrigin}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block text-[11px]">100% Unpasteurized</span>
                    <span className="text-[10px] text-emerald-700 mt-0.5 block leading-normal">
                      Retains all enzymes, pollen & antioxidants.
                    </span>
                  </div>
                  <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block text-[11px]">Zero Adulteration</span>
                    <span className="text-[10px] text-emerald-700 mt-0.5 block leading-normal">
                      Never mixed with sugar syrup or preservatives.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: How to Order via WhatsApp */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <button
              onClick={() => toggleAccordion('howToOrder')}
              className="w-full p-4 flex items-center justify-between text-left font-bold text-xs text-slate-900 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>How to Order via WhatsApp</span>
              </div>
              {accordionOpen.howToOrder ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {accordionOpen.howToOrder && (
              <div className="px-4 pb-4 pt-1 text-xs text-slate-600 space-y-3 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Tap “Order via WhatsApp”</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      The button opens your WhatsApp with the item title, price, and SKU link already written.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Share Address & Confirm</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Send your delivery address and phone number directly in the chat. Choose Cash on Delivery or bKash.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Get Delivery in 2–3 Days</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      We dispatch your parcel with secure bubble wrap. Inspect before paying cash to the courier.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3: Delivery Rates & Speed */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <button
              onClick={() => toggleAccordion('delivery')}
              className="w-full p-4 flex items-center justify-between text-left font-bold text-xs text-slate-900 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Delivery Rates & Speed</span>
              </div>
              {accordionOpen.delivery ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {accordionOpen.delivery && (
              <div className="px-4 pb-4 pt-1 text-xs text-slate-600 space-y-2 border-t border-slate-100">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Inside Dhaka City</span>
                    <span className="text-[11px] text-slate-500">24 to 48 Hours Delivery</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs">৳60</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">Outside Dhaka (All BD)</span>
                    <span className="text-[11px] text-slate-500">48 to 72 Hours via Steadfast</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs">৳120</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 9. Frequently Bought Together Carousel */}
        {relatedProducts.length > 0 && (
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Frequently Bought Together
              </h2>
              <span className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer">
                View All
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-2.5 flex flex-col justify-between shadow-2xs cursor-pointer hover:border-emerald-300 transition-all"
                >
                  <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{rel.name}</h4>
                    <span className="text-[11px] font-extrabold text-slate-900 block tabular-nums">
                      ৳{rel.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenWhatsApp(rel);
                    }}
                    className="w-full mt-2 bg-[#046A38] hover:bg-[#03532c] text-white py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3 fill-white" />
                    <span>Order</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 10. Sticky Bottom Mobile Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Total Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 tabular-nums">
                ৳{currentPrice.toLocaleString()}
              </span>
              {originalTotal > currentPrice && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ৳{originalTotal.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onOpenWhatsApp(product, prefilledMessage, quantity)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#046A38] hover:bg-[#03532c] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={activeImage}
        title={product.name}
      />
    </div>
  );
};
