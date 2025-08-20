'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store';
import { Star, ChevronLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { Product, useCurrencyStore, useProductsStore } from '@/store';
import { getProductById, getAllProducts } from '@/app/admin/dashboard/products/actions';
import { NextSeo } from 'next-seo';
import { trackViewContent } from '@/components/FacebookPixel';
import { trackGAViewItem } from '@/components/GoogleAnalytics';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductVariantLightbox from '@/components/ProductVariantLightbox';
import { getProductImage } from '@/utils/productImage';
import { getCategoryName, getSubcategoryName, getProductName, getProductDescription, getPriceValue } from '@/utils/safeRender';

import { ProductImage } from '@/store/types';

type PageProps = { params: Promise<{ id: string }> }

export default function ProductDetails({ params }: PageProps) {
  const router = useRouter();
  // Use cart store directly for variant support
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setsimilarProducts] = useState<Product[] | []>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  const { formatPrice, currentCurrency } = useCurrencyStore();
  const { getProductImages } = useProductsStore();
  const id = use(params).id;

  // Find the current product
  useEffect(() => {
    async function getDetails() {
      const product = await getProductById(id);
      if (product) {
        const allProducts = await getAllProducts();
        const products = allProducts.filter(p => p.category === product.category);
        
        // Debug logging to help identify object rendering issues
        console.log('Product Details:', {
          productName: product.name,
          productDescription: product.description,
          productCategory: product.category,
          productSubcategory: product.subcategory,
          productVariants: product.variants,
          categoryType: typeof product.category,
          subcategoryType: typeof product.subcategory
        });
        
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
        if (product.types && product.types.length > 0) {
          // For now, we'll use the first type as default variant
          // You may need to implement getDefaultVariant for ProductType
        }

        // Track Facebook Pixel ViewContent event
        if (product.name && product.category) {
          const categoryName = getCategoryName(product.category);
          trackViewContent(getProductName(product), categoryName);
        }

        // Track Google Analytics ViewItem event
        if (product.name && typeof product.price === 'number') {
          trackGAViewItem(product.id, getProductName(product), product.price, 'NGN');
        }
      }
    }

    getDetails();
  }, [id, getProductImages]);


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

  // Safety check to ensure product has valid data
  if (!product.name) {
    console.error('Product has invalid name:', product.name);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg mb-4">Product data is invalid.</p>
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
           title={`${getProductName(product)} | UVHub`}
           description={getProductDescription(product) || 'View product details and buy at UVHub.'}
           openGraph={{
             title: `${getProductName(product)} | UVHub`,
             description: getProductDescription(product) || 'View product details and buy at UVHub.',
             images: [
               { url: getProductImage(product), alt: getProductName(product) },
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

      {/* Product Variants Lightbox */}
      {product.variants && product.variants.length > 0 ? (
        <ProductVariantLightbox 
          product={product}
          variants={product.variants}
          className="mb-16"
          isLoading={false}
        />
      ) : (
        /* Fallback for products without variants */
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden mb-16">
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
                         {productImages.length > 0 ? (
               <ProductImageGallery 
                 images={productImages} 
                 productName={getProductName(product)}
                 className="w-full"
               />
            ) : (
                             <div className="relative w-full h-80">
                 <Image
                   src={product.image}
                   alt={getProductName(product)}
                   fill
                   className="object-contain rounded-xl shadow-md"
                   sizes="(max-width: 768px) 100vw, 50vw"
                   priority
                 />
               </div>
            )}
          </div>
          <div className="md:w-1/2 p-8 flex flex-col">
                         {/* Product Basic Info */}
             <h1 className="text-3xl font-bold text-gray-900 mb-4">
               {getProductName(product)}
             </h1>
             {product.description && (
               <p className="text-gray-600 mb-6 leading-relaxed text-lg">{getProductDescription(product)}</p>
             )}
            
                         {/* Product Category and Subcategory Info */}
             <div className="flex items-center gap-4 mb-6">
               <div className="flex flex-col gap-1">
                 <span className="text-sm text-gray-500">
                   Category: <span className="font-medium text-gray-700">
                     {getCategoryName(product.category_data?.name || product.category)}
                   </span>
                 </span>
                 {product.subcategory && (
                   <span className="text-sm text-gray-500">
                     Subcategory: <span className="font-medium text-gray-700">
                       {getSubcategoryName(product.subcategory)}
                     </span>
                   </span>
                 )}
               </div>
             </div>
          </div>
        </div>
      )}



      {/* Similar Products Section */}
      {similarProducts?.length > 0 && (
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
            <button
              onClick={() => router.push(`/home/all-products`)}
              className="flex items-center text-blue-600 hover:underline"
            >
                             View all in {getCategoryName(product.category_data?.name || product.category)} <ArrowRight className="w-4 h-4 ml-1" />
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
                     alt={getProductName(similarProduct)}
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
                   <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                     {getProductName(similarProduct)}
                   </h3>
                   <div className="flex justify-between items-center mt-2">
                     <div>
                       <span className="text-lg font-bold text-gray-900">
                         ${getPriceValue(similarProduct.price)}
                       </span>
                       {similarProduct.price && (
                         <span className="text-gray-500 line-through text-sm ml-2">${getPriceValue(similarProduct.price)}</span>
                       )}
                     </div>
                     <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                       <Star className="w-3 h-3 text-yellow-500 fill-current" />
                       <span className="ml-1">
                         {getPriceValue(similarProduct.rating)}
                       </span>
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