import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      email,
      name,
      items,
      shippingAddress,
      discountPercent = 0,
    } = body;

    if (!email || !name || !items || items.length === 0 || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required checkout information' },
        { status: 400 }
      );
    }

    // 1. Validate stock for non-made-to-order items
    for (const item of items) {
      const dbVariant = await prisma.variant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!dbVariant) {
        return NextResponse.json(
          { error: `Variant for ${item.productTitle} not found` },
          { status: 400 }
        );
      }

      if (!dbVariant.product.madeToOrder) {
        if (dbVariant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${item.productTitle}. Only ${dbVariant.stock} available.` },
            { status: 400 }
          );
        }
      }
    }

    // 2. Perform database transaction to create address, order, and deduct stock
    const result = await prisma.$transaction(async (tx) => {
      // Create shipping address
      const createdAddress = await tx.address.create({
        data: {
          userId: session?.user ? (session.user as any).id : null,
          line1: shippingAddress.line1,
          line2: shippingAddress.line2 || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
      });

      // Calculate totals
      let subtotal = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const dbVariant = await tx.variant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        const activePrice = dbVariant?.priceOverride
          ? dbVariant.priceOverride
          : dbVariant?.product.basePrice || item.price;

        subtotal += activePrice * item.quantity;

        // Add to array
        orderItemsToCreate.push({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: activePrice,
        });

        // Deduct stock if NOT made to order
        if (dbVariant && !dbVariant.product.madeToOrder) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      const discountAmount = subtotal * (discountPercent / 100);
      const shippingCost = subtotal > 100 ? 0 : 8.0;
      const total = subtotal - discountAmount + shippingCost;

      // Create Order
      const createdOrder = await tx.order.create({
        data: {
          userId: session?.user ? (session.user as any).id : null,
          status: 'pending',
          subtotal,
          shippingCost,
          total,
          addressId: createdAddress.id,
          customerEmail: email,
          customerName: name,
          items: {
            create: orderItemsToCreate,
          },
        },
      });

      return createdOrder;
    });

    console.log(`[Checkout API] Successfully created order ${result.id}`);

    // If Stripe keys are configured and we are not in mock mode,
    // we would generate a Stripe Checkout session here.
    // For local running, we succeed immediately.
    return NextResponse.json({
      success: true,
      orderId: result.id,
    });
  } catch (error: any) {
    console.error('[Checkout API Error]:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your checkout: ' + error.message },
      { status: 500 }
    );
  }
}
