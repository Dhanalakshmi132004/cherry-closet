import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductFormClient from '../../ProductFormClient';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0; // Fresh item details for edit form

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      images: {
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const collections = await prisma.collection.findMany();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-brand-charcoal">Edit Product</h1>
        <p className="text-brand-muted text-xs font-sans mt-1">
          Modify title, base prices, collection labels, physical dimensions, custom fiber materials, variants, and gallery showcase.
        </p>
      </div>

      <ProductFormClient product={product} collections={collections} />
    </div>
  );
}
