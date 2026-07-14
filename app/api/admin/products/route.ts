/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper to check admin authorization
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: 'Unauthorized', status: 401 };
  }
  const user = session.user as any;
  if (user.role !== 'admin') {
    return { error: 'Forbidden', status: 403 };
  }
  return { authorized: true };
}

// 1. CREATE Product (POST)
export async function POST(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const {
      title,
      slug,
      description,
      materials,
      dimensions,
      basePrice,
      compareAtPrice,
      published,
      madeToOrder,
      shipEstimateDays,
      collectionId,
      variants = [],
      images = [],
    } = body;

    if (!title || !slug || basePrice === undefined) {
      return NextResponse.json(
        { error: 'Title, slug, and base price are required' },
        { status: 400 }
      );
    }

    // Verify slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create product
      const newProduct = await tx.product.create({
        data: {
          title,
          slug,
          description: description || '',
          materials: materials || '',
          dimensions: dimensions || '',
          basePrice: parseFloat(basePrice),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          published: !!published,
          madeToOrder: !!madeToOrder,
          shipEstimateDays: parseInt(shipEstimateDays) || 3,
          collectionId,
        },
      });

      // Create variants
      if (variants.length > 0) {
        await tx.variant.createMany({
          data: variants.map((v: any) => ({
            productId: newProduct.id,
            color: v.color || '',
            size: v.size || '',
            stock: parseInt(v.stock) || 0,
            priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
          })),
        });
      }

      // Create images
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: newProduct.id,
            url: img.url,
            altText: img.altText || title,
            position: img.position !== undefined ? parseInt(img.position) : idx,
          })),
        });
      }

      return newProduct;
    });

    console.log(`[Admin Product API] Created product: ${result.slug}`);
    return NextResponse.json({ success: true, product: result });
  } catch (error: any) {
    console.error('[Admin Product Create Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. UPDATE Product (PUT)
export async function PUT(req: Request) {
  const auth = await checkAdminAuth();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      description,
      materials,
      dimensions,
      basePrice,
      compareAtPrice,
      published,
      madeToOrder,
      shipEstimateDays,
      collectionId,
      variants = [],
      images = [],
    } = body;

    if (!id || !title || !slug || basePrice === undefined) {
      return NextResponse.json(
        { error: 'Product ID, title, slug, and base price are required' },
        { status: 400 }
      );
    }

    // Verify slug uniqueness (excluding current product)
    const existing = await prisma.product.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Another product with this slug already exists' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update product fields
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          title,
          slug,
          description: description || '',
          materials: materials || '',
          dimensions: dimensions || '',
          basePrice: parseFloat(basePrice),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          published: !!published,
          madeToOrder: !!madeToOrder,
          shipEstimateDays: parseInt(shipEstimateDays) || 3,
          collectionId,
        },
      });

      // Clear existing variants and recreate
      await tx.variant.deleteMany({
        where: { productId: id },
      });

      if (variants.length > 0) {
        await tx.variant.createMany({
          data: variants.map((v: any) => ({
            productId: id,
            color: v.color || '',
            size: v.size || '',
            stock: parseInt(v.stock) || 0,
            priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null,
          })),
        });
      }

      // Clear existing images and recreate
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: any, idx: number) => ({
            productId: id,
            url: img.url,
            altText: img.altText || title,
            position: img.position !== undefined ? parseInt(img.position) : idx,
          })),
        });
      }

      return updatedProduct;
    });

    console.log(`[Admin Product API] Updated product: ${result.slug}`);
    return NextResponse.json({ success: true, product: result });
  } catch (error: any) {
    console.error('[Admin Product Update Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
