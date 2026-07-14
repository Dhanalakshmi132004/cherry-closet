'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Calendar, User, Mail, DollarSign, Clock, Hammer, Truck, CheckCircle2, ChevronRight, Loader2, ArrowUpDown } from 'lucide-react';

interface AdminOrdersClientProps {
  initialOrders: any[];
  currentFilter?: string;
}

export default function AdminOrdersClient({ initialOrders, currentFilter }: AdminOrdersClientProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filterTabs = [
    { name: 'All Orders', value: '' },
    { name: 'Pending', value: 'pending' },
    { name: 'In Production', value: 'in_production' },
    { name: 'Shipped', value: 'shipped' },
    { name: 'Delivered', value: 'delivered' },
  ];

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

  const handleFilterChange = (val: string) => {
    if (val === '') {
      router.push('/admin/orders');
    } else {
      router.push(`/admin/orders?status=${val}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none font-sans text-xs">
        {filterTabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleFilterChange(tab.value)}
            className={cn(
              "px-4 py-2.5 rounded-pill border transition-all font-semibold shrink-0",
              (currentFilter || '') === tab.value
                ? "bg-brand-charcoal border-brand-charcoal text-brand-cream"
                : "bg-white border-brand-sand hover:border-brand-muted text-brand-muted"
            )}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Orders List Table */}
      {initialOrders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-brand-sand rounded-card text-brand-muted text-xs">
          No orders found matching the filter criteria.
        </div>
      ) : (
        <div className="bg-white border border-brand-sand rounded-card overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-brand-cream border-b border-brand-sand text-brand-muted uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items Summary</th>
                  <th className="px-6 py-4">Total Paid</th>
                  <th className="px-6 py-4">Order Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/50">
                {initialOrders.map((order) => {
                  const isUpdating = updatingId === order.id;
                  const hasMadeToOrder = order.items.some((i: any) => i.product?.madeToOrder);

                  return (
                    <tr key={order.id} className="hover:bg-brand-cream/10 transition-colors align-top">
                      
                      {/* ID and Date */}
                      <td className="px-6 py-4 space-y-1">
                        <span className="font-mono text-brand-charcoal font-semibold block">
                          {order.id.slice(0, 8)}...
                        </span>
                        <span className="text-[10px] text-brand-muted flex items-center gap-1">
                          <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="px-6 py-4 space-y-1">
                        <span className="font-medium text-brand-charcoal block">
                          {order.customerName}
                        </span>
                        <span className="text-[10px] text-brand-muted block font-mono">
                          {order.customerEmail}
                        </span>
                      </td>

                      {/* Items Curation */}
                      <td className="px-6 py-4 space-y-2 max-w-xs">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="text-brand-muted text-[11px] leading-relaxed">
                            <strong className="text-brand-charcoal font-medium">
                              {item.product?.title || 'Unknown Product'}
                            </strong>
                            <span className="mx-1">&times;</span>
                            <span>{item.quantity}</span>
                            <span className="text-[10px] block mt-0.5 text-brand-muted/80">
                              Variant: {item.variant?.color || 'OS'} / {item.variant?.size || 'OS'}
                              {item.product?.madeToOrder && (
                                <span className="ml-1 bg-brand-cream text-brand-terracotta text-[9px] px-1 rounded border border-brand-sand font-semibold">
                                  Made to order
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 font-semibold text-brand-charcoal">
                        ${order.total.toFixed(2)}
                      </td>

                      {/* Status Dropdown selector */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin text-brand-muted" />
                          ) : null}
                          <select
                            disabled={isUpdating}
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className={cn(
                              "border rounded py-1 px-2.5 text-[11px] font-semibold uppercase tracking-wider cursor-pointer outline-none",
                              order.status === 'pending' && "border-amber-200 bg-amber-50 text-amber-700",
                              order.status === 'in_production' && "border-amber-200 bg-amber-100 text-amber-800",
                              order.status === 'shipped' && "border-blue-200 bg-blue-100 text-blue-800",
                              order.status === 'delivered' && "border-brand-success/20 bg-brand-success/10 text-brand-success"
                            )}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_production">In Production</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </td>

                      {/* Details View */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/order-confirmation/${order.id}`}
                          className="h-[28px] px-3.5 inline-flex items-center justify-center border border-brand-sand hover:border-brand-muted text-brand-charcoal text-[11px] font-semibold rounded transition-colors bg-white"
                        >
                          View Page
                        </Link>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
