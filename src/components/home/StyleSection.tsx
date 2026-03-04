interface StyleCard {
  src: string;
  label: string;
}

interface StyleSectionProps {
  cards: StyleCard[];
}

export default function StyleSection({ cards }: StyleSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex flex-row justify-between items-center mb-16 border-b border-gray-200 pb-8 overflow-hidden">
          <div className="flex-shrink-0">
            <span className="bg-gray-100 text-gray-800 px-3 md:px-4 py-1.5 md:py-2 text-[8px] md:text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
              Eightplux Style
            </span>
          </div>
          <h2 className="text-sm md:text-5xl lg:text-7xl font-light text-right text-black font-tt lowercase ml-4 leading-tight">
            every look is a <span className="font-bold text-[#C72f32]">statement</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ src, label }) => (
            <div key={src} className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
              <img
                alt={label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={src}
              />
              <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
                <span className="bg-white/20 backdrop-blur-md text-black px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-white/20">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
