'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Block */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-4 group">
            <Image src="/logo.png" alt="Sha closet logo" width={40} height={40} className="object-contain" />
            <span className="font-serif text-2xl tracking-wider text-brand-dark group-hover:text-brand-blue-600 transition-colors">
              Sha closet
            </span>
          </Link>
          <p className="text-brand-muted max-w-sm font-sans text-sm leading-relaxed mb-6">
            Handcrafted editorial crochet items made from premium, sustainably sourced natural fibers. Slowly made, built to last, and designed to bring warmth to your life.
          </p>
          <p className="text-xs text-brand-muted">
            &copy; {new Date().getFullYear()} Sha closet. All rights reserved.
          </p>
        </div>

        {/* Shop Navigation */}
        <div>
          <h3 className="font-serif text-lg text-brand-dark mb-6">Shop</h3>
          <ul className="space-y-4 font-sans text-sm text-brand-muted">
            <li>
              <Link href="/shop" className="hover:text-brand-blue-600 transition-colors">Shop All Products</Link>
            </li>
            <li>
              <Link href="/shop?collection=clothing" className="hover:text-brand-blue-600 transition-colors">Clothing</Link>
            </li>
            <li>
              <Link href="/shop?collection=accessories" className="hover:text-brand-blue-600 transition-colors">Accessories</Link>
            </li>
            <li>
              <Link href="/shop?collection=home-and-living" className="hover:text-brand-blue-600 transition-colors">Home & Living</Link>
            </li>
            <li>
              <Link href="/shop?collection=amigurumi" className="hover:text-brand-blue-600 transition-colors">Amigurumi</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="font-serif text-lg text-brand-dark mb-6">Join our Newsletter</h3>
          <p className="text-brand-muted font-sans text-sm leading-relaxed mb-4">
            Receive updates on monthly collections, limited-run sales, and artisan stories.
          </p>
          {submitted ? (
            <p className="text-brand-blue-600 font-sans text-sm font-medium">
              Thank you for subscribing! Keep an eye on your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  id="newsletter-email"
                  placeholder="Your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 bg-brand-white border border-gray-200 rounded-btn text-brand-dark text-sm placeholder-brand-muted focus:ring-1 focus:ring-brand-blue-600 focus:border-brand-blue-600"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-brand-white text-sm font-medium rounded-btn transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </footer>
  );
}
