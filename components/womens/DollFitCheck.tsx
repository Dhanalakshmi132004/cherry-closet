'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ShoppingBag, X, ChevronRight, Check, Droplets, Scissors } from 'lucide-react';

const CHUDIDHARS = [
  {
    id: 1,
    name: 'Royal Blue Zari Anarkali',
    price: 3499,
    image: '/images/womens/premium_chudidhar_1.png',
    description: 'A masterpiece of royal blue silk, adorned with intricate gold zari embroidery. Handcrafted for the modern royalty.',
    tag: 'Bestseller',
    fabric: 'Pure Silk & Zari',
    care: 'Dry clean only',
    category: 'Silk',
  },
  {
    id: 2,
    name: 'Emerald Noir Georgette',
    price: 2899,
    image: '/images/womens/premium_chudidhar_2.png',
    description: 'Breathtaking emerald georgette that cascades with grace, featuring delicate silver sequin embellishments that catch every light.',
    tag: 'Trending',
    fabric: 'Premium Georgette',
    care: 'Gentle hand wash',
    category: 'Georgette',
  },
  {
    id: 3,
    name: 'Rose Quartz Net Silhouette',
    price: 4599,
    image: '/images/womens/premium_chudidhar_3.png',
    description: 'A delicate and luxurious pastel pink net suit, heavily encrusted with hand-placed stones for evening galas.',
    tag: 'New Arrival',
    fabric: 'French Net & Silk',
    care: 'Dry clean only',
    category: 'Net',
  },
  {
    id: 4,
    name: 'Midnight Onyx Velvet',
    price: 5299,
    image: '/images/womens/premium_chudidhar_4.png',
    description: 'Emude pure sophistication and royal charm in this midnight black velvet chudidhar, highlighted with golden dori work.',
    tag: 'Limited Edition',
    fabric: 'Luxe Velvet',
    care: 'Dry clean only',
    category: 'Velvet',
  },
  {
    id: 5,
    name: 'Sunshine Chanderi',
    price: 3199,
    image: '/images/womens/chudidhar_yellow_1785354654983.png',
    description: 'Bright and airy chanderi silk with subtle golden motifs. The epitome of effortless elegance.',
    fabric: 'Chanderi Silk',
    care: 'Dry clean recommended',
    category: 'Silk',
  },
  {
    id: 6,
    name: 'Lavender Organza Dream',
    price: 3899,
    image: '/images/womens/chudidhar_lavender_1785354663923.png',
    description: 'Modern organza fabric with exquisite floral digital prints and delicate scalloped borders.',
    fabric: 'Pure Organza',
    care: 'Dry clean only',
    category: 'Organza',
  },
];

const CATEGORIES = ['All', 'Silk', 'Georgette', 'Velvet', 'Net', 'Organza'];

const PERSPECTIVE_CLASSES = [
  "object-cover",
  "object-cover scale-[1.7] origin-top",
  "object-cover scale-[1.7] origin-center",
  "object-cover scale-[1.7] origin-bottom",
  "object-cover scale-[1.4] origin-[20%_50%]"
];

