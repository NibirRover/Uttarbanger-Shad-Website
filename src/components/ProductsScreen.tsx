import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Check, X, RotateCcw, MessageCircle, AlertCircle } from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface ProductsScreenProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onCategoryChange: (cat: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onOpenWhatsApp: (product?: Product) => void;
  initialSearchQuery?: string;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  products,
  selectedCategory,
  onCategoryChange,
  onSelectProduct,
  onOpenWhatsApp,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [simulateEmpty, setSimulateEmpty] = useState(false);

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All', value: 'All' },
    { label: 'Grocery & Pantry', value: 'Grocery & Pantry' },
    { label: 'Fashion', value: 'Fashion' },
    { label: 'Tea & Drink', value: 'Tea & Drink' },
    { label: 'Artisan Crafts', value: 'Artisan Crafts' },
  ];

  const filteredProducts = useMemo(() => {
    if (simulateEmpty) return [];

    let list = [...products];

    // Filter by live/active
    list = list.filter((p) => p.isLiveOnWhatsApp);

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by In Stock
    if (inStockOnly) {
      list = list.filter((p) => p.stockStatus !== 'out_of_stock');
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // Most popular / default
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [products, selectedCategory, inStockOnly, searchQuery, sortBy, simulateEmpty]);

  return (
    <div className="space-y-4 px-4 pt-3 pb-24">
      {/* 1. Search Bar with Filter Icon */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search honey, tea, clothing, spice"
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`p-2.5 rounded-2xl border transition-colors ${
            inStockOnly
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Toggle Filter"
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#046A38] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Sort & Simulator Controls */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Sort Select */}
        <div className="relative inline-flex items-center">
          <label htmlFor="sort-select" className="text-slate-500 font-bold mr-1 text-[11px]">SORT:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1 pr-6 font-semibold text-slate-800 text-xs focus:outline-none focus:border-emerald-600"
          >
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 pointer-events-none" />
        </div>

        {/* Simulate Empty Toggle */}
        <button
          onClick={() => setSimulateEmpty(!simulateEmpty)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
            simulateEmpty
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Simulate Empty</span>
          {simulateEmpty && <Check className="w-3 h-3 text-amber-800" />}
        </button>
      </div>

      {/* 4. Results Status & Active Filter Badges */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
          <span>Showing {filteredProducts.length} Products</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium text-[11px]">Dhaka Region</span>
        </div>

        {inStockOnly && !simulateEmpty && (
          <button
            onClick={() => setInStockOnly(false)}
            className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <span>In Stock</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 5. Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="group bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              {/* Product Card Image Container */}
              <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Save & Origin Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                  {prod.discountAmount && prod.discountAmount > 0 && (
                    <span className="bg-emerald-700/95 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                      Save ৳{prod.discountAmount}
                    </span>
                  )}
                  {prod.regionBadge && (
                    <span className="bg-white/95 text-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                      {prod.regionBadge}
                    </span>
                  )}
                </div>

                {/* In Stock Badge Bottom Right */}
                <div className="absolute bottom-2 right-2">
                  <span className="inline-flex items-center gap-1 bg-white/95 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    In Stock
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                    {prod.category}
                  </span>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
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

                {/* Order via WhatsApp Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenWhatsApp(prod);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#046A38] hover:bg-[#03552d] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Order via WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3 my-6">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {simulateEmpty
              ? 'Empty state simulation active. Tap the button below to restore full product catalog.'
              : 'Try clearing your search term or switching product categories.'}
          </p>
          <button
            onClick={() => {
              setSimulateEmpty(false);
              setSearchQuery('');
              onCategoryChange('All');
              setInStockOnly(false);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters & Reload Catalog</span>
          </button>
        </div>
      )}
    </div>
  );
};
