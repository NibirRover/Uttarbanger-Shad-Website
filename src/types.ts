export type ProductCategory = 
  | 'All'
  | 'Grocery & Pantry'
  | 'Fashion'
  | 'Tea & Drink'
  | 'Dairy'
  | 'Artisan Crafts';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  region: string;
  badgeTag?: string;
  regionBadge?: string;
  price: number;
  originalPrice: number;
  discountAmount?: number;
  stockStatus: StockStatus;
  stockCount: number;
  stockUnitLabel?: string;
  rating: number;
  reviewsCount: number;
  isLiveOnWhatsApp: boolean;
  image: string;
  gallery?: string[];
  unit: string;
  subtitle: string;
  description: string;
  harvestOrigin: string;
  features: string[];
  badgeLabels?: string[];
  sku: string;
}

export interface ReviewChat {
  id: string;
  authorInitials: string;
  authorName: string;
  location: string;
  message: string;
  timeAgo: string;
  verified: boolean;
  productName?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  role: 'customer' | 'admin';
  avatar?: string;
}

export interface OrderTimelineStep {
  title: string;
  time: string;
  completed: boolean;
  current?: boolean;
  description?: string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  date: string;
  productName: string;
  productImage: string;
  quantity: number;
  totalPrice: number;
  status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  courierPartner?: string;
  courierTracking?: string;
  estimatedDelivery?: string;
  deliveryAddress: string;
  paymentMethod: string;
  customerName?: string;
  customerPhone?: string;
  timeline?: OrderTimelineStep[];
}

export type ActiveTab = 'home' | 'products' | 'deals' | 'admin' | 'tracking';
