import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import {
  ArrowUpRight,
  ChevronRight,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Award,
  Truck,
  Leaf,
  Palette,
  Star,
  Scissors,
  Package,
  RefreshCw,
  Sparkles,
  BookOpen,
  Download,
  Sun,
  Droplet
} from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
    },
  });

  return (
    <div className="bg-brand-white min-h-screen text-brand-dark overflow-hidden font-sans">

      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-20 w-full">
        {/* Background Gradient & Huge Text */}
        <div className="relative overflow-hidden bg-gradient-to-b from-brand-blue-100 via-brand-blue-50 to-brand-white w-full min-h-[700px] flex flex-col items-center justify-center border-b border-brand-blue-100" style={{ borderBottomLeftRadius: '50% 10%', borderBottomRightRadius: '50% 10%' }}>
          {/* New Ambient Hero Elements */}
          <div className="absolute top-20 left-[15%] w-[40vw] h-[40vw] bg-brand-blue-200/40 rounded-[40%_60%_70%_30%] blur-[80px] animate-[spin_20s_linear_infinite] pointer-events-none z-0" />
          <div className="absolute bottom-10 right-[10%] w-[35vw] h-[35vw] bg-purple-200/30 rounded-[60%_40%_30%_70%] blur-[80px] animate-[spin_25s_linear_infinite_reverse] pointer-events-none z-0" />
          <div className="absolute top-[30%] left-[25%] text-brand-blue-400/50 animate-float pointer-events-none z-10" style={{ animationDelay: '0.4s' }}>
             <Star size={32} strokeWidth={1.5} />
          </div>
          <div className="absolute bottom-[40%] right-[25%] text-brand-blue-300/60 animate-float-delayed pointer-events-none z-10" style={{ animationDelay: '1.2s' }}>
             <Sparkles size={48} strokeWidth={1} />
          </div>

          {/* Huge Faded Background Text */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
            <h1 className="text-[12vw] font-serif font-black text-brand-white/80 tracking-tighter leading-none mix-blend-overlay blur-[2px]">
              the SHA Closet
            </h1>
          </div>

          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
            <h1 className="text-[12vw] font-serif font-black text-brand-white/50 tracking-tighter leading-none mix-blend-overlay">
              the SHA Closet
            </h1>
          </div>

          {/* Centerpiece Image (The "Phone" equivalent) */}
          <div className="relative z-20 animate-float-delayed mt-20 sm:mt-10">
            <div className="w-[300px] h-[550px] sm:w-[350px] sm:h-[650px] rounded-[48px] border-8 border-brand-white shadow-premium bg-brand-white overflow-hidden relative transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700">
              <Image
                src="/banner.png"
                alt="the SHA Closet premium crochet"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-900/40 to-transparent" />

              {/* Internal Floating UI Element mimicking mobile notification */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] bg-brand-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue-600 flex items-center justify-center text-brand-white flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-dark">Premium Quality</h4>
                  <p className="text-[10px] text-brand-muted">100% Organic Yarn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Glass Pill 1 — Left: Orders */}
          <div className="absolute z-30 top-[38%] left-[3%] sm:left-[10%] lg:left-[16%] animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="bg-brand-white/85 backdrop-blur-xl border border-brand-white shadow-2xl rounded-2xl p-4 flex items-center gap-3 max-w-[210px] hover:-translate-y-1 transition-transform duration-300">
              <div className="w-11 h-11 rounded-xl bg-brand-blue-100 flex items-center justify-center text-brand-blue-600 flex-shrink-0">
                <Award size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark leading-tight">1,400+ Orders<br />Delivered</h4>
                <p className="text-[10px] text-brand-muted mt-0.5">Will Yours Be Next?</p>
              </div>
            </div>
          </div>

          {/* Floating Glass Pill 2 — Left Bottom: Rating */}
          <div className="absolute z-30 top-[62%] left-[2%] sm:left-[8%] lg:left-[14%] animate-fade-in-left" style={{ animationDelay: '0.5s' }}>
            <div className="bg-brand-white/85 backdrop-blur-xl border border-brand-white shadow-xl rounded-2xl p-3 flex items-center gap-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500 flex-shrink-0">
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} fill="#EAB308" className="text-yellow-400" />)}
                </div>
                <p className="text-[11px] font-bold text-brand-dark mt-0.5">5.0 · 2,300 Reviews</p>
              </div>
            </div>
          </div>

          {/* Floating Glass Pill 3 — Left Mid: Eco */}
          <div className="hidden lg:flex absolute z-30 top-[22%] left-[5%] lg:left-[10%] animate-fade-in-left" style={{ animationDelay: '0.7s' }}>
            <div className="bg-brand-white/85 backdrop-blur-xl border border-brand-white shadow-xl rounded-full px-4 py-2.5 items-center gap-2 hover:-translate-y-1 transition-transform duration-300 flex">
              <Leaf size={16} className="text-green-500" />
              <span className="text-xs font-bold text-brand-dark">100% Organic</span>
            </div>
          </div>

          {/* Floating Glass Pill 4 — Right: Artisan */}
          <div className="absolute z-30 top-[22%] right-[3%] sm:right-[10%] lg:right-[16%] animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="bg-brand-white/85 backdrop-blur-xl border border-brand-white shadow-2xl rounded-full px-4 py-3 flex items-center gap-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-9 h-9 rounded-full border-2 border-brand-blue-100 overflow-hidden relative flex-shrink-0">
                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Designer" fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-dark">@sha_artisan</h4>
                <p className="text-[10px] text-brand-muted">Master Crochet Designer</p>
              </div>
            </div>
          </div>

          {/* Floating Glass Pill 5 — Right Mid: Fast delivery */}
          <div className="absolute z-30 top-[45%] right-[2%] sm:right-[8%] lg:right-[13%] animate-fade-in-right" style={{ animationDelay: '0.6s' }}>
            <div className="bg-brand-white/85 backdrop-blur-xl border border-brand-white shadow-xl rounded-2xl p-3 flex items-center gap-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-xl bg-brand-blue-50 flex items-center justify-center text-brand-blue-600 flex-shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-brand-dark">Express Shipping</p>
                <p className="text-[10px] text-brand-muted">Worldwide delivery</p>
              </div>
            </div>
          </div>

          {/* Floating Glass Pill 6 — Right Bottom: Custom order */}
          <div className="hidden lg:flex absolute z-30 top-[65%] right-[4%] lg:right-[12%] animate-fade-in-right" style={{ animationDelay: '0.8s' }}>
            <div className="bg-brand-white/85 backdrop-blur-xl border border-brand-white shadow-xl rounded-full px-4 py-2.5 items-center gap-2 hover:-translate-y-1 transition-transform duration-300 flex">
              <Palette size={16} className="text-brand-blue-600" />
              <span className="text-xs font-bold text-brand-dark">Custom Colorways</span>
            </div>
          </div>

          {/* Floating Icon Orb — Top Left glow */}
          <div className="hidden lg:block absolute z-10 top-[12%] left-[22%] animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 rounded-2xl bg-brand-blue-600/20 backdrop-blur-sm border border-brand-blue-200/50 flex items-center justify-center shadow-lg">
              <Scissors size={20} className="text-brand-blue-600" />
            </div>
          </div>

          {/* Floating Icon Orb — Top Right glow */}
          <div className="hidden lg:block absolute z-10 top-[15%] right-[22%] animate-float" style={{ animationDelay: '1.4s' }}>
            <div className="w-12 h-12 rounded-2xl bg-brand-blue-400/20 backdrop-blur-sm border border-brand-blue-200/50 flex items-center justify-center shadow-lg">
              <Heart size={20} className="text-brand-blue-500" />
            </div>
          </div>

          {/* Floating Icon Orb — Bottom Left */}
          <div className="hidden lg:block absolute z-10 bottom-[28%] left-[24%] animate-float" style={{ animationDelay: '0.6s' }}>
            <div className="w-10 h-10 rounded-xl bg-brand-white/60 backdrop-blur-sm border border-brand-white shadow-md flex items-center justify-center">
              <Sparkles size={18} className="text-brand-blue-400" />
            </div>
          </div>

          {/* Floating Icon Orb — Bottom Right */}
          <div className="hidden lg:block absolute z-10 bottom-[30%] right-[24%] animate-float" style={{ animationDelay: '1.2s' }}>
            <div className="w-10 h-10 rounded-xl bg-brand-white/60 backdrop-blur-sm border border-brand-white shadow-md flex items-center justify-center">
              <Package size={18} className="text-brand-blue-400" />
            </div>
          </div>

          {/* Pre-subscribe CTA Pill — Bottom Center */}
          <div className="absolute z-30 bottom-10 left-1/2 -translate-x-1/2 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <Link href="/shop" className="bg-brand-white/90 backdrop-blur-xl border border-brand-white shadow-2xl rounded-full px-7 py-3.5 flex items-center gap-3 hover:bg-brand-white hover:shadow-brand-blue-100 transition-all duration-300 group">
              <div className="w-6 h-6 rounded-full bg-brand-blue-600 flex items-center justify-center">
                <Sparkles size={12} className="text-brand-white" />
              </div>
              <span className="text-sm font-bold text-brand-dark tracking-wide">Explore Collection</span>
              <ArrowUpRight size={16} className="text-brand-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Faded Floating Text Badges */}
          <div className="absolute z-10 bottom-[22%] right-[8%] rotate-12 opacity-40 bg-brand-white/40 backdrop-blur-sm px-5 py-1.5 rounded-full border border-brand-white/40 animate-float" style={{ animationDelay: '0.9s' }}>
            <span className="text-xs font-bold text-brand-dark uppercase tracking-widest">PREMIUM YARN</span>
          </div>
          <div className="absolute z-10 bottom-[38%] left-[6%] -rotate-6 opacity-40 bg-brand-white/40 backdrop-blur-sm px-5 py-1.5 rounded-full border border-brand-white/40 animate-float" style={{ animationDelay: '1.5s' }}>
            <span className="text-xs font-bold text-brand-dark uppercase tracking-widest">HANDCRAFTED</span>
          </div>
        </div>
      </section>

      {/* 2. MARQUEE STRIP */}
      <section className="py-4 border-b border-brand-blue-50 overflow-hidden bg-brand-white relative -mt-10 z-20">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-8 px-4 w-full">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-xs font-bold text-brand-muted uppercase tracking-widest border border-brand-blue-100 rounded-full px-4 py-1.5 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-brand-blue-500" /> 100% Organic Cotton
              </span>
              <span className="text-xs font-bold text-brand-muted uppercase tracking-widest border border-brand-blue-100 rounded-full px-4 py-1.5 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-brand-blue-500" /> Tailored Fit
              </span>
              <span className="text-xs font-bold text-brand-muted uppercase tracking-widest border border-brand-blue-100 rounded-full px-4 py-1.5 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-brand-blue-500" /> Master Artisans
              </span>
              <span className="text-xs font-bold text-brand-muted uppercase tracking-widest border border-brand-blue-100 rounded-full px-4 py-1.5 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-brand-blue-500" /> Sustainable
              </span>
              <span className="text-xs font-bold text-brand-muted uppercase tracking-widest border border-brand-blue-100 rounded-full px-4 py-1.5 flex items-center gap-2">
                <CheckCircle2 size={12} className="text-brand-blue-500" /> Custom Colorways
              </span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 3. BENTO GRID SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        {/* Floating background shapes */}
        <div className="absolute top-[20%] left-[-5%] w-64 h-64 bg-brand-blue-200/30 rounded-full blur-[60px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 bg-purple-200/20 rounded-full blur-[80px] pointer-events-none animate-float-delayed" />
        
        <div className="mb-12 flex justify-between items-center relative z-10">
          <span className="bg-brand-blue-50 border border-brand-blue-100 text-brand-blue-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
            UI / UX INNOVATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px] relative z-10">

          {/* Large Left Card - Step by Step */}
          <div className="md:col-span-8 md:row-span-2 rounded-[32px] overflow-hidden relative group">
            {/* Inner card floating elements */}
            <div className="absolute top-10 right-10 text-brand-white/40 animate-float pointer-events-none z-20">
              <Scissors size={48} strokeWidth={1} className="rotate-45" />
            </div>
            <div className="absolute inset-0 bg-brand-blue-50/50" />
            <Image
              src="https://images.unsplash.com/photo-1609388492577-c6e7d7e3e1e0?auto=format&fit=crop&w=1200&q=80"
              alt="Crochet Yarn and Hooks"
              fill
              className="object-cover opacity-70 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-white/90 via-brand-white/40 to-transparent p-10 flex flex-col justify-center w-2/3">
              <div className="flex items-center gap-3 mb-4">
                <Scissors size={24} className="text-brand-blue-600" />
                <span className="text-brand-blue-600 text-xs font-bold uppercase tracking-widest">Craft Guide</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl font-black text-brand-dark leading-[1.1] uppercase">
                HOW CROCHET<br />
                WORKS: A STEP-<br />
                BY-STEP GUIDE
              </h2>
            </div>

            {/* Overlapping Subscribe Glass Card */}
            <div className="absolute bottom-8 right-8 bg-brand-white/70 backdrop-blur-xl border border-brand-white shadow-2xl rounded-[24px] p-6 w-[280px] z-10 hover:-translate-y-2 transition-transform duration-300">
              <span className="text-brand-blue-400 font-serif font-bold text-xl opacity-50 mb-2 block">01</span>
              <h3 className="font-bold text-brand-dark mb-2 text-lg">SUBSCRIBE</h3>
              <p className="text-[11px] text-brand-muted leading-relaxed mb-4">
                Select the level of custom detailing that best suits your style. Flexible timelines ensure you only pay for the premium craftsmanship you need.
              </p>
              <Link href="/shop" className="w-8 h-8 rounded-full bg-brand-blue-600 text-brand-white flex items-center justify-center hover:bg-brand-blue-700 transition-colors float-right shadow-md">
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Vertical Card */}
          <div className="md:col-span-4 md:row-span-2 rounded-[32px] bg-gradient-to-br from-brand-blue-400 to-brand-blue-800 relative overflow-hidden group border border-brand-blue-300 p-8 flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-white/10 rounded-full blur-2xl animate-pulse pointer-events-none z-10" />
            <div className="absolute bottom-1/3 left-10 text-brand-white/30 animate-float-delayed pointer-events-none z-20" style={{ animationDelay: '0.6s' }}>
               <Heart size={40} strokeWidth={1.5} className="-rotate-12" />
            </div>
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80"
              alt="Colorful Yarn Balls"
              fill
              className="object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 flex flex-col gap-6 h-full justify-center">
              <div className="flex items-center gap-3">
                <Palette size={28} className="text-brand-white/80" />
                <p className="text-brand-white font-bold tracking-[0.2em] text-sm">PREMIUM YARNS</p>
              </div>
              <div className="w-full h-[1px] bg-brand-white/20" />
              <div className="flex items-center gap-3">
                <Heart size={28} className="text-brand-blue-200" />
                <p className="text-brand-blue-200 font-bold tracking-[0.15em] text-sm">MADE WITH LOVE</p>
              </div>
              <div className="w-full h-[1px] bg-brand-white/20" />
              <div className="flex items-center gap-3">
                <Sparkles size={28} className="text-brand-white/80" />
                <p className="text-brand-white font-bold tracking-[0.2em] text-sm">FOR YOUR HOME</p>
              </div>
            </div>
          </div>

          {/* Bottom Card - Get Updates */}
          <div className="md:col-span-12 md:row-span-1 rounded-[32px] bg-brand-dark relative overflow-hidden flex flex-col md:flex-row items-center border border-brand-blue-900 group">
            <div className="p-10 flex-1 z-10">
              <span className="text-brand-blue-400 font-serif font-bold text-xl opacity-50 mb-2 block">03</span>
              <h3 className="font-serif text-3xl font-bold text-brand-white uppercase">GET UPDATES</h3>
            </div>

            {/* Center Phone Graphic Mockup */}
            <div className="flex-1 h-full flex items-center justify-center relative z-10 mt-10 md:mt-0">
              <div className="w-[180px] h-[300px] border-4 border-gray-800 rounded-[32px] overflow-hidden translate-y-[50px] group-hover:translate-y-[30px] transition-transform duration-500 shadow-2xl relative bg-brand-blue-950">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-brand-white/50 text-xs">9:41</div>
                <div className="absolute top-16 left-4 right-4 bg-brand-white/10 backdrop-blur-md rounded-xl p-3 flex gap-3 border border-brand-white/20">
                  <div className="w-8 h-8 rounded-full bg-brand-blue-600 flex items-center justify-center text-brand-white">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-white">Order Shipped!</p>
                    <p className="text-[8px] text-brand-blue-200 mt-1">ETA: 3 Days.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 flex-1 z-10 text-right">
              <p className="text-brand-blue-200 text-xs leading-relaxed max-w-xs ml-auto">
                Receive instant SMS Alerts with the artisan's estimated finishing time and a confirmation once your custom piece has been shipped.
              </p>
              <div className="mt-6 flex justify-end">
                <span className="bg-brand-white/10 text-brand-white border border-brand-white/20 px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase inline-block">
                  SAFE GUARD
                </span>
              </div>
            </div>

            {/* Background decorative blob */}
            <div className="absolute bottom-[-50%] right-[20%] w-[300px] h-[300px] bg-brand-blue-600/30 blur-[80px] rounded-full pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 3.4. WHY SHA CLOSET — FEATURES ICON SECTION */}
      <section className="py-20 bg-gradient-to-b from-brand-blue-50/50 to-brand-white relative overflow-hidden">
        {/* Floating geometric icons */}
        <div className="absolute top-[20%] left-[8%] text-brand-blue-300/40 animate-float pointer-events-none" style={{ animationDelay: '0.3s' }}>
          <ShieldCheck size={64} strokeWidth={1} className="-rotate-12" />
        </div>
        <div className="absolute top-[60%] right-[5%] text-brand-blue-200/50 animate-float-delayed pointer-events-none" style={{ animationDelay: '1.4s' }}>
          <Star size={48} strokeWidth={1.5} className="rotate-45" />
        </div>
        <div className="absolute bottom-[10%] left-[40%] text-brand-blue-400/30 animate-pulse pointer-events-none blur-[1px]">
          <Package size={56} strokeWidth={1} className="rotate-12" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-blue-600 font-bold text-xs uppercase tracking-widest bg-brand-white border border-brand-blue-100 px-4 py-1.5 rounded-full shadow-sm">Our Promise</span>
            <h2 className="font-serif text-4xl font-black text-brand-dark mt-4">Why the SHA Closet?</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: <Leaf size={28} />, title: 'Organic', desc: '100% natural fibers, eco-sourced' },
              { icon: <Scissors size={28} />, title: 'Handcrafted', desc: 'Each stitch placed with intention' },
              { icon: <Palette size={28} />, title: 'Custom Colors', desc: 'Your palette, your vision' },
              { icon: <Truck size={28} />, title: 'Fast Delivery', desc: 'Careful packing, swift dispatch' },
              { icon: <RefreshCw size={28} />, title: 'Easy Returns', desc: 'Hassle-free return policy' },
              { icon: <Star size={28} />, title: '5-Star Rated', desc: '10k+ happy customers' },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center text-center p-6 rounded-[24px] bg-brand-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-blue-200 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-blue-50 group-hover:bg-brand-blue-600 text-brand-blue-600 group-hover:text-brand-white flex items-center justify-center mb-4 transition-all duration-300 shadow-sm">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-brand-dark text-sm mb-1">{feat.title}</h3>
                <p className="text-[11px] text-brand-muted leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Crochet lifestyle image strip */}
          <div className="mt-16 grid grid-cols-3 gap-4 rounded-[32px] overflow-hidden">
            <div className="relative h-48 overflow-hidden rounded-[24px] group">
              <Image src="https://images.unsplash.com/photo-1585914924626-15adac1e6402?auto=format&fit=crop&w=600&q=80" alt="Crochet in progress" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-brand-blue-900/20 group-hover:bg-brand-blue-900/10 transition-colors" />
              <span className="absolute bottom-3 left-3 bg-brand-white/80 backdrop-blur-sm text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Scissors size={10} /> In Progress
              </span>
            </div>
            <div className="relative h-48 overflow-hidden rounded-[24px] group">
              <Image src="https://images.unsplash.com/photo-1604456930969-37f67bcd6e1e?auto=format&fit=crop&w=600&q=80" alt="Yarn collection" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-brand-blue-900/20 group-hover:bg-brand-blue-900/10 transition-colors" />
              <span className="absolute bottom-3 left-3 bg-brand-white/80 backdrop-blur-sm text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Palette size={10} /> Yarn Selection
              </span>
            </div>
            <div className="relative h-48 overflow-hidden rounded-[24px] group">
              <Image src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80" alt="Finished crochet product" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-brand-blue-900/20 group-hover:bg-brand-blue-900/10 transition-colors" />
              <span className="absolute bottom-3 left-3 bg-brand-white/80 backdrop-blur-sm text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Package size={10} /> Ready to Ship
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5. TRENDING HANDMADES (Products Grid) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        {/* Floating aesthetics for Trending section */}
        <div className="absolute top-0 right-[10%] w-32 h-32 bg-brand-blue-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-[20%] left-0 w-48 h-48 bg-brand-blue-200/20 rounded-[50%_50%_40%_60%] blur-2xl animate-[spin_20s_linear_infinite] pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4 relative z-10">
          <div className="space-y-3 animate-fade-in-left">
            <span className="text-brand-blue-600 font-bold text-xs uppercase tracking-widest bg-brand-blue-50 border border-brand-blue-100 px-3 py-1 rounded-full">Trending Creations</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark font-bold">Popular Handmades</h2>
            <p className="text-brand-muted text-sm max-w-md">Our hand-stitched favorites, popular with our community this week.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => {
            const primaryImg = product.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={product.id}
                className={`group flex flex-col space-y-4 animate-fade-in-up bg-brand-white p-3 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300`}
                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-[16px] overflow-hidden bg-gray-50 group-hover:shadow-inner transition-all duration-500">
                  <Image
                    src={primaryImg}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.madeToOrder && (
                    <span className="absolute top-3 left-3 bg-brand-white/90 text-brand-dark text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                      Made to Order
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex justify-between items-start px-2 pb-2">
                  <div className="space-y-1">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-serif text-base text-brand-dark font-bold group-hover:text-brand-blue-600 transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>
                    <span className="text-[11px] text-brand-muted font-medium block">
                      {product.materials ? product.materials.split(',')[0] : '100% Cotton'}
                    </span>
                  </div>

                  {/* Price */}
                  <span className="font-bold text-sm text-brand-blue-600">
                    ${product.basePrice.toFixed(0)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3.6. BABY CLOTHING SECTION */}
      <section className="py-24 bg-brand-blue-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue-100 rounded-full blur-[100px] opacity-50 pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-brand-white rounded-[40%_60%_70%_30%] blur-[80px] pointer-events-none animate-[spin_15s_linear_infinite]" />
        
        {/* Floating Clouds/Hearts */}
        <div className="absolute top-[30%] left-[10%] text-brand-blue-300/40 animate-float pointer-events-none">
          <Heart size={48} strokeWidth={1} />
        </div>
        <div className="absolute bottom-[20%] right-[15%] text-purple-300/30 animate-float-delayed pointer-events-none" style={{ animationDelay: '0.8s' }}>
          <Sparkles size={64} strokeWidth={1} className="-rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="text-brand-blue-600 font-bold text-xs uppercase tracking-widest bg-brand-white border border-brand-blue-100 px-4 py-1.5 rounded-full shadow-sm">Gentle Touches</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-brand-dark font-black">Baby Clothing Collection</h2>
            <p className="text-brand-muted text-base max-w-xl mx-auto">Ultra-soft, hypoallergenic natural fibers stitched with love. Keep your little ones warm and cozy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product, idx) => {
              const primaryImg = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80';
              return (
                <div key={`baby-${product.id}`} className="group relative rounded-[32px] overflow-hidden bg-brand-white border border-brand-blue-100 shadow-premium p-4 hover:-translate-y-2 transition-all duration-500">
                  <div className="relative aspect-square rounded-[24px] overflow-hidden mb-4">
                    <Image src={primaryImg} alt="Baby Clothing" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="text-center px-4 pb-2">
                    <h3 className="font-bold text-brand-dark text-lg mb-1 group-hover:text-brand-blue-600 transition-colors">{product.title}</h3>
                    <p className="text-sm font-bold text-brand-blue-400">${product.basePrice.toFixed(0)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3.7. HANDCRAFTED FLOWER CROCHET SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative">
        {/* Ambient floating blobs behind the whole container */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-blue-900/30 rounded-full blur-[100px] animate-pulse pointer-events-none z-0" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/20 rounded-[40%_60%_70%_30%] blur-[100px] animate-[spin_25s_linear_infinite] pointer-events-none z-0" />

        <div className="bg-brand-dark rounded-[48px] overflow-hidden flex flex-col lg:flex-row relative shadow-2xl group z-10">
          {/* Left: Huge sticky image */}
          <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
            <Image
              src="/flower-crochet-hero.png"
              alt="Handcrafted Crochet Flowers"
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent p-12 flex flex-col justify-center">
              <span className="text-brand-blue-200 font-bold text-xs uppercase tracking-widest mb-4 block">Everlasting Bloom</span>
              <h2 className="font-serif text-5xl sm:text-6xl text-brand-white font-black leading-[1.1] mb-6">HANDCRAFTED<br />FLOWER<br />CROCHET</h2>
              <Link href="/shop" className="w-fit bg-brand-white text-brand-dark px-8 py-4 rounded-full text-sm font-bold hover:bg-brand-blue-50 transition-colors flex items-center gap-2">
                Explore Bouquets <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right: Product grid with flower crochet images */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-brand-dark flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-900/20 to-transparent pointer-events-none" />
            <div className="grid grid-cols-2 gap-4 relative z-10 w-full">
              {[
                { src: '/flower-crochet-1.png', title: 'Rose Bouquet', price: '$35' },
                { src: '/flower-crochet-2.png', title: 'Sunflower Bloom', price: '$28' },
                { src: '/flower-crochet-3.png', title: 'Tulip Basket', price: '$42' },
                { src: '/flower-crochet-4.png', title: 'Lavender Wrap', price: '$30' },
              ].map((item, idx) => (
                <div key={`flower-${idx}`} className="bg-brand-white/10 backdrop-blur-md rounded-[24px] p-3 border border-brand-white/10 hover:bg-brand-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-square rounded-[16px] overflow-hidden mb-3">
                    <Image src={item.src} alt={item.title} fill className="object-cover hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="font-bold text-brand-white text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-brand-blue-200 text-xs font-semibold mt-1">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3.8. MULTIPLE PREMIUM BOOKS SECTION */}
      <section className="py-24 relative overflow-hidden bg-brand-dark">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-blue-900/40 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/30 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-white/5 border border-brand-white/10 text-brand-blue-300">
                <BookOpen size={16} />
                <span className="text-xs font-bold tracking-[0.2em] uppercase">Curated Library</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-white font-black leading-[1.1]">
                MINDS THAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-400 to-purple-400">SHAPED THE WORLD</span>
              </h2>
              <p className="text-brand-blue-100/60 text-lg font-light leading-relaxed">
                Unlock unparalleled wisdom with our exclusive collection of 15 life-changing books. 
                From mastering wealth to understanding human psychology, elevate your mind today.
              </p>
            </div>
            
            <div className="hidden md:flex gap-3">
              <button className="w-12 h-12 rounded-full bg-brand-white/5 border border-brand-white/10 flex items-center justify-center text-brand-white hover:bg-brand-white/20 transition-colors">
                <ChevronRight className="rotate-180" size={20} />
              </button>
              <button className="w-12 h-12 rounded-full bg-brand-white/10 border border-brand-white/20 flex items-center justify-center text-brand-white hover:bg-brand-blue-600 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div className="flex gap-8 overflow-x-auto pb-12 pt-16 snap-x snap-mandatory hide-scrollbar relative">
            {[
              { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80", tag: "Finance", price: "$24" },
              { title: "Psychology of Money", author: "Morgan Housel", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80", tag: "Wealth", price: "$22" },
              { title: "Atomic Habits", author: "James Clear", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80", tag: "Growth", price: "$19" },
              { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80", tag: "Psychology", price: "$26" },
              { title: "The Intelligent Investor", author: "Benjamin Graham", img: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=400&q=80", tag: "Investing", price: "$30" },
              { title: "Sapiens", author: "Yuval Noah Harari", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80", tag: "History", price: "$25" },
              { title: "Deep Work", author: "Cal Newport", img: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=400&q=80", tag: "Focus", price: "$21" },
              { title: "Zero to One", author: "Peter Thiel", img: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&w=400&q=80", tag: "Business", price: "$23" },
              { title: "Principles", author: "Ray Dalio", img: "https://images.unsplash.com/photo-1511116262446-c2152865ec09?auto=format&fit=crop&w=400&q=80", tag: "Leadership", price: "$28" },
              { title: "Shoe Dog", author: "Phil Knight", img: "https://images.unsplash.com/photo-1589998059171-9899ea86200b?auto=format&fit=crop&w=400&q=80", tag: "Biography", price: "$20" },
              { title: "Outliers", author: "Malcolm Gladwell", img: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&w=400&q=80", tag: "Success", price: "$18" },
              { title: "Good to Great", author: "Jim Collins", img: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=400&q=80", tag: "Business", price: "$22" },
              { title: "The 48 Laws of Power", author: "Robert Greene", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80", tag: "Strategy", price: "$29" },
              { title: "Start with Why", author: "Simon Sinek", img: "https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?auto=format&fit=crop&w=400&q=80", tag: "Leadership", price: "$19" },
              { title: "The Lean Startup", author: "Eric Ries", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80", tag: "Startup", price: "$24" }
            ].map((book, idx) => (
              <div 
                key={idx} 
                className="group relative min-w-[280px] max-w-[280px] snap-center rounded-[32px] bg-brand-white/5 backdrop-blur-xl border border-brand-white/10 p-6 flex flex-col hover:-translate-y-4 hover:bg-brand-white/10 hover:border-brand-blue-400/50 transition-all duration-500 ease-out shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] mt-12"
              >
                {/* Floating Image */}
                <div className="relative w-full aspect-[3/4] -mt-20 mb-6 rounded-[16px] overflow-hidden shadow-2xl group-hover:-translate-y-2 group-hover:scale-[1.02] transition-transform duration-500 border border-brand-white/20">
                  <Image
                    src={book.img}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Tag Pill Overlay */}
                  <div className="absolute top-4 left-4 bg-brand-dark/80 backdrop-blur-md text-brand-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-brand-white/10">
                    {book.tag}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-end">
                  <h3 className="font-serif text-2xl text-brand-white font-bold leading-tight mb-2 group-hover:text-brand-blue-300 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-brand-white/50 text-sm mb-6 font-medium">{book.author}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-brand-white/10 mt-auto">
                    <span className="text-xl font-black text-brand-white">{book.price}</span>
                    <button className="w-10 h-10 rounded-full bg-brand-white text-brand-dark flex items-center justify-center hover:bg-brand-blue-600 hover:text-brand-white transition-colors hover:scale-110 active:scale-95 duration-300 shadow-lg">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.9. BOTANICAL COLLECTION SECTION */}
      <section className="py-24 relative overflow-hidden bg-brand-white">
        {/* Soft Organic Background Elements */}
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-brand-white to-green-50/50 -z-10" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-green-200/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-emerald-100/30 blur-[80px] rounded-full mix-blend-multiply pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          
          {/* Floating Aesthetic Greenery Elements */}
          <div className="absolute -z-10 top-10 left-[10%] animate-float text-green-400/40 -rotate-12 pointer-events-none" style={{ animationDelay: '0.2s' }}>
            <Leaf size={48} strokeWidth={1} />
          </div>
          <div className="absolute -z-10 top-40 right-[5%] animate-float-delayed text-emerald-500/30 rotate-45 blur-[2px] pointer-events-none" style={{ animationDelay: '0.7s' }}>
            <Leaf size={64} strokeWidth={1.5} />
          </div>
          <div className="absolute -z-10 bottom-20 left-[2%] animate-float text-green-300/50 rotate-90 pointer-events-none" style={{ animationDelay: '1.2s' }}>
            <Leaf size={32} strokeWidth={1} />
          </div>
          <div className="hidden lg:block absolute -z-10 top-1/3 left-1/2 -translate-x-1/2 animate-pulse text-green-200/20 rotate-180 blur-[8px] pointer-events-none">
            <Leaf size={180} strokeWidth={0.5} />
          </div>
          <div className="absolute -z-10 bottom-10 right-[15%] animate-float-delayed text-green-500/30 -rotate-45 pointer-events-none" style={{ animationDelay: '0.5s' }}>
            <Sparkles size={40} strokeWidth={1} />
          </div>
          <div className="absolute -z-10 top-20 right-[30%] animate-float text-emerald-400/20 rotate-12 pointer-events-none" style={{ animationDelay: '1.5s' }}>
            <Leaf size={24} strokeWidth={1.5} />
          </div>
          <div className="absolute -z-10 top-[60%] right-[40%] animate-float text-blue-400/30 pointer-events-none" style={{ animationDelay: '0.9s' }}>
            <Droplet size={36} strokeWidth={1.5} />
          </div>
          <div className="absolute -z-10 bottom-[30%] left-[20%] animate-pulse text-yellow-500/20 pointer-events-none" style={{ animationDelay: '0.3s' }}>
            <Sun size={80} strokeWidth={0.5} />
          </div>
          {/* Floating Organic Shapes */}
          <div className="absolute -z-10 top-[10%] right-[20%] w-20 h-20 bg-green-200/30 rounded-[40%_60%_70%_30%] blur-[4px] animate-[spin_10s_linear_infinite] pointer-events-none" />
          <div className="absolute -z-10 bottom-[10%] left-[30%] w-32 h-32 bg-emerald-200/20 rounded-[60%_40%_30%_70%] blur-[8px] animate-[spin_15s_linear_infinite_reverse] pointer-events-none" />

          {/* Header */}
          <div className="mb-16 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 text-green-700 mb-6 shadow-sm">
              <Leaf size={16} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Living Collection</span>
            </div>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-brand-dark font-black leading-[1.1] tracking-tight">
              BREATHE LIFE <br />
              <span className="italic font-light text-green-700">into your space</span>
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[700px]">
            
            {/* Potted Plants - Hero (Span 7) */}
            <div className="lg:col-span-7 relative group rounded-[40px] overflow-hidden bg-green-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] transition-all duration-700 border border-green-100/50">
              <Image 
                src="/potted_plant_premium.png" 
                alt="Lush Potted Plant" 
                fill 
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />
              
              {/* Card-specific floating icons */}
              <div className="absolute top-10 left-10 animate-float text-white/50 pointer-events-none" style={{ animationDelay: '0.1s' }}>
                <Sun size={32} strokeWidth={1} />
              </div>
              <div className="absolute bottom-40 right-12 animate-float-delayed text-green-300/60 pointer-events-none" style={{ animationDelay: '0.8s' }}>
                <Leaf size={28} strokeWidth={1.5} className="-rotate-45" />
              </div>
              
              <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between">
                <div className="self-end bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                  Bestseller
                </div>
                
                <div className="max-w-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-4xl sm:text-5xl text-white font-bold mb-4 leading-tight">
                    Premium <br /> Potted Plants
                  </h3>
                  <p className="text-white/80 text-sm mb-8 font-medium">
                    Hand-selected, thriving greenery delivered straight to your door in our artisan soil mix.
                  </p>
                  
                  <button className="bg-white text-green-900 px-8 py-4 rounded-full font-bold text-sm hover:bg-green-50 transition-colors flex items-center gap-3 group/btn shadow-[0_10px_30px_-10px_rgba(255,255,255,0.5)]">
                    Explore Plants 
                    <ArrowUpRight size={18} className="group-hover/btn:rotate-45 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column Stack (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Artisan Pots */}
              <div className="flex-1 relative group rounded-[40px] overflow-hidden bg-stone-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] transition-all duration-700 border border-stone-200">
                <Image 
                  src="/artisan_ceramic_pots.png" 
                  alt="Ceramic Pots" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/70 to-transparent" />
                
                {/* Card-specific floating shapes */}
                <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 rounded-full animate-pulse pointer-events-none blur-[1px]" />
                <div className="absolute bottom-20 right-8 text-stone-300/40 animate-float pointer-events-none" style={{ animationDelay: '1.1s' }}>
                  <Droplet size={24} strokeWidth={1.5} />
                </div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="font-serif text-3xl text-white font-bold mb-2">Artisan Pots</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-stone-200 text-sm font-medium">Handcrafted ceramics</p>
                    <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-stone-900 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Heirloom Seeds */}
              <div className="h-[250px] lg:h-[300px] relative group rounded-[40px] overflow-hidden bg-amber-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] transition-all duration-700 border border-amber-100/50">
                <Image 
                  src="/heirloom_seeds.png" 
                  alt="Heirloom Seeds" 
                  fill 
                  className="object-cover opacity-80 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-transparent" />
                
                {/* Card-specific floating icons */}
                <div className="absolute top-12 left-1/2 animate-float text-amber-200/50 pointer-events-none" style={{ animationDelay: '0.4s' }}>
                  <Leaf size={20} strokeWidth={2} className="rotate-45" />
                </div>
                <div className="absolute bottom-12 left-[10%] w-8 h-8 bg-amber-500/20 rounded-[40%_60%_70%_30%] animate-[spin_8s_linear_infinite] pointer-events-none blur-[2px]" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-center w-2/3">
                  <h3 className="font-serif text-3xl text-white font-bold mb-3">Heirloom <br/> Seeds</h3>
                  <p className="text-amber-100 text-sm mb-6 font-medium">Grow your own organic oasis from scratch.</p>
                  <Link href="/shop/seeds" className="text-white font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest">
                    Shop Seeds <ArrowUpRight size={16} />
                  </Link>
                </div>

                {/* Decorative rotating badge */}
                <div className="absolute top-6 right-6 w-24 h-24 animate-[spin_10s_linear_infinite] flex items-center justify-center opacity-80 pointer-events-none">
                   <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                      <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                      <text className="text-[12px] font-bold uppercase tracking-[0.2em]"><textPath href="#circlePath">100% Organic • 100% Organic • </textPath></text>
                   </svg>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA SECTION (Mimicking the bottom shape) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative overflow-hidden">
        {/* Playful Floating CTA elements */}
        <div className="absolute top-[10%] left-[20%] text-brand-blue-400/40 animate-float pointer-events-none">
          <ArrowUpRight size={56} strokeWidth={2} className="-rotate-12" />
        </div>
        <div className="absolute bottom-[20%] right-[25%] text-brand-blue-600/30 animate-pulse pointer-events-none blur-[1px]">
          <Award size={64} strokeWidth={1} className="rotate-12" />
        </div>

        <span className="bg-brand-white border border-gray-200 text-brand-dark px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm mb-8 inline-block relative z-10">
          ABOUT US
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-dark font-black leading-tight uppercase max-w-4xl mx-auto">
          CRAFTSMANSHIP THAT ACTS BEFORE IT'S TOO LATE
        </h2>

        <div className="mt-16 relative w-full h-[300px] max-w-4xl mx-auto">
          {/* Custom clipped shape matching the bottom image in reference */}
          <div
            className="absolute inset-0 bg-brand-blue-100 rounded-t-[40px] overflow-hidden"
            style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}
          >
            <Image
              src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1200&q=80"
              alt="Crochet Team"
              fill
              className="object-cover object-top opacity-50 mix-blend-multiply"
            />
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
