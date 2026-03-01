interface StageSectionProps {
  image: string;
}

export default function StageSection({ image }: StageSectionProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-end justify-center pb-20 bg-gray-800">
      <div className="absolute inset-0 z-0">
        <img
          alt="Eightplux stage"
          className="w-full h-full object-cover object-center brightness-[0.6]"
          src={image}
        />
      </div>
      <div className="relative z-10 text-center px-4 w-full">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight mb-8">
          the <span className="text-[#FF0000] font-bold">stage</span> is yours
        </h2>
        <div className="flex justify-center">
          <button className="bg-white/50 backdrop-blur-sm border border-white text-white px-12 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF0000] hover:border-[#FF0000] transition-all duration-300">
            explore
          </button>
        </div>
      </div>
    </section>
  );
}
