import React, { useState } from 'react';
import { Plus, Trash2, ArrowLeft, Package } from 'lucide-react';
import { Product } from '../types';
import { ProductFormModal } from './ProductFormModal';

interface AdminPortalScreenProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddProduct: (product: Product) => void;
  onExitAdmin: () => void;
}

export const AdminPortalScreen: React.FC<AdminPortalScreenProps> = ({
  products,
  onDeleteProduct,
  onAddProduct,
  onExitAdmin,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteConfirm = (id: string) => {
    onDeleteProduct(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-4 px-4 pt-3 pb-24 text-slate-800">
      {/* 1. Header with back to store action */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Admin Panel
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            পণ্য যোগ ও মুছে ফেলার প্যানেল (Add & Remove Products)
          </p>
        </div>

        <button
          onClick={onExitAdmin}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>দোকানে ফিরুন</span>
        </button>
      </div>

      {/* 2. Prominent Add Product Button */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-[#046A38] hover:bg-[#03522b] text-white py-3 px-4 rounded-2xl font-bold text-sm shadow-md shadow-emerald-950/10 transition-all active:scale-[0.99]"
      >
        <Plus className="w-5 h-5" />
        <span>+ নতুন পণ্য যোগ করুন (Add New Product)</span>
      </button>

      {/* 3. Product List Header */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="font-bold text-slate-800">
          বর্তমান পণ্য তালিকা (Total Products: {products.length})
        </span>
      </div>

      {/* 4. Products List with Remove Option */}
      <div className="space-y-2.5">
        {products.length > 0 ? (
          products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs flex items-center justify-between gap-3"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-slate-900 truncate">
                    {prod.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="bg-slate-100 px-1.5 py-0.2 rounded text-[10px] font-semibold text-slate-700">
                      {prod.category}
                    </span>
                    <span className="font-bold text-emerald-800 tabular-nums">
                      ৳{prod.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Remove / Delete Action */}
              <div className="shrink-0">
                {deletingId === prod.id ? (
                  <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                    <button
                      onClick={() => handleDeleteConfirm(prod.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-xl font-bold text-[11px] shadow-xs"
                    >
                      নিশ্চিত মুছুন
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded-xl text-[11px] font-semibold"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingId(prod.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors border border-rose-200/70"
                    title="Remove Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছুন</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2 text-slate-400">
            <Package className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">কোনো পণ্য নেই (No products)</p>
            <p className="text-[11px]">উপরের বাটন দিয়ে নতুন পণ্য যোগ করুন।</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newProduct) => {
          onAddProduct(newProduct);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
};
