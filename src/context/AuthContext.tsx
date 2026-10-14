import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserOrder } from '../types';

interface AuthContextType {
  currentUser: User | null;
  orders: UserOrder[];
  login: (phoneOrEmail: string, role?: 'customer' | 'admin', name?: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => boolean;
  addOrder: (order: Omit<UserOrder, 'id'>) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

// Pre-defined demo users
export const DEMO_USERS: Record<string, User> = {
  customer: {
    id: 'user-c1',
    name: 'Tanvir Shahriar',
    phone: '01712-889900',
    email: 'tanvir@gmail.com',
    address: 'House 14, Road 7, Dhanmondi, Dhaka',
    city: 'Dhaka',
    role: 'customer',
    avatar: 'TS',
  },
  customer2: {
    id: 'user-c2',
    name: 'Nusrat Anjum',
    phone: '01819-334455',
    email: 'nusrat@gmail.com',
    address: 'Sector 4, Uttara, Dhaka',
    city: 'Dhaka',
    role: 'customer',
    avatar: 'NA',
  },
  admin: {
    id: 'user-admin',
    name: 'Nahid (Store Manager)',
    phone: '01712-345678',
    email: 'admin@uttarbangershad.com.bd',
    address: 'House 42, Road 11, Banani Block D, Dhaka',
    city: 'Dhaka',
    role: 'admin',
    avatar: 'UB',
  },
};

const initialDemoOrders: UserOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'UBS-8821',
    date: '10 Oct 2026',
    productName: 'Sundarbans Natural Wild Raw Honey 500g',
    productImage: '',
    quantity: 1,
    totalPrice: 910, // 850 + 60
    status: 'Delivered',
    courierPartner: 'Steadfast Courier',
    courierTracking: 'SF-99214BD',
    estimatedDelivery: 'Delivered on 11 Oct 2026, 4:15 PM',
    deliveryAddress: 'House 14, Road 7, Dhanmondi, Dhaka',
    paymentMethod: 'Cash on Delivery (COD)',
    customerName: 'Tanvir Shahriar',
    customerPhone: '01712-889900',
    timeline: [
      { title: 'Order Confirmed', time: '10 Oct, 10:15 AM', completed: true, description: 'WhatsApp order verified with customer' },
      { title: 'Quality Checked & Packed', time: '10 Oct, 02:30 PM', completed: true, description: 'Sealed with tamper-proof bubble wrap at Banani Hub' },
      { title: 'Handed to Steadfast Courier', time: '10 Oct, 06:45 PM', completed: true, description: 'Dispatched with tracking code SF-99214BD' },
      { title: 'Out for Delivery in Dhanmondi', time: '11 Oct, 11:20 AM', completed: true, description: 'Courier rider en route' },
      { title: 'Delivered Successfully', time: '11 Oct, 04:15 PM', completed: true, current: true, description: 'Parcel inspected and BDT 910 collected' }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'UBS-8942',
    date: 'Yesterday',
    productName: 'Tangail Handloom Khadi Kurta',
    productImage: '',
    quantity: 1,
    totalPrice: 1510,
    status: 'Out for Delivery',
    courierPartner: 'Pathao Courier',
    courierTracking: 'PT-440192',
    estimatedDelivery: 'Today by 7:00 PM',
    deliveryAddress: 'House 8, Sector 4, Uttara, Dhaka',
    paymentMethod: 'bKash Merchant Pay',
    customerName: 'Nusrat Anjum',
    customerPhone: '01819-334455',
    timeline: [
      { title: 'Order Confirmed', time: 'Yesterday, 11:30 AM', completed: true, description: 'Item reserved from Tangail weaver stock' },
      { title: 'Quality Checked & Packed', time: 'Yesterday, 04:00 PM', completed: true, description: 'Folded in eco-friendly protective carton' },
      { title: 'In Transit to Uttara Hub', time: 'Yesterday, 08:15 PM', completed: true, description: 'Sorted at Tejgaon transit hub' },
      { title: 'Out for Delivery', time: 'Today, 09:45 AM', completed: true, current: true, description: 'Rider is on the way to Uttara Sector 4' },
      { title: 'Delivered & Completed', time: 'Pending Delivery', completed: false, description: 'Payment pre-confirmed via bKash' }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: 'UBS-9104',
    date: 'Today, 10:20 AM',
    productName: 'Cold Pressed Extra Virgin Mustard Oil 1L & Ghee Duo',
    productImage: '',
    quantity: 2,
    totalPrice: 1580,
    status: 'Processing',
    courierPartner: 'Steadfast Courier',
    courierTracking: 'SF-104928BD',
    estimatedDelivery: 'Tomorrow, 24-48 Hours',
    deliveryAddress: 'Mirpur DOHS, Dhaka',
    paymentMethod: 'Cash on Delivery (COD)',
    customerName: 'Rashedul Karim',
    customerPhone: '01912-778899',
    timeline: [
      { title: 'Order Confirmed on WhatsApp', time: 'Today, 10:20 AM', completed: true, current: true, description: 'Order bot registered item and batch reservation' },
      { title: 'Packing at Banani Warehouse', time: 'In Progress', completed: false, description: 'Glass bottles being bubble wrapped in foam boxes' },
      { title: 'Courier Handover', time: 'Estimated 05:00 PM Today', completed: false, description: 'Awaiting courier scan at Banani Hub' },
      { title: 'Out for Delivery', time: 'Tomorrow', completed: false, description: 'Final mile delivery in Mirpur, Dhaka' },
      { title: 'Delivered', time: 'Pending', completed: false, description: 'Cash collection upon parcel inspection' }
    ]
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ubs_current_user');
      return saved ? JSON.parse(saved) : DEMO_USERS.customer;
    } catch {
      return DEMO_USERS.customer;
    }
  });

