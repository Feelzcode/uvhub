"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle, Star, Package, TrendingUp, Users, Award, Shield, Truck, CheckCircle,
  ArrowRight, Search, X,
} from "lucide-react";
import { useCart } from "@/store/hooks";
import { useProductsStore } from '@/store'
import { Product } from "@/store/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCurrencyStore } from "@/store";
import Testimonials from "@/components/ui/HomeComponents/Testimonial";

// --- Static Data ---
const heroSlides = [
  { image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&auto=format&fit=crop", title: "Professional Strength Equipment", subtitle: "Commercial quality for home gyms", cta: "Shop Now" },
  { image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&auto=format&fit=crop", title: "Premium Cardio Machines", subtitle: "Engineered for performance and durability", cta: "View Collection" },
  { image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop", title: "Transform Your Fitness Journey", subtitle: "Professional equipment for every goal", cta: "Get Started" },
];

const horizontalProducts = [
  { id: "1", name: "Wonder core", price: 200000, image: "/images/img_gym7.jpeg", badge: "Best Seller" },
  { id: "2", name: "Recumbent Bike", price: 15000, image: "/images/recumbent_bike.webp", badge: "New" },
  { id: "3", name: "Stepper", price: 100000, image: "/images/stepper.jpg" },
  { id: "4", name: "Massage chair", price: 20000, image: "/images/img_gym11.jpeg" },
  { id: "5", name: "Kettlebell", price: 150000, image: "/images/kettlebell.jpeg", badge: "Popular" },
  { id: "6", name: "Dumbbell Rack", price: 200000, image: "/images/dumbbell_rack.webp" },
];

const stats = [
  { icon: Package, label: "Equipment Listed", value: 500, suffix: "+" },
  { icon: TrendingUp, label: "Equipment Sold", value: 12000, suffix: "+" },
  { icon: Users, label: "Happy Clients", value: 8500, suffix: "+" },
];

const whyUsFeatures = [
  { icon: Award, title: "Premium Quality", description: "Commercial-grade equipment built to last" },
  { icon: Shield, title: "Warranty Protection", description: "Comprehensive warranty on all products" },
  { icon: Truck, title: "Free Shipping", description: "Free delivery on all orders" },
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
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    getFilteredProducts,
    getProducts,
  } = useProductsStore();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const router = useRouter();

  useEffect(() => {
    getProducts();
    clearFilters();
  }, [getProducts, clearFilters]);

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

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get autocomplete suggestions
  const getAutocompleteSuggestions = () => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const filteredProducts = getFilteredProducts();
    return filteredProducts
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  };

  const suggestions = getAutocompleteSuggestions();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowAutocomplete(value.length >= 2);
    setSelectedSuggestion(-1);
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchTerm(product.name);
    setShowAutocomplete(false);
    setSelectedSuggestion(-1);
    setFilters({ search: product.name });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showAutocomplete) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
          handleSuggestionClick(suggestions[selectedSuggestion]);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        setSelectedSuggestion(-1);
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowAutocomplete(false);
    setSelectedSuggestion(-1);
    setFilters({ search: '' });
  };

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
          onClick={getProducts}
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
            <div className="md:col-span-2 relative" ref={searchRef}>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="e.g., Treadmill Pro"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showAutocomplete && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((product, index) => (
                    <div
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${
                        index === selectedSuggestion ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{product.name}</div>
                        <div className="text-sm text-gray-500">{formatPrice(product.price, currentCurrency)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                        className={`px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${isInCart(product.id)
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

      <Testimonials/>

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
            <a href="https://wa.me/07032220325?text=Hi%20uvHubGym%20team,%20I%20need%20help%20with..." className="block w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors text-center" target="_blank" rel="noopener noreferrer">Start Chat</a>
          </div>
        )}
        <button onClick={() => setShowWhatsApp(!showWhatsApp)} className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"><MessageCircle className="w-6 h-6 text-white" /></button>
      </div>
    </div>
  );
};

export default Home;