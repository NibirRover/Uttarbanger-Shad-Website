import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { UserOrder } from '../types';
import { useAuth } from '../context/AuthContext';

interface OrderStatusTrackerProps {
  initialOrderId?: string;
  onOpenWhatsApp?: (customMessage?: string) => void;
  onBackToHome?: () => void;
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  initialOrderId = '',
  onOpenWhatsApp,
  onBackToHome,
}) => {
  const { orders } = useAuth();
  const [searchInput, setSearchInput] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState<UserOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // If initialOrderId is passed, look it up automatically
  useEffect(() => {
    if (initialOrderId) {
      setSearchInput(initialOrderId);
      handleSearch(initialOrderId);
    } else if (orders.length > 0) {
      // Default to the latest active order for immediate customer view
      setSearchedOrder(orders[1] || orders[0]);
      setSearchInput((orders[1] || orders[0]).orderNumber);
      setHasSearched(true);
    }
  }, [initialOrderId, orders]);

  const handleSearch = (queryToUse?: string) => {
    const q = (queryToUse !== undefined ? queryToUse : searchInput).trim().toLowerCase();
    if (!q) return;

    setHasSearched(true);

    // Search by orderNumber, phone, tracking number, or id
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === q ||
        o.orderNumber.toLowerCase().includes(q) ||
        (o.courierTracking && o.courierTracking.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q))
    );

    setSearchedOrder(found || null);
  };

  const handleCopy = (text: string, type: 'order' | 'tracking') => {
    navigator.clipboard.writeText(text);
    if (type === 'order') {
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } else {
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const getStatusBadgeClass = (status: UserOrder['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Dispatched':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-24 text-slate-800 max-w-md mx-auto animate-in fade-in duration-200">
      {/* 1. Header with Title & Back Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-5 h-5 text-emerald-700" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Order Status Tracking
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            রিয়েল-টাইম ডেলিভারি ট্র্যাকিং (Steadfast & Pathao Courier)
          </p>
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition-colors"
          >
            দোকানে ফিরুন
          </button>
        )}
      </div>

      {/* 2. Order ID Search Input Box */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-800">
          অর্ডার নম্বর দিয়ে সার্চ করুন (Enter Order ID or Phone):
        </label>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. UBS-8821, UBS-8942, UBS-9104"
              className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-2xl pl-10 pr-3 py-2.5 text-xs font-mono font-semibold text-slate-900 placeholder:font-sans placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 bg-[#046A38] hover:bg-[#03522b] text-white rounded-2xl font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>ট্র্যাক করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Sample Order Pills for Easy Testing */}
        <div className="pt-1 border-t border-slate-100">
          <span className="text-[10px] text-slate-500 block mb-1.5 font-medium">
            নমুনা অর্ডার আইডি সিলেক্ট করুন (Tap sample ID):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchInput(o.orderNumber);
                  handleSearch(o.orderNumber);
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-xl border transition-all ${
                  searchedOrder?.orderNumber === o.orderNumber
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span>{o.orderNumber}</span>
                <span className="text-[9px] ml-1 text-slate-500 font-sans">
                  ({o.status})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Search Results: Order Details & Live Timeline */}
      {searchedOrder ? (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {/* Card A: Order Summary Banner */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900 text-base">
                    #{searchedOrder.orderNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(searchedOrder.orderNumber, 'order')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Copy Order ID"
                  >
                    {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Placed: {searchedOrder.date}
                </p>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(
                  searchedOrder.status
                )}`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span>{searchedOrder.status}</span>
              </span>
            </div>

            {/* Courier & Delivery ETA strip */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  কুরিয়ার পার্টনার:
                </span>
                <span className="font-bold text-slate-800">
                  {searchedOrder.courierPartner || 'Steadfast Courier'}
                </span>
              </div>

              {searchedOrder.courierTracking && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">ট্র্যাকিং নম্বর:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-800">
                    <span>{searchedOrder.courierTracking}</span>
                    <button
                      onClick={() => handleCopy(searchedOrder.courierTracking!, 'tracking')}
                      className="p-0.5 text-slate-400 hover:text-slate-600"
                      title="Copy Tracking ID"
                    >
                      {copiedTracking ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  আনুমানিক ডেলিভারি (ETA):
                </span>
                <span className="font-bold text-indigo-900">
                  {searchedOrder.estimatedDelivery || '24-48 Hours'}
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Visual Stepper / Delivery Milestones Timeline */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>ডেলিভারি ট্র্যাকিং অগ্রগতি (Milestone Steps)</span>
            </h3>

            <div className="relative pl-6 space-y-4 pt-1">
              {/* Vertical connecting line */}
              <div className="absolute left-2.5 top-2 bottom-3 w-0.5 bg-slate-200" />

              {(searchedOrder.timeline || []).map((step, idx) => {
                const isCompleted = step.completed;
                const isCurrent = step.current;

                return (
                  <div key={idx} className="relative">
                    {/* Circle Milestone Icon */}
                    <div
                      className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-blue-600 border-blue-400 text-white animate-pulse'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs font-bold ${
                            isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {step.time}
                        </span>
                      </div>

                      {step.description && (
                        <p
                          className={`text-[11px] mt-0.5 leading-relaxed ${
                            isCompleted || isCurrent ? 'text-slate-600' : 'text-slate-400'
                          }`}
                        >
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card C: Delivery Address & Item Details */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-600" />
              <span>ডেলিভারি ঠিকানা ও পণ্য বিবরণ</span>
            </h3>

            <div className="bg-slate-50 rounded-2xl p-3 space-y-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">গন্তব্য ঠিকানা (Address):</span>
                <span className="font-bold text-slate-800">{searchedOrder.deliveryAddress}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500">পণ্য (Item):</span>
                <span className="font-bold text-slate-900 text-right max-w-[65%] truncate">
                  {searchedOrder.productName}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/60 pt-1">
                <span className="text-slate-500">পরিমাণ (Quantity):</span>
                <span className="font-bold text-slate-800">{searchedOrder.quantity} Unit(s)</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/60 pt-1">
                <span className="text-slate-500">পরিশোধ পদ্ধতি (Payment):</span>
                <span className="font-semibold text-emerald-800">{searchedOrder.paymentMethod}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/60 pt-1 text-xs">
                <span className="font-bold text-slate-800">সর্বমোট (Total Amount):</span>
                <span className="font-black text-slate-900 text-sm tabular-nums">
                  ৳{searchedOrder.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Card D: WhatsApp Help for this Specific Order */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-xs text-emerald-950">
                ডেলিভারি নিয়ে কোনো জিজ্ঞাসা আছে?
              </h4>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                অর্ডার #{searchedOrder.orderNumber} সম্পর্কে WhatsApp এ সরাসরি জানতে ট্যাপ করুন।
              </p>
            </div>

            <button
              onClick={() => {
                const message = `Hello Uttarbanger Shad! I am inquiring about the delivery status of my order #${searchedOrder.orderNumber} (${searchedOrder.productName}). Could you please provide an update on dispatch/courier?`;
                if (onOpenWhatsApp) {
                  onOpenWhatsApp(message);
                } else {
                  const url = `https://wa.me/8801712345678?text=${encodeURIComponent(message)}`;
                  window.open(url, '_blank', 'noopener,noreferrer');
                }
              }}
              className="bg-[#046A38] hover:bg-[#03522b] text-white p-2.5 rounded-2xl shadow-xs shrink-0 flex items-center justify-center transition-transform active:scale-95"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
            </button>
          </div>
        </div>
      ) : hasSearched ? (
        /* Empty / Not Found State */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              অর্ডারটি পাওয়া যায়নি (Order Not Found)
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              "{searchInput}" নম্বরের কোনো অর্ডার ডাটাবেজে মেলেনি। অনুগ্রহ করে WhatsApp মেসেজের অর্ডার আইডি অথবা সঠিক মোবাইল নম্বর প্রদান করুন।
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2 max-w-xs mx-auto">
            <button
              onClick={() => {
                if (orders.length > 0) {
                  setSearchInput(orders[0].orderNumber);
                  handleSearch(orders[0].orderNumber);
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>নমুনা অর্ডার #{orders[0]?.orderNumber || 'UBS-8821'} দেখুন</span>
            </button>

            <button
              onClick={() => {
                const message = `Hello Uttarbanger Shad! I need help finding my order details for order ID or phone: ${searchInput}`;
                if (onOpenWhatsApp) {
                  onOpenWhatsApp(message);
                } else {
                  window.open(`https://wa.me/8801712345678?text=${encodeURIComponent(message)}`, '_blank');
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#046A38] hover:bg-[#03522b] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp এ সহায়তা নিন</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
