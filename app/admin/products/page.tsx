import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, Edit3, Eye, FileText, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export const revalidate = 0; // Fresh products database on view

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      collection: true,
      variants: true,
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-sand pb-6">
        <div>
          <h1 className="font-serif text-3xl text-brand-charcoal">Products Catalog</h1>
          <p className="text-brand-muted text-xs font-sans mt-1">
            Manage your store details, materials, pricing overrides, variants, and published visibility.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="h-[38px] px-4 inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream text-xs font-semibold rounded-btn transition-colors shrink-0"
        >
          <Plus size={14} className="mr-1" /> New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-brand-sand rounded-card space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-muted flex items-center justify-center mx-auto">
            <ShoppingBag size={20} />
          </div>
          <h3 className="font-serif text-lg text-brand-charcoal">No products in catalog</h3>
          <p className="text-brand-muted text-xs max-w-xs mx-auto leading-relaxed">
            Get started by adding your first handmade crochet product listing, pricing, and variant options.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex h-[40px] px-6 items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream text-xs font-semibold rounded-btn transition-colors"
          >
            Create Product
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-brand-sand rounded-card overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-brand-cream border-b border-brand-sand text-brand-muted uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Collection</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock status</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/50">
                {products.map((product) => {
                  const coverImg = product.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=120&q=80';
                  
                  // Compute total stock across all variants
                  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

                  return (
                    <tr key={product.id} className="hover:bg-brand-cream/20 transition-colors">
                      
                      {/* Image & Title */}
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="relative w-10 aspect-[4/5] rounded border border-brand-sand bg-brand-cream overflow-hidden shrink-0">
                          <img
                            src={coverImg}
                            alt={product.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <span className="font-serif text-sm font-semibold text-brand-charcoal block line-clamp-1">
                            {product.title}
                          </span>
                          <span className="text-[10px] text-brand-muted font-mono block mt-0.5">
                            {product.slug}
                          </span>
                        </div>
                      </td>

                      {/* Collection */}
                      <td className="px-6 py-4 text-brand-charcoal font-medium">
                        {product.collection?.name || 'Unassigned'}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-semibold text-brand-charcoal">
                        ${product.basePrice.toFixed(2)}
                      </td>

                      {/* Stock / Production */}
                      <td className="px-6 py-4">
                        {product.madeToOrder ? (
                          <span className="bg-brand-cream text-brand-terracotta border border-brand-sand/50 px-2 py-0.5 rounded font-medium text-[10px]">
                            Made to Order
                          </span>
                        ) : (
                          <span className={cn(
                            "font-medium",
                            totalStock === 0 ? "text-brand-error" : "text-brand-success"
                          )}>
                            {totalStock} in stock ({product.variants.length} variant{product.variants.length !== 1 ? 's' : ''})
                          </span>
                        )}
                      </td>

                      {/* Published Status */}
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-pill font-semibold text-[9px] uppercase tracking-wider",
                          product.published
                            ? "bg-brand-success/15 text-brand-success"
                            : "bg-brand-sand/30 text-brand-muted"
                        )}>
                          {product.published ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                          {product.published ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      {/* Action trigger */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-2 hover:bg-brand-cream text-brand-muted hover:text-brand-charcoal rounded transition-colors"
                            title="Preview Storefront"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2 hover:bg-brand-cream text-brand-muted hover:text-brand-terracotta rounded transition-colors"
                            title="Edit details"
                          >
                            <Edit3 size={14} />
                          </Link>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
