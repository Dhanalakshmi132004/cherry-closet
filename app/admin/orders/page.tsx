import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminOrdersClient from './AdminOrdersClient';

interface AdminOrdersPageProps {
  searchParams: {
    status?: string;
  };
}

export const revalidate = 0; // Fresh order database on view

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = searchParams;

  const whereClause: any = {};
  if (status) {
    whereClause.status = status;
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      address: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-brand-charcoal">Orders Management</h1>
        <p className="text-brand-muted text-xs font-sans mt-1">
          Track payments, update shipping statuses, filter active customer deliveries, and inspect order summaries.
        </p>
      </div>

      <AdminOrdersClient initialOrders={orders} currentFilter={status} />
    </div>
  );
}
