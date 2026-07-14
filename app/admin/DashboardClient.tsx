'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, ShoppingBag, ShoppingCart, Hammer, Calendar, Clock, CheckCircle2, ChevronRight, Play, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardClientProps {
  stats: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    queueCount: number;
  };
  productionQueue: any[];
  recentOrders: any[];
}

export default function DashboardClient({ stats, productionQueue, recentOrders }: DashboardClientProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (orderId: string, nextStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl text-brand-charcoal">Dashboard</h1>
        <p className="text-brand-muted text-xs font-sans mt-1">
          Overview of shop sales, products volumes, and active crochet stitching pipeline.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Sales */}
        <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-terracotta flex items-center justify-center shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[11px] font-sans text-brand-muted font-semibold uppercase tracking-wider block">Total Sales</span>
            <span className="font-sans text-xl font-bold text-brand-charcoal">${stats.totalSales.toFixed(2)}</span>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-terracotta flex items-center justify-center shrink-0">
            <ShoppingCart size={20} />
          </div>
          <div>
            <span className="text-[11px] font-sans text-brand-muted font-semibold uppercase tracking-wider block">Total Orders</span>
            <span className="font-sans text-xl font-bold text-brand-charcoal">{stats.totalOrders}</span>
          </div>
        </div>

        {/* Stitching Queue */}
        <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-terracotta flex items-center justify-center shrink-0">
            <Hammer size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-sans text-brand-muted font-semibold uppercase tracking-wider block">Stitching Queue</span>
            <span className="font-sans text-xl font-bold text-brand-terracotta">{stats.queueCount}</span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-terracotta flex items-center justify-center shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div>
            <span className="text-[11px] font-sans text-brand-muted font-semibold uppercase tracking-wider block">Total Catalog</span>
            <span className="font-sans text-xl font-bold text-brand-charcoal">{stats.totalProducts}</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid Panel: Stitching Production Queue (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center border-b border-brand-sand pb-4">
            <h2 className="font-serif text-lg text-brand-charcoal flex items-center gap-2">
              <Hammer size={18} /> Active Stitching Queue
            </h2>
            <span className="bg-brand-cream border border-brand-sand text-brand-muted font-sans font-semibold px-2 py-0.5 rounded text-[10px]">
              {productionQueue.length} Order{productionQueue.length !== 1 ? 's' : ''} Need Attention
            </span>
          </div>

          {productionQueue.length === 0 ? (
            <div className="text-center py-12 bg-white border border-brand-sand rounded-card text-brand-muted text-xs">
              Stitching queue is empty. All current orders have been completed and shipped!
            </div>
          ) : (
            <div className="space-y-4">
              {productionQueue.map((order) => {
                const isPending = order.status === 'pending';
                const isUpdating = updatingId === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-brand-sand rounded-card p-6 shadow-subtle space-y-4"
                  >
                    {/* Queue Card Header */}
                    <div className="flex justify-between items-center border-b border-brand-sand/50 pb-3">
                      <div>
                        <h3 className="font-sans text-sm font-semibold text-brand-charcoal">
                          {order.customerName}
                        </h3>
                        <p className="text-[10px] text-brand-muted mt-0.5 flex items-center gap-1">
                          <Calendar size={10} /> Placed {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Current status tag */}
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider",
                            isPending ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-brand-terracotta/5 text-brand-terracotta border border-brand-terracotta/20"
                          )}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-2">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-xs font-sans">
                          <div className="text-brand-muted">
                            <span className="text-brand-charcoal font-medium">
                              {item.product?.title}
                            </span>{' '}
                            ({item.variant?.color || 'OS'} / {item.variant?.size || 'OS'})
                            {item.product?.madeToOrder && (
                              <span className="ml-2 bg-brand-cream text-brand-terracotta text-[9px] font-semibold px-1 py-0.2 rounded border border-brand-sand">
                                Craft
                              </span>
                            )}
                          </div>
                          <span className="text-brand-charcoal font-medium">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Transition Button Control */}
                    <div className="flex justify-end pt-2 border-t border-brand-sand/50">
                      {isPending ? (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(order.id, 'in_production')}
                          className="h-[32px] px-4 inline-flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-btn transition-colors gap-1.5"
                        >
                          <Play size={12} fill="currentColor" /> Start Production
                        </button>
                      ) : (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(order.id, 'shipped')}
                          className="h-[32px] px-4 inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream text-xs font-semibold rounded-btn transition-colors gap-1.5"
                        >
                          <ArrowRight size={12} /> Ship & Dispatch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Grid Panel: Recent Orders (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <h2 className="font-serif text-lg text-brand-charcoal border-b border-brand-sand pb-4 flex items-center gap-2">
            <ShoppingCart size={18} /> Recent Orders
          </h2>

          <div className="bg-white border border-brand-sand rounded-card shadow-subtle divide-y divide-brand-sand/50">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 space-y-2">
                <div className="flex justify-between items-baseline font-sans text-xs">
                  <span className="font-semibold text-brand-charcoal truncate pr-2">
                    {order.customerName}
                  </span>
                  <span className="font-semibold text-brand-terracotta shrink-0">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-brand-muted font-sans">
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className="capitalize font-semibold">{order.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
