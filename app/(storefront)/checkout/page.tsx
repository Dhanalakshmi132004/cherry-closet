'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/lib/store/useCart';
import { CreditCard, Shield, AlertCircle, Loader2, Sparkles, ChevronLeft } from 'lucide-react';

// Form validation schema
const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  line1: z.string().min(5, 'Please enter your street address'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Please enter your city'),
  state: z.string().min(2, 'Please enter your state/province'),
  postalCode: z.string().min(4, 'Please enter a valid ZIP/Postal code'),
  country: z.string().min(2, 'Please enter your country'),
  // Mock payment details
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry date must be MM/YY'),
  cvc: z.string().regex(/^\d{3}$/, 'CVC must be 3 digits'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const cartItems = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const subtotal = useCart((state) => state.getCartTotal());

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Set up react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      cardNumber: '',
      expiry: '',
      cvc: '',
    },
  });

  // Prefill form if user is logged in
  useEffect(() => {
    if (session?.user) {
      setValue('email', session.user.email || '');
      setValue('name', session.user.name || '');
    }
  }, [session, setValue]);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 size={32} className="text-brand-terracotta animate-spin" />
        <p className="font-sans text-sm text-brand-muted">Loading secure checkout...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center space-y-6">
        <h1 className="font-serif text-3xl text-brand-charcoal">Your bag is empty</h1>
        <p className="text-brand-muted text-sm">You need items in your cart to checkout.</p>
        <Link
          href="/shop"
          className="inline-flex h-[44px] px-6 items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-medium rounded-btn text-sm transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const shippingCost = subtotal > 100 ? 0 : 8.0;
  const total = subtotal + shippingCost;

  const onSubmit = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          name: values.name,
          items: cartItems,
          shippingAddress: {
            line1: values.line1,
            line2: values.line2,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
            country: values.country,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong during checkout.');
      }

      // Success! Clear cart and redirect
      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-sand pb-6">
        <Link
          href="/cart"
          className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-charcoal transition-colors font-medium"
        >
          <ChevronLeft size={16} /> Back to Bag
        </Link>
        <span className="font-serif text-xl tracking-wider text-brand-charcoal">
          SECURE CHECKOUT
        </span>
        <div className="w-16" /> {/* Spacer to center title */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Forms */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-8">
          
          {submitError && (
            <div className="p-4 bg-brand-error/10 border border-brand-error/20 rounded-card flex items-center gap-3 text-brand-error">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{submitError}</p>
            </div>
          )}

          {/* 1. Contact Information */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-brand-charcoal border-b border-brand-sand pb-2">
              1. Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="text-xs font-semibold text-brand-charcoal block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                />
                {errors.email && (
                  <p className="text-xs text-brand-error mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="name" className="text-xs font-semibold text-brand-charcoal block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                />
                {errors.name && (
                  <p className="text-xs text-brand-error mt-1">{errors.name.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-brand-charcoal border-b border-brand-sand pb-2">
              2. Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <div className="sm:col-span-6">
                <label htmlFor="line1" className="text-xs font-semibold text-brand-charcoal block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="line1"
                  {...register('line1')}
                  className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                />
                {errors.line1 && (
                  <p className="text-xs text-brand-error mt-1">{errors.line1.message}</p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="line2" className="text-xs font-semibold text-brand-charcoal block mb-1">
                  Apartment, suite, unit (optional)
                </label>
                <input
                  type="text"
                  id="line2"
                  {...register('line2')}
                  className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="city" className="text-xs font-semibold text-brand-charcoal block mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  {...register('city')}
                  className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                />
                {errors.city && (
                  <p className="text-xs text-brand-error mt-1">{errors.city.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="state" className="text-xs font-semibold text-brand-charcoal block mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  id="state"
                  {...register('state')}
                  className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                />
                {errors.state && (
                  <p className="text-xs text-brand-error mt-1">{errors.state.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="postalCode" className="text-xs font-semibold text-brand-charcoal block mb-1">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  {...register('postalCode')}
                  className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                />
                {errors.postalCode && (
                  <p className="text-xs text-brand-error mt-1">{errors.postalCode.message}</p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="country" className="text-xs font-semibold text-brand-charcoal block mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  {...register('country')}
                  className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                />
                {errors.country && (
                  <p className="text-xs text-brand-error mt-1">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 3. Payment Method (Mock Sandbox Mode) */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-brand-charcoal border-b border-brand-sand pb-2 flex items-center gap-2">
              3. Payment Information
              <span className="text-[10px] uppercase font-sans font-semibold bg-brand-cream border border-brand-sand text-brand-muted px-2 py-0.5 rounded">
                Test Mode
              </span>
            </h2>
            
            <div className="p-4 bg-white border border-brand-sand rounded-card space-y-4">
              <div className="flex items-center gap-3 text-xs text-brand-muted border-b border-brand-sand/50 pb-3">
                <CreditCard size={16} className="text-brand-terracotta" />
                <span>Credit Card (Simulated Sandbox Checkout)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-4">
                  <label htmlFor="cardNumber" className="text-xs font-semibold text-brand-charcoal block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="4111 2222 3333 4444"
                    maxLength={16}
                    {...register('cardNumber')}
                    className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-brand-error mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="expiry" className="text-xs font-semibold text-brand-charcoal block mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    {...register('expiry')}
                    className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                  />
                  {errors.expiry && (
                    <p className="text-xs text-brand-error mt-1">{errors.expiry.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="cvc" className="text-xs font-semibold text-brand-charcoal block mb-1">
                    Security Code (CVC)
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    placeholder="123"
                    maxLength={3}
                    {...register('cvc')}
                    className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                  />
                  {errors.cvc && (
                    <p className="text-xs text-brand-error mt-1">{errors.cvc.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Secure details */}
          <div className="flex items-center gap-2.5 text-xs text-brand-muted pl-1">
            <Shield size={16} className="text-brand-success shrink-0" />
            <span>Payments are securely processed. Your connections are encrypted.</span>
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[48px] bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-semibold rounded-btn transition-colors shadow-subtle flex items-center justify-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing Order...
              </>
            ) : (
              `Pay $${total.toFixed(2)}`
            )}
          </button>

        </form>

        {/* Right Column: Order Summary Sidebar */}
        <aside className="lg:col-span-5 bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-lg text-brand-charcoal border-b border-brand-sand pb-4">
            Items in Order
          </h2>

          <div className="space-y-4 divide-y divide-brand-sand/50">
            {cartItems.map((item) => (
              <div key={item.variantId} className="flex gap-4 pt-4 first:pt-0">
                <div className="relative w-12 aspect-[4/5] rounded border border-brand-sand bg-brand-cream overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.productTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 font-sans text-xs">
                  <h4 className="font-serif text-sm text-brand-charcoal truncate font-medium">
                    {item.productTitle}
                  </h4>
                  <p className="text-brand-muted mt-0.5">
                    {item.color || 'OS'} / {item.size || 'OS'} &times; {item.quantity}
                  </p>
                  <p className="text-brand-terracotta font-semibold mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-brand-sand pt-6 space-y-3 font-sans text-sm">
            <div className="flex justify-between text-brand-muted">
              <span>Subtotal</span>
              <span className="text-brand-charcoal font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>Shipping</span>
              <span className="text-brand-charcoal font-medium">
                {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-brand-sand pt-3 text-base font-semibold text-brand-charcoal">
              <span>Total to Pay</span>
              <span className="text-brand-terracotta">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-brand-cream border border-brand-sand rounded-lg p-3 text-[11px] text-brand-muted flex items-start gap-2">
            <Sparkles size={14} className="text-brand-terracotta shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Made-to-order</strong> items will begin hand-stitching as soon as payment is confirmed. Look for an email update once your order starts production!
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
