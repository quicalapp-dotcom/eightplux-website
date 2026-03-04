interface StageSectionProps {
  image: string;
}

export default function StageSection({ image }: StageSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#1a1a1a]">
      <img
        alt="Eightplux stage"
        className="w-full h-auto block brightness-[0.5]"
        src={image}
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4 font-tt">
        <h2 className="text-white text-5xl md:text-8xl lg:text-[100px] font-thin tracking-tighter leading-[0.85] mb-12 flex flex-col items-center">
          <span className="flex items-center gap-2 md:gap-4">
            <span className="text-[#C72f32] font-black italic">Define</span>
            <span className="lowercase">your</span>
          </span>
          <span className="lowercase">statement</span>
        </h2>
        
        <div className="flex justify-center">
          <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-3 text-[11px] lowercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">
            explore
          </button>
        </div>
      </div>
    </section>
  );
}
