import { Product, Category } from '@/store/types';

// Sample categories
const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Apparel and fashion items',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    description: 'Home improvement and garden items',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Sports and fitness equipment',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  },
];

export const sampleCategories = categories;

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: categories[0], // Electronics
    stock: 25,
    rating: 4.5,
    reviews: 128,
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS tracking.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: sampleCategories[0], // Electronics
    stock: 15,
    rating: 4.3,
    reviews: 89,
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable cotton t-shirt available in multiple colors.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: sampleCategories[1], // Clothing
    stock: 50,
    rating: 4.7,
    reviews: 256,
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: sampleCategories[2], // Home & Garden
    stock: 75,
    rating: 4.8,
    reviews: 342,
    created_at: new Date('2024-01-05'),
    updated_at: new Date('2024-01-05'),
  },
  {
    id: '5',
    name: 'Professional Camera Lens',
    description: 'High-quality 50mm f/1.8 prime lens perfect for portrait photography.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    category: sampleCategories[0], // Electronics
    stock: 8,
    rating: 4.9,
    reviews: 67,
    created_at: new Date('2024-01-12'),
    updated_at: new Date('2024-01-12'),
  },
  {
    id: '6',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat made from eco-friendly materials, perfect for home workouts.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    category: sampleCategories[3], // Sports
    stock: 30,
    rating: 4.4,
    reviews: 156,
    created_at: new Date('2024-01-18'),
    updated_at: new Date('2024-01-18'),
  },
  {
    id: '7',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
    category: sampleCategories[0], // Electronics
    stock: 20,
    rating: 4.2,
    reviews: 94,
    created_at: new Date('2024-01-08'),
    updated_at: new Date('2024-01-08'),
  },
  {
    id: '8',
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 beautiful ceramic coffee mugs, perfect for your morning brew.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop',
    category: sampleCategories[2], // Home & Garden
    stock: 40,
    rating: 4.6,
    reviews: 203,
    created_at: new Date('2024-01-25'),
    updated_at: new Date('2024-01-25'),
  },
];

// Sample orders commented out due to type mismatches
// export const sampleOrders: Order[] = [];
