'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingBag, User, Menu, X, ChevronDown, LayoutDashboard, LogOut, ShoppingCart, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCart } from '@/lib/store/useCart';
import { cn } from '@/lib/utils';
import FlowerLogo from './FlowerLogo';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch — only render icon after mount
  useEffect(() => setMounted(true), []);

  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const cartCount = useCart((state) => state.getCartCount());

  const user = session?.user as any;
  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { name: 'Shop All', href: '/shop' },
    { name: 'Clothing', href: '/shop?collection=clothing' },
    { name: "Women's Clothing", href: '/#womens-clothing' },
    { name: 'Accessories', href: '/shop?collection=accessories' },
    { name: 'Home & Living', href: '/shop?collection=home-and-living' },
    { name: 'Amigurumi', href: '/shop?collection=amigurumi' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-brand-dark hover:text-brand-blue-600 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo - Unique Styled Brand Mark */}
        <Link href="/" className="flex items-center group">
          <FlowerLogo className="w-14 h-14 text-brand-blue-800 group-hover:text-brand-blue-600 transition-colors duration-300 mr-2 flex-shrink-0" />
          <span className="relative flex flex-col items-start select-none">
            {/* Main brand name with mixed weight + gradient */}
            <span className="font-serif leading-[0.9] tracking-tight">
              <span className="font-light text-[18px] tracking-[0.12em] text-brand-blue-800 mr-1 group-hover:text-brand-blue-600 transition-colors duration-300">
                the
              </span>
              <span className="font-black text-[28px] bg-gradient-to-br from-brand-blue-800 via-brand-blue-500 to-brand-blue-300 bg-clip-text text-transparent group-hover:from-brand-blue-600 group-hover:via-brand-blue-400 group-hover:to-brand-blue-200 transition-all duration-500">
                SHA
              </span>
              <span className="font-light text-[18px] tracking-[0.12em] text-brand-blue-800 ml-1 group-hover:text-brand-blue-600 transition-colors duration-300 lowercase">
                closet
              </span>
            </span>
            {/* Animated shimmer underline */}
            <span className="block h-[2px] w-full mt-[2px] rounded-full bg-gradient-to-r from-brand-blue-600 via-brand-blue-200 to-transparent group-hover:from-brand-blue-400 group-hover:via-brand-blue-600 transition-all duration-500" />
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
        <div className="flex items-center gap-3 relative">

          {/* Theme Toggle */}
          {mounted && (
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={cn(
                "relative p-2 rounded-full transition-all duration-300",
                "text-gray-600 dark:text-gray-300",
                "hover:bg-brand-blue-50 dark:hover:bg-brand-blue-950",
                "hover:text-brand-blue-600 dark:hover:text-brand-blue-400",
                "border border-transparent hover:border-brand-blue-200 dark:hover:border-brand-blue-800"
              )}
            >
              <span className="relative block w-5 h-5">
                <Sun
                  size={20}
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                  )}
                />
                <Moon
                  size={20}
                  className={cn(
                    "absolute inset-0 transition-all duration-300",
                    isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                  )}
                />
              </span>
            </button>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors relative flex items-center"
            aria-label="Cart"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans font-semibold animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User / Profile Section */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1 p-2 text-gray-700 dark:text-gray-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors focus:outline-none"
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
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-900 shadow-premium border border-gray-200 dark:border-gray-700 py-2 z-40 transform origin-top-right transition-all">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-brand-muted dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-brand-dark dark:text-gray-100 truncate">{session.user?.name || session.user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-brand-dark dark:text-gray-200 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-950 hover:text-brand-blue-600 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/account"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-brand-dark dark:text-gray-200 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-950 hover:text-brand-blue-600 transition-colors"
                    >
                      <User size={16} />
                      My Account
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-brand-dark dark:text-gray-200 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-950 hover:text-brand-blue-600 transition-colors"
                    >
                      <ShoppingCart size={16} />
                      Order History
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-brand-error hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-t border-gray-200 dark:border-gray-700 mt-1"
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
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors"
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-950 z-50 p-6 flex flex-col justify-between shadow-premium lg:hidden">
            <div>
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center group">
                  <FlowerLogo className="w-11 h-11 text-brand-blue-800 group-hover:text-brand-blue-600 transition-colors duration-300 mr-1.5 flex-shrink-0" />
                  <span className="relative flex flex-col items-start select-none">
                    <span className="font-serif leading-[0.9] tracking-tight">
                      <span className="font-light text-[14px] tracking-[0.12em] text-brand-blue-800 mr-1">
                        The
                      </span>
                      <span className="font-black text-[22px] bg-gradient-to-br from-brand-blue-800 via-brand-blue-500 to-brand-blue-300 bg-clip-text text-transparent">
                        SHA
                      </span>
                      <span className="font-light text-[14px] tracking-[0.12em] text-brand-blue-800 ml-1 lowercase">
                        closet
                      </span>
                    </span>
                    <span className="block h-[2px] w-full mt-[2px] rounded-full bg-gradient-to-r from-brand-blue-600 via-brand-blue-200 to-transparent" />
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

              {/* Mobile theme toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="mt-8 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-950 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-all"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-auto">
              {session ? (
                <div className="flex flex-col gap-4">
                  <div className="mb-2">
                    <p className="text-xs text-brand-muted dark:text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-brand-dark dark:text-gray-100 truncate">{session.user?.name || session.user?.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm text-brand-dark dark:text-gray-200 hover:text-brand-blue-600"
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-brand-dark dark:text-gray-200 hover:text-brand-blue-600"
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
                  className="flex items-center justify-center gap-2 w-full py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-medium rounded-btn transition-colors"
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
