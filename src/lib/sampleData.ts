import { Category, ProductType, Product } from '@/store/types';
import { Package, TrendingUp, Users, Award, Shield, Truck, CheckCircle } from 'lucide-react';

export const sampleCategories: Category[] = [
    {
        id: '1',
        name: 'Treadmill',
        description: 'Running and walking machines',
        subcategories: [],
        types: [
            {
                id: '1',
                name: 'Commercial Treadmill Pro',
                image: '/api/placeholder/300/200',
                price: 2999.99,
                price_ngn: 2999.99,
                price_ghs: 2999.99,
                description: 'Heavy-duty commercial grade treadmill with advanced features',
                category_id: '1',
                stock: 15,
                rating: 4.8,
                reviews: 42,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '2',
                name: 'Home Treadmill Basic',
                image: '/api/placeholder/300/200',
                price: 899.99,
                price_ngn: 899.99,
                price_ghs: 899.99,
                description: 'Compact home treadmill perfect for daily cardio',
                category_id: '1',
                stock: 20,
                rating: 4.3,
                reviews: 18,
                created_at: new Date(),
                updated_at: new Date(),
            }
        ],
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: '2',
        name: 'Exercise Bike',
        description: 'Stationary cycling equipment',
        subcategories: [],
        types: [
            {
                id: '3',
                name: 'Spin Bike Pro',
                image: '/api/placeholder/300/200',
                price: 1299.99,
                price_ngn: 1299.99,
                price_ghs: 1299.99,
                description: 'Professional spin bike with magnetic resistance',
                category_id: '2',
                stock: 10,
                rating: 4.5,
                reviews: 25,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '4',
                name: 'Recumbent Bike Comfort',
                image: '/api/placeholder/300/200',
                price: 799.99,
                description: 'Comfortable recumbent bike for low-impact cardio',
                category_id: '2',
                created_at: new Date(),
                updated_at: new Date(),
            }
        ],
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: '3',
        name: 'Strength Equipment',
        description: 'Weight training and strength building equipment',
        subcategories: [],
        types: [
            {
                id: '5',
                name: 'Power Rack System',
                image: '/api/placeholder/300/200',
                price: 2499.99,
                description: 'Complete power rack with safety bars and pull-up bar',
                categoryId: '3',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: '6',
                name: 'Dumbbell Set',
                image: '/api/placeholder/300/200',
                price: 399.99,
                description: 'Adjustable dumbbell set from 5-50 lbs',
                categoryId: '3',
                created_at: new Date(),
                updated_at: new Date(),
            }
        ],
        created_at: new Date(),
        updated_at: new Date(),
    }
];

export const sampleProductTypes: ProductType[] = [
    {
        id: '1',
        name: 'Commercial Treadmill Pro',
        image: '/api/placeholder/300/200',
        price: 2999.99,
        description: 'Heavy-duty commercial grade treadmill with advanced features',
        categoryId: '1',
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: '2',
        name: 'Home Treadmill Basic',
        image: '/api/placeholder/300/200',
        price: 899.99,
        description: 'Compact home treadmill perfect for daily cardio',
        categoryId: '1',
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        id: '3',
        name: 'Spin Bike Pro',
        image: '/api/placeholder/300/200',
        price: 1299.99,
        description: 'Professional spin bike with magnetic resistance',
        categoryId: '2',
        created_at: new Date(),
        updated_at: new Date(),
    }
];

