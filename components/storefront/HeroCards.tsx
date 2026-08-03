'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Heart, Leaf, Sparkles, BookOpen } from 'lucide-react';

const CARDS = [
  {
    id: 1,
    image: '/banner.png',
    title: 'Premium Quality',
    subtitle: '100% Organic Yarn',
    icon: ShieldCheck,
    bgColor: 'bg-brand-blue-600',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80',
    title: 'Trending Handmades',
    subtitle: 'Popular Creations',
    icon: Heart,
    bgColor: 'bg-rose-500',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    title: 'Gentle Touches',
    subtitle: 'Baby Collection',
    icon: Leaf,
    bgColor: 'bg-emerald-500',
  },
  {
    id: 4,
    image: '/flower-crochet-hero.png',
    title: 'Everlasting Bloom',
    subtitle: 'Flower Crochet',
    icon: Sparkles,
    bgColor: 'bg-amber-500',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    title: 'Curated Library',
    subtitle: 'Premium Books',
    icon: BookOpen,
    bgColor: 'bg-indigo-500',
  },
];

export default function HeroCards() {
  const [cards, setCards] = useState(CARDS);

  const rotateCards = () => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const firstCard = newCards.shift();
      if (firstCard) newCards.push(firstCard);
      return newCards;
    });
  };

  return (
    <div 
      className="relative z-20 animate-float-delayed mt-20 sm:mt-10 cursor-pointer w-[300px] h-[550px] sm:w-[350px] sm:h-[650px] mx-auto perspective-[1000px]"
      onClick={rotateCards}
    >
      {cards.map((card, index) => {
        // Calculate stacking effects
        const isTop = index === 0;
        const rotate = -5 + (index * 2); // -5, -3, -1, 1, 3
        const translateY = index * 10;
        const scale = 1 - (index * 0.05);
        const zIndex = cards.length - index;
        const opacity = 1 - (index * 0.15);

        return (
          <div
            key={card.id}
            className={`absolute top-0 left-0 w-full h-full rounded-[48px] border-8 border-brand-white shadow-premium bg-brand-white overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isTop ? 'hover:rotate-0 hover:translate-y-[-10px]' : ''}`}
            style={{
              transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
              zIndex: zIndex,
              opacity: opacity,
            }}
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              priority={isTop}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-900/50 via-transparent to-transparent pointer-events-none" />

            {/* Internal Floating UI Element mimicking mobile notification */}
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] bg-brand-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg flex items-center gap-3 transition-opacity duration-300 ${isTop ? 'opacity-100' : 'opacity-0'}`}>
              <div className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center text-brand-white flex-shrink-0`}>
                {React.createElement(card.icon, { size: 20 })}
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-dark">{card.title}</h4>
                <p className="text-[10px] text-brand-muted">{card.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
