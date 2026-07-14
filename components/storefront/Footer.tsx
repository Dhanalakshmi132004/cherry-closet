'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
    <footer className="bg-white border-t border-brand-sand">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Block */}
        <div className="md:col-span-2">
          <Link href="/" className="font-serif text-2xl tracking-wider text-brand-charcoal mb-4 inline-block">
            THE CLOSET
          </Link>
          <p className="text-brand-muted max-w-sm font-sans text-sm leading-relaxed mb-6">
            Handcrafted editorial crochet items made from premium, sustainably sourced natural fibers. Slowly made, built to last, and designed to bring warmth to your life.
          </p>
          <p className="text-xs text-brand-muted">
            &copy; {new Date().getFullYear()} The Closet. All rights reserved.
          </p>
        </div>

        {/* Shop Navigation */}
        <div>
          <h3 className="font-serif text-lg text-brand-charcoal mb-6">Shop</h3>
          <ul className="space-y-4 font-sans text-sm text-brand-muted">
            <li>
              <Link href="/shop" className="hover:text-brand-terracotta transition-colors">Shop All Products</Link>
            </li>
            <li>
              <Link href="/shop?collection=clothing" className="hover:text-brand-terracotta transition-colors">Clothing</Link>
            </li>
            <li>
              <Link href="/shop?collection=accessories" className="hover:text-brand-terracotta transition-colors">Accessories</Link>
            </li>
            <li>
              <Link href="/shop?collection=home-and-living" className="hover:text-brand-terracotta transition-colors">Home & Living</Link>
            </li>
            <li>
              <Link href="/shop?collection=amigurumi" className="hover:text-brand-terracotta transition-colors">Amigurumi</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="font-serif text-lg text-brand-charcoal mb-6">Join our Newsletter</h3>
          <p className="text-brand-muted font-sans text-sm leading-relaxed mb-4">
            Receive updates on monthly collections, limited-run sales, and artisan stories.
          </p>
          {submitted ? (
            <p className="text-brand-success font-sans text-sm font-medium">
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
                  className="flex-1 px-4 py-2 bg-brand-cream border border-brand-sand rounded-btn text-brand-charcoal text-sm placeholder-brand-muted focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream text-sm font-medium rounded-btn transition-colors shrink-0"
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
