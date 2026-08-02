import React from 'react';
import DollFitCheck from '@/components/womens/DollFitCheck';

export const metadata = {
  title: "Women's Chudidhars - Premium Collection",
  description: "Shop our latest collection of 10 stunning chudidhars. Try them on with our interactive virtual fit check.",
};

export default function ChudidharsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-pink-50 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 tracking-tight">
            The Chudidhar <span className="text-pink-600 italic">Collection</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            Experience our exclusive selection of beautifully crafted chudidhars. Use our virtual doll to see how they look before you buy.
          </p>
        </div>
      </div>

      {/* Main Interactive Section */}
      <DollFitCheck />
    </div>
  );
}
