'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Plus, Trash2, ArrowLeft, Loader2, Sparkles, CheckCircle, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

interface ProductFormClientProps {
  product?: any; // Prisma product with variants and images if editing
  collections: any[]; // List of collections
}

// Preset crochet image URLs for quick mock adding
const MOCK_CROCHET_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1584992791193-5db3cb340f4e?auto=format&fit=crop&w=800&q=80', label: 'Crochet Sweater View' },
  { url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80', label: 'Sage green Tote Bag' },
  { url: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=800&q=80', label: 'Yellow Daisy Coasters' },
  { url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80', label: 'Woven Cotton Throw' },
  { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80', label: 'Off-white Cardigan Front' },
];

export default function ProductFormClient({ product, collections }: ProductFormClientProps) {
  const router = useRouter();
  const isEditMode = !!product;

  // Form states
  const [title, setTitle] = useState(product?.title || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [description, setDescription] = useState(product?.description || '');
  const [materials, setMaterials] = useState(product?.materials || '');
  const [dimensions, setDimensions] = useState(product?.dimensions || '');
  const [basePrice, setBasePrice] = useState(product?.basePrice?.toString() || '');
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice?.toString() || '');
  const [collectionId, setCollectionId] = useState(product?.collectionId || '');
  const [published, setPublished] = useState(product?.published ?? true);
  const [madeToOrder, setMadeToOrder] = useState(product?.madeToOrder ?? false);
  const [shipEstimateDays, setShipEstimateDays] = useState(product?.shipEstimateDays?.toString() || '3');

  // Arrays
  const [variants, setVariants] = useState<any[]>(
    product?.variants?.map((v: any) => ({
      color: v.color,
      size: v.size,
      stock: v.stock.toString(),
      priceOverride: v.priceOverride?.toString() || '',
    })) || [{ color: 'Terracotta', size: 'S/M', stock: '10', priceOverride: '' }]
  );

  const [images, setImages] = useState<any[]>(
    product?.images?.map((img: any) => ({
      url: img.url,
      altText: img.altText,
      position: img.position,
    })) || []
  );

  const [inputImageUrl, setInputImageUrl] = useState('');
  const [inputImageAlt, setInputImageAlt] = useState('');

  // Statuses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-slugify helper
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditMode) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  // Add variant row
  const addVariantRow = () => {
    setVariants([...variants, { color: '', size: '', stock: '0', priceOverride: '' }]);
  };

  // Remove variant row
  const removeVariantRow = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleVariantChange = (idx: number, field: string, value: string) => {
    const updated = variants.map((v, i) => {
      if (i === idx) {
        return { ...v, [field]: value };
      }
      return v;
    });
    setVariants(updated);
  };

  // Add custom Image URL
  const addCustomImage = (urlToAdd?: string) => {
    const url = urlToAdd || inputImageUrl;
    if (!url) return;

    setImages([
      ...images,
      {
        url,
        altText: inputImageAlt || title || 'Product Showcase',
        position: images.length,
      },
    ]);
    setInputImageUrl('');
    setInputImageAlt('');
  };

  // Add mock image
  const addMockImage = () => {
    const nextMock = MOCK_CROCHET_IMAGES[images.length % MOCK_CROCHET_IMAGES.length];
    setImages([
      ...images,
      {
        url: nextMock.url,
        altText: title || nextMock.label,
        position: images.length,
      },
    ]);
  };

  // Remove Image
  const removeImage = (idx: number) => {
    const filtered = images.filter((_, i) => i !== idx);
    // Recalculate positions
    const updated = filtered.map((img, i) => ({ ...img, position: i }));
    setImages(updated);
  };

  // Reorder Images
  const moveImage = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === images.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newImages = [...images];
    
    // Swap
    const temp = newImages[idx];
    newImages[idx] = newImages[targetIdx];
    newImages[targetIdx] = temp;

    // Reset positions
    const updated = newImages.map((img, i) => ({ ...img, position: i }));
    setImages(updated);
  };

  // Submit Handler
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (variants.length === 0 && !madeToOrder) {
      setErrorMsg('You must define at least one color/size variant if the product is not made-to-order.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        id: product?.id, // Sent only in edit mode
        title,
        slug,
        description,
        materials,
        dimensions,
        basePrice: parseFloat(basePrice),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        collectionId: collectionId || null,
        published,
        madeToOrder,
        shipEstimateDays: parseInt(shipEstimateDays) || 3,
        variants: variants.map(v => ({
          color: v.color,
          size: v.size,
          stock: parseInt(v.stock) || 0,
          priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
        })),
        images,
      };

      const response = await fetch('/api/admin/products', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save product.');
      }

      setSuccessMsg(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
      
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-24">
      {/* Messages */}
      <div className="lg:col-span-12 space-y-4">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-xs font-semibold text-brand-muted hover:text-brand-charcoal transition-colors font-sans"
        >
          <ArrowLeft size={14} /> Back to Products Catalog
        </Link>
        
        {successMsg && (
          <div className="p-4 bg-brand-success/10 border border-brand-success/20 rounded-card flex items-center gap-3 text-brand-success text-sm font-medium">
            <CheckCircle size={20} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-brand-error/10 border border-brand-error/20 rounded-card flex items-center gap-3 text-brand-error text-sm font-medium">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Left Column: Basic details form (8 cols) */}
      <div className="lg:col-span-8 space-y-8 bg-white border border-brand-sand rounded-card p-6 sm:p-8 shadow-subtle">
        
        {/* Title / Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Product Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
              placeholder="E.g. Sage Meadow Tote Bag"
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
            />
          </div>
          <div>
            <label htmlFor="slug" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Storefront URL Slug
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              required
              placeholder="sage-meadow-tote-bag"
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta font-mono"
            />
          </div>
        </div>

        {/* Pricing / Collection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="basePrice" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Base Price ($)
            </label>
            <input
              type="number"
              id="basePrice"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
              placeholder="45.00"
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
            />
          </div>
          <div>
            <label htmlFor="compareAtPrice" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Compare-at Price ($) (Optional Sale)
            </label>
            <input
              type="number"
              id="compareAtPrice"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="55.00"
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
            />
          </div>
          <div>
            <label htmlFor="collection" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Collection Category
            </label>
            <select
              id="collection"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta outline-none"
            >
              <option value="">Unassigned</option>
              {collections.map(col => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write an editorial story about this handcrafted piece..."
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="materials" className="text-xs font-semibold text-brand-charcoal block mb-1">
                Yarn Materials
              </label>
              <input
                type="text"
                id="materials"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="100% GOTS Organic cotton yarn"
                className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
              />
            </div>
            <div>
              <label htmlFor="dimensions" className="text-xs font-semibold text-brand-charcoal block mb-1">
                Dimensions / Sizing Guide
              </label>
              <input
                type="text"
                id="dimensions"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="12 in. wide x 14 in. high"
                className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Variants Grid (Sizes & Colors) */}
        <div className="space-y-4 border-t border-brand-sand pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-base text-brand-charcoal">Variants Options</h3>
              <p className="text-[11px] text-brand-muted font-sans mt-0.5">
                Each color and size variant has its own stock. Price overrides are optional.
              </p>
            </div>
            <button
              type="button"
              onClick={addVariantRow}
              className="h-[30px] px-3 inline-flex items-center justify-center border border-brand-sand hover:border-brand-muted text-brand-charcoal text-xs font-semibold rounded-btn transition-colors bg-white"
            >
              <Plus size={12} className="mr-1" /> Add Option
            </button>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {variants.map((variant, idx) => (
              <div key={idx} className="flex flex-wrap sm:flex-nowrap gap-3 items-end bg-brand-cream/20 p-3 rounded-lg border border-brand-sand/50">
                <div className="flex-1 min-w-[120px]">
                  <label className="text-[10px] text-brand-muted block mb-1 font-semibold">Color</label>
                  <input
                    type="text"
                    required
                    value={variant.color}
                    onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                    placeholder="Oatmeal"
                    className="w-full px-2.5 py-1.5 bg-white border border-brand-sand rounded-btn text-xs"
                  />
                </div>
                <div className="flex-1 min-w-[80px]">
                  <label className="text-[10px] text-brand-muted block mb-1 font-semibold">Size</label>
                  <input
                    type="text"
                    required
                    value={variant.size}
                    onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                    placeholder="S/M or OS"
                    className="w-full px-2.5 py-1.5 bg-white border border-brand-sand rounded-btn text-xs"
                  />
                </div>
                <div className="w-24">
                  <label className="text-[10px] text-brand-muted block mb-1 font-semibold">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(idx, 'stock', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-brand-sand rounded-btn text-xs"
                  />
                </div>
                <div className="w-28 font-semibold">
                  <label className="text-[10px] text-brand-muted block mb-1 font-semibold">Price Override ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={variant.priceOverride}
                    onChange={(e) => handleVariantChange(idx, 'priceOverride', e.target.value)}
                    placeholder="None"
                    className="w-full px-2.5 py-1.5 bg-white border border-brand-sand rounded-btn text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariantRow(idx)}
                  className="p-2 text-brand-muted hover:text-brand-error transition-colors"
                  aria-label="Remove variant"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Images, production options, status (4 cols) */}
      <div className="lg:col-span-4 space-y-8">
        
        {/* Visibility / Production */}
        <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-6">
          <h3 className="font-serif text-base text-brand-charcoal border-b border-brand-sand pb-2">
            Status & Settings
          </h3>

          <div className="space-y-4">
            {/* Published Switch */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-brand-terracotta border-brand-sand focus:ring-brand-terracotta outline-none"
              />
              <div className="font-sans text-xs">
                <span className="text-brand-charcoal font-semibold block">Visible in Storefront</span>
                <span className="text-brand-muted">Draft products are hidden from search catalog listings.</span>
              </div>
            </label>

            {/* Made to order switch */}
            <label className="flex items-center gap-3 cursor-pointer border-t border-brand-sand/50 pt-4">
              <input
                type="checkbox"
                checked={madeToOrder}
                onChange={(e) => setMadeToOrder(e.target.checked)}
                className="w-4 h-4 rounded text-brand-terracotta border-brand-sand focus:ring-brand-terracotta outline-none"
              />
              <div className="font-sans text-xs">
                <span className="text-brand-charcoal font-semibold block">Made to Order</span>
                <span className="text-brand-muted">Crafted individually upon receiving customer checkout.</span>
              </div>
            </label>

            {/* Ship estimates */}
            {madeToOrder && (
              <div className="pl-7 animate-in fade-in slide-in-from-top-1.5 duration-200">
                <label htmlFor="shipEstimateDays" className="text-[10px] font-semibold text-brand-charcoal block mb-1">
                  Est. Stitching Time (Days)
                </label>
                <input
                  type="number"
                  id="shipEstimateDays"
                  value={shipEstimateDays}
                  onChange={(e) => setShipEstimateDays(e.target.value)}
                  className="w-full max-w-[120px] px-2.5 py-1.5 bg-white border border-brand-sand rounded-btn text-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* Media / Images Manager */}
        <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-6">
          <div className="flex justify-between items-center border-b border-brand-sand pb-2">
            <h3 className="font-serif text-base text-brand-charcoal">Images Gallery</h3>
            <button
              type="button"
              onClick={addMockImage}
              className="text-[10px] text-brand-terracotta hover:underline font-semibold flex items-center gap-1 font-sans"
            >
              <Sparkles size={11} /> Add Mock Image
            </button>
          </div>

          {/* Image Inputs */}
          <div className="space-y-3 font-sans text-xs">
            <div>
              <label className="text-[10px] text-brand-muted block mb-1 font-semibold">Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/photo.jpg"
                value={inputImageUrl}
                onChange={(e) => setInputImageUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-brand-sand rounded-btn text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-brand-muted block mb-1 font-semibold">Alt Text (Optional)</label>
              <input
                type="text"
                placeholder="Sweater back close-up"
                value={inputImageAlt}
                onChange={(e) => setInputImageAlt(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-brand-sand rounded-btn text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => addCustomImage()}
              className="w-full py-1.5 border border-brand-sand hover:border-brand-muted text-brand-charcoal text-xs font-semibold rounded-btn transition-colors bg-white"
            >
              Add Image Url
            </button>
          </div>

          {/* Image list reorder strip */}
          {images.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-brand-sand rounded bg-brand-cream/30 text-brand-muted text-xs">
              No gallery images added yet. Click &quot;Add Mock Image&quot; to quickly add beautiful default photos.
            </div>
          ) : (
            <div className="space-y-2 font-sans text-xs">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 bg-brand-cream/30 border border-brand-sand rounded"
                >
                  <div className="relative w-8 aspect-[4/5] rounded border border-brand-sand bg-white overflow-hidden shrink-0">
                    <img src={img.url} alt={img.altText} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-brand-charcoal block truncate">{img.altText}</span>
                    <span className="text-[8px] text-brand-muted font-mono block truncate">{img.url}</span>
                  </div>
                  
                  {/* Reorder Buttons */}
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 hover:bg-brand-cream text-brand-muted hover:text-brand-charcoal disabled:opacity-30 rounded"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 hover:bg-brand-cream text-brand-muted hover:text-brand-charcoal disabled:opacity-30 rounded"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 hover:bg-brand-cream text-brand-muted hover:text-brand-error rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Save Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[46px] bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-semibold rounded-btn transition-colors shadow-subtle flex items-center justify-center gap-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving details...
            </>
          ) : (
            isEditMode ? 'Update Product' : 'Create Product'
          )}
        </button>

      </div>
    </form>
  );
}
