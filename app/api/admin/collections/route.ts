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

    const user = session.user as any;
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, slug, description } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.collection.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A collection with this slug already exists' },
        { status: 400 }
      );
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description: description || '',
      },
    });

    console.log(`[Admin Collection API] Created collection: ${collection.slug}`);

    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    console.error('[Admin Collection Create Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
