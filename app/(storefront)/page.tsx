import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ChevronRight, ArrowRight, ShieldCheck, Sparkles, Sprout } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch collections
  const collections = await prisma.collection.findMany();

  // Fetch featured products (latest 4 published products)
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
      variants: true,
    },
  });

  return (
    <div className="space-y-24 pb-24">
      {/* 1. Hero Section */}
      <section className="relative bg-[#F3ECE3] overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1584992791193-5db3cb340f4e?auto=format&fit=crop&w=1600&q=80"
            alt="Handmade crochet yarns and tools"
            fill
            priority
            className="object-cover object-center opacity-25 filter grayscale"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 max-w-xl">
            <span className="font-sans text-sm font-semibold tracking-widest text-brand-terracotta uppercase">
              Artisan Knitwear & Decor
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-brand-charcoal leading-tight">
              Warmed by hand, built to last.
            </h1>
            <p className="font-sans text-brand-muted text-base sm:text-lg leading-relaxed">
              We slow down the craft of crochet. Every item is hand-stitched by independent artisans using 100% natural fibers and eco-conscious dyes. Explore cozy staples and heirloom home goods.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/shop"
                className="h-[44px] min-w-[140px] px-6 inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-medium rounded-btn transition-colors shadow-subtle text-sm"
              >
                Shop the Collection
              </Link>
              <Link
                href="/shop?collection=clothing"
                className="h-[44px] min-w-[140px] px-6 inline-flex items-center justify-center border border-brand-sand hover:border-brand-charcoal text-brand-charcoal font-medium rounded-btn transition-all text-sm bg-white/50 backdrop-blur-sm"
              >
                Explore Apparel
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block relative h-[500px] w-full">
            <div className="absolute inset-0 border border-brand-sand rounded-card overflow-hidden shadow-lg transform rotate-2 translate-x-4 translate-y-4">
              <Image
                src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
                alt="Cozy Terracotta Crochet Sweater Model View"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 border border-brand-sand rounded-card overflow-hidden shadow-lg bg-white transform -rotate-1">
              <Image
                src="https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
                alt="Sage Meadow Crochet Tote Bag"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Collection Category Quick Links */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-brand-charcoal">Browse Collections</h2>
            <p className="text-brand-muted text-sm max-w-md">Organized curation of our hand-crafted offerings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => {
            const imagesMap: Record<string, string> = {
              'clothing': 'https://images.unsplash.com/photo-1584992791193-5db3cb340f4e?auto=format&fit=crop&w=600&q=80',
              'accessories': 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80',
              'home-and-living': 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=600&q=80',
              'amigurumi': 'https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=600&q=80',
            };
            const bgUrl = imagesMap[col.slug] || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';
            
            return (
              <Link
                key={col.id}
                href={`/shop?collection=${col.slug}`}
                className="group relative h-72 rounded-card overflow-hidden shadow-subtle block"
              >
                <Image
                  src={bgUrl}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-brand-cream font-serif text-xl flex items-center gap-1 group-hover:text-brand-cream/80 transition-colors">
                    {col.name} <ChevronRight size={18} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. New Arrivals / Featured Products */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        <div className="flex justify-between items-end border-b border-brand-sand pb-4">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl text-brand-charcoal">Newest Additions</h2>
            <p className="text-brand-muted text-sm">Fresh off the hook. Limited stock, heirloom items.</p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-brand-terracotta hover:text-brand-terracottaHover font-sans text-sm font-semibold transition-colors"
          >
            Shop All Arrivals <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const hasSale = product.compareAtPrice !== null && product.compareAtPrice > product.basePrice;
            const primaryImg = product.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';
            
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group flex flex-col space-y-4"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-card overflow-hidden bg-brand-cream border border-brand-sand shadow-subtle transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md">
                  <Image
                    src={primaryImg}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  {hasSale && (
                    <span className="absolute top-3 left-3 bg-brand-terracotta text-brand-cream text-xs font-semibold px-3 py-1 rounded-pill uppercase tracking-wider">
                      Sale
                    </span>
                  )}
                  {product.madeToOrder && (
                    <span className="absolute bottom-3 left-3 bg-brand-charcoal/90 text-brand-cream text-xs font-medium px-3 py-1 rounded-pill backdrop-blur-sm">
                      Made to Order
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-brand-charcoal group-hover:text-brand-terracotta transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans font-semibold text-brand-terracotta text-base">
                      ${product.basePrice.toFixed(2)}
                    </span>
                    {hasSale && (
                      <span className="font-sans text-brand-muted text-sm line-through">
                        ${product.compareAtPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Brand Story Strip */}
      <section className="bg-white border-y border-brand-sand py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-terracotta">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif text-xl text-brand-charcoal">100% Handcrafted</h3>
            <p className="text-brand-muted text-sm max-w-xs leading-relaxed font-sans">
              No industrial machines can replicate crochet stitches. Each item is custom, unique, and loops through the fingers of a single artisan.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 border-y lg:border-y-0 lg:border-x border-brand-sand py-8 lg:py-0">
            <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-terracotta">
              <Sprout size={24} />
            </div>
            <h3 className="font-serif text-xl text-brand-charcoal">Sustainable Fibers</h3>
            <p className="text-brand-muted text-sm max-w-xs leading-relaxed font-sans">
              We exclusively use GOTS-certified organic cotton, renewable alpaca, merino wool, and eco-friendly dyes that are safe for you and the planet.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-terracotta">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-serif text-xl text-brand-charcoal">Fair Trade & Living Wage</h3>
            <p className="text-brand-muted text-sm max-w-xs leading-relaxed font-sans">
              We partner with local and global women cooperatives, ensuring every creator is paid a living wage above market rates for their artisan work.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
