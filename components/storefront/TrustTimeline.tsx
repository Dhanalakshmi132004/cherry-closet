import React from 'react';

const notes = [
  {
    id: '01',
    title: 'Testimonials',
    description: 'The only way to attract new clients, is to show your experience with the previous ones. Include: real photo, position at company, links their profiles',
    color: 'bg-orange-50',
    pinColor: 'bg-orange-500',
    pinShadow: 'shadow-orange-500/50',
    rotation: '-rotate-3',
    align: 'self-start lg:-ml-12',
  },
  {
    id: '02',
    title: 'Trust Badges',
    description: 'Show all the achievements you have. Awards, certificates, payment protections, etc.',
    color: 'bg-blue-50',
    pinColor: 'bg-blue-600',
    pinShadow: 'shadow-blue-600/50',
    rotation: 'rotate-3',
    align: 'self-end lg:-mr-12 mt-12 lg:-mt-16',
  },
  {
    id: '03',
    title: 'Add Contacts',
    description: 'People need to understand that if something will happen, they can always reach out to you. Leave links to your social media, your email and the phone',
    color: 'bg-purple-50',
    pinColor: 'bg-purple-600',
    pinShadow: 'shadow-purple-600/50',
    rotation: '-rotate-2',
    align: 'self-start lg:ml-12 mt-12 lg:-mt-16',
  },
  {
    id: '04',
    title: 'Case Studies',
    description: 'Share detailed examples of how your product or service solved real problems. This helps visitors imagine their own success.',
    color: 'bg-orange-50', // Peach color similar to the image
    pinColor: 'bg-orange-600',
    pinShadow: 'shadow-orange-600/50',
    rotation: 'rotate-2',
    align: 'self-end lg:-mr-24 mt-12 lg:-mt-16',
  }
];

export default function TrustTimeline() {
  return (
    <section className="relative py-24 w-full bg-[#fcfcfc] overflow-hidden">
      {/* Notebook Background Lines */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #ccc 39px, #ccc 40px)' }}
      />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-700 tracking-tight">
            How to Build Trust on<br/>Your Website
          </h2>
        </div>

        <div className="relative flex flex-col max-w-3xl mx-auto">
          
          {/* Dashed SVG path weaving through the items */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
             <svg width="100%" height="100%" preserveAspectRatio="none" className="opacity-20 text-gray-500">
               <path 
                  d="M 150 100 C 300 200, 500 150, 600 300 C 550 450, 200 400, 250 550 C 300 700, 600 650, 550 800" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeDasharray="6 6" 
                  fill="none" 
               />
             </svg>
          </div>

          {notes.map((note, idx) => (
            <div 
              key={note.id} 
              className={`relative z-10 w-full md:w-[400px] ${note.align} transition-transform duration-500 hover:scale-105 hover:z-20`}
            >
              <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-2 ${note.rotation}`}>
                <div className={`${note.color} rounded-xl p-8 pt-10 h-full relative`}>
                  
                  {/* Push Pin */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full ${note.pinColor} shadow-lg ${note.pinShadow} relative z-10 border border-white/20`} 
                         style={{ boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.3), 2px 4px 8px rgba(0,0,0,0.4)' }}/>
                    <div className="w-1.5 h-3 bg-gray-400 opacity-80 -mt-1 rounded-b-sm shadow-sm z-0"/>
                  </div>

                  <span className={`text-xl font-handwriting ${note.pinColor.replace('bg-', 'text-')} mb-2 block font-medium italic opacity-80`}>
                    {note.id}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {note.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
