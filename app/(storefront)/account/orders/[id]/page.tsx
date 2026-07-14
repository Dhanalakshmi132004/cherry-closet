import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ChevronLeft, Truck, Hammer, Clock, CheckCircle2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0; // Dynamic fetching of order updates

export default async function AccountOrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/account/orders/${params.id}`);
  }

  const userId = (session.user as any).id;

  const order = await prisma.order.findFirst({
    where: {
      id: params.id,
      userId,
    },
    include: {
      address: true,
      items: {
        include: {
          variant: true,
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

  if (!order) {
    notFound();
  }

  // Define step status
  const steps = [
    { name: 'Order Placed', status: 'completed' },
    {
      name: 'In Production',
      status: order.status === 'in_production' || order.status === 'shipped' || order.status === 'delivered' ? 'completed' : 'pending',
    },
    {
      name: 'Shipped',
      status: order.status === 'shipped' || order.status === 'delivered' ? 'completed' : 'pending',
    },
    {
      name: 'Delivered',
      status: order.status === 'delivered' ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-sand pb-6">
        <Link
          href="/account/orders"
          className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-charcoal transition-colors font-medium font-sans"
        >
          <ChevronLeft size={16} /> Back to History
        </Link>
        <span className="font-serif text-sm tracking-wider text-brand-charcoal">
          ORDER DETAILS
        </span>
        <div className="w-16" />
      </div>

      {/* Progress Tracker Card */}
      <div className="bg-white border border-brand-sand rounded-card p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs text-brand-muted font-sans uppercase font-semibold tracking-wider">Status Update</span>
            <h2 className="font-serif text-2xl text-brand-charcoal mt-1">
              {order.status === 'pending' && 'Stitching soon'}
              {order.status === 'in_production' && 'Under active production'}
              {order.status === 'shipped' && 'On its way to you'}
              {order.status === 'delivered' && 'Delivered successfully'}
            </h2>
          </div>
          <span
            className={cn(
              "px-4 py-1.5 rounded-pill text-xs font-semibold uppercase tracking-wider flex items-center gap-1",
              order.status === 'pending' && "bg-brand-terracotta/10 text-brand-terracotta",
              order.status === 'in_production' && "bg-amber-100 text-amber-800",
              order.status === 'shipped' && "bg-blue-100 text-blue-800",
              order.status === 'delivered' && "bg-brand-success/10 text-brand-success"
            )}
          >
            {order.status.replace('_', ' ')}
          </span>
        </div>

        {/* Progress Bar Visualization */}
        <div className="relative pt-6 pb-2">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-brand-sand -translate-y-1/2 z-0 hidden sm:block" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 relative z-10 font-sans text-xs font-medium">
            {steps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              return (
                <div key={step.name} className="flex sm:flex-col items-center gap-3 sm:gap-2 bg-white sm:px-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors shrink-0",
                      isCompleted
                        ? "bg-brand-terracotta border-brand-terracotta text-brand-cream"
                        : "bg-white border-brand-sand text-brand-muted"
                    )}
                  >
                    {isCompleted ? <CheckCircle2 size={12} /> : idx + 1}
                  </div>
                  <span className={cn(isCompleted ? "text-brand-charcoal font-semibold" : "text-brand-muted")}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary and Shipping details grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Products list */}
        <div className="md:col-span-7 bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-4">
          <h3 className="font-serif text-base text-brand-charcoal border-b border-brand-sand pb-3">Items list</h3>
          <div className="space-y-4 divide-y divide-brand-sand/50">
            {order.items.map((item) => {
              const primaryImg = item.product?.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';
              return (
                <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                  <div className="relative w-12 aspect-[4/5] rounded border border-brand-sand overflow-hidden shrink-0 bg-brand-cream">
                    <img
                      src={primaryImg}
                      alt={item.product?.title || 'Product'}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0 font-sans text-xs flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-serif text-sm text-brand-charcoal truncate font-medium">
                        {item.product?.title}
                      </h4>
                      <p className="text-brand-muted mt-0.5">
                        {item.variant?.color || 'OS'} / {item.variant?.size || 'OS'} &times; {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-brand-terracotta mt-1">
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-brand-sand pt-4 space-y-2 text-xs font-sans">
            <div className="flex justify-between text-brand-muted">
              <span>Subtotal</span>
              <span className="text-brand-charcoal font-medium">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>Shipping</span>
              <span className="text-brand-charcoal font-medium">
                {order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-brand-sand pt-2 text-sm font-semibold text-brand-charcoal">
              <span>Total Paid</span>
              <span className="text-brand-terracotta">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Address and updates */}
        <div className="md:col-span-5 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-4">
            <h3 className="font-serif text-base text-brand-charcoal border-b border-brand-sand pb-3">Shipping Address</h3>
            {order.address && (
              <p className="font-sans text-xs text-brand-muted leading-relaxed">
                <strong className="text-brand-charcoal font-medium block mb-1">{order.customerName}</strong>
                {order.address.line1}
                {order.address.line2 && <span className="block">{order.address.line2}</span>}
                <span className="block">
                  {order.address.city}, {order.address.state} {order.address.postalCode}
                </span>
                <span className="block">{order.address.country}</span>
              </p>
            )}
          </div>

          {/* Help card */}
          <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-3 font-sans text-xs">
            <h4 className="font-serif text-sm text-brand-charcoal font-semibold">Need help with this order?</h4>
            <p className="text-brand-muted leading-relaxed">
              If you have any questions about yarn fibers, custom sizing tweaks, or delivery status, feel free to contact us.
            </p>
            <a
              href="mailto:support@crochet.com"
              className="text-brand-terracotta hover:underline font-semibold block pt-1"
            >
              support@crochet.com &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