  const [orders, setOrders] = useState<UserOrder[]>(() => {
    try {
      const saved = localStorage.getItem('ubs_user_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return initialDemoOrders;
    } catch {
      return initialDemoOrders;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ubs_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('ubs_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('ubs_user_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const login = (phoneOrEmail: string, role: 'customer' | 'admin' = 'customer', name?: string) => {
    // If matching known demo admin
    if (phoneOrEmail.toLowerCase().includes('admin') || role === 'admin') {
      setCurrentUser(DEMO_USERS.admin);
      setIsAuthModalOpen(false);
      return true;
    }

    // Default or custom customer user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || (phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Valued Customer'),
      phone: phoneOrEmail.includes('@') ? '01712-000000' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
      address: 'Dhaka, Bangladesh',
      city: 'Dhaka',
      role: 'customer',
      avatar: (name ? name[0] : 'U').toUpperCase(),
    };

    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (data: Omit<User, 'id'>) => {
    const newUser: User = {
      ...data,
      id: `user-${Date.now()}`,
      avatar: data.name ? data.name.charAt(0).toUpperCase() : 'U',
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const addOrder = (orderData: Omit<UserOrder, 'id'>) => {
    const trackingCode = `SF-${Math.floor(100000 + Math.random() * 900000)}BD`;
    const newOrder: UserOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      courierPartner: orderData.courierPartner || 'Steadfast Courier',
      courierTracking: orderData.courierTracking || trackingCode,
      estimatedDelivery: orderData.estimatedDelivery || 'Within 24 to 48 Hours',
      timeline: orderData.timeline || [
        { title: 'Order Confirmed', time: 'Just now', completed: true, current: true, description: 'WhatsApp order recorded in Uttarbanger Shad system' },
        { title: 'Packing & Sealing', time: 'In Queue', completed: false, description: 'Being packed at Banani dispatch center' },
        { title: 'Handed to Courier', time: 'Pending', completed: false, description: `Courier code: ${trackingCode}` },
        { title: 'Out for Delivery', time: 'Tomorrow', completed: false, description: 'Rider dispatch to customer location' },
        { title: 'Delivered', time: 'Pending', completed: false, description: 'Payment collection on delivery' }
      ]
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        orders,
        login,
        logout,
        register,
        addOrder,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
