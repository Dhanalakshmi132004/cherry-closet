import React from 'react';
import { prisma } from '@/lib/prisma';
import ProductFormClient from '../../ProductFormClient';

export const revalidate = 0; // Fresh list of collections

export default async function AdminNewProductPage() {
  const collections = await prisma.collection.findMany();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-brand-charcoal">Add New Product</h1>
        <p className="text-brand-muted text-xs font-sans mt-1">
          Create a fresh catalog entry with collections, rich tags, dimensions, variants, and drag-and-drop media.
        </p>
      </div>

      <ProductFormClient collections={collections} />
    </div>
  );
}
