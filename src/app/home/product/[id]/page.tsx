'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/store/hooks';
import { Star, ChevronLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { Product, useCurrencyStore, useProductsStore } from '@/store';
import { NextSeo } from 'next-seo';
import { trackViewContent } from '@/components/FacebookPixel';
import { trackGAViewItem } from '@/components/GoogleAnalytics';
import ProductImageGallery from '@/components/ProductImageGallery';
import { getProductImage } from '@/utils/productImage';
import { getProductPrice } from '@/utils/productPrice';
import { getVariantPrice, getDefaultVariant } from '@/utils/variantPrice';
import ProductVariantSelector from '@/components/ProductVariantSelector';
import { ProductImage, ProductVariant } from '@/store/types';

type PageProps = { params: Promise<{ id: string }> }

export default function ProductDetails({ params }: PageProps) {
  const router = useRouter();
  const { getProductById, getProductsByCategory } = useProductsStore();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setsimilarProducts] = useState<Product[] | []>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const { formatPrice, currentCurrency, location } = useCurrencyStore();
  const { getProductImages } = useProductsStore();
  const id = use(params).id;

  // Find the current product
  useEffect(() => {
    async function getDetails() {
      const product = getProductById(id);
      if (product) {
        const products = getProductsByCategory(product.category?.id as string);

        setProduct(product);
        setsimilarProducts(products!);

        // Get product images
        try {
          const images = await getProductImages(id);
          setProductImages(images);
        } catch (error) {
          console.error('Error fetching product images:', error);
        }

        // Set default variant if product has variants
        if (product.variants && product.variants.length > 0) {
          const defaultVariant = getDefaultVariant(product.variants);
          if (defaultVariant) {
            setSelectedVariant(defaultVariant);
          }
        }

        // Track Facebook Pixel ViewContent event
        trackViewContent(product.name, product.category?.name);

        // Track Google Analytics ViewItem event
        trackGAViewItem(product.id, product.name, product.price, 'NGN');
      }
    }

    getDetails();
  }, [id, getProductById, getProductsByCategory, getProductImages]);


  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg mb-4">Product not found.</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {product && (
        <NextSeo
          title={`${product.name} | UVHub`}
          description={product.description || 'View product details and buy at UVHub.'}
          openGraph={{
            title: `${product.name} | UVHub`,
            description: product.description || 'View product details and buy at UVHub.',
            images: [
              { url: getProductImage(product), alt: product.name },
            ],
          }}
        />
      )}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Products
      </button>

      {/* Main Product Section */}
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden mb-16">
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
          {productImages.length > 0 ? (
            <ProductImageGallery 
              images={productImages} 
              productName={product.name}
              className="w-full"
            />
          ) : (
            <div className="relative w-full h-80">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain rounded-xl shadow-md"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}
        </div>
        <div className="md:w-1/2 p-8 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-semibold text-blue-600">
              {selectedVariant 
                ? formatPrice(getVariantPrice(selectedVariant, location), currentCurrency)
                : formatPrice(getProductPrice(product, location), currentCurrency)
              }
            </span>
            {product.price && (
              <span className="text-gray-400 line-through text-lg">
                {selectedVariant 
                  ? formatPrice(getVariantPrice(selectedVariant, location), currentCurrency)
                  : formatPrice(getProductPrice(product, location), currentCurrency)
                }
              </span>
            )}
            <span className="flex items-center ml-4 text-yellow-500 font-medium">
              <Star className="w-5 h-5 mr-1 fill-current" />
              {product.rating}
            </span>
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <ProductVariantSelector
                variants={product.variants}
                location={location}
                selectedVariantId={selectedVariant?.id}
                onVariantChange={setSelectedVariant}
                showLocationIndicator={true}
              />
            </div>
          )}
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500">
                Category: <span className="font-medium text-gray-700">{product.category.name}</span>
              </span>
              {product.subcategory && (
                <span className="text-sm text-gray-500">
                  Subcategory: <span className="font-medium text-gray-700">{product.subcategory.name}</span>
                </span>
              )}
            </div>
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <button
            onClick={() => {
              if (selectedVariant) {
                // Add variant to cart (you'll need to update the cart system to handle variants)
                addToCart(product, 1);
              } else {
                addToCart(product, 1);
              }
            }}
            disabled={
              Boolean(
                isInCart(product.id) ||
                product.stock === 0 ||
                (selectedVariant ? selectedVariant.stock === 0 : false)
              )
            }
            className={`w-full py-4 rounded-lg font-semibold text-lg shadow-md transition-all duration-300
              ${isInCart(product.id) || product.stock === 0 || (selectedVariant && selectedVariant.stock === 0)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105'
              }`}
          >
            {isInCart(product.id)
              ? 'Already in Cart'
              : product.stock === 0 || (selectedVariant && selectedVariant.stock === 0)
                ? 'Out of Stock'
                : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts?.length > 0 && (
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
            <button
              onClick={() => router.push(`/home/all-products`)}
              className="flex items-center text-blue-600 hover:underline"
            >
              View all in {product.category.name} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((similarProduct) => (
              <div
                key={similarProduct.id}
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getProductImage(similarProduct)}
                    alt={similarProduct.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => router.push(`/home/product/${similarProduct.id}`)}
                      className="bg-white bg-opacity-90 text-gray-900 px-4 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-opacity-100 flex items-center shadow-md text-sm"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex flex-col">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{similarProduct.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <span className="text-lg font-bold text-gray-900">${similarProduct.price}</span>
                      {similarProduct.price && (
                        <span className="text-gray-500 line-through text-sm ml-2">${similarProduct.price}</span>
                      )}
                    </div>
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="ml-1">{similarProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}