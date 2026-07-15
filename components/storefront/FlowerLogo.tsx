import React from 'react';
import Image from 'next/image';

interface FlowerLogoProps {
  className?: string;
}

export default function FlowerLogo({ className }: FlowerLogoProps) {
  return (
    <div className={`relative ${className} overflow-hidden`}>
      <Image
        src="/logo.png"
        alt="the SHA closet flower logo"
        fill
        className="object-contain transition-transform duration-300 group-hover:scale-110"
        priority
      />
    </div>
  );
}
