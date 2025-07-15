// 'use client';

// import { useParams } from 'next/navigation';
// // import { useOrdersStore } from '@/store/orders-store';
// import { useEffect, useState } from 'react';
// // import { Order } from '@/types';
// import { Button } from '@/components/ui/button';
// import { CheckCircle, ShoppingBag, Truck } from 'lucide-react';
// import { Order, useOrdersStore } from '@/store';

// export default function OrderConfirmationPage() {
//   const { id } = useParams();
//   const { getOrderById } = useOrdersStore();
//   const [order, setOrder] = useState<Order | null>(null);

//   useEffect(() => {
//     if (id) {
//       const orderData = getOrderById(id as string);
//       setOrder(orderData || null);
//     }
//   }, [id, getOrderById]);

//   if (!order) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <p>Loading order details...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-2xl mx-auto text-center">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
//           <CheckCircle className="w-8 h-8 text-green-600" />
//         </div>
        
//         <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
//         <p className="text-lg text-gray-600 mb-8">
//           Thank you for your purchase. Your order #{order.id} has been received and is being processed.
//         </p>

//         <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <ShoppingBag className="w-6 h-6 text-blue-600" />
//             </div>
//             <div>
//               <h2 className="font-semibold">Order Summary</h2>
//               <p className="text-sm text-gray-500">#{order.id}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <h3 className="font-medium mb-2">Shipping Address</h3>
//               <p className="text-gray-600">
//                 {order.customer.name}<br />
//                 {order.customer.address.street}<br />
//                 {order.customer.address.city}, {order.customer.address.state} {order.customer.address.zipCode}<br />
//                 {order.customer.address.country}
//               </p>
//             </div>

//             <div>
//               <h3 className="font-medium mb-2">Payment Method</h3>
//               <p className="text-gray-600 capitalize">
//                 {order.paymentMethod.replace('_', ' ')}
//               </p>
//             </div>
//           </div>

//           <div className="border-t pt-4">
//             <h3 className="font-medium mb-4">Order Items</h3>
//             <div className="space-y-4">
//               {order.items.map(item => (
//                 <div key={item.id} className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
//                     {item.product && (
//                       <img
//                         src={item.product.image}
//                         alt={item.product.name}
//                         className="w-full h-full object-cover"
//                       />
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <h4 className="font-medium">{item.product?.name || 'Product'}</h4>
//                     <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                   </div>
//                   <div className="font-medium">
//                     ${item.price.toFixed(2)}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between font-bold text-lg mt-6 pt-4 border-t">
//               <span>Total</span>
//               <span>${order.total.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-blue-50 rounded-lg p-6 mb-8">
//           <div className="flex items-center gap-4">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <Truck className="w-6 h-6 text-blue-600" />
//             </div>
//             <div>
//               <h2 className="font-semibold mb-1">Shipping Status</h2>
//               <p className="text-sm text-gray-600">
//                 Your order is being processed and will be shipped soon.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Button variant="outline" className="w-full sm:w-auto">
//             View Order Details
//           </Button>
//           <Button className="w-full sm:w-auto">
//             Continue Shopping
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }