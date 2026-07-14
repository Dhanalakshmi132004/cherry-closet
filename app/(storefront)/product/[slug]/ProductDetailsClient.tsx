'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/store/useCart';
import { cn } from '@/lib/utils';
import { ShoppingBag, ChevronRight, Plus, Minus, Heart, Truck, RefreshCw, Sparkles, Check } from 'lucide-react';

interface ProductDetailsClientProps {
  product: any; // Prisma product with images, variants, collection
  relatedProducts: any[];
}

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
  const addItem = useCart((state) => state.addItem);

  // States
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care'>('details');
  const [showToast, setShowToast] = useState(false);

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIndex] || null;

  // Compute price
  const price = activeVariant?.priceOverride ? activeVariant.priceOverride : product.basePrice;
  const comparePrice = product.compareAtPrice;
  const isSale = comparePrice && comparePrice > price;

  // Stock details
  const isOutOfStock = !product.madeToOrder && (!activeVariant || activeVariant.stock <= 0);
  const stockLimit = activeVariant ? activeVariant.stock : 0;

  const handleIncrement = () => {
    if (product.madeToOrder) {
      setQuantity((q) => q + 1);
    } else {
      setQuantity((q) => Math.min(q + 1, stockLimit));
    }
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(q - 1, 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const primaryImage = product.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';

    addItem({
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      image: primaryImage,
      variantId: activeVariant.id,
      color: activeVariant.color,
      size: activeVariant.size,
      price: price,
      stock: product.madeToOrder ? 99 : stockLimit,
    }, quantity);

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-20 relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-charcoal text-brand-cream px-6 py-4 rounded-card shadow-lg flex items-center gap-3 border border-brand-sand/20 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-brand-terracotta flex items-center justify-center">
            <Check size={18} />
          </div>
          <div>
            <p className="font-sans text-sm font-semibold">Added to Bag</p>
            <p className="font-sans text-xs text-brand-cream/80">
              {quantity}x {product.title} ({activeVariant?.color || 'Default'} / {activeVariant?.size || 'OS'})
            </p>
          </div>
          <Link
            href="/cart"
            className="ml-4 font-sans text-xs font-semibold underline text-brand-terracotta hover:text-brand-terracotta/80"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-sans text-xs font-medium text-brand-muted">
        <Link href="/" className="hover:text-brand-charcoal transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-brand-charcoal transition-colors">Shop</Link>
        {product.collection && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/shop?collection=${product.collection.slug}`}
              className="hover:text-brand-charcoal transition-colors"
            >
              {product.collection.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-brand-charcoal truncate">{product.title}</span>
      </nav>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Main Showcase */}
          <div className="relative aspect-[4/5] rounded-card overflow-hidden border border-brand-sand bg-white shadow-subtle">
            {product.images.length > 0 ? (
              <Image
                src={product.images[activeImageIndex].url}
                alt={product.images[activeImageIndex].altText || product.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80"
                alt="Product placeholder image"
                fill
                priority
                className="object-cover"
              />
            )}
            
            {product.madeToOrder && (
              <span className="absolute bottom-4 left-4 bg-brand-charcoal/90 text-brand-cream text-xs font-medium px-3.5 py-1.5 rounded-pill backdrop-blur-sm shadow-sm flex items-center gap-1.5">
                <Sparkles size={12} className="text-brand-terracotta" />
                Made to order
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={cn(
                    "relative w-20 aspect-[4/5] rounded-lg overflow-hidden border transition-all shrink-0",
                    activeImageIndex === idx
                      ? "border-brand-terracotta ring-2 ring-brand-terracotta/20"
                      : "border-brand-sand hover:border-brand-muted"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `Thumbnail ${idx}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Checkout Info */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4">
            {product.collection && (
              <span className="font-sans text-xs font-semibold tracking-wider text-brand-terracotta uppercase">
                {product.collection.name}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl text-brand-charcoal leading-tight">
              {product.title}
            </h1>
            
            {/* Price Box */}
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-2xl font-semibold text-brand-terracotta">
                ${price.toFixed(2)}
              </span>
              {isSale && (
                <span className="font-sans text-brand-muted line-through text-lg">
                  ${comparePrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {variants.length > 0 && (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">
                Select Option
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {variants.map((v: any, idx: number) => {
                  const isSelected = selectedVariantIndex === idx;
                  const isVarOOS = !product.madeToOrder && v.stock <= 0;
                  
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantIndex(idx);
                        setQuantity(1); // Reset qty on variant change
                      }}
                      disabled={isVarOOS && !product.madeToOrder}
                      className={cn(
                        "px-4 py-3 rounded-btn border text-left flex justify-between items-center transition-all",
                        isSelected
                          ? "border-brand-terracotta bg-brand-terracotta/5 text-brand-charcoal font-medium ring-1 ring-brand-terracotta"
                          : isVarOOS
                          ? "border-brand-sand opacity-40 bg-brand-cream/50 cursor-not-allowed"
                          : "border-brand-sand hover:border-brand-muted bg-white text-brand-muted"
                      )}
                    >
                      <div className="font-sans text-sm">
                        <span className="text-brand-charcoal">{v.color || 'Default'}</span>
                        <span className="mx-1 text-brand-sand">/</span>
                        <span>{v.size || 'OS'}</span>
                      </div>
                      
                      {/* Price / Stock overlay */}
                      <span className="font-sans text-xs">
                        {v.priceOverride ? `$${v.priceOverride.toFixed(2)}` : ''}
                        {isVarOOS ? ' (Sold Out)' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ship Estimate & Production Badges */}
          <div className="bg-white border border-brand-sand rounded-card p-4 space-y-3 font-sans text-xs">
            <div className="flex items-center gap-3 text-brand-charcoal">
              <Truck size={16} className="text-brand-terracotta shrink-0" />
              <span>
                {product.madeToOrder
                  ? `Handcrafted on order: Est. ship in ${product.shipEstimateDays} days`
                  : `In Stock: Ready to ship in 1-2 business days`}
              </span>
            </div>
            {!product.madeToOrder && activeVariant && (
              <div className="flex items-center gap-3 text-brand-muted pl-7">
                <span>Only {activeVariant.stock} items remaining</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-4">
            
            {/* Quantity Stepper */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-brand-sand rounded-btn bg-white">
                  <button
                    onClick={handleDecrement}
                    className="p-3 hover:text-brand-terracotta transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold font-sans text-brand-charcoal">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="p-3 hover:text-brand-terracotta transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "flex-1 h-[48px] px-6 inline-flex items-center justify-center font-medium rounded-btn transition-colors text-sm",
                  isOutOfStock
                    ? "bg-brand-sand text-brand-muted cursor-not-allowed"
                    : "bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream shadow-subtle"
                )}
              >
                <ShoppingBag size={18} className="mr-2" />
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>
              
              <button
                className="h-[48px] w-[48px] inline-flex items-center justify-center border border-brand-sand hover:border-brand-charcoal text-brand-muted hover:text-brand-charcoal rounded-btn transition-all bg-white"
                aria-label="Add to wishlist"
              >
                <Heart size={18} />
              </button>
            </div>
          </div>

          {/* Accordion Tabs */}
          <div className="border-t border-brand-sand pt-6 space-y-4">
            <div className="flex gap-6 border-b border-brand-sand/50 pb-2 text-sm font-sans">
              {(['details', 'materials', 'care'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-2 font-medium capitalize border-b-2 transition-all relative -bottom-[10px]",
                    activeTab === tab
                      ? "border-brand-terracotta text-brand-charcoal font-semibold"
                      : "border-transparent text-brand-muted hover:text-brand-charcoal"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="font-sans text-sm text-brand-muted leading-relaxed min-h-[80px]">
              {activeTab === 'details' && (
                <p>{product.description}</p>
              )}
              {activeTab === 'materials' && (
                <p>
                  <strong>Materials:</strong> {product.materials || '100% natural, organic combed cotton yarn.'}
                  <br />
                  Our yarns are ethically sourced from farms committing to strict environmental and fair labor policies.
                </p>
              )}
              {activeTab === 'care' && (
                <p>
                  Hand wash gently in lukewarm water using mild detergent. Lay flat on clean towel to dry. Do not machine wash, tumble dry, or bleach. Steam gently if needed.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-brand-sand pt-20 space-y-8">
          <h2 className="font-serif text-2xl text-brand-charcoal">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relProduct) => {
              const relImg = relProduct.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';
              return (
                <Link
                  key={relProduct.id}
                  href={`/product/${relProduct.slug}`}
                  className="group flex flex-col space-y-4"
                >
                  <div className="relative aspect-[4/5] rounded-card overflow-hidden bg-white border border-brand-sand shadow-subtle transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md">
                    <Image
                      src={relImg}
                      alt={relProduct.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base text-brand-charcoal group-hover:text-brand-terracotta transition-colors line-clamp-1">
                      {relProduct.title}
                    </h3>
                    <p className="font-sans font-semibold text-brand-terracotta text-sm">
                      ${relProduct.basePrice.toFixed(2)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
