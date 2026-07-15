'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingBag, User, Menu, X, ChevronDown, LayoutDashboard, LogOut, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/store/useCart';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const cartCount = useCart((state) => state.getCartCount());

  const user = session?.user as any;
  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { name: 'Shop All', href: '/shop' },
    { name: 'Clothing', href: '/shop?collection=clothing' },
    { name: 'Accessories', href: '/shop?collection=accessories' },
    { name: 'Home & Living', href: '/shop?collection=home-and-living' },
    { name: 'Amigurumi', href: '/shop?collection=amigurumi' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-brand-dark hover:text-brand-blue-600 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="Sha closet logo" width={40} height={40} className="object-contain" />
          <span className="font-serif text-2xl tracking-wider text-brand-dark group-hover:text-brand-blue-600 transition-colors">
            Sha closet
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "font-sans text-sm font-medium transition-colors relative py-1 text-brand-muted hover:text-brand-dark",
                  pathname === link.href ? "text-brand-blue-600" : ""
                )}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 relative">
          
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="p-2 text-brand-dark hover:text-brand-blue-600 transition-colors relative flex items-center"
            aria-label="Cart"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-blue-600 text-brand-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans font-semibold animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User / Profile Section */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1 p-2 text-brand-dark hover:text-brand-blue-600 transition-colors focus:outline-none"
              >
                <User size={22} />
                <ChevronDown size={14} />
              </button>
              
              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-premium border border-gray-200 py-2 z-40 transform origin-top-right transition-all">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-xs text-brand-muted">Signed in as</p>
                      <p className="text-sm font-semibold text-brand-dark truncate">{session.user?.name || session.user?.email}</p>
                    </div>
                    
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-brand-dark hover:bg-brand-blue-50 hover:text-brand-blue-600 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/account"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-brand-dark hover:bg-brand-blue-50 hover:text-brand-blue-600 transition-colors"
                    >
                      <User size={16} />
                      My Account
                    </Link>
                    
                    <Link
                      href="/account/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-brand-dark hover:bg-brand-blue-50 hover:text-brand-blue-600 transition-colors"
                    >
                      <ShoppingCart size={16} />
                      Order History
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-brand-error hover:bg-red-50 transition-colors border-t border-gray-200 mt-1"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="p-2 text-brand-dark hover:text-brand-blue-600 transition-colors"
              aria-label="Login"
            >
              <User size={22} />
            </Link>
          )}

        </div>
      </div>

      {/* Mobile Navigation Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-brand-white z-50 p-6 flex flex-col justify-between shadow-premium lg:hidden">
            <div>
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-3">
                  <Image src="/logo.png" alt="Sha closet logo" width={32} height={32} className="object-contain" />
                  <span className="font-serif text-xl tracking-wider text-brand-dark">
                    Sha closet
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-brand-dark hover:text-brand-blue-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-sans text-lg font-medium text-brand-dark hover:text-brand-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-auto">
              {session ? (
                <div className="flex flex-col gap-4">
                  <div className="mb-2">
                    <p className="text-xs text-brand-muted">Signed in as</p>
                    <p className="text-sm font-semibold text-brand-dark truncate">{session.user?.name || session.user?.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm text-brand-dark hover:text-brand-blue-600"
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-brand-dark hover:text-brand-blue-600"
                  >
                    <User size={18} />
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center gap-2 text-sm text-brand-error mt-2"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-brand-white font-medium rounded-btn transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
