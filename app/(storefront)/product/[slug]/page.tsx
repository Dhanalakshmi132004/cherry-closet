import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailsClient from './ProductDetailsClient';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0; // Dynamic fetching of product stock

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  // Fetch product
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { position: 'asc' },
      },
      variants: true,
      collection: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same collection, excluding self)
  const relatedProducts = await prisma.product.findMany({
    where: {
      published: true,
      collectionId: product.collectionId,
      NOT: { id: product.id },
    },
    take: 4,
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
