'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/store/types';
import { getAllProducts } from '../products/actions';
import ProductVariantDisplay from '@/components/ProductVariantDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Package } from 'lucide-react';

export default function VariantTestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const productsWithVariants = products.filter(product => 
    product.variants && product.variants.length > 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Variants Test</h1>
        <p className="text-gray-600 mt-2">
          Test the new variant functionality with lightbox display
        </p>
      </div>

      {selectedProduct ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedProduct(null)}
            >
              ← Back to Products
            </Button>
            <Badge variant="secondary">
              {selectedProduct.variants?.length || 0} variants
            </Badge>
          </div>
          
          <ProductVariantDisplay 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-medium">
                Products with Variants: {productsWithVariants.length}
              </span>
            </div>
            <Badge variant="outline">
              Total Products: {products.length}
            </Badge>
          </div>

          {productsWithVariants.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Products with Variants
                </h3>
                <p className="text-gray-600">
                  Create some product variants in the products section to test this functionality.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsWithVariants.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="secondary">
                        {product.variants?.length || 0} variants
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">
                        Category: {product.category_data?.name || 'Uncategorized'}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Variants: {product.variants?.map(v => v.name).join(', ')}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>Click to view variants</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
