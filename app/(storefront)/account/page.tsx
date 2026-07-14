import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AccountClient from './AccountClient';

export const revalidate = 0; // Dynamic rendering for user settings updates

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/account');
  }

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <AccountClient user={user} />
    </div>
  );
}
