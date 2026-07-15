import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { 
  ArrowRight, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Scissors, 
  Truck, 
  Ruler, 
  Star, 
  Heart,
  Award
} from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch collections
  const collections = await prisma.collection.findMany();

  // Fetch featured products (latest 3 published products for the popular section)
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
      variants: true,
    },
  });

  return (
    <div className="bg-white min-h-screen text-brand-charcoal overflow-hidden font-sans">
      
      {/* 1. HERO SECTION WITH GRADIENT BACKGROUND */}
      <section className="relative pt-6 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-tr from-[#EBF5FF] via-[#F5F9FD] to-[#FAF8F5] rounded-[40px] border border-white shadow-xl shadow-blue-900/5 p-8 lg:p-16">
          
          {/* Subtle animated light blobs */}
          <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-200/40 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-blue-100/30 blur-[60px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & Steps */}
            <div className="lg:col-span-6 flex gap-6 sm:gap-8 items-start animate-fade-in-left">
              
              {/* Vertical Step Indicators */}
              <div className="hidden sm:flex flex-col items-center gap-12 pt-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="w-8 h-8 rounded-full border border-blue-600 bg-blue-600 text-white flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-md shadow-blue-500/20">1</span>
                  <div className="w-[1px] h-10 bg-blue-300" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="w-8 h-8 rounded-full border border-blue-200 text-blue-400 flex items-center justify-center text-xs font-semibold hover:border-blue-400 transition-colors">2</span>
                  <div className="w-[1px] h-10 bg-blue-100" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="w-8 h-8 rounded-full border border-blue-200 text-blue-400 flex items-center justify-center text-xs font-semibold hover:border-blue-400 transition-colors">3</span>
                </div>
              </div>

              {/* Main Copy */}
              <div className="space-y-6 sm:space-y-8 flex-1">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs sm:text-sm font-semibold tracking-wider uppercase animate-pulse">
                  <Sparkles size={14} /> Create Your Knit Journey
                </span>
                
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-[1.1] font-bold tracking-tight">
                  Experience <br />
                  The Magic Of <br />
                  <span className="text-blue-600 relative inline-block">
                    Crochet!
                    <span className="absolute bottom-1 left-0 w-full h-[4px] bg-blue-200 -z-10 rounded-full" />
                  </span>
                </h1>
                
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg font-medium">
                  We slow down the craft of crochet. Every item is hand-stitched by independent artisans using 100% natural fibers. Explore cozy staples and heirloom home goods.
                </p>
                
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/shop"
                    className="h-14 px-8 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 shadow-blue-500/10 text-sm tracking-wide gap-2 group"
                  >
                    Shop Cozy Knitwear
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link
                    href="/shop?collection=clothing"
                    className="h-14 w-14 inline-flex items-center justify-center border-2 border-white hover:border-blue-500 text-blue-600 bg-white hover:bg-blue-50 font-bold rounded-full transition-all shadow-md active:scale-95 group relative"
                    title="Watch Process"
                  >
                    <Play size={18} fill="currentColor" className="ml-0.5 text-blue-600" />
                  </Link>
                  <span className="text-slate-700 font-bold text-sm tracking-wide">Watch Story</span>
                </div>
              </div>
            </div>
            
            {/* Right Column: Hero Image Layout */}
            <div className="lg:col-span-6 relative flex justify-center items-center animate-scale-in">
              {/* Curved border crop design matching the travel page style */}
              <div className="relative w-full h-[350px] sm:h-[450px] overflow-hidden rounded-tl-[120px] rounded-br-[120px] border-[8px] border-white shadow-2xl bg-white/50 backdrop-blur-md">
                <Image
                  src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80"
                  alt="Artisan cozy terracotta knit cardigan model view"
                  fill
                  priority
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating glassmorphic card on hero image matching the "Know More" card */}
              <div className="absolute bottom-6 right-6 sm:right-10 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl shadow-blue-900/10 rounded-3xl p-4 sm:p-5 flex items-center gap-4 max-w-xs animate-float">
                <div className="flex -space-x-3 overflow-hidden">
                  <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                    <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Artisan 1" fill className="object-cover" />
                  </div>
                  <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Artisan 2" fill className="object-cover" />
                  </div>
                  <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                    <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Artisan 3" fill className="object-cover" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">Artisan Network</h4>
                  <p className="text-[11px] text-slate-500 font-semibold tracking-wide truncate">Join 10k+ crochet lovers</p>
                </div>
                
                <Link
                  href="/shop"
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors shadow-md shadow-blue-500/20"
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PARTNER / BRAND STRIP */}
      <section className="py-12 bg-white border-y border-slate-100/80 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap justify-around items-center gap-8 md:gap-12">
          <span className="font-serif text-lg md:text-xl font-bold tracking-wider text-slate-300 italic uppercase">DMC Yarns</span>
          <span className="font-serif text-lg md:text-xl font-bold tracking-wider text-slate-300 italic uppercase">Rowan Craft</span>
          <span className="font-serif text-lg md:text-xl font-bold tracking-wider text-slate-300 italic uppercase">Lion Brand</span>
          <span className="font-serif text-lg md:text-xl font-bold tracking-wider text-slate-300 italic uppercase">Red Heart</span>
          <span className="font-serif text-lg md:text-xl font-bold tracking-wider text-slate-300 italic uppercase">Bernat Yarn</span>
        </div>
      </section>

      {/* 3. POPULAR DESTINATIONS -> TRENDING HANDMADES SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div className="space-y-3 animate-fade-in-left">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Trending Creations</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold">Popular Handmades</h2>
            <p className="text-slate-500 text-sm max-w-md">Our hand-stitched favorites, popular with our community this week.</p>
          </div>
          
          <div className="flex gap-3 animate-fade-in-right">
            <button className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-400 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all active:scale-95">
              <ChevronLeft size={20} />
            </button>
            <button className="w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-white transition-all active:scale-95 shadow-md shadow-slate-900/10">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => {
            const primaryImg = product.images[0]?.url || 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80';
            
            return (
              <div 
                key={product.id}
                className={`group flex flex-col space-y-5 animate-fade-in-up`}
                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
              >
                {/* Image Container with high-radius corners */}
                <div className="relative aspect-[4/5] rounded-[36px] overflow-hidden bg-slate-50 border border-slate-100 shadow-md group-hover:shadow-xl transition-all duration-500">
                  <Image
                    src={primaryImg}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.madeToOrder && (
                    <span className="absolute bottom-4 left-4 bg-white/90 text-slate-800 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/50 shadow-sm backdrop-blur-md">
                      Made to Order
                    </span>
                  )}
                  
                  {/* Floating Like Icon */}
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white hover:scale-110 text-blue-500 shadow-sm backdrop-blur-md flex items-center justify-center transition-all duration-300">
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>

                {/* Details */}
                <div className="flex justify-between items-start px-2">
                  <div className="space-y-1">
                    <span className="text-[12px] text-blue-600 font-bold tracking-wider uppercase block">
                      {product.materials ? product.materials.split(',')[0] : '100% Cotton'} • {product.shipEstimateDays}d Estimate
                    </span>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-serif text-xl text-slate-800 font-bold group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>
                  </div>
                  
                  {/* Styled Price Badge Button */}
                  <Link 
                    href={`/product/${product.slug}`}
                    className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg shadow-blue-500/10 active:scale-95"
                  >
                    ${product.basePrice.toFixed(0)}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. JOURNEY SECTION -> CRAFTING YOUR CLOSET MADE SIMPLE */}
      <section className="py-24 bg-gradient-to-b from-[#F5F9FD] to-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-16">
          <div className="space-y-4 max-w-2xl mx-auto animate-fade-in-up">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Our Process</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold leading-tight">Journey To The Stitches Made Simple!</h2>
            <p className="text-slate-500 text-sm">Every loop, knot, and yarn selection is carefully optimized for your ultimate comfort.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Step 1 Card: White */}
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-900/5 rounded-[32px] p-10 flex flex-col justify-between items-center text-center space-y-8 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Scissors size={26} />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-slate-800 font-bold">Find Your Design</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Browse our range of garments, cozy accessories, and custom toys designed by top-tier crochet creators.
                </p>
              </div>
              <span className="text-slate-300 font-serif text-5xl font-extrabold select-none opacity-20">01</span>
            </div>

            {/* Step 2 Card: Vibrant Blue Highlight (matching center card in mockup) */}
            <div className="bg-blue-600 text-white shadow-2xl shadow-blue-500/20 rounded-[32px] p-10 flex flex-col justify-between items-center text-center space-y-8 hover:translate-y-[-4px] transition-transform duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
              
              {/* Circular crochet pattern preview crop */}
              <div className="relative w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden shadow-lg mx-auto">
                <Image
                  src="https://images.unsplash.com/photo-1584992791193-5db3cb340f4e?auto=format&fit=crop&w=200&q=80"
                  alt="Colorful crochet stitches"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl font-bold">Custom Size & Color</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Select your exact chest measurement, custom yarn material (cotton, merino, or alpaca), and color palette.
                </p>
              </div>
              
              <Link 
                href="/shop"
                className="font-bold text-xs uppercase tracking-widest text-white hover:text-blue-100 border-b border-white pb-1"
              >
                Learn More
              </Link>
            </div>

            {/* Step 3 Card: White */}
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-900/5 rounded-[32px] p-10 flex flex-col justify-between items-center text-center space-y-8 hover:translate-y-[-4px] transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Truck size={26} />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-slate-800 font-bold">Handcrafted & Shipped</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Our local women cooperatives stitch your item using sustainable fibers and ship it in biodegradable packaging.
                </p>
              </div>
              <span className="text-slate-300 font-serif text-5xl font-extrabold select-none opacity-20">03</span>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BOTTOM GRID BANNERS SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative flex justify-center items-center animate-fade-in-left">
            <div className="relative w-full h-[450px] sm:h-[550px] rounded-[36px] overflow-hidden border-8 border-white shadow-2xl bg-white">
              <Image
                src="https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80"
                alt="Autumn organic collection showcase model view"
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Sale Tag matching the bottom layout badge */}
              <div className="absolute bottom-6 left-6 bg-blue-600 text-white p-5 rounded-2xl border border-white/40 shadow-xl max-w-xs animate-float">
                <span className="font-bold text-3xl block leading-none">20% OFF</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-100 block mt-1">Mid-Summer Craft Sale</span>
              </div>
            </div>
          </div>

          {/* Right Column: Creative Pitch & CTA */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in-right">
            <div className="space-y-4">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">Artisan Values</span>
              <h2 className="font-serif text-4xl sm:text-5xl text-slate-900 font-bold leading-tight">
                UNLEASH CREATIVITY WITH CHERRY CLOSET
              </h2>
              <p className="text-slate-600 leading-relaxed text-base font-medium">
                No industrial machines can replicate crochet stitches. Each item is custom, unique, and loops through the fingers of a single artisan. We exclusively use GOTS-certified organic cotton, renewable alpaca, and wool.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-800">100% Handcrafted</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">Unique stitches that cannot be replicated by machines.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Ruler size={18} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-800">Tailored Fit</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">Provide your custom measurements for a custom layout.</p>
                </div>
              </div>
            </div>

            {/* Premium CTA Bar at the bottom matching the image */}
            <Link 
              href="/shop"
              className="w-full sm:w-auto min-w-[320px] px-8 py-5 bg-[#E5E9FF] hover:bg-[#D9E2FF] text-[#1D4ED8] flex items-center justify-between rounded-3xl font-bold tracking-wide transition-all shadow-md group active:scale-95"
            >
              <span>Explore Made-to-Order Kits</span>
              <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
