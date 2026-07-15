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
  Award
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
          
          {/* Huge Faded Background Text */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
            <h1 className="text-[12vw] font-serif font-black text-brand-white/80 tracking-tighter leading-none mix-blend-overlay blur-[2px]">
              SHA CLOSET
            </h1>
          </div>

          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0">
            <h1 className="text-[12vw] font-serif font-black text-brand-white/50 tracking-tighter leading-none mix-blend-overlay">
              SHA CLOSET
            </h1>
          </div>

          {/* Centerpiece Image (The "Phone" equivalent) */}
          <div className="relative z-20 animate-float-delayed mt-20 sm:mt-10">
            <div className="w-[300px] h-[550px] sm:w-[350px] sm:h-[650px] rounded-[48px] border-8 border-brand-white shadow-premium bg-brand-white overflow-hidden relative transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700">
              <Image 
                src="/banner.png" 
                alt="Sha closet premium crochet"
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

          {/* Floating Glass Pill 1 (Left) */}
          <div className="absolute z-30 top-[40%] left-[5%] sm:left-[15%] lg:left-[20%] animate-fade-in-left">
            <div className="bg-brand-white/80 backdrop-blur-xl border border-brand-white shadow-xl rounded-2xl p-4 flex items-center gap-4 max-w-[220px]">
              <div className="w-12 h-12 rounded-xl bg-brand-blue-100 flex items-center justify-center text-brand-blue-600">
                <Award size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark leading-tight">1,400+ Custom <br/> Orders Delivered</h4>
                <p className="text-[10px] text-brand-muted mt-1">Will Yours Be Next?</p>
              </div>
            </div>
          </div>

          {/* Floating Glass Pill 2 (Right Top) */}
          <div className="absolute z-30 top-[25%] right-[5%] sm:right-[15%] lg:right-[20%] animate-fade-in-right">
            <div className="bg-brand-white/80 backdrop-blur-xl border border-brand-white shadow-xl rounded-full px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-brand-white overflow-hidden relative">
                <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Designer" fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-dark">@sha_artisan</h4>
                <p className="text-[10px] text-brand-muted">Master Crochet Designer</p>
              </div>
            </div>
          </div>

          {/* Pre-subscribe Pill (Center Bottom) */}
          <div className="absolute z-30 bottom-10 left-1/2 -translate-x-1/2">
            <Link href="/shop" className="bg-brand-white/90 backdrop-blur-xl border border-brand-white shadow-xl rounded-full px-6 py-3 flex items-center gap-3 hover:bg-brand-white transition-colors group">
              <span className="text-xs font-bold text-brand-dark tracking-wide">Explore Collection</span>
              <ArrowUpRight size={16} className="text-brand-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          {/* Floating Background Badges */}
          <div className="absolute z-10 bottom-[20%] right-[10%] rotate-12 opacity-50 bg-brand-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-brand-white/50">
            <span className="text-sm font-bold text-brand-dark uppercase tracking-widest">PREMIUM YARN</span>
          </div>
          <div className="absolute z-10 bottom-[35%] left-[8%] -rotate-12 opacity-50 bg-brand-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-brand-white/50">
            <span className="text-sm font-bold text-brand-dark uppercase tracking-widest">HANDCRAFTED</span>
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
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-12 flex justify-between items-center">
          <span className="bg-brand-blue-50 border border-brand-blue-100 text-brand-blue-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
            UI / UX INNOVATION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
          
          {/* Large Left Card - Step by Step */}
          <div className="md:col-span-8 md:row-span-2 rounded-[32px] overflow-hidden relative group">
            <div className="absolute inset-0 bg-brand-blue-50/50" />
            <Image 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" 
              alt="Abstract Blue Waves" 
              fill 
              className="object-cover opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-white/90 via-brand-white/40 to-transparent p-10 flex flex-col justify-center w-2/3">
              <h2 className="font-serif text-4xl sm:text-5xl font-black text-brand-dark leading-[1.1] uppercase">
                HOW CROCHET<br/>
                WORKS: A STEP-<br/>
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
            <Image 
              src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=600&q=80" 
              alt="Abstract Blue" 
              fill 
              className="object-cover opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="relative z-10 flex justify-between h-full">
              <div className="w-[10%] h-full flex items-center">
                 <p className="transform -rotate-90 text-brand-white font-bold tracking-[0.3em] whitespace-nowrap origin-left text-lg">
                   PREMIUM YARNS
                 </p>
              </div>
              <div className="w-[10%] h-full flex items-center">
                 <p className="transform -rotate-90 text-brand-blue-200 font-bold tracking-[0.3em] whitespace-nowrap origin-left text-lg">
                   A MARKED PIECE FOR YOUR HOME
                 </p>
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

      {/* 3.5. TRENDING HANDMADES (Products Grid) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue-100 rounded-full blur-[100px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-brand-white rounded-full blur-[80px] pointer-events-none" />
        
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
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="bg-brand-dark rounded-[48px] overflow-hidden flex flex-col lg:flex-row relative shadow-2xl group">
          {/* Left: Huge sticky image */}
          <div className="lg:w-1/2 relative min-h-[400px] lg:min-h-full">
            <Image 
              src="https://images.unsplash.com/photo-1582769923195-c6e60b29cebd?auto=format&fit=crop&w=800&q=80" 
              alt="Crochet Flowers" 
              fill 
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 to-transparent p-12 flex flex-col justify-center">
               <span className="text-brand-blue-200 font-bold text-xs uppercase tracking-widest mb-4 block">Everlasting Bloom</span>
               <h2 className="font-serif text-5xl sm:text-6xl text-brand-white font-black leading-[1.1] mb-6">HANDCRAFTED<br/>FLOWER<br/>CROCHET</h2>
               <Link href="/shop" className="w-fit bg-brand-white text-brand-dark px-8 py-4 rounded-full text-sm font-bold hover:bg-brand-blue-50 transition-colors flex items-center gap-2">
                 Explore Bouquets <ChevronRight size={16} />
               </Link>
            </div>
          </div>

          {/* Right: Scrollable/Grid products */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-brand-dark flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-900/20 to-transparent pointer-events-none" />
            <div className="grid grid-cols-2 gap-4 relative z-10 w-full">
              {products.slice(0, 4).map((product, idx) => (
                <div key={`flower-${product.id}`} className="bg-brand-white/10 backdrop-blur-md rounded-[24px] p-3 border border-brand-white/10 hover:bg-brand-white/20 transition-colors">
                  <div className="relative aspect-square rounded-[16px] overflow-hidden mb-3">
                    <Image src="https://images.unsplash.com/photo-1620023640245-0d268508e734?auto=format&fit=crop&w=400&q=80" alt="Flower Crochet" fill className="object-cover hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="font-bold text-brand-white text-sm line-clamp-1">{product.title}</h3>
                  <p className="text-brand-blue-200 text-xs font-semibold mt-1">${product.basePrice.toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA SECTION (Mimicking the bottom shape) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
         <span className="bg-brand-white border border-gray-200 text-brand-dark px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm mb-8 inline-block">
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}} />
    </div>
  );
}
