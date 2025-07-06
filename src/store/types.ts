export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

// Supabase User Interfaces
export interface UserIdentity {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
}

export interface UserAppMetadata {
  provider: string;
  providers: string[];
}

export interface UserUserMetadata {
  email_verified: boolean;
}

export interface SupabaseUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: UserAppMetadata;
  user_metadata: UserUserMetadata;
  identities: UserIdentity[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

// Extended user interface for your app
export interface User extends SupabaseUser {
  // Add any additional fields your app needs
  displayName?: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
}

export interface UserActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
    search: string;
  };
}

export interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  selectedOrder: Order | null;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface RootState {
  products: ProductsState;
  orders: OrdersState;
  cart: CartState;
} 