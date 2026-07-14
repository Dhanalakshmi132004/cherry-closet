/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = session.user as any;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing orderId or status in request body' },
        { status: 400 }
      );
    }

    const allowedStatuses = ['pending', 'in_production', 'shipped', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    console.log(`[Admin Order API] Updated order ${orderId} to: ${status}`);

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('[Admin Order PATCH Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
