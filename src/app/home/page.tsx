// 'use client';

// import { useState } from 'react';
// import { useEcommerce } from '@/store/hooks';
// import ProductList from '@/components/ProductList';
// import CartSummary from '@/components/CartSummary';

// export default function Home() {
//   const { cart } = useEcommerce();
//   const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <h1 className="text-2xl font-bold text-gray-900">UVHub E-commerce</h1>
            
//             {/* Navigation */}
//             <nav className="flex space-x-8">
//               <button
//                 onClick={() => setActiveTab('products')}
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   activeTab === 'products'
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Products
//               </button>
//               <button
//                 onClick={() => setActiveTab('cart')}
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
//                   activeTab === 'cart'
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Cart
//                 {cart.itemCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {cart.itemCount}
//                   </span>
//                 )}
//               </button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {activeTab === 'products' ? (
//           <div>
//             <div className="mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 Our Products
//               </h2>
//               <p className="text-gray-600">
//                 Discover amazing products with our powerful state management powered by Zustand
//               </p>
//             </div>
//             <ProductList />
//           </div>
//         ) : (
//           <div>
//             <div className="mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 Shopping Cart
//               </h2>
//               <p className="text-gray-600">
//                 Your cart is persisted using Zustand&apos;s persist middleware
//               </p>
//             </div>
//             <div className="max-w-2xl">
//               <CartSummary />
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-center text-gray-500">
//             <p>Built with Next.js and Zustand State Management</p>
//             <p className="mt-2 text-sm">
//               Features: Product filtering, shopping cart, persistent state, and more!
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// 'use client';

// import { useState } from 'react';
// import { useEcommerce } from '@/store/hooks';
// import ProductList from '@/components/ProductList';
// import CartSummary from '@/components/CartSummary';

// export default function Home() {
//   const { cart } = useEcommerce();
//   const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <h1 className="text-2xl font-bold text-gray-900">UVHub E-commerce</h1>
            
//             {/* Navigation */}
//             <nav className="flex space-x-8">
//               <button
//                 onClick={() => setActiveTab('products')}
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   activeTab === 'products'
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Products
//               </button>
//               <button
//                 onClick={() => setActiveTab('cart')}
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
//                   activeTab === 'cart'
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 Cart
//                 {cart.itemCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {cart.itemCount}
//                   </span>
//                 )}
//               </button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {activeTab === 'products' ? (
//           <div>
//             <div className="mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 Our Products
//               </h2>
//               <p className="text-gray-600">
//                 Discover amazing products with our powerful state management powered by Zustand
//               </p>
//             </div>
//             <ProductList />
//           </div>
//         ) : (
//           <div>
//             <div className="mb-8">
//               <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                 Shopping Cart
//               </h2>
//               <p className="text-gray-600">
//                 Your cart is persisted using Zustand's persist middleware
//               </p>
//             </div>
//             <div className="max-w-2xl">
//               <CartSummary />
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-center text-gray-500">
//             <p>Built with Next.js and Zustand State Management</p>
//             <p className="mt-2 text-sm">
//               Features: Product filtering, shopping cart, persistent state, and more!
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// // }


// import React, { useState, useEffect } from 'react';
// import { 
//   ShoppingCart, 
//   X, 
//   MessageCircle, 
//   Star, 
//   ChevronLeft, 
//   ChevronRight, 
//   Menu,
//   Package,
//   TrendingUp,
//   Users,
//   Award,
//   Shield,
//   Truck,
//   CheckCircle,
//   Quote
// } from 'lucide-react';

// const Home = () => {
//   const [showWhatsApp, setShowWhatsApp] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   // Counter animation hook
//   const useCounter = (end, duration = 2000) => {
//     const [count, setCount] = useState(0);
//     const [isVisible, setIsVisible] = useState(false);

//     useEffect(() => {
//       if (!isVisible) return;

//       let startTime;
//       const animate = (currentTime) => {
//         if (!startTime) startTime = currentTime;
//         const progress = (currentTime - startTime) / duration;
        
//         if (progress < 1) {
//           setCount(Math.floor(end * progress));
//           requestAnimationFrame(animate);
//         } else {
//           setCount(end);
//         }
//       };
      
//       requestAnimationFrame(animate);
//     }, [isVisible, end, duration]);

//     return { count, setIsVisible };
//   };

