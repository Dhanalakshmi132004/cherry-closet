import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Check, Calendar, Mail, Compass, HelpCircle, ArrowRight } from 'lucide-react';

interface OrderConfirmationPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0; // Dynamic rendering for new orders

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { id } = params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      address: true,
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
          variant: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const hasMadeToOrder = order.items.some((item) => item.product?.madeToOrder);
  const maxShipDays = order.items.reduce(
    (max, item) => (item.product?.shipEstimateDays || 3) > max ? (item.product?.shipEstimateDays || 3) : max,
    3
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      {/* 1. Celebratory Success Card */}
      <div className="bg-white border border-brand-sand rounded-card p-8 text-center space-y-6 shadow-subtle">
        <div className="w-16 h-16 rounded-full bg-brand-success/15 text-brand-success flex items-center justify-center mx-auto">
          <Check size={32} />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-semibold text-brand-success uppercase tracking-widest block">
            Payment Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-charcoal">
            Thank you for your order!
          </h1>
          <p className="text-brand-muted text-sm max-w-md mx-auto leading-relaxed font-sans">
            We&apos;ve received your request and sent a confirmation receipt to{' '}
            <strong className="text-brand-charcoal">{order.customerEmail}</strong>.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-brand-muted bg-brand-cream px-6 py-3 rounded-pill border border-brand-sand/50">
          <span>Order ID: <strong className="text-brand-charcoal">{order.id}</strong></span>
          <span className="hidden sm:inline text-brand-sand">|</span>
          <span>Placed: <strong className="text-brand-charcoal">{new Date(order.createdAt).toLocaleDateString()}</strong></span>
        </div>
      </div>

      {/* 2. Timeline Steps */}
      <div className="space-y-6">
        <h2 className="font-serif text-xl text-brand-charcoal">What happens next?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-brand-sand rounded-card p-6 space-y-3 shadow-subtle relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-brand-terracotta text-brand-cream text-xs font-bold flex items-center justify-center mb-2">
              1
            </div>
            <h3 className="font-serif text-base text-brand-charcoal font-semibold">Artisan Assignment</h3>
            <p className="text-xs text-brand-muted leading-relaxed font-sans">
              {hasMadeToOrder
                ? 'Your made-to-order items are assigned to an artisan who will begin looping the stitches by hand.'
                : 'Your in-stock items are being carefully inspected and wrapped in protective tissue paper.'}
            </p>
          </div>

          <div className="bg-white border border-brand-sand rounded-card p-6 space-y-3 shadow-subtle">
            <div className="w-8 h-8 rounded-full bg-brand-cream border border-brand-sand text-brand-muted text-xs font-bold flex items-center justify-center mb-2">
              2
            </div>
            <h3 className="font-serif text-base text-brand-charcoal font-semibold">
              {hasMadeToOrder ? 'Production & Care' : 'Dispatch'}
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed font-sans">
              {hasMadeToOrder
                ? `Production requires approximately ${maxShipDays} days to guarantee dense, durable stichwork.`
                : 'Packages are picked up by our shipping carrier within 24-48 business hours.'}
            </p>
          </div>

          <div className="bg-white border border-brand-sand rounded-card p-6 space-y-3 shadow-subtle">
            <div className="w-8 h-8 rounded-full bg-brand-cream border border-brand-sand text-brand-muted text-xs font-bold flex items-center justify-center mb-2">
              3
            </div>
            <h3 className="font-serif text-base text-brand-charcoal font-semibold">Shipment Tracking</h3>
            <p className="text-xs text-brand-muted leading-relaxed font-sans">
              You will receive an automated email containing a carrier tracking number as soon as the shipping label is generated.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Order Breakdown and Shipping details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Items list */}
        <div className="md:col-span-7 bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg text-brand-charcoal border-b border-brand-sand pb-3">
            Summary of Items
          </h2>
          <div className="space-y-4 divide-y divide-brand-sand/50">
            {order.items.map((item) => {
              const primaryImg = item.product?.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';
              return (
                <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                  <div className="relative w-14 aspect-[4/5] rounded border border-brand-sand overflow-hidden shrink-0 bg-brand-cream">
                    <Image
                      src={primaryImg}
                      alt={item.product?.title || 'Product'}
                      fill
                      className="object-cover"
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

        {/* Shipping address details */}
        <div className="md:col-span-5 bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-4">
          <h2 className="font-serif text-lg text-brand-charcoal border-b border-brand-sand pb-3">
            Shipping Information
          </h2>
          <div className="space-y-4 font-sans text-xs">
            <div className="space-y-1">
              <span className="text-brand-muted uppercase font-semibold tracking-wider block">Recipient</span>
              <p className="text-brand-charcoal font-medium">{order.customerName}</p>
            </div>

            {order.address && (
              <div className="space-y-1">
                <span className="text-brand-muted uppercase font-semibold tracking-wider block">Address</span>
                <p className="text-brand-charcoal leading-relaxed">
                  {order.address.line1}
                  {order.address.line2 && <span className="block">{order.address.line2}</span>}
                  <span className="block">
                    {order.address.city}, {order.address.state} {order.address.postalCode}
                  </span>
                  <span className="block">{order.address.country}</span>
                </p>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-brand-muted uppercase font-semibold tracking-wider block">Shipping Mode</span>
              <p className="text-brand-charcoal font-medium">
                {hasMadeToOrder ? 'Standard Insured (Stitched to Order)' : 'Standard Ground'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Action Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center border-t border-brand-sand pt-8">
        <Link
          href="/shop"
          className="h-[44px] px-6 inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-semibold rounded-btn transition-colors text-sm"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account/orders"
          className="h-[44px] px-6 inline-flex items-center justify-center border border-brand-sand hover:border-brand-charcoal text-brand-charcoal bg-white font-semibold rounded-btn transition-all text-sm"
        >
          Track in Order History <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>

    </div>
  );
}
