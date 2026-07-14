'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Plus, FolderHeart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const collectionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

interface CollectionsClientProps {
  initialCollections: any[];
}

export default function CollectionsClient({ initialCollections }: CollectionsClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    const slugVal = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setValue('slug', slugVal);
  };

  const onSubmit = async (values: CollectionFormValues) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create collection.');
      }

      setSuccess('Collection created successfully!');
      reset();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left side: Collections Table */}
      <div className="lg:col-span-8 bg-white border border-brand-sand rounded-card overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-brand-cream border-b border-brand-sand text-brand-muted uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Collection Info</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Product Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-sand/50 text-brand-charcoal">
              {initialCollections.map((col) => (
                <tr key={col.id} className="hover:bg-brand-cream/20 transition-colors">
                  <td className="px-6 py-4 font-semibold flex items-center gap-2">
                    <FolderHeart size={14} className="text-brand-terracotta shrink-0" />
                    <span>{col.name}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-brand-muted">{col.slug}</td>
                  <td className="px-6 py-4 text-brand-muted max-w-xs truncate">
                    {col.description || 'No description provided'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium pr-8">
                    {col.products?.length || 0} items
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right side: Add Form */}
      <div className="lg:col-span-4 bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-6">
        <h2 className="font-serif text-lg text-brand-charcoal border-b border-brand-sand pb-2 flex items-center gap-2">
          <Plus size={16} /> Create Collection
        </h2>

        {success && (
          <div className="p-3.5 bg-brand-success/10 border border-brand-success/20 rounded-card flex items-center gap-2 text-brand-success text-xs font-medium">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-brand-error/10 border border-brand-error/20 rounded-card flex items-center gap-2 text-brand-error text-xs font-medium">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans text-xs">
          <div>
            <label htmlFor="col-name" className="text-[10px] font-semibold text-brand-charcoal block mb-1">
              Collection Name
            </label>
            <input
              type="text"
              id="col-name"
              {...register('name')}
              onChange={handleNameChange}
              placeholder="E.g. Amigurumi"
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-xs text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta"
            />
            {errors.name && (
              <p className="text-[10px] text-brand-error mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="col-slug" className="text-[10px] font-semibold text-brand-charcoal block mb-1">
              URL Slug
            </label>
            <input
              type="text"
              id="col-slug"
              {...register('slug')}
              placeholder="amigurumi"
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-xs text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta font-mono"
            />
            {errors.slug && (
              <p className="text-[10px] text-brand-error mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="col-desc" className="text-[10px] font-semibold text-brand-charcoal block mb-1">
              Description
            </label>
            <textarea
              id="col-desc"
              rows={3}
              {...register('description')}
              placeholder="Handmade yarn animals and plushies..."
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-xs text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[38px] bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-semibold rounded-btn transition-colors flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : null}
            Create Collection
          </button>
        </form>
      </div>

    </div>
  );
}
