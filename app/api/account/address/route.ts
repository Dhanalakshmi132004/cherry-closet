import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    const { line1, line2, city, state, postalCode, country } = await req.json();

    if (!line1 || !city || !state || !postalCode || !country) {
      return NextResponse.json(
        { error: 'Missing required address fields' },
        { status: 400 }
      );
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        line1,
        line2: line2 || '',
        city,
        state,
        postalCode,
        country,
      },
    });

    console.log(`[Address API] Created address ${newAddress.id} for user ${userId}`);

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    console.error('[Add Address API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    const { addressId } = await req.json();

    if (!addressId) {
      return NextResponse.json({ error: 'Missing addressId' }, { status: 400 });
    }

    // Verify address belongs to the active user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Address not found or unauthorized' },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    console.log(`[Address API] Deleted address ${addressId} for user ${userId}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Delete Address API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
