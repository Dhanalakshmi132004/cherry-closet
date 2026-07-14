import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ShoppingBag, ChevronRight, Eye, Truck, Hammer, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const revalidate = 0; // Dynamic rendering for order updates

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/account/orders');
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { position: 'asc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-8">
      {/* Breadcrumb / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-sand pb-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Account dashboard</span>
          <h1 className="font-serif text-3xl text-brand-charcoal">Your Order History</h1>
        </div>
        <Link
          href="/account"
          className="text-xs font-semibold text-brand-terracotta hover:underline self-start sm:self-center"
        >
          Manage profile & addresses &rarr;
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-brand-sand rounded-card space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-muted flex items-center justify-center mx-auto">
            <ShoppingBag size={20} />
          </div>
          <h3 className="font-serif text-lg text-brand-charcoal">No orders placed yet</h3>
          <p className="text-brand-muted text-xs max-w-xs mx-auto leading-relaxed">
            You haven&apos;t placed any orders with this account. Once you place an order, it will appear here.
          </p>
          <Link
            href="/shop"
            className="inline-flex h-[40px] px-6 items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream text-xs font-semibold rounded-btn transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const hasMadeToOrder = order.items.some(item => item.product?.madeToOrder);
            
            return (
              <div
                key={order.id}
                className="bg-white border border-brand-sand rounded-card overflow-hidden shadow-subtle hover:border-brand-muted transition-colors"
              >
                {/* Order Top Bar Info */}
                <div className="bg-brand-cream/50 px-6 py-4 border-b border-brand-sand flex flex-wrap justify-between items-center gap-4 text-xs font-sans">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-brand-muted">
                    <span>
                      Placed:{' '}
                      <strong className="text-brand-charcoal">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </strong>
                    </span>
                    <span>
                      Order ID: <strong className="text-brand-charcoal">{order.id}</strong>
                    </span>
                    {hasMadeToOrder && (
                      <span className="text-brand-terracotta font-medium flex items-center gap-1">
                        <Hammer size={12} /> Contains custom craft
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={cn(
                        "px-3 py-1 rounded-pill text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1",
                        order.status === 'pending' && "bg-brand-terracotta/10 text-brand-terracotta",
                        order.status === 'in_production' && "bg-amber-100 text-amber-800",
                        order.status === 'shipped' && "bg-blue-100 text-blue-800",
                        order.status === 'delivered' && "bg-brand-success/10 text-brand-success"
                      )}
                    >
                      {order.status === 'pending' && <Clock size={10} />}
                      {order.status === 'in_production' && <Hammer size={10} />}
                      {order.status === 'shipped' && <Truck size={10} />}
                      {order.status === 'delivered' && <CheckCircle size={10} />}
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Order Contents Details */}
                <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                  {/* Thumbnails */}
                  <div className="flex gap-4 items-center overflow-x-auto">
                    {order.items.map((item) => {
                      const imgUrl = item.product?.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';
                      return (
                        <div
                          key={item.id}
                          className="relative w-12 aspect-[4/5] rounded border border-brand-sand overflow-hidden shrink-0 bg-brand-cream"
                        >
                          <img
                            src={imgUrl}
                            alt={item.product?.title || 'Product'}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      );
                    })}
                    <div className="text-xs font-medium text-brand-muted pl-2">
                      {order.items.length} product{order.items.length > 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-brand-sand/50">
                    <div className="text-right">
                      <span className="text-xs text-brand-muted block font-sans">Total amount Paid</span>
                      <span className="font-sans font-bold text-brand-terracotta text-lg">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="h-[36px] px-4 inline-flex items-center justify-center bg-brand-charcoal hover:bg-brand-charcoal/90 text-brand-cream text-xs font-semibold rounded-btn transition-colors"
                    >
                      <Eye size={14} className="mr-1.5" /> Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
