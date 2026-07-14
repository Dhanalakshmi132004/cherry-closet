import React from 'react';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export const revalidate = 0; // Fresh metrics on load

export default async function AdminDashboardPage() {
  // Aggregate sales
  const salesAgg = await prisma.order.aggregate({
    _sum: { total: true },
  });
  const totalSales = salesAgg._sum.total || 0;

  // Order counts
  const totalOrders = await prisma.order.count();

  // Products counts
  const totalProducts = await prisma.product.count();

  // Active production orders
  const productionQueue = await prisma.order.findMany({
    where: {
      status: {
        in: ['pending', 'in_production'],
      },
    },
    orderBy: { createdAt: 'asc' },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  // Recent 5 orders
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <DashboardClient
      stats={{
        totalSales,
        totalOrders,
        totalProducts,
        queueCount: productionQueue.length,
      }}
      productionQueue={productionQueue}
      recentOrders={recentOrders}
    />
  );
}
