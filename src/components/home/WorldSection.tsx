interface WorldSectionProps {
  image: string;
}

export default function WorldSection({ image }: WorldSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      <img
        alt="Eightplux World – the collective"
        className="w-full h-auto block opacity-50"
        src={image}
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto font-tt">
        <h2 className="text-white text-5xl md:text-8xl lg:text-[100px] font-thin tracking-tighter leading-[0.85] mb-4 flex flex-col items-center">
          <span className="flex items-center gap-2 md:gap-4">
            <span className="lowercase">the</span>
            <span className="text-[#C72f32] font-black italic">Stage</span>
          </span>
          <span className="lowercase">is yours</span>
        </h2>
        
        <p className="text-[10px] md:text-sm font-light text-white/80 mb-12 tracking-[0.2em] lowercase">
          tag us to be featured in the collective
        </p>
        
        <div className="flex justify-center mt-4">
          <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-3 text-[11px] lowercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">
            explore
          </button>
        </div>
      </div>
    </section>
  );
}
