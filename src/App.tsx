import React, { useState } from 'react';
import { initialProducts, reviewChats } from './data/products';
import { Product, ProductCategory, ActiveTab } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { WhatsAppModal } from './components/WhatsAppModal';
import { HomeScreen } from './components/HomeScreen';
import { ProductsScreen } from './components/ProductsScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { DealsScreen } from './components/DealsScreen';
import { AdminPortalScreen } from './components/AdminPortalScreen';
import { ProfileModal } from './components/ProfileModal';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { OrderStatusTracker } from './components/OrderStatusTracker';

function MainStorefront() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  
  // WhatsApp checkout modal state
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalCustomMessage, setModalCustomMessage] = useState<string | undefined>();
  const [modalQuantity, setModalQuantity] = useState<number>(1);

  // Profile modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Handlers
  const handleNavigateToTracking = (orderId?: string) => {
    if (orderId) {
      setTrackingOrderId(orderId);
    }
    setSelectedProduct(null);
    setActiveTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWhatsApp = (
    product?: Product,
    customMessage?: string,
    quantity?: number
  ) => {
    setModalProduct(product || null);
    setModalCustomMessage(customMessage);
    setModalQuantity(quantity || 1);
    setWhatsAppModalOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  const handleNavigateToProducts = (category?: ProductCategory) => {
    if (category) {
      setSelectedCategory(category);
    }
    setSelectedProduct(null);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: ActiveTab) => {
    setSelectedProduct(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProduct?.id === updated.id) {
      setSelectedProduct(updated);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans antialiased text-slate-800 flex justify-center">
      {/* Mobile-first App Container */}
      <div className="w-full max-w-md min-h-screen bg-[#F8FAFC] shadow-2xl relative border-x border-slate-200/80 flex flex-col">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenWhatsApp={() => handleOpenWhatsApp()}
          onOpenSearch={() => handleNavigateToProducts()}
          onOpenProfile={() => setProfileModalOpen(true)}
          isDetailView={Boolean(selectedProduct)}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {selectedProduct ? (
            <ProductDetailScreen
              product={selectedProduct}
              allProducts={products}
              onBack={handleBackToProducts}
              onOpenWhatsApp={handleOpenWhatsApp}
              onSelectProduct={handleSelectProduct}
            />
          ) : activeTab === 'home' ? (
            <HomeScreen
              products={products}
              reviews={reviewChats}
              onSelectProduct={handleSelectProduct}
              onNavigateToProducts={handleNavigateToProducts}
              onOpenWhatsApp={(prod) => handleOpenWhatsApp(prod)}
              onNavigateToTracking={handleNavigateToTracking}
            />
          ) : activeTab === 'products' ? (
            <ProductsScreen
              products={products}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onSelectProduct={handleSelectProduct}
              onOpenWhatsApp={(prod) => handleOpenWhatsApp(prod)}
            />
          ) : activeTab === 'deals' ? (
            <DealsScreen
              products={products}
              onOpenWhatsApp={(prod, msg) => handleOpenWhatsApp(prod, msg)}
              onSelectProduct={handleSelectProduct}
            />
          ) : activeTab === 'tracking' ? (
            <OrderStatusTracker
              initialOrderId={trackingOrderId}
              onOpenWhatsApp={(msg) => handleOpenWhatsApp(undefined, msg)}
              onBackToHome={() => setActiveTab('home')}
            />
          ) : (
            <AdminPortalScreen
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onAddProduct={handleAddProduct}
              onExitAdmin={() => setActiveTab('home')}
            />
          )}
        </main>

        {/* Floating WhatsApp Help Pill */}
        {!selectedProduct && activeTab !== 'tracking' && (
          <FloatingWhatsApp onClick={() => handleOpenWhatsApp()} />
        )}

        {/* Fixed Bottom Navigation Bar */}
        {!selectedProduct && (
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        )}

        {/* Interactive WhatsApp Order Checkout Modal */}
        <WhatsAppModal
          isOpen={whatsAppModalOpen}
          onClose={() => setWhatsAppModalOpen(false)}
          product={modalProduct}
          customMessage={modalCustomMessage}
          initialQuantity={modalQuantity}
        />

        {/* Profile & Account Modal with Login/Logout */}
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          onSwitchToAdmin={() => handleTabChange('admin')}
          onOpenWhatsApp={() => handleOpenWhatsApp()}
          onTrackOrder={handleNavigateToTracking}
        />

        {/* Standalone Login / Sign Up Modal */}
        <AuthModal />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainStorefront />
    </AuthProvider>
  );
}

