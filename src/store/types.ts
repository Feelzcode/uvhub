export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  stock: number;
  rating: number;
  reviews: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  created_at: Date;
  product?: Product; // Optional for when we join with products
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  customer: Customer;
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
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[]; // Optional for when we join with order items
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

// Currency Types
export type Currency = 'NGN' | 'GHS' | 'USD';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate relative to USD
}

export interface LocationInfo {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
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

export interface FileState {
  file: File | null;
  isUploading: boolean;
  error: string;
}

export interface FileActions {
  uploadFile: (file: File) => Promise<void>;
  setFile: (file: File | null) => void;
  setIsUploading: (isUploading: boolean) => void;
  setError: (error: string) => void;
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


export interface PaginatedResponse<T> {
  documents: T[];
  total: number;
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: number | null;
    nextPage: number | null;
  };

// Currency State
export interface CurrencyState {
  currentCurrency: Currency;
  location: LocationInfo | null;
  loading: boolean;
  error: string | null;
  currencies: Record<Currency, CurrencyInfo>;
}

export interface CurrencyActions {
  setCurrency: (currency: Currency) => void;
  setLocation: (location: LocationInfo) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  detectLocation: () => Promise<void>;
  formatPrice: (price: number, currency?: Currency) => string;
  convertPrice: (price: number, fromCurrency: Currency, toCurrency: Currency) => number;
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
  categories: Category[];
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
  file: FileState;
  user: UserState;
  fileActions: FileActions;
  userActions: UserActions;
}

// Upload Response Interfaces
export interface UploadFileMeta {
  name: string;
  type: string;
  bucketName: string;
  objectName: string;
  contentType: string;
}

export interface UploadProgress {
  uploadStarted: number;
  uploadComplete: boolean;
  bytesUploaded: number;
  bytesTotal: number;
  percentage: number;
}

export interface UploadTus {
  uploadUrl: string;
}

export interface UploadResponseBody {
  xhr: Record<string, any>;
}

export interface UploadResponse {
  uploadURL: string;
  status: number;
  body: UploadResponseBody;
}

export interface UploadedFile {
  source: string;
  id: string;
  name: string;
  extension: string;
  meta: UploadFileMeta;
  type: string;
  data: Record<string, any>;
  progress: UploadProgress;
  size: number;
  isGhost: boolean;
  isRemote: boolean;
  tus: UploadTus;
  response: UploadResponse;
  uploadURL: string;
  isPaused: boolean;
}

export interface UploadResult {
  successful: UploadedFile[];
  failed: any[];
  uploadID: string;
  user: UserState;
  currency: CurrencyState & CurrencyActions;
} 