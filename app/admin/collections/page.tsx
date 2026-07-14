import React from 'react';
import { prisma } from '@/lib/prisma';
import CollectionsClient from './CollectionsClient';

export const revalidate = 0; // Fresh database on view

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      products: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-brand-charcoal">Collections Manager</h1>
        <p className="text-brand-muted text-xs font-sans mt-1">
          Organize products into editorial categories (e.g. Clothing, Accessories, Amigurumi) for catalog filtering.
        </p>
      </div>

      <CollectionsClient initialCollections={collections} />
    </div>
  );
}
