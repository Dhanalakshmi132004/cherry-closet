import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LayoutDashboard, ShoppingBag, FolderHeart, ShoppingCart, ArrowLeft, LogOut } from 'lucide-react';
import AdminLogoutButton from './AdminLogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  const user = session.user as any;
  if (user.role !== 'admin') {
    // Non-admins cannot access cms admin panel
    redirect('/');
  }

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Collections', href: '/admin/collections', icon: FolderHeart },
  ];

  return (
    <div className="flex min-h-screen bg-brand-cream/30 text-brand-charcoal">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-charcoal text-brand-cream flex flex-col justify-between shrink-0 hidden md:flex border-r border-brand-sand/15">
        <div>
          {/* Brand header */}
          <div className="h-20 flex items-center px-6 border-b border-brand-sand/10">
            <span className="font-serif text-lg tracking-widest uppercase">
              THE CLOSET CMS
            </span>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-brand-cream/10 transition-colors text-brand-cream/80 hover:text-brand-cream"
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom options */}
        <div className="p-4 border-t border-brand-sand/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-brand-cream/10 transition-colors text-brand-cream/80 hover:text-brand-cream"
          >
            <ArrowLeft size={18} />
            Back to Storefront
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-brand-sand px-6 sm:px-12 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <span className="font-serif text-sm tracking-wider uppercase text-brand-muted block md:hidden">
              THE CLOSET CMS
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="text-brand-muted">Admin:</span>
            <span className="font-semibold text-brand-charcoal">{session.user?.name || session.user?.email}</span>
          </div>
        </header>

        {/* Inner children view */}
        <main className="flex-grow p-6 sm:p-12 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
