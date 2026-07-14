'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/store/useCart';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Sparkles } from 'lucide-react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const cartItems = useCart((state) => state.items);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const subtotal = useCart((state) => state.getCartTotal());

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-brand-terracotta border-t-transparent animate-spin" />
        <p className="font-sans text-sm text-brand-muted">Loading your shopping bag...</p>
      </div>
    );
  }

  // Shipping logic: free shipping over $100, otherwise flat $8
  const shippingCost = subtotal > 100 || subtotal === 0 ? 0 : 8.0;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const formattedCode = promoCode.trim().toUpperCase();

    if (formattedCode === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoSuccess('Promo code WELCOME10 applied! 10% discount subtracted.');
    } else if (formattedCode === 'HANDMADE15') {
      setDiscountPercent(15);
      setPromoSuccess('Promo code HANDMADE15 applied! 15% discount subtracted.');
    } else {
      setPromoError('Invalid promo code. Try "WELCOME10" or "HANDMADE15".');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-white border border-brand-sand rounded-full flex items-center justify-center mx-auto text-brand-muted">
          <ShoppingBag size={28} />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-brand-charcoal">Your bag is empty</h1>
          <p className="text-brand-muted text-sm max-w-sm mx-auto">
            It looks like you haven&apos;t added any items to your shopping bag yet. Explore our handcrafted collection to find something you love.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex h-[44px] px-8 items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-medium rounded-btn text-sm transition-colors shadow-subtle"
        >
          Explore the Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-10">
      <h1 className="font-serif text-4xl text-brand-charcoal border-b border-brand-sand pb-6">Your Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 sm:gap-6 bg-white border border-brand-sand rounded-card p-4 sm:p-6 shadow-subtle hover:border-brand-muted transition-colors relative"
            >
              {/* Product Image */}
              <div className="relative w-20 sm:w-28 aspect-[4/5] rounded-lg overflow-hidden shrink-0 border border-brand-sand bg-brand-cream">
                <Image
                  src={item.image}
                  alt={item.productTitle}
                  fill
                  sizes="(max-width: 640px) 80px, 112px"
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-1 pr-6">
                  <h3 className="font-serif text-base sm:text-lg text-brand-charcoal hover:text-brand-terracotta transition-colors line-clamp-1">
                    <Link href={`/product/${item.productSlug}`}>{item.productTitle}</Link>
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-brand-muted">
                    {item.color && (
                      <>
                        <span>Color: <strong>{item.color}</strong></span>
                        <span className="text-brand-sand">|</span>
                      </>
                    )}
                    {item.size && (
                      <span>Size: <strong>{item.size}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity Controller */}
                  <div className="flex items-center border border-brand-sand rounded-btn bg-white">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-2 hover:text-brand-terracotta transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-brand-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-2 hover:text-brand-terracotta transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Pricing Info */}
                  <span className="font-sans font-semibold text-brand-charcoal text-sm sm:text-base">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.variantId)}
                className="absolute top-4 right-4 p-1.5 text-brand-muted hover:text-brand-error transition-colors"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-6">
            <h2 className="font-serif text-xl text-brand-charcoal border-b border-brand-sand pb-4">
              Order Summary
            </h2>

            {/* Calculations List */}
            <div className="space-y-4 font-sans text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>Subtotal</span>
                <span className="text-brand-charcoal font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between text-brand-success font-medium">
                  <span className="flex items-center gap-1">
                    <Tag size={14} /> Discount ({discountPercent}%)
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-brand-muted">
                <span>Shipping</span>
                <span className="text-brand-charcoal font-medium">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              
              {shippingCost > 0 && (
                <div className="text-[11px] text-brand-muted bg-brand-cream p-2.5 rounded-lg flex items-center gap-1.5">
                  <Sparkles size={12} className="text-brand-terracotta" />
                  <span>Add <strong>${(100 - subtotal).toFixed(2)}</strong> more for free shipping!</span>
                </div>
              )}

              <div className="flex justify-between border-t border-brand-sand pt-4 text-base font-semibold text-brand-charcoal">
                <span>Total</span>
                <span className="text-brand-terracotta">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Link CTA */}
            <Link
              href="/checkout"
              className="w-full h-[44px] bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-semibold rounded-btn transition-colors shadow-subtle flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
          </div>

          {/* Promo Code Form */}
          <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-4">
            <h3 className="font-serif text-sm font-semibold text-brand-charcoal">Have a promo code?</h3>
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="WELCOME10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-brand-cream border border-brand-sand rounded-btn text-sm text-brand-charcoal uppercase placeholder-brand-muted focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-charcoal hover:bg-brand-charcoal/90 text-brand-cream text-xs font-semibold rounded-btn transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-xs text-brand-error font-medium">{promoError}</p>}
              {promoSuccess && <p className="text-xs text-brand-success font-medium">{promoSuccess}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
