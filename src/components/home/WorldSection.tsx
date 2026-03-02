interface WorldSectionProps {
  image: string;
}

export default function WorldSection({ image }: WorldSectionProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-gray-900">
      <div className="absolute inset-0 z-0">
        <img
          alt="Eightplux World – the collective"
          className="w-full h-full object-cover object-center brightness-[0.5]"
          src={image}
        />
      </div>
      <div className="relative z-10 text-center px-4 max-w-5xl font-tt">
        <div className="mb-8 flex justify-center">
          <span className="border border-white/40 text-white/90 px-3 py-1 text-[9px] uppercase tracking-[0.3em] backdrop-blur-sm">
            Eightplux World
          </span>
        </div>
        
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-thin text-white leading-tight mb-4 tracking-tight">
          the <span className="text-[#C72f32] font-medium">Stage</span> is yours
        </h2>
        
        <p className="text-[10px] md:text-sm font-light text-white/80 mb-12 tracking-[0.2em] lowercase">
          tag us to be featured in the collective
        </p>
        
        <div className="flex justify-center w-full max-w-xs sm:max-w-none mx-auto">
          <button className="bg-white/30 backdrop-blur-md border border-white/20 text-white px-16 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500 w-full sm:w-auto">
            explore
          </button>
        </div>
      </div>
    </section>
  );
}
