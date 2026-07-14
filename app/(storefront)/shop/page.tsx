import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';

interface ShopPageProps {
  searchParams: {
    collection?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    q?: string;
  };
}

export const revalidate = 0; // Dynamic rendering for filters

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { collection, color, minPrice, maxPrice, sort, q } = searchParams;

  // Fetch collections for filter sidebar
  const collections = await prisma.collection.findMany();

  // Dynamically query unique colors from database
  const allVariants = await prisma.variant.findMany({
    select: { color: true },
    distinct: ['color'],
  });
  const colors = allVariants.map(v => v.color).filter(Boolean) as string[];

  // Build prisma filter clause
  const whereClause: any = {
    published: true,
  };

  if (collection) {
    whereClause.collection = {
      slug: collection,
    };
  }

  if (color) {
    whereClause.variants = {
      some: {
        color: {
          equals: color,
          mode: 'insensitive',
        },
      },
    };
  }

  if (minPrice || maxPrice) {
    whereClause.basePrice = {};
    if (minPrice) {
      whereClause.basePrice.gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      whereClause.basePrice.lte = parseFloat(maxPrice);
    }
  }

  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { materials: { contains: q, mode: 'insensitive' } },
    ];
  }

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') {
    orderBy = { basePrice: 'asc' };
  } else if (sort === 'price-desc') {
    orderBy = { basePrice: 'desc' };
  } else if (sort === 'newest') {
    orderBy = { createdAt: 'desc' };
  }

  // Fetch products matching filters
  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy,
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
      variants: true,
    },
  });

  // Helper to build URL with merged query params
  const buildQueryUrl = (updates: Record<string, string | null>) => {
    const current = { ...searchParams };
    Object.keys(updates).forEach(key => {
      const val = updates[key];
      if (val === null) {
        delete current[key as keyof typeof current];
      } else {
        current[key as keyof typeof current] = val;
      }
    });

    const params = new URLSearchParams();
    Object.keys(current).forEach(key => {
      const val = current[key as keyof typeof current];
      if (val !== undefined) params.append(key, val);
    });

    const str = params.toString();
    return `/shop${str ? `?${str}` : ''}`;
  };

  const activeFiltersCount = [collection, color, minPrice, maxPrice, q].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-12">
      
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-sand pb-8">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl text-brand-charcoal">The Catalog</h1>
          <p className="text-brand-muted text-sm max-w-md">
            Filter by fiber, collection, or colors. Hand-knotted and dispatched on order.
          </p>
        </div>

        {/* Search Input Bar */}
        <form method="GET" action="/shop" className="relative max-w-sm w-full">
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal placeholder-brand-muted focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta focus:outline-none"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          {q && (
            <Link
              href={buildQueryUrl({ q: null })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal"
            >
              <X size={14} />
            </Link>
          )}
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Sidebar Filters */}
        <aside className="space-y-8 lg:sticky lg:top-28">
          
          {/* Active Filters Clear */}
          {activeFiltersCount > 0 && (
            <div className="p-4 bg-white border border-brand-sand rounded-card flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-charcoal">
                {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''} Active
              </span>
              <Link
                href="/shop"
                className="text-xs font-medium text-brand-terracotta hover:underline flex items-center gap-1"
              >
                Clear All <X size={12} />
              </Link>
            </div>
          )}

          {/* Collections Filter */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-brand-charcoal border-b border-brand-sand pb-2">Collections</h3>
            <div className="flex flex-col gap-2 font-sans text-sm">
              <Link
                href={buildQueryUrl({ collection: null })}
                className={cn(
                  "hover:text-brand-terracotta transition-colors py-1",
                  !collection ? "text-brand-terracotta font-semibold" : "text-brand-muted"
                )}
              >
                All Collections
              </Link>
              {collections.map(col => (
                <Link
                  key={col.id}
                  href={buildQueryUrl({ collection: col.slug })}
                  className={cn(
                    "hover:text-brand-terracotta transition-colors py-1",
                    collection === col.slug ? "text-brand-terracotta font-semibold" : "text-brand-muted"
                  )}
                >
                  {col.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Colors Filter */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-brand-charcoal border-b border-brand-sand pb-2">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map(colName => {
                const isSelected = color === colName;
                return (
                  <Link
                    key={colName}
                    href={buildQueryUrl({ color: isSelected ? null : colName })}
                    className={cn(
                      "px-3 py-1.5 rounded-pill text-xs font-medium border transition-all",
                      isSelected
                        ? "bg-brand-terracotta text-brand-cream border-brand-terracotta"
                        : "bg-white text-brand-muted border-brand-sand hover:border-brand-muted"
                    )}
                  >
                    {colName}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-brand-charcoal border-b border-brand-sand pb-2">Price Range</h3>
            <div className="grid grid-cols-2 gap-2">
              <form method="GET" action="/shop" className="contents">
                {/* Carry other parameters as hidden inputs */}
                {collection && <input type="hidden" name="collection" value={collection} />}
                {color && <input type="hidden" name="color" value={color} />}
                {sort && <input type="hidden" name="sort" value={sort} />}
                {q && <input type="hidden" name="q" value={q} />}
                
                <div>
                  <label htmlFor="minPrice" className="text-xs text-brand-muted block mb-1">Min Price</label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    placeholder="$0"
                    defaultValue={minPrice || ''}
                    className="w-full px-3 py-1.5 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                  />
                </div>
                <div>
                  <label htmlFor="maxPrice" className="text-xs text-brand-muted block mb-1">Max Price</label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    placeholder="$200"
                    defaultValue={maxPrice || ''}
                    className="w-full px-3 py-1.5 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-2 w-full py-2 bg-white hover:bg-brand-cream border border-brand-sand hover:border-brand-muted text-brand-charcoal text-xs font-semibold rounded-btn transition-colors"
                >
                  Apply Price
                </button>
              </form>
            </div>
          </div>

        </aside>

        {/* Main Grid Area */}
        <main className="lg:col-span-3 space-y-8">
          
          {/* Sorting & Stats Info */}
          <div className="flex items-center justify-between font-sans text-sm">
            <span className="text-brand-muted">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-brand-muted text-xs hidden sm:inline flex-shrink-0">Sort By:</span>
              <div className="relative">
                <select
                  onChange={(e) => {
                    window.location.href = buildQueryUrl({ sort: e.target.value === 'default' ? null : e.target.value });
                  }}
                  value={sort || 'default'}
                  className="bg-white border border-brand-sand text-brand-charcoal rounded-btn py-1 px-3 text-xs focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta outline-none cursor-pointer"
                >
                  <option value="default">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-brand-sand rounded-card space-y-4">
              <p className="font-serif text-xl text-brand-charcoal">No products match your criteria</p>
              <p className="text-brand-muted text-sm max-w-sm mx-auto">
                Try loosening your filters, removing search keywords, or selecting a different collection category.
              </p>
              <Link
                href="/shop"
                className="inline-flex h-[40px] px-6 items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-medium rounded-btn text-xs transition-colors"
              >
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => {
                const hasSale = product.compareAtPrice !== null && product.compareAtPrice > product.basePrice;
                const primaryImg = product.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';
                
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group flex flex-col space-y-4"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] rounded-card overflow-hidden bg-white border border-brand-sand shadow-subtle transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md">
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

                    {/* Description Details */}
                    <div className="space-y-1">
                      <h3 className="font-serif text-base text-brand-charcoal group-hover:text-brand-terracotta transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="font-sans font-semibold text-brand-terracotta text-sm sm:text-base">
                          ${product.basePrice.toFixed(2)}
                        </span>
                        {hasSale && (
                          <span className="font-sans text-brand-muted text-xs sm:text-sm line-through">
                            ${product.compareAtPrice?.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
