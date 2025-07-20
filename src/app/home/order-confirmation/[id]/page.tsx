'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Truck, ArrowLeft } from 'lucide-react';
import { Order } from '@/store/types';
import { useCurrencyStore } from '@/store';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { formatPrice, currentCurrency } = useCurrencyStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        
        const orderData = await response.json();
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Order Not Found</h2>
            <p className="text-red-600 mb-4">
              {error || 'The order you are looking for could not be found.'}
            </p>
            <Button onClick={() => router.push('/home')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order #{order.id} has been received and is being processed.
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold">Order Summary</h2>
              <p className="text-sm text-gray-500">#{order.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <p className="text-gray-600">
                {order.shipping_address?.street}<br />
                {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}<br />
                {order.shipping_address?.country}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Payment Method</h3>
              <p className="text-gray-600 capitalize">
                {order.payment_method?.replace('_', ' ') || 'Cash on Delivery'}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Order Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Status</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium capitalize">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date</span>
                <span className="text-gray-900">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg mt-6 pt-4 border-t">
              <span>Total</span>
              <span>{formatPrice(order.total, currentCurrency)}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold mb-1">Shipping Status</h2>
              <p className="text-sm text-gray-600">
                Your order is being processed and will be shipped soon. We&apos;ll contact you when it&apos;s ready for delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-2">Important Information</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Payment will be collected upon delivery</li>
            <li>• Please have the exact amount ready</li>
            <li>• You&apos;ll receive a call to confirm delivery time</li>
            <li>• Contact us at <span className="font-semibold">09026520028</span> for any questions</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => router.push('/home')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          <Button 
            className="w-full sm:w-auto"
            onClick={() => window.open('https://wa.me/+2347032220325?text=Hi%20uvHubGym%20team,%20I%20have%20a%20question%20about%20my%20order%20' + order.id, '_blank')}
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}