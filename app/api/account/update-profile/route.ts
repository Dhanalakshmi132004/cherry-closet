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
    const { name } = await req.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    });

    console.log(`[Account API] User ${updatedUser.email} updated name to: ${updatedUser.name}`);

    return NextResponse.json({ success: true, name: updatedUser.name });
  } catch (error: any) {
    console.error('[Update Profile API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
