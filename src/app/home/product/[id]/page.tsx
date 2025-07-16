// 'use client';

// import { useRouter, useParams } from 'next/navigation';
// import { useCart, useProducts } from '@/store/hooks';
// import { Star, ChevronLeft } from 'lucide-react';

// export default function ProductDetails() {
//   const router = useRouter();
//   const { id } = useParams(); // expects [id].tsx route
//   const { products } = useProducts();
//   const { addToCart, isInCart } = useCart();

//   // Find the product by id
//   const product = products.find((p) => p.id === id);

//   if (!product) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <p className="text-gray-500 text-lg mb-4">Product not found.</p>
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-blue-600 hover:underline"
//         >
//           <ChevronLeft className="w-5 h-5" />
//           Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto py-12 px-4">
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
//       >
//         <ChevronLeft className="w-5 h-5" />
//         Back to Products
//       </button>
//       <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
//         <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-80 object-contain rounded-xl shadow-md"
//           />
//         </div>
//         <div className="md:w-1/2 p-8 flex flex-col">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
//           <div className="flex items-center gap-2 mb-4">
//             <span className="text-xl font-semibold text-blue-600">${product.price}</span>
//             {product.price && (
//               <span className="text-gray-400 line-through text-lg">${product.price}</span>
//             )}
//             <span className="flex items-center ml-4 text-yellow-500 font-medium">
//               <Star className="w-5 h-5 mr-1" />
//               {product.rating}
//             </span>
//           </div>
//           <p className="text-gray-700 mb-6">{product.description}</p>
//           <div className="flex items-center gap-4 mb-8">
//             <span className="text-sm text-gray-500">Category: <span className="font-medium text-gray-700">{product.category}</span></span>
//             <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
//               {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
//             </span>
//           </div>
//           <button
//             onClick={() => addToCart(product, 1)}
//             disabled={isInCart(product.id) || product.stock === 0}
//             className={`w-full py-4 rounded-lg font-semibold text-lg shadow-md transition-all duration-300
//               ${isInCart(product.id) || product.stock === 0
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105'
//               }`}
//           >
//             {isInCart(product.id)
//               ? 'Already in Cart'
//               : product.stock === 0
//                 ? 'Out of Stock'
//                 : 'Add to Cart'}
//           </button>
//         </div>
//       </div>
//       {/* Optionally, add reviews/testimonials here */}
//     </div>
//   );
// }

'use client';

import { useRouter } from 'next/navigation';
import { useCart, useProducts } from '@/store/hooks';
import { Star, ChevronLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { use } from 'react';

type PageProps = { params: Promise<{ id: string }> }

export default function ProductDetails({ params }: PageProps) {
  const router = useRouter();
  const { products } = useProducts();
  const { addToCart, isInCart } = useCart();
  const id = use(params).id;

  // Find the current product
  const product = products.find((p) => p.id === id);

  // Find similar products (same category, excluding current product)
  const similarProducts = products
    .filter(p => p.category === product?.category && p.id !== id)
    .slice(0, 4); // Show max 4 similar products

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
        </div>
        <div className="md:w-1/2 p-8 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-semibold text-blue-600">N{product.price}</span>
            {product.price && (
              <span className="text-gray-400 line-through text-lg">N{product.price}</span>
            )}
            <span className="flex items-center ml-4 text-yellow-500 font-medium">
              <Star className="w-5 h-5 mr-1 fill-current" />
              {product.rating}
            </span>
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm text-gray-500">Category: <span className="font-medium text-gray-700">{product.category.name}</span></span>
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isInCart(product.id) || product.stock === 0}
            className={`w-full py-4 rounded-lg font-semibold text-lg shadow-md transition-all duration-300
              ${isInCart(product.id) || product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105'
              }`}
          >
            {isInCart(product.id)
              ? 'Already in Cart'
              : product.stock === 0
                ? 'Out of Stock'
                : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
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
                    src={similarProduct.image}
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