//   // Auto-slide for hero section
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const heroSlides = [
//     {
//       image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop",
//       title: "Professional Strength Equipment",
//       subtitle: "Commercial quality for home gyms",
//       cta: "Shop Now"
//     },
//     {
//       image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&auto=format&fit=crop",
//       title: "Premium Cardio Machines",
//       subtitle: "Engineered for performance and durability",
//       cta: "View Collection"
//     },
//     {
//       image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop",
//       title: "Transform Your Fitness Journey",
//       subtitle: "Professional equipment for every goal",
//       cta: "Get Started"
//     }
//   ];

//   const horizontalProducts = [
//     {
//       id: 1,
//       name: "Adjustable Bench",
//       price: 299,
//       image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&auto=format&fit=crop",
//       badge: "Best Seller"
//     },
//     {
//       id: 2,
//       name: "Olympic Plates",
//       price: 199,
//       image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&auto=format&fit=crop",
//       badge: "New"
//     },
//     {
//       id: 3,
//       name: "Resistance Bands",
//       price: 49,
//       image: "https://images.unsplash.com/photo-1595079835353-9d5c8b456e10?w=300&auto=format&fit=crop"
//     },
//     {
//       id: 4,
//       name: "Jump Rope",
//       price: 29,
//       image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333d?w=300&auto=format&fit=crop"
//     },
//     {
//       id: 5,
//       name: "Kettlebell",
//       price: 89,
//       image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&auto=format&fit=crop",
//       badge: "Popular"
//     },
//     {
//       id: 6,
//       name: "Yoga Mat",
//       price: 39,
//       image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&auto=format&fit=crop"
//     },
//     {
//       id: 7,
//       name: "Dumbbells Set",
//       price: 149,
//       image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&auto=format&fit=crop"
//     },
//     {
//       id: 8,
//       name: "Pull-up Bar",
//       price: 79,
//       image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&auto=format&fit=crop"
//     }
//   ];

//   const mainProducts = [
//     {
//       id: 9,
//       name: "Power Rack System",
//       price: 899,
//       originalPrice: 1099,
//       image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop",
//       rating: 4.9,
//       description: "Commercial-grade power rack with laser-cut steel"
//     },
//     {
//       id: 10,
//       name: "Treadmill Pro",
//       price: 2499,
//       originalPrice: 2999,
//       image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop",
//       rating: 4.7,
//       description: "3.5 HP motor with 12% incline and touchscreen"
//     }
//   ];

//   const testimonials = [
//     {
//       id: 1,
//       name: "Sarah Johnson",
//       role: "Fitness Enthusiast",
//       content: "EliteGym equipment transformed my home workout experience. The quality is outstanding and delivery was seamless.",
//       rating: 5,
//       image: "https://images.unsplash.com/photo-1494790108755-2616b9c84aaf?w=100&auto=format&fit=crop"
//     },
//     {
//       id: 2,
//       name: "Mike Chen",
//       role: "Personal Trainer",
//       content: "I've recommended EliteGym to all my clients. Professional-grade equipment at reasonable prices.",
//       rating: 5,
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
//     },
//     {
//       id: 3,
//       name: "Emily Rodriguez",
//       role: "Gym Owner",
//       content: "Equipped my entire gym with EliteGym products. Excellent durability and customer service.",
//       rating: 5,
//       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop"
//     }
//   ];

//   const stats = [
//     { icon: Package, label: "Equipment Listed", value: 500, suffix: "+" },
//     { icon: TrendingUp, label: "Equipment Sold", value: 12000, suffix: "+" },
//     { icon: Users, label: "Happy Clients", value: 8500, suffix: "+" }
//   ];

//   const whyUsFeatures = [
//     {
//       icon: Award,
//       title: "Premium Quality",
//       description: "Commercial-grade equipment built to last"
//     },
//     {
//       icon: Shield,
//       title: "Warranty Protection",
//       description: "Comprehensive warranty on all products"
//     },
//     {
//       icon: Truck,
//       title: "Free Shipping",
//       description: "Free delivery on orders over $500"
//     },
//     {
//       icon: CheckCircle,
//       title: "Expert Support",
//       description: "24/7 customer service and installation help"
//     }
//   ];

//   const addToCart = (product) => {
//     setCartCount(prev => prev + 1);
//     // Add cart animation or notification here
//   };

//   const StatsCounter = ({ stat }) => {
//     const { count, setIsVisible } = useCounter(stat.value);
    
//     useEffect(() => {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true);
//           }
//         },
//         { threshold: 0.5 }
//       );

//       const element = document.getElementById(`stat-${stat.label}`);
//       if (element) observer.observe(element);

//       return () => observer.disconnect();
//     }, [setIsVisible]);

//     return (
//       <div id={`stat-${stat.label}`} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
//           <stat.icon className="w-8 h-8 text-white" />
//         </div>
//         <div className="text-3xl font-bold text-gray-900 mb-2">
//           {count.toLocaleString()}{stat.suffix}
//         </div>
//         <div className="text-gray-600">{stat.label}</div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Enhanced Header */}
//       <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               EliteGym
//             </div>
            
//             <nav className="hidden md:flex space-x-8">
//               {['Home', 'Products', 'Collections', 'About'].map((item) => (
//                 <a
//                   key={item}
//                   href="#"
//                   className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 py-2 px-3 rounded-lg hover:bg-blue-50"
//                 >
//                   {item}
//                 </a>
//               ))}
//             </nav>
            
//             <div className="flex items-center space-x-4">
//               <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
//                 <ShoppingCart className="w-6 h-6" />
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>
              
//               <button 
//                 className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               >
//                 <Menu className="w-6 h-6" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
//           <div className="bg-white w-4/5 h-full ml-auto p-6 transform transition-transform duration-300">
//             <div className="flex justify-between items-center mb-8">
//               <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 EliteGym
//               </div>
//               <button onClick={() => setMobileMenuOpen(false)}>
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
            
//             <nav className="space-y-4">
//               {['Home', 'Products', 'Collections', 'About'].map((item) => (
//                 <a
//                   key={item}
//                   href="#"
//                   className="block py-3 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   {item}
//                 </a>
//               ))}
//             </nav>
//           </div>
//         </div>
//       )}

//       {/* Enhanced Hero Section */}
//       <section className="relative h-screen overflow-hidden">
//         {heroSlides.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ${
//               index === currentSlide ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <img 
//               src={slide.image}
//               alt={slide.title}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center justify-center">
//               <div className="text-center px-4 max-w-4xl">
//                 <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
//                   {slide.title}
//                 </h1>
//                 <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
//                   {slide.subtitle}
//                 </p>
//                 <button
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
//                 >
//                   {slide.cta}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
        
//         {/* Slide indicators */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
//           {heroSlides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
//               }`}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Enhanced Horizontal Product Slider */}
//       <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Accessories</h2>
//             <p className="text-gray-600">Essential equipment for every fitness journey</p>
//           </div>
          
//           <div className="relative">
//             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
//               {horizontalProducts.map((product) => (
//                 <div 
//                   key={product.id} 
//                   className="flex-shrink-0 w-44 sm:w-48 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
//                 >
//                   <div className="relative h-36 overflow-hidden rounded-t-lg">
//                     <img 
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                     {product.badge && (
//                       <span className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
//                         {product.badge}
//                       </span>
//                     )}
//                     <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-md font-bold text-sm">
//                       ${product.price}
//                     </div>
//                   </div>
//                   <div className="p-3">
//                     <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact</h2>
//             <p className="text-blue-100">Trusted by thousands of fitness enthusiasts worldwide</p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {stats.map((stat) => (
//               <StatsCounter key={stat.label} stat={stat} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EliteGym?</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best fitness equipment and service experience</p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {whyUsFeatures.map((feature, index) => (
//               <div 
//                 key={index}
//                 className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2"
//               >
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
//                   <feature.icon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Main Products */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Equipment</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">Commercial-grade machines for serious training</p>
//           </div>
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {mainProducts.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
//               >
//                 <div className="h-80 overflow-hidden">
//                   <img 
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//                   />
//                 </div>
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
//                       <p className="text-gray-600 mt-2">{product.description}</p>
//                     </div>
//                     <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
//                       <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                       <span className="ml-1 text-gray-700 font-medium">{product.rating}</span>
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <span className="text-2xl font-bold text-gray-900">${product.price}</span>
//                       {product.originalPrice && (
//                         <span className="text-gray-500 line-through ml-2">${product.originalPrice}</span>
//                       )}
//                     </div>
//                     <button 
//                       onClick={() => addToCart(product)}
//                       className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
//                     >
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
//             <p className="text-gray-600">Real feedback from satisfied customers</p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial) => (
//               <div 
//                 key={testimonial.id}
//                 className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2"
//               >
//                 <div className="flex items-center mb-4">
//                   <Quote className="w-8 h-8 text-blue-500 mr-3" />
//                   <div className="flex">
//                     {[...Array(testimonial.rating)].map((_, i) => (
//                       <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
//                     ))}
//                   </div>
//                 </div>
//                 <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
//                 <div className="flex items-center">
//                   <img 
//                     src={testimonial.image}
//                     alt={testimonial.name}
//                     className="w-12 h-12 rounded-full object-cover mr-4"
//                   />
//                   <div>
//                     <div className="font-semibold text-gray-900">{testimonial.name}</div>
//                     <div className="text-gray-600 text-sm">{testimonial.role}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* WhatsApp Widget */}
//       <div className="fixed bottom-6 right-6 z-50">
//         {showWhatsApp && (
//           <div className="bg-white rounded-xl shadow-xl p-4 mb-4 max-w-xs transform transition-all duration-300 animate-in slide-in-from-bottom">
//             <div className="flex items-center mb-3">
//               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
//                 <MessageCircle className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <div className="font-semibold text-sm">Gym Expert</div>
//                 <div className="text-xs text-gray-500">Typically replies instantly</div>
//               </div>
//             </div>
//             <div className="bg-gray-100 rounded-lg p-3 mb-3">
//               <p className="text-sm text-gray-700">
//                 Need help choosing equipment?
//               </p>
//             </div>
//             <a 
//               href="https://wa.me/1234567890?text=Hi%20EliteGym%20team,%20I%20need%20help%20with..."
//               className="block w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors text-center"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Start Chat
//             </a>
//           </div>
//         )}
        
//         <button
//           onClick={() => setShowWhatsApp(!showWhatsApp)}
//           className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
//         >
//           <MessageCircle className="w-6 h-6 text-white" />
//         </button>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white pt-16 pb-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
//             <div>
//               <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                 EliteGym
//               </h3>
//               <p className="text-gray-400 leading-relaxed">
//                 Professional grade gym equipment for serious athletes and fitness enthusiasts.
//               </p>
//             </div>
            
//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Shop</h4>
//               <ul className="space-y-3">
//                 {['Strength', 'Cardio', 'Accessories', 'Bundles'].map((item) => (
//                   <li key={item}>
//                     <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Support</h4>
//               <ul className="space-y-3">
//                 {['Contact Us', 'Shipping', 'Returns', 'FAQ'].map((item) => (
//                   <li key={item}>
//                     <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Company</h4>
//               <ul className="space-y-3">
//                 {['About', 'Blog', 'Careers', 'Press'].map((item) => (
//                   <li key={item}>
//                     <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400 mb-4 md:mb-0">
//               © 2024 EliteGym. All rights reserved.
//             </p>
//             <div className="flex space-x-6">
//               {['Privacy', 'Terms', 'Sitemap'].map((item) => (
//                 <a key={item} href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
//                   {item}
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;
// "use client"
// import React, { useState, useEffect } from 'react';
// import {
//   ShoppingCart,
//   X,
//   MessageCircle,
//   Star,
//   Menu,
//   Package,
//   TrendingUp,
//   Users,
//   Award,
//   Shield,
//   Truck,
//   CheckCircle,
//   Quote,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react';
// import { useCart, useEcommerce } from '@/store/hooks';
// const Home = () => {
//   // Original component states
//   const [showWhatsApp, setShowWhatsApp] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const [currentSlide, setCurrentSlide] = useState(0);
// const { cart } = useEcommerce();
//    const { addToCart, isInCart } = useCart();
//   // --- States for product filtering ---
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     minPrice: '',
//     maxPrice: '',
//   });
//   interface Product {
//     id: string;
//     name: string;
//     price: number;
//     originalPrice?: number;
//     image: string;
//     rating: number;
//     description: string;
//     reviews: number;
//   createdAt: Date;
//   updatedAt: Date;
//   }
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

//   // --- Data Section ---

//   const heroSlides = [
//     { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop', title: 'Professional Strength Equipment', subtitle: 'Commercial quality for home gyms', cta: 'Shop Now' },
//     { image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&auto=format&fit=crop', title: 'Premium Cardio Machines', subtitle: 'Engineered for performance and durability', cta: 'View Collection' },
//     { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop', title: 'Transform Your Fitness Journey', subtitle: 'Professional equipment for every goal', cta: 'Get Started' },
//   ];

//   const horizontalProducts = [
//     { id: "1", name: 'Adjustable Bench', price: 299, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&auto=format&fit=crop', badge: 'Best Seller' },
//     { id: "2", name: 'Olympic Plates', price: 199, image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&auto=format&fit=crop', badge: 'New' },
//     { id: "3", name: 'Resistance Bands', price: 49, image: 'https://images.unsplash.com/photo-1595079835353-9d5c8b456e10?w=300&auto=format&fit=crop' },
//     { id: "4", name: 'Jump Rope', price: 29, image: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333d?w=300&auto=format&fit=crop' },
//     { id: "5", name: 'Kettlebell', price: 89, image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&auto=format&fit=crop', badge: 'Popular' },
//     { id: "6", name: 'Yoga Mat', price: 39, image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&auto=format&fit=crop' },
//   ];

//   const mainProducts = [
//     {
//       id: "9",
//       name: 'Power Rack System',
//       price: 899,
//       originalPrice: 1099,
//       image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop',
//       rating: 4.9,
//       description: 'Commercial-grade power rack with laser-cut steel',
//       reviews: 120,
//       createdAt: new Date('2023-01-01'),
//       updatedAt: new Date('2023-06-01'),
//       category: 'Strength',
//       stock: 10
//     },
//     {
//       id: "10",
//       name: 'Treadmill Pro',
//       price: 2499,
//       originalPrice: 2999,
//       image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop',
//       rating: 4.7,
//       description: '3.5 HP motor with 12% incline and touchscreen',
//       reviews: 85,
//       createdAt: new Date('2023-02-01'),
//       updatedAt: new Date('2023-06-10'),
//       category: 'Cardio',
//       stock: 7
//     },
//     {
//       id: "11",
//       name: 'Adjustable Dumbbell Set',
//       price: 599,
//       originalPrice: 799,
//       image: 'https://images.unsplash.com/photo-1581009137042-c552b485697a?w=800&auto=format&fit=crop',
//       rating: 4.8,
//       description: 'Replaces 15 sets of weights, easy-select dials.',
//       reviews: 60,
//       createdAt: new Date('2023-03-01'),
//       updatedAt: new Date('2023-06-15'),
//       category: 'Strength',
//       stock: 15
//     },
//     {
//       id: "12",
//       name: 'Rowing Machine',
//       price: 799,
//       image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop',
//       rating: 4.6,
//       description: 'Full-body workout with a smooth, quiet magnetic resistance.',
//       reviews: 40,
//       createdAt: new Date('2023-04-01'),
//       updatedAt: new Date('2023-06-20'),
//       category: 'Cardio',
//       stock: 5
//     }
//   ];

//   const testimonials = [
//     { id: 1, name: 'Sarah Johnson', role: 'Fitness Enthusiast', content: 'EliteGym equipment transformed my home workout experience. The quality is outstanding and delivery was seamless.', rating: 5, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop' },
//     { id: 2, name: 'Mike Chen', role: 'Personal Trainer', content: 'I\'ve recommended EliteGym to all my clients. Professional-grade equipment at reasonable prices.', rating: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop' },
//     { id: 3, name: 'Emily Rodriguez', role: 'Gym Owner', content: 'Equipped my entire gym with EliteGym products. Excellent durability and customer service.', rating: 5, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop' }
//   ];

//   const stats = [
//     { icon: Package, label: 'Equipment Listed', value: 500, suffix: '+' },
//     { icon: TrendingUp, label: 'Equipment Sold', value: 12000, suffix: '+' },
//     { icon: Users, label: 'Happy Clients', value: 8500, suffix: '+' }
//   ];

//   const whyUsFeatures = [
//     { icon: Award, title: 'Premium Quality', description: 'Commercial-grade equipment built to last' },
//     { icon: Shield, title: 'Warranty Protection', description: 'Comprehensive warranty on all products' },
//     { icon: Truck, title: 'Free Shipping', description: 'Free delivery on orders over $500' },
//     { icon: CheckCircle, title: 'Expert Support', description: '24/7 customer service and installation help' }
//   ];

//   // --- Logic and Functions Section ---

//   interface FilterState {
//     search: string;
//     minPrice: string;
//     maxPrice: string;
//   }

//   interface Product {
//      id: string;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
//   category: string;
//   stock: number;
//   rating: number;
//   reviews: number;
//   createdAt: Date;
//   updatedAt: Date;
// }
  

//   interface FilterChangeEvent extends React.ChangeEvent<HTMLInputElement> {
//     target: HTMLInputElement & { name: keyof FilterState; value: string };
//   }

//   const handleFilterChange = (e: FilterChangeEvent) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({ search: '', minPrice: '', maxPrice: '' });
//   };

//   useEffect(() => {
//     setLoading(true);
//     setError(null);

//     const getFilteredProducts = () => {
//       let products = [...mainProducts];
//       if (filters.search) products = products.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
//       if (filters.minPrice) products = products.filter(p => p.price >= Number(filters.minPrice));
//       if (filters.maxPrice) products = products.filter(p => p.price <= Number(filters.maxPrice));
//       return products;
//     };

//     const debounce = setTimeout(() => {
//         try { setFilteredProducts(getFilteredProducts()) } 
//         catch (err) { setError('Failed to filter products.'); console.error(err) } 
//         finally { setLoading(false) }
//     }, 300);

//     return () => clearTimeout(debounce);
//   }, [filters]);

//   interface UseCounterResult {
//     count: number;
//     setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
//   }

//   const useCounter = (end: number, duration: number = 2000): UseCounterResult => {
//     const [count, setCount] = useState<number>(0);
//     const [isVisible, setIsVisible] = useState<boolean>(false);

//     useEffect(() => {
//       if (!isVisible) return;
//       let startTime: number | undefined;
//       const animate = (currentTime: number) => {
//         if (!startTime) startTime = currentTime;
//         const progress = (currentTime - startTime) / duration;
//         if (progress < 1) {
//           setCount(Math.floor(end * progress));
//           requestAnimationFrame(animate);
//         } else {
//           setCount(end);
//         }
//       };
//       requestAnimationFrame(animate);
//     }, [isVisible, end, duration]);

//     return { count, setIsVisible };
//   };

//   useEffect(() => {
//     const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // const addToCart = () => setCartCount(prev => prev + 1);

//   // --- Child Components ---

//   type StatType = {
//     icon: React.ElementType;
//     label: string;
//     value: number;
//     suffix: string;
//   };

//   const StatsCounter = ({ stat }: { stat: StatType }) => {
//     const { count, setIsVisible } = useCounter(stat.value);
//     useEffect(() => {
//       const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true) }, { threshold: 0.5 });
//       const element = document.getElementById(`stat-${stat.label}`);
//       if (element) observer.observe(element);
//       return () => { if (element) observer.unobserve(element) };
//     }, [stat.label, setIsVisible]);

//     return (
//       <div id={`stat-${stat.label}`} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"><stat.icon className="w-8 h-8 text-white" /></div>
//         <div className="text-3xl font-bold text-gray-900 mb-2">{count.toLocaleString()}{stat.suffix}</div>
//         <div className="text-gray-600">{stat.label}</div>
//       </div>
//     );
//   };

//   // --- Main JSX Return ---

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">uvHub</div>
//             <nav className="hidden md:flex space-x-8">
//               {['Home', 'Products', 'Collections', 'About'].map((item) => (<a key={item} href="#" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 py-2 px-3 rounded-lg hover:bg-blue-50">{item}</a>))}
//             </nav>
//             <div className="flex items-center space-x-4">
//               <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
//                 <ShoppingCart className="w-6 h-6" />
//                 {cart.itemCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">{cartCount}</span>)}
//               </button>
//               <button className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu className="w-6 h-6" /></button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {mobileMenuOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
//           <div className="bg-white w-4/5 h-full ml-auto p-6 transform transition-transform duration-300">
//             <div className="flex justify-between items-center mb-8">
//               <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EliteGym</div>
//               <button onClick={() => setMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
//             </div>
//             <nav className="space-y-4">
//               {['Home', 'Products', 'Collections', 'About'].map((item) => (<a key={item} href="#" className="block py-3 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors">{item}</a>))}
//             </nav>
//           </div>
//         </div>
//       )}

//       <section className="relative h-screen overflow-hidden">
//         {heroSlides.map((slide, index) => (
//           <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
//             <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center justify-center">
//               <div className="text-center px-4 max-w-4xl">
//                 <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">{slide.title}</h1>
//                 <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">{slide.subtitle}</p>
//                 <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">{slide.cta}</button>
//               </div>
//             </div>
//           </div>
//         ))}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
//           {heroSlides.map((_, index) => (<button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`} />))}
//         </div>
//       </section>

//       <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Accessories</h2><p className="text-gray-600">Essential equipment for every fitness journey</p></div>
//           <div className="relative">
//             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
//               {horizontalProducts.map((product) => (
//                 <div key={product.id} className="flex-shrink-0 w-44 sm:w-48 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
//                   <div className="relative h-36 overflow-hidden rounded-t-lg">
//                     <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
//                     {product.badge && (<span className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">{product.badge}</span>)}
//                     <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-md font-bold text-sm">${product.price}</div>
//                   </div>
//                   <div className="p-3"><h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact</h2><p className="text-blue-100">Trusted by thousands of fitness enthusiasts worldwide</p></div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{stats.map((stat) => (<StatsCounter key={stat.label} stat={stat} />))}</div>
//         </div>
//       </section>

//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EliteGym?</h2><p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best fitness equipment and service experience</p></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {whyUsFeatures.map((feature, index) => (
//               <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"><feature.icon className="w-8 h-8 text-white" /></div>
//                 <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3><p className="text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="py-16 bg-gray-50" id="products">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Equipment</h2><p className="text-gray-600 max-w-2xl mx-auto">Commercial-grade machines for serious training</p></div>
//           <div className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//             <div className="md:col-span-2"><label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label><input type="text" name="search" id="search" placeholder="e.g., Treadmill Pro" value={filters.search} onChange={handleFilterChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" /></div>
//             <div><label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label><input type="number" name="minPrice" id="minPrice" placeholder="0" value={filters.minPrice} onChange={handleFilterChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" /></div>
//             <div><label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label><input type="number" name="maxPrice" id="maxPrice" placeholder="3000" value={filters.maxPrice} onChange={handleFilterChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" /></div>
//             <div className="md:col-span-4 flex justify-end"><button onClick={clearFilters} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Clear Filters</button></div>
//           </div>
//           {loading && <p className="text-center py-8">Filtering products...</p>}
//           {error && <p className="text-center py-8 text-red-500">{error}</p>}
//           {!loading && !error && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {filteredProducts.length > 0 ? (
//                 filteredProducts.map((product) => (
//                   <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
//                     <div className="h-80 overflow-hidden"><img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" /></div>
//                     <div className="p-6 flex flex-col">
//                       <div className="flex-grow">
//                         <div className="flex justify-between items-start mb-4">
//                           <div><h3 className="text-xl font-bold text-gray-900">{product.name}</h3><p className="text-gray-600 mt-2">{product.description}</p></div>
//                           <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"><Star className="w-4 h-4 text-yellow-500 fill-current" /><span className="ml-1">{product.rating}</span></div>
//                         </div>
//                       </div>
//                       <div className="flex justify-between items-center mt-4">
//                         <div><span className="text-2xl font-bold text-gray-900">${product.price}</span>{product.originalPrice && <span className="text-gray-500 line-through ml-2">${product.originalPrice}</span>}</div>
//                         <button onClick={() => addToCart(product, 1)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">Add to Cart</button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="lg:col-span-2 text-center py-16 px-6 bg-white rounded-lg shadow-md"><h3 className="text-xl font-semibold text-gray-800">No Products Found</h3><p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p></div>
//               )}
//             </div>
//           )}
//         </div>
//       </section>

//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2><p className="text-gray-600">Real feedback from satisfied customers</p></div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial) => (
//               <div key={testimonial.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2">
//                 <div className="flex items-center mb-4"><Quote className="w-8 h-8 text-blue-500 mr-3" /><div className="flex">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />))}</div></div>
//                 <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
//                 <div className="flex items-center">
//                   <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
//                   <div><div className="font-semibold text-gray-900">{testimonial.name}</div><div className="text-gray-600 text-sm">{testimonial.role}</div></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <div className="fixed bottom-6 right-6 z-50">
//         {showWhatsApp && (
//           <div className="bg-white rounded-xl shadow-xl p-4 mb-4 max-w-xs transform transition-all duration-300 animate-in slide-in-from-bottom">
//             <div className="flex items-center mb-3">
//               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3"><MessageCircle className="w-5 h-5 text-white" /></div>
//               <div><div className="font-semibold text-sm">Gym Expert</div><div className="text-xs text-gray-500">Typically replies instantly</div></div>
//             </div>
//             <div className="bg-gray-100 rounded-lg p-3 mb-3"><p className="text-sm text-gray-700">Need help choosing equipment?</p></div>
//             <a href="https://wa.me/08160486223?text=Hi%20EliteGym%20team,%20I%20need%20help%20with..." className="block w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors text-center" target="_blank" rel="noopener noreferrer">Start Chat</a>
//           </div>
//         )}
//         <button onClick={() => setShowWhatsApp(!showWhatsApp)} className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"><MessageCircle className="w-6 h-6 text-white" /></button>
//       </div>

//       <footer className="bg-gray-900 text-white pt-16 pb-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
//             <div>
//               <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">EliteGym</h3>
//               <p className="text-gray-400 leading-relaxed">Professional grade gym equipment for serious athletes and fitness enthusiasts.</p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Shop</h4>
//               <ul className="space-y-3">{['Strength', 'Cardio', 'Accessories', 'Bundles'].map((item) => (<li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a></li>))}</ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Support</h4>
//               <ul className="space-y-3">{['Contact Us', 'Shipping', 'Returns', 'FAQ'].map((item) => (<li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a></li>))}</ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Company</h4>
//               <ul className="space-y-3">{['About', 'Blog', 'Careers', 'Press'].map((item) => (<li key={item}><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a></li>))}</ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400 mb-4 md:mb-0">&copy; 2025 EliteGym. All rights reserved.</p>
//             <div className="flex space-x-6">{['Privacy', 'Terms', 'Sitemap'].map((item) => (<a key={item} href="#" className="text-gray-400 hover:text-white transition-colors duration-300">{item}</a>))}</div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;

// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   MessageCircle, Star, Package, TrendingUp, Users, Award, Shield, Truck, CheckCircle, Quote,
//   ArrowRight,
// } from "lucide-react";
// import { useCart, useEcommerce, useProducts } from "@/store/hooks";
// import { Product } from "@/store/types";
// import { useRouter } from "next/navigation";


// // --- Static Data ---
// const heroSlides = [
//   { image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop", title: "Professional Strength Equipment", subtitle: "Commercial quality for home gyms", cta: "Shop Now" },
//   { image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&auto=format&fit=crop", title: "Premium Cardio Machines", subtitle: "Engineered for performance and durability", cta: "View Collection" },
//   { image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop", title: "Transform Your Fitness Journey", subtitle: "Professional equipment for every goal", cta: "Get Started" },
// ];

// const horizontalProducts = [
//   { id: "1", name: "Adjustable Bench", price: 299, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&auto=format&fit=crop", badge: "Best Seller" },
//   { id: "2", name: "Olympic Plates", price: 199, image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&auto=format&fit=crop", badge: "New" },
//   { id: "3", name: "Resistance Bands", price: 49, image: "https://images.unsplash.com/photo-1595079835353-9d5c8b456e10?w=300&auto=format&fit=crop" },
//   { id: "4", name: "Jump Rope", price: 29, image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333d?w=300&auto=format&fit=crop" },
//   { id: "5", name: "Kettlebell", price: 89, image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&auto=format&fit=crop", badge: "Popular" },
//   { id: "6", name: "Yoga Mat", price: 39, image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&auto=format&fit=crop" },
// ];

// const testimonials = [
//   { id: 1, name: "Sarah Johnson", role: "Fitness Enthusiast", content: "EliteGym equipment transformed my home workout experience. The quality is outstanding and delivery was seamless.", rating: 5, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" },
//   { id: 2, name: "Mike Chen", role: "Personal Trainer", content: "I've recommended EliteGym to all my clients. Professional-grade equipment at reasonable prices.", rating: 5, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" },
//   { id: 3, name: "Emily Rodriguez", role: "Gym Owner", content: "Equipped my entire gym with EliteGym products. Excellent durability and customer service.", rating: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop" },
// ];

// const stats = [
//   { icon: Package, label: "Equipment Listed", value: 500, suffix: "+" },
//   { icon: TrendingUp, label: "Equipment Sold", value: 12000, suffix: "+" },
//   { icon: Users, label: "Happy Clients", value: 8500, suffix: "+" },
// ];

// const whyUsFeatures = [
//   { icon: Award, title: "Premium Quality", description: "Commercial-grade equipment built to last" },
//   { icon: Shield, title: "Warranty Protection", description: "Comprehensive warranty on all products" },
//   { icon: Truck, title: "Free Shipping", description: "Free delivery on orders over $500" },
//   { icon: CheckCircle, title: "Expert Support", description: "24/7 customer service and installation help" },
// ];

// // --- Counter Hook ---
// const useCounter = (end: number, duration: number = 2000) => {
//   const [count, setCount] = useState<number>(0);
//   const [isVisible, setIsVisible] = useState<boolean>(false);

//   useEffect(() => {
//     if (!isVisible) return;
//     let startTime: number | undefined;
//     const animate = (currentTime: number) => {
//       if (!startTime) startTime = currentTime;
//       const progress = (currentTime - startTime) / duration;
//       if (progress < 1) {
//         setCount(Math.floor(end * progress));
//         requestAnimationFrame(animate);
//       } else {
//         setCount(end);
//       }
//     };
//     requestAnimationFrame(animate);
//   }, [isVisible, end, duration]);

//   return { count, setIsVisible };
// };

// // --- Main Component ---
// const Home = () => {
//   // All hooks at the top!
//   const [showWhatsApp, setShowWhatsApp] = useState(false);
 
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const { addToCart, isInCart } = useCart();
  
//   const {
//     products,
//     loading,
//     error,
//     filters,
//     setFilters,
//     clearFilters,
//     getFilteredProducts,
//     fetchProducts,
//   } = useProducts();
//   const [searchTerm, setSearchTerm] = useState(filters.search);
// const router = useRouter();

//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       setFilters({ search: searchTerm });
//     }, 300);
//     return () => clearTimeout(timeoutId);
//   }, [searchTerm, setFilters]);

//   useEffect(() => {
//     const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // --- Stats Counter Component ---
//   const StatsCounter = ({ stat }: { stat: typeof stats[0] }) => {
//     const { count, setIsVisible } = useCounter(stat.value);
//     useEffect(() => {
//       const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true) }, { threshold: 0.5 });
//       const element = document.getElementById(`stat-${stat.label}`);
//       if (element) observer.observe(element);
//       return () => { if (element) observer.unobserve(element) };
//     }, [stat.label, setIsVisible]);
    


//     return (
//       <div id={`stat-${stat.label}`} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"><stat.icon className="w-8 h-8 text-white" /></div>
//         <div className="text-3xl font-bold text-gray-900 mb-2">{count.toLocaleString()}{stat.suffix}</div>
//         <div className="text-gray-600">{stat.label}</div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-500">Error: {error}</p>
//         <button
//           onClick={fetchProducts}
//           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   const filteredProducts: Product[] = getFilteredProducts();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}

//       {/* Hero Section */}
//       <section className="relative h-screen overflow-hidden">
//         {heroSlides.map((slide, index) => (
//           <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
//             <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center justify-center">
//               <div className="text-center px-4 max-w-4xl">
//                 <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">{slide.title}</h1>
//                 <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">{slide.subtitle}</p>
//                 <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">{slide.cta}</button>
//               </div>
//             </div>
//           </div>
//         ))}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
//           {heroSlides.map((_, index) => (
//             <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`} />
//           ))}
//         </div>
//       </section>

//       {/* Featured Accessories */}
//       <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Accessories</h2>
//             <p className="text-gray-600">Essential equipment for every fitness journey</p>
//           </div>
//           <div className="relative">
//             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
//               {horizontalProducts.map((product) => (
//                 <div key={product.id} className="flex-shrink-0 w-44 sm:w-48 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
//                   <div className="relative h-36 overflow-hidden rounded-t-lg">
//                     <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
//                     {product.badge && (
//                       <span className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">{product.badge}</span>
//                     )}
//                     <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-md font-bold text-sm">${product.price}</div>
//                   </div>
//                   <div className="p-3">
//                     <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Our Impact */}
//       <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact</h2>
//             <p className="text-blue-100">Trusted by thousands of fitness enthusiasts worldwide</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {stats.map((stat) => (<StatsCounter key={stat.label} stat={stat} />))}
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose EliteGym?</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">We're committed to providing the best fitness equipment and service experience</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {whyUsFeatures.map((feature, index) => (
//               <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"><feature.icon className="w-8 h-8 text-white" /></div>
//                 <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Products Section */}
//       {/* Section */} 
//       <section className="py-16 bg-gray-50" id="products">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Equipment</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">Commercial-grade machines for serious training</p>
//           </div>
//           {/* Product Filter */}
//           <div className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
//             <div className="md:col-span-2">
//               <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
//               <input
//                 type="text"
//                 name="search"
//                 id="search"
//                 placeholder="e.g., Treadmill Pro"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
//               <input
//                 type="number"
//                 name="minPrice"
//                 id="minPrice"
//                 placeholder="0"
//                 value={filters.minPrice || ""}
//                 onChange={(e) => setFilters({ ...filters, minPrice: e.target.value === "" ? 0 : Number(e.target.value) })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div>
//               <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
//               <input
//                 type="number"
//                 name="maxPrice"
//                 id="maxPrice"
//                 placeholder="3000"
//                 value={filters.maxPrice || ""}
//                 onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value === "" ? 0 : Number(e.target.value) })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div className="md:col-span-4 flex justify-end">
//               <button onClick={clearFilters} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Clear Filters</button>
//             </div>
//           </div>
         
//           {filteredProducts.length > 0 ? (
//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//     {filteredProducts.map((product: Product) => (
//       <div 
//         key={product.id} 
//         className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
//       >
//         {/* Product Image with View Details Overlay */}
//         <div className="h-80 overflow-hidden relative">
//           <img 
//             src={product.image} 
//             alt={product.name} 
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
//           />
//           {/* View Details Overlay */}
//            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
//       <button 
//         onClick={() => router.push(`/home/product/${product.id}`)}
//         className="bg-white bg-opacity-90 text-gray-900 px-6 py-3 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-opacity-100 flex items-center shadow-md"
//       >
//         View Details
//         <ArrowRight className="w-4 h-4 ml-2" />
//       </button>
//     </div>
//         </div>
        
//         {/* Product Content */}
//         <div className="p-6 flex flex-col">
//           <div className="flex-grow">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
//                 <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
//               </div>
//               <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
//                 <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                 <span className="ml-1">{product.rating}</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-between items-center mt-4">
//             <div>
//               <span className="text-2xl font-bold text-gray-900">${product.price}</span>
//               {product.price && (
//                 <span className="text-gray-500 line-through ml-2">${product.price}</span>
//               )}
//             </div>
//             <button
//               disabled={isInCart(product.id) || product.stock === 0}
//               onClick={(e) => {
//                 e.preventDefault();
//                 addToCart(product, 1);
//               }}
//               className={`px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
//                 isInCart(product.id) 
//                   ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                   : product.stock === 0
//                     ? 'bg-red-100 text-red-600 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
//               }`}
//             >
//               {isInCart(product.id) ? 'Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//             </button>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// ) : (
//   <div className="lg:col-span-2 text-center py-16 px-6 bg-white rounded-lg shadow-md">
//     <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
//     <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
//   </div>
// )}
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
//             <p className="text-gray-600">Real feedback from satisfied customers</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial) => (
//               <div key={testimonial.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2">
//                 <div className="flex items-center mb-4">
//                   <Quote className="w-8 h-8 text-blue-500 mr-3" />
//                   <div className="flex">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />))}</div>
//                 </div>
//                 <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
//                 <div className="flex items-center">
//                   <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
//                   <div>
//                     <div className="font-semibold text-gray-900">{testimonial.name}</div>
//                     <div className="text-gray-600 text-sm">{testimonial.role}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* WhatsApp Floating Button */}
//       <div className="fixed bottom-6 right-6 z-50">
//         {showWhatsApp && (
//           <div className="bg-white rounded-xl shadow-xl p-4 mb-4 max-w-xs transform transition-all duration-300 animate-in slide-in-from-bottom">
//             <div className="flex items-center mb-3">
//               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3"><MessageCircle className="w-5 h-5 text-white" /></div>
//               <div>
//                 <div className="font-semibold text-sm">Gym Expert</div>
//                 <div className="text-xs text-gray-500">Typically replies instantly</div>
//               </div>
//             </div>
//             <div className="bg-gray-100 rounded-lg p-3 mb-3"><p className="text-sm text-gray-700">Need help choosing equipment?</p></div>
//             <a href="https://wa.me/08160486223?text=Hi%20EliteGym%20team,%20I%20need%20help%20with..." className="block w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors text-center" target="_blank" rel="noopener noreferrer">Start Chat</a>
//           </div>
//         )}
//         <button onClick={() => setShowWhatsApp(!showWhatsApp)} className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"><MessageCircle className="w-6 h-6 text-white" /></button>
//       </div>

    
      
//     </div>
//   );
// };

// export default Home;

"use client";
import React, { useState, useEffect } from "react";
import {
  MessageCircle, Star, Package, TrendingUp, Users, Award, Shield, Truck, CheckCircle, Quote,
  ArrowRight,
} from "lucide-react";
import { useCart, useProducts } from "@/store/hooks";
import { Product } from "@/store/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCurrencyStore } from "@/store";

// --- Static Data ---
const heroSlides = [
  { image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop", title: "Professional Strength Equipment", subtitle: "Commercial quality for home gyms", cta: "Shop Now" },
  { image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&auto=format&fit=crop", title: "Premium Cardio Machines", subtitle: "Engineered for performance and durability", cta: "View Collection" },
  { image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop", title: "Transform Your Fitness Journey", subtitle: "Professional equipment for every goal", cta: "Get Started" },
];

const horizontalProducts = [
  { id: "1", name: "Adjustable Bench", price: 200000, image: "/images/img_gym7.jpeg", badge: "Best Seller" },
  { id: "2", name: "Olympic Plates", price: 15000, image: "/images/img_gym9.jpeg", badge: "New" },
  { id: "3", name: "Resistance Bands", price: 100000, image: "/images/img_gym10.jpeg" },
  { id: "4", name: "Jump Rope", price: 20000, image: "/images/img_gym11.jpeg" },
  { id: "5", name: "Kettlebell", price: 150000, image: "/images/img_gym6.jpeg", badge: "Popular" },
  { id: "6", name: "Yoga Mat", price: 200000, image: "/images/img-gym8.jpeg" },
];
export const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Adjustable Dumbbell Set",
    description: "High-quality adjustable dumbbell set ranging from 5 to 50 lbs. Perfect for home workouts.",
    price: 100000,
    image: "/images/img_gym.jpg",
    category: "Strength Equipment" as any,
    stock: 25,
    rating: 4.8,
    reviews: 120,
    created_at: new Date("2024-05-10"),
    updated_at: new Date("2024-06-01"),
  },
  {
    id: "2",
    name: "Yoga Mat",
    description: "Non-slip, extra thick yoga mat with carrying strap for comfort and easy transport.",
    price: 150000,
    image: "/images/img_gym12.jpeg",
    category: "Accessories" as any,
    stock: 100,
    rating: 4.6,
    reviews: 90,
    created_at: new Date("2024-05-12"),
    updated_at: new Date("2024-06-02"),
  },
  {
    id: "3",
    name: "Kettlebell - 20 lbs",
    description: "Cast iron kettlebell with powder coating for durability and better grip.",
    price: 200000,
    image: "/images/img_gym2.jpg",
    category: "Strength Equipment" as any,
    stock: 50,
    rating: 4.7,
    reviews: 60,
    created_at: new Date("2024-05-15"),
    updated_at: new Date("2024-06-05"),
  },
  {
    id: "4",
    name: "Resistance Bands Set",
    description: "Set of 5 resistance bands with different resistance levels for full-body workouts.",
    price: 300000,
    image: "/images/img_gym7.jpeg",
    category: "Accessories" as any,
    stock: 80,
    rating: 4.5,
    reviews: 75,
    created_at: new Date("2024-05-18"),
    updated_at: new Date("2024-06-07"),
  },
  {
    id: "5",
    name: "Treadmill",
    description: "Compact foldable treadmill with adjustable incline and built-in heart rate monitor.",
    price: 200000,
    image: "/images/img_gym10.jpeg",
    category: "Cardio Equipment" as any,
    stock: 10,
    rating: 4.3,
    reviews: 35,
    created_at: new Date("2024-05-20"),
    updated_at: new Date("2024-06-08"),
  },
  {
    id: "6",
    name: "Pull-Up Bar",
    description: "Doorway pull-up bar with multiple grip positions for upper body strength training.",
    price: 100000,
    image: "/images/img-gym8.jpeg",
    category: "Strength Equipment" as any,
    stock: 40,
    rating: 4.4,
    reviews: 50,
    created_at: new Date("2024-05-22"),
    updated_at: new Date("2024-06-09"),
  },
  {
    id: "7",
    name: "Foam Roller",
    description: "High-density foam roller for deep tissue massage and muscle recovery.",
    price: 200000,
    image: "/images/img_gym9.jpeg",
    category: "Accessories" as any,
    stock: 70,
    rating: 4.6,
    reviews: 45,
    created_at: new Date("2024-05-24"),
    updated_at: new Date("2024-06-10"),
  },
];

const testimonials = [
  { id: 1, name: "Sarah Johnson", role: "Fitness Enthusiast", content: "EliteGym equipment transformed my home workout experience. The quality is outstanding and delivery was seamless.", rating: 5, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" },
  { id: 2, name: "Mike Chen", role: "Personal Trainer", content: "I've recommended EliteGym to all my clients. Professional-grade equipment at reasonable prices.", rating: 5, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" },
  { id: 3, name: "Emily Rodriguez", role: "Gym Owner", content: "Equipped my entire gym with EliteGym products. Excellent durability and customer service.", rating: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop" },
];

const stats = [
  { icon: Package, label: "Equipment Listed", value: 500, suffix: "+" },
  { icon: TrendingUp, label: "Equipment Sold", value: 12000, suffix: "+" },
  { icon: Users, label: "Happy Clients", value: 8500, suffix: "+" },
];

const whyUsFeatures = [
  { icon: Award, title: "Premium Quality", description: "Commercial-grade equipment built to last" },
  { icon: Shield, title: "Warranty Protection", description: "Comprehensive warranty on all products" },
  { icon: Truck, title: "Free Shipping", description: "Free delivery on orders over $500" },
  { icon: CheckCircle, title: "Expert Support", description: "24/7 customer service and installation help" },
];

// --- Counter Hook ---
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number | undefined;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;
      if (progress < 1) {
        setCount(Math.floor(end * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return { count, setIsVisible };
};

// --- Main Component ---
const Home = () => {
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart, isInCart } = useCart();
  const { currentCurrency, formatPrice } = useCurrencyStore();
  
  const {
    
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    getFilteredProducts,
    fetchProducts,
  } = useProducts();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, setFilters]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Stats Counter Component ---
  const StatsCounter = ({ stat }: { stat: typeof stats[0] }) => {
    const { count, setIsVisible } = useCounter(stat.value);
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true) }, { threshold: 0.5 });
      const element = document.getElementById(`stat-${stat.label}`);
      if (element) observer.observe(element);
      return () => { if (element) observer.unobserve(element) };
    }, [stat.label, setIsVisible]);

    return (
      <div id={`stat-${stat.label}`} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"><stat.icon className="w-8 h-8 text-white" /></div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{count.toLocaleString()}{stat.suffix}</div>
        <div className="text-gray-600">{stat.label}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredProducts: Product[] = getFilteredProducts();
  console.log(filteredProducts, "check if products is available");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl">
                <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">{slide.title}</h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">{slide.subtitle}</p>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">{slide.cta}</button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* Featured Accessories */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Accessories</h2>
            <p className="text-gray-600">Essential equipment for every fitness journey</p>
          </div>
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {horizontalProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-44 sm:w-48 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
                  <div className="relative h-36 overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">{product.badge}</span>
                    )}
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-md font-bold text-sm">{formatPrice(product.price, currentCurrency)}</div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-blue-100">Trusted by thousands of fitness enthusiasts worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (<StatsCounter key={stat.label} stat={stat} />))}
          </div>
        </div>
      </section>

       {/* Products Section */}
      <section className="py-16 bg-gray-50" id="products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Equipment</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Commercial-grade machines for serious training</p>
          </div>
          {/* Product Filter */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="e.g., Treadmill Pro"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                name="minPrice"
                id="minPrice"
                placeholder="0"
                value={filters.minPrice || ""}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value === "" ? 0 : Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                id="maxPrice"
                placeholder="3000"
                value={filters.maxPrice || ""}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value === "" ? 0 : Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button onClick={clearFilters} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Clear Filters</button>
            </div>
          </div>
         
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProducts.map((product: Product) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
                >
                  {/* Product Image with View Details Overlay */}
                  <div className="h-80 overflow-hidden relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        onClick={() => router.push(`/home/product/${product.id}`)}
                        className="bg-white bg-opacity-90 text-gray-900 px-6 py-3 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-opacity-100 flex items-center shadow-md"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Product Content */}
                  <div className="p-6 flex flex-col">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                          <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="ml-1">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price, currentCurrency)}</span>
                        {product.price && (
                          <span className="text-gray-500 line-through ml-2">{formatPrice(product.price, currentCurrency)}</span>
                        )}
                      </div>
                      <button
                        disabled={isInCart(product.id) || product.stock === 0}
                        onClick={() => {
                          addToCart(product, 1);
                        }}
                        className={`px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          isInCart(product.id) 
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : product.stock === 0
                              ? 'bg-red-100 text-red-600 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        {isInCart(product.id) ? 'Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="lg:col-span-2 text-center py-16 px-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters to find what you&apos;re looking for.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose uvHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We&apos;re committed to providing the best fitness equipment and service experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUsFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"><feature.icon className="w-8 h-8 text-white" /></div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-gray-600">Real feedback from satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-blue-500 mr-3" />
                  <div className="flex">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />))}</div>
                </div>
<p className="text-gray-700 mb-4 italic">&quot;{testimonial.content}&quot;</p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showWhatsApp && (
          <div className="bg-white rounded-xl shadow-xl p-4 mb-4 max-w-xs transform transition-all duration-300 animate-in slide-in-from-bottom">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3"><MessageCircle className="w-5 h-5 text-white" /></div>
              <div>
                <div className="font-semibold text-sm">Gym Expert</div>
                <div className="text-xs text-gray-500">Typically replies instantly</div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 mb-3"><p className="text-sm text-gray-700">Need help choosing equipment?</p></div>
            <a href="https://wa.me/08160486223?text=Hi%20EliteGym%20team,%20I%20need%20help%20with..." className="block w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors text-center" target="_blank" rel="noopener noreferrer">Start Chat</a>
          </div>
        )}
        <button onClick={() => setShowWhatsApp(!showWhatsApp)} className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"><MessageCircle className="w-6 h-6 text-white" /></button>
      </div>
    </div>
  );
};

export default Home;