export default function DollFitCheck() {
  const [selectedDress, setSelectedDress] = useState<typeof CHUDIDHARS[0] | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const galleryImages = selectedDress 
    ? Array(5).fill(selectedDress.image) 
    : [];

  const handleAcquire = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const filteredChudidhars = CHUDIDHARS.filter(dress => 
    activeCategory === 'All' ? true : dress.category === activeCategory
  );

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#050505] w-full min-h-screen relative font-sans text-neutral-200 selection:bg-neutral-800 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-white/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[60vw] h-[60vw] bg-white/[0.01] rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Marquee Header */}
      <div className="w-full bg-[#0a0a0a] border-b border-white/5 py-3 overflow-hidden relative z-10">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-[10px] font-bold tracking-[0.4em] uppercase text-neutral-500 mx-8">
              • THE ATELIER • EXCLUSIVE COLLECTION • VIRTUAL SHOWROOM • HAUTE COUTURE 
            </span>
          ))}
        </div>
      </div>
      
      {/* Side Drawer Overlay & Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${selectedDress ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none delay-200'}`}
        onClick={() => {
          setSelectedDress(null);
          setIsAdded(false);
        }}
      />
      
      {/* Cinematic Side Drawer (Dark Theme) */}
      <div className={`fixed top-0 right-0 z-50 w-full md:w-[640px] h-[100dvh] bg-[#0a0a0a]/90 backdrop-blur-3xl shadow-2xl border-l border-white/10 transform transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${selectedDress ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {selectedDress && (
          <>
            <div className="flex justify-between items-center px-10 py-8 absolute top-0 w-full z-20 pointer-events-none">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/50">The Atelier</span>
                <button 
                    onClick={() => {
                      setSelectedDress(null);
                      setIsAdded(false);
                    }}
                    className="p-3 hover:scale-90 hover:bg-white/10 transition-all duration-300 rounded-full pointer-events-auto text-white backdrop-blur-sm"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="relative w-full h-[75vh] bg-black overflow-hidden group">
                  <Image
                      src={galleryImages[activeImageIndex]}
                      alt={selectedDress.name}
                      fill
                      className={`object-cover transition-all duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${PERSPECTIVE_CLASSES[activeImageIndex]}`}
                      priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />
                  
                  {selectedDress.tag && (
                    <div className="absolute top-32 left-10 z-10">
                      <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-sm border border-white/20">
                        {selectedDress.tag}
                      </span>
                    </div>
                  )}
              </div>

              <div className="px-10 pb-32 -mt-24 relative z-10">
                  <div className="bg-[#111]/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
                    <h3 className="font-serif text-5xl md:text-6xl text-white mb-6 leading-[1.05] tracking-tight">{selectedDress.name}</h3>
                    <div className="flex items-center gap-6 mb-8">
                        <p className="text-3xl font-light text-white">₹{selectedDress.price.toLocaleString()}</p>
                        <span className="w-12 h-[1px] bg-white/20" />
                        <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-3 py-1 rounded-full flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          In Stock
                        </span>
                    </div>
                    
                    <p className="text-neutral-400 leading-[1.8] font-light mb-10 text-sm max-w-md">{selectedDress.description}</p>

                    <div className="grid grid-cols-2 gap-8 mb-12 py-8 border-y border-white/10">
                      <div>
                        <div className="flex items-center gap-2 text-neutral-500 mb-2">
                          <Scissors className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Fabric</span>
                        </div>
                        <p className="text-sm font-medium text-neutral-200">{selectedDress.fabric}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-neutral-500 mb-2">
                          <Droplets className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Care</span>
                        </div>
                        <p className="text-sm font-medium text-neutral-200">{selectedDress.care}</p>
                      </div>
                    </div>

                    <h4 className="text-[10px] font-bold text-neutral-500 mb-6 uppercase tracking-[0.2em]">Curated Perspectives</h4>
                    
                    <div className="flex gap-4">
                        {galleryImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`relative w-24 h-32 overflow-hidden flex-shrink-0 transition-all duration-500 rounded-lg border ${activeImageIndex === idx ? 'border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)] z-10' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-95 grayscale hover:grayscale-[50%]'}`}
                            >
                                <Image 
                                    src={img} 
                                    alt={`Perspective ${idx}`} 
                                    fill 
                                    className={`object-cover ${PERSPECTIVE_CLASSES[idx]}`} 
                                />
                            </button>
                        ))}
                    </div>
                  </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-xl p-6 border-t border-white/10 z-30">
                <button 
                  onClick={handleAcquire}
                  disabled={isAdded}
                  className={`relative w-full overflow-hidden group py-5 px-8 flex items-center justify-center gap-4 transition-all duration-500 rounded-xl ${isAdded ? 'bg-emerald-800 text-white' : 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:-translate-y-1'}`}
                >
                    {!isAdded && <span className="absolute inset-0 bg-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />}
                    
                    <div className="relative z-10 flex items-center gap-4">
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5 animate-[bounce_0.5s_ease-out]" />
                          <span className="text-xs font-bold tracking-[0.2em] uppercase">Added to Wardrobe</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span className="text-xs font-bold tracking-[0.2em] uppercase">Acquire Piece</span>
                        </>
                      )}
                    </div>
                </button>
            </div>
          </>
        )}
      </div>

      {/* Main Editorial Runway Page */}
      <div className={`relative z-10 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedDress ? 'scale-[0.95] blur-[10px] opacity-30' : 'scale-100'}`}>
        
        {/* Editorial Header */}
        <div className="px-6 sm:px-12 lg:px-20 pt-24 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-4xl relative">
                <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-neutral-500 mb-8 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-neutral-500"></span>
                  Collection 01
                </h2>
                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif text-white tracking-tighter leading-[0.8]">
                  The<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 italic font-light">Atelier.</span>
                </h1>
            </div>
            
            <div className="flex flex-col items-end gap-12">
              <p className="text-neutral-400 leading-relaxed font-light text-sm max-w-sm text-right border-r border-white/20 pr-6">
                  An immersive exploration of unapologetic luxury. Swipe to experience the meticulously crafted masterpieces.
              </p>
              
              {/* Runway Navigation Arrows */}
              <div className="flex gap-4">
                <button onClick={scrollLeft} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300">
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <button onClick={scrollRight} className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
        </div>

        {/* Elegant Filter Navigation */}
        <div className="px-6 sm:px-12 lg:px-20 mb-16 flex flex-wrap items-center gap-8">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-600">Curations:</span>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-xs uppercase tracking-widest px-6 py-3 transition-all duration-500 rounded-full whitespace-nowrap ${
                  activeCategory === category 
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-transparent text-neutral-500 border border-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Runway Layout */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-10 overflow-x-auto px-6 sm:px-12 lg:px-20 pb-32 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredChudidhars.map((dress, index) => (
            <div 
                key={dress.id} 
                onClick={() => {
                    setSelectedDress(dress);
                    setActiveImageIndex(0);
                }}
                className="group relative cursor-pointer flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] xl:w-[28vw] snap-center overflow-hidden bg-neutral-900 rounded-2xl transform transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/5"
            >
              <div className="relative w-full aspect-[2/3] overflow-hidden">
                <Image
                  src={dress.image}
                  alt={dress.name}
                  fill
                  className="object-cover transition-all duration-[2.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 28vw"
                />
                
                {dress.tag && (
                  <div className="absolute top-6 left-6 z-20">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm border border-white/10 transition-transform duration-500 group-hover:-translate-y-1">
                      {dress.tag}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                
                <div className="absolute bottom-0 left-0 w-full p-10 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-20">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 mb-4 flex items-center gap-3">
                      Look 0{index + 1}
                      <span className="w-8 h-[1px] bg-neutral-500"></span>
                    </p>
                    <h3 className="font-serif text-4xl text-white mb-4 leading-tight">{dress.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="font-light text-white/80 tracking-widest text-xl">₹{dress.price.toLocaleString()}</p>
                      <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-x-4 group-hover:translate-x-0 group-hover:bg-white text-white group-hover:text-black">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
          {/* Spacer for final item */}
          <div className="w-[10vw] flex-shrink-0" />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
