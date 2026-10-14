import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';
import { Product, ProductCategory } from '../types';

import honeyImg from '../assets/images/honey_sundarbans_1791870127471.jpg';
import kurtaImg from '../assets/images/kurta_handloom_1791870128274.jpg';
import oilImg from '../assets/images/mustard_oil_1791870129165.jpg';
import teaImg from '../assets/images/tea_sylhet_1791870130131.jpg';
import gheeImg from '../assets/images/ghee_bilona_1791870129999.jpg';
import pickleImg from '../assets/images/pickle_mango_1791870160591.jpg';
import doiImg from '../assets/images/doi_bogura_1791870161939.jpg';
import terracottaImg from '../assets/images/terracotta_tea_1791870161014.jpg';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const PRESET_IMAGES = [
  { label: 'Honey', src: honeyImg },
  { label: 'Ghee', src: gheeImg },
  { label: 'Tea', src: teaImg },
  { label: 'Mustard Oil', src: oilImg },
  { label: 'Panjabi/Kurta', src: kurtaImg },
  { label: 'Pickle/Achar', src: pickleImg },
  { label: 'Misti Doi', src: doiImg },
  { label: 'Clay Pottery', src: terracottaImg },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Grocery & Pantry');
  const [region, setRegion] = useState('Sundarbans Forest');
  const [price, setPrice] = useState<number>(500);
  const [originalPrice, setOriginalPrice] = useState<number>(600);
  const [subtitle, setSubtitle] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>(honeyImg);
  const [customImageUrl, setCustomImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      region: region.trim() || 'Bangladesh Origin',
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      discountAmount: Math.max(0, Number(originalPrice) - Number(price)),
      stockStatus: 'in_stock',
      stockCount: 20,
      stockUnitLabel: 'In Stock',
      rating: 5.0,
      reviewsCount: 1,
      isLiveOnWhatsApp: true,
      image: customImageUrl.trim() || selectedImage,
      unit: '1 Unit',
      subtitle: subtitle.trim() || '100% Authentic verified artisan staple from Bangladesh',
      description: 'Single-origin handcrafted product sourced directly from local artisans.',
      harvestOrigin: region.trim() || 'Bangladesh',
      features: ['100% Pure authentic batch', 'Hand-harvested / handwoven'],
      sku: `UBS-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    onSave(newProduct);
    // Reset form
    setName('');
    setPrice(500);
    setOriginalPrice(600);
    setSubtitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#046A38] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm">নতুন পণ্য যোগ করুন (Add Product)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3 text-xs text-slate-700">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              পণ্যের নাম (Product Title) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sundarbans Raw Khalsi Honey 500g"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-800 mb-1">ক্যাটাগরি (Category)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white text-xs"
              >
                <option value="Grocery & Pantry">Grocery & Pantry</option>
                <option value="Fashion">Fashion</option>
                <option value="Tea & Drink">Tea & Drink</option>
                <option value="Dairy">Dairy</option>
                <option value="Artisan Crafts">Artisan Crafts</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">উৎস / অঞ্চল (Region)</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Satkhira, Sundarbans"
                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-800 mb-1">বিক্রয় মূল্য (Price ৳) *</label>
              <input
                type="number"
                required
                min="10"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:outline-none font-bold text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">আসল মূল্য (Regular ৳)</label>
              <input
                type="number"
                min="10"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">সংক্ষিপ্ত বিবরণ (Subtitle)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Hand-harvested natural raw honey batch"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs"
            />
          </div>

          {/* Image Selector Presets */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              পণ্যের ছবি নির্বাচন করুন (Select Photo):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES.map((img) => {
                const isSelected = selectedImage === img.src && !customImageUrl;
                return (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img.src);
                      setCustomImageUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden border aspect-square p-0.5 transition-all ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#046A38] hover:bg-[#03522b] text-white py-3 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>পণ্য সংরক্ষণ করুন (Add Product)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