export const sampleProducts: Product[] = [
  {
    id: '3BA83E57-2E49-41DB-B04D-65F6DD8DEE67',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 129.99,
    price_ngn: 129.99,
    price_ghs: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: sampleCategories[0], // Electronics
    stock: 25,
    rating: 4.5,
    reviews: 128,
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: '1E5CB2FA-CD89-4E4D-87E4-4E1DF048EF32',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS tracking.',
    price: 199.99,
    price_ngn: 199.99,
    price_ghs: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: sampleCategories[0], // Electronics
    stock: 15,
    rating: 4.3,
    reviews: 89,
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-10'),
  },
  {
    id: '91D81F5F-BEF8-474A-B2F0-74A2E28A9C27',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable cotton t-shirt available in multiple colors.',
    price: 29.99,
      price_ngn: 29.99,
      price_ghs: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: sampleCategories[1], // Clothing
    stock: 50,
    rating: 4.7,
    reviews: 256,
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20'),
  },
  {
    id: 'B9D2F0DF-6C7A-4289-9510-5D52E10DC34B',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 24.99,
    price_ngn: 24.99,
    price_ghs: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: sampleCategories[2], // Home & Garden
    stock: 75,
    rating: 4.8,
    reviews: 342,
    created_at: new Date('2024-01-05'),
    updated_at: new Date('2024-01-05'),
  },
  {
    id: '32C13160-DE60-4AE1-980E-C38F8186BC5F',
    name: 'Professional Camera Lens',
    description: 'High-quality 50mm f/1.8 prime lens perfect for portrait photography.',
    price: 399.99,
    price_ngn: 399.99,
    price_ghs: 399.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    category: sampleCategories[0], // Electronics
    stock: 8,
    rating: 4.9,
    reviews: 67,
    created_at: new Date('2024-01-12'),
    updated_at: new Date('2024-01-12'),
  },
  {
    id: '4D76AAE6-A73D-4D41-9538-3A4EEFF7940B',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat made from eco-friendly materials, perfect for home workouts.',
    price: 34.99,
    price_ngn: 34.99,
    price_ghs: 34.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    category: sampleCategories[3], // Sports
    stock: 30,
    rating: 4.4,
    reviews: 156,
    created_at: new Date('2024-01-18'),
    updated_at: new Date('2024-01-18'),
  },
  {
    id: 'CAB2F0D4-6B0A-42E2-8361-41630E0A7F91',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 49.99,
    price_ngn: 49.99,
    price_ghs: 49.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
    category: sampleCategories[0], // Electronics
    stock: 20,
    rating: 4.2,
    reviews: 94,
    created_at: new Date('2024-01-08'),
    updated_at: new Date('2024-01-08'),
  },
  {
    id: '1E1F73B2-55B1-49E4-B8AF-9C1B321CE96B',
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 beautiful ceramic coffee mugs, perfect for your morning brew.',
    price: 19.99,
    price_ngn: 19.99,
    price_ghs: 19.99,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop',
    category: sampleCategories[2], // Home & Garden
    stock: 40,
    rating: 4.6,
    reviews: 203,
    created_at: new Date('2024-01-25'),
    updated_at: new Date('2024-01-25'),
  },
];

export const heroSlides = [
  { image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop", title: "Professional Strength Equipment", subtitle: "Commercial quality for home gyms", cta: "Shop Now", link: "/home/all-products" },
  { image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&auto=format&fit=crop", title: "Premium Cardio Machines", subtitle: "Engineered for performance and durability", cta: "View Collection", link: "/home/all-products" },
  { image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop", title: "Transform Your Fitness Journey", subtitle: "Professional equipment for every goal", cta: "Get Started", link: "/home/all-products" },
];

export const horizontalProducts = [
  { id: "1", name: "Wonder core", price: 200000, image: "/images/img_gym7.jpeg", badge: "Best Seller" },
  { id: "2", name: "Recumbent Bike", price: 510000, image: "/images/recumbent_bike.webp", badge: "New" },
  { id: "3", name: "Stepper", price: 100000, image: "/images/stepper.jpg" },
  { id: "4", name: "Massage chair", price: 1800000, image: "/images/img_gym11.jpeg" },
  { id: "5", name: "Kettlebell", price: 60000, image: "/images/kettlebell.jpeg", badge: "Popular" },
  { id: "6", name: "Dumbbell Rack", price: 120000, image: "/images/dumbbell_rack.webp" },
];

export const stats = [
  { icon: Package, label: "Equipment Listed", value: 500, suffix: "+" },
  { icon: TrendingUp, label: "Equipment Sold", value: 12000, suffix: "+" },
  { icon: Users, label: "Happy Clients", value: 8500, suffix: "+" },
];

export const whyUsFeatures = [
  { icon: Award, title: "Premium Quality", description: "Commercial-grade equipment built to last" },
  { icon: Shield, title: "Warranty Protection", description: "Comprehensive warranty on all products" },
  { icon: Truck, title: "Free Shipping", description: "Free delivery on all orders" },
  { icon: CheckCircle, title: "Expert Support", description: "24/7 customer service and installation help" },
];

// Sample orders commented out due to type mismatches
// export const sampleOrders: Order[] = [];
