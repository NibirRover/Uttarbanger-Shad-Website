import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, CheckCheck, Truck, ShieldCheck, Phone } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  customMessage?: string;
  initialQuantity?: number;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  product,
  customMessage,
  initialQuantity = 1,
}) => {
  const { currentUser, addOrder } = useAuth();
  const [quantity, setQuantity] = useState(initialQuantity);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'order_form' | 'chat_simulator'>('order_form');

  // Sync if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!customerPhone) setCustomerPhone(currentUser.phone);
      if (!customerAddress && currentUser.address) setCustomerAddress(currentUser.address);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const deliveryCharge = deliveryArea === 'dhaka' ? 60 : 120;
  const itemTotal = (product ? product.price : 0) * quantity;
  const grandTotal = itemTotal + deliveryCharge;

  const defaultFormattedMessage = product
    ? `Hello DeshiMart / Uttarbanger Shad! I am interested in ordering this product:

📦 *${product.name}*
💰 Price: ৳${product.price} (Qty: ${quantity} ${product.unit.split(' ')[0] || 'Unit'})
🏷️ Item Total: ৳${itemTotal}
🚚 Delivery (${deliveryArea === 'dhaka' ? 'Inside Dhaka City' : 'Outside Dhaka BD'}): ৳${deliveryCharge}
💵 *Grand Total: ৳${grandTotal}*
🔗 Link: uttarbangershad.com.bd/p/${product.slug}

*Customer Details:*
👤 Name: ${customerName || '[My Name]'}
📱 Phone: ${customerPhone || '[My Phone]'}
📍 Address: ${customerAddress || '[My Delivery Address]'}
💳 Preferred Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : paymentMethod === 'bkash' ? 'bKash Mobile Banking' : 'Nagad Mobile Banking'}

Please confirm availability and dispatch details.`
    : customMessage || `Hello Uttarbanger Shad! I would like to inquire about your authentic organic catalog and custom orders.`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(defaultFormattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenRealWhatsApp = () => {
    if (product) {
      addOrder({
        orderNumber: `UBS-${Math.floor(1000 + Math.random() * 9000)}`,
        date: 'Just now',
        productName: product.name,
        productImage: product.image,
        quantity,
        totalPrice: grandTotal,
        status: 'Confirmed',
        courierTracking: 'Preparing for pickup',
        deliveryAddress: customerAddress || (currentUser?.address || 'Dhaka, Bangladesh'),
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : paymentMethod === 'bkash' ? 'bKash' : 'Nagad',
      });
    }
    const encodedText = encodeURIComponent(defaultFormattedMessage);
    const whatsappUrl = `https://wa.me/8801712345678?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* WhatsApp Styled Header */}
        <div className="bg-[#075E54] text-white px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center font-bold text-white text-sm">
                UB
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">Uttarbanger Shad Official</span>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-[11px] text-emerald-200">
                +880 1712-345678 • Typically replies in seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => setActiveView('order_form')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeView === 'order_form'
                ? 'border-emerald-600 text-emerald-800 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            WhatsApp Order Preview
          </button>
          <button
            onClick={() => setActiveView('chat_simulator')}
            className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
              activeView === 'chat_simulator'
                ? 'border-emerald-600 text-emerald-800 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Live Bot Simulation
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-800">
          {activeView === 'order_form' ? (
            <>
              {/* If product ordering */}
              {product && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{product.name}</h4>
                      <p className="text-[11px] text-slate-500">Unit: {product.unit}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-2 py-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-slate-600 font-bold px-1.5 hover:text-slate-900"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-slate-600 font-bold px-1.5 hover:text-slate-900"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Customer Quick Address inputs */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Tanvir"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="017XXXXXXXX"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Delivery Destination</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setDeliveryArea('dhaka')}
                        className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between ${
                          deliveryArea === 'dhaka'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-medium'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <span>Dhaka City</span>
                        <span className="font-bold">৳60</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryArea('outside')}
                        className={`py-1.5 px-2 rounded-lg border text-left flex items-center justify-between ${
                          deliveryArea === 'outside'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-medium'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <span>Outside Dhaka</span>
                        <span className="font-bold">৳120</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Full Delivery Address</label>
                    <input
                      type="text"
                      placeholder="House / Road / Area / District"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`py-1 px-1.5 rounded-lg border text-center ${
                          paymentMethod === 'cod'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-medium'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        Cash on Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bkash')}
                        className={`py-1 px-1.5 rounded-lg border text-center ${
                          paymentMethod === 'bkash'
                            ? 'border-pink-500 bg-pink-50 text-pink-900 font-medium'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        bKash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('nagad')}
                        className={`py-1 px-1.5 rounded-lg border text-center ${
                          paymentMethod === 'nagad'
                            ? 'border-orange-500 bg-orange-50 text-orange-900 font-medium'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        Nagad
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Formatted Message Chat Preview Box */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-slate-700">Pre-filled WhatsApp Message</span>
                  <button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-[11px] font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                  </button>
                </div>

                <div className="bg-[#EFEAE2] p-3 rounded-2xl border border-slate-300/80 shadow-inner relative font-sans text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  <div className="bg-[#DCF8C6] p-3 rounded-xl rounded-tr-none shadow-xs border border-emerald-200">
                    {defaultFormattedMessage}
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 mt-1">
                      <span>Just now</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Live Bot Simulator */
            <div className="bg-[#EFEAE2] p-3 rounded-2xl border border-slate-300/80 min-h-[300px] flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="text-center">
                  <span className="bg-white/80 backdrop-blur-xs text-[10px] text-slate-600 px-3 py-1 rounded-full shadow-xs">
                    Messages are end-to-end encrypted • Banani HQ
                  </span>
                </div>

                {/* Incoming merchant greetings */}
                <div className="bg-white p-2.5 rounded-xl rounded-tl-none max-w-[85%] shadow-xs text-xs">
                  <p className="font-semibold text-emerald-800 text-[11px] mb-0.5">DeshiMart Merchant Bot</p>
                  <p>Assalamu Alaikum! Welcome to Uttarbanger Shad. How can we assist your order today?</p>
                  <span className="text-[9px] text-slate-400 block text-right mt-1">10:00 AM</span>
                </div>

                {/* Customer order preview */}
                <div className="bg-[#DCF8C6] p-2.5 rounded-xl rounded-tr-none max-w-[85%] ml-auto shadow-xs text-xs">
                  <p>Order: {product?.name || 'Sundarbans Wild Honey 500g'}</p>
                  <p className="font-semibold mt-1">৳{grandTotal} (COD confirmed)</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-500 mt-0.5">
                    <span>10:01 AM</span>
                    <CheckCheck className="w-3 h-3 text-blue-500" />
                  </div>
                </div>

                {/* Instant Bot response */}
                <div className="bg-white p-2.5 rounded-xl rounded-tl-none max-w-[85%] shadow-xs text-xs space-y-1">
                  <p className="font-semibold text-emerald-800 text-[11px]">Merchant Support (Nahid, Dhaka)</p>
                  <p>Batch confirmed fresh! We are dispatching your parcel via Steadfast Courier within 24 hours.</p>
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100">
                    🚚 Tracking code will be auto-messaged upon courier handover. No advance payment required!
                  </p>
                  <span className="text-[9px] text-slate-400 block text-right mt-0.5">10:02 AM</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-xl flex items-center gap-2 border border-slate-200">
                <input
                  type="text"
                  placeholder="Type a message on WhatsApp..."
                  readOnly
                  value="Ready to confirm order via WhatsApp"
                  className="flex-1 text-xs text-slate-600 bg-transparent focus:outline-none"
                />
                <button
                  onClick={handleOpenRealWhatsApp}
                  className="bg-[#25D366] text-white p-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          <button
            onClick={handleOpenRealWhatsApp}
            className="w-full flex items-center justify-center gap-2 bg-[#046A38] hover:bg-[#03532c] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Open WhatsApp & Send Order</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Cash on Delivery Available
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              24-48h Dhaka Courier
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
