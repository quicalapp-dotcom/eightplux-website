interface WorldSectionProps {
  image: string;
}

export default function WorldSection({ image }: WorldSectionProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-gray-900">
      <div className="absolute inset-0 z-0">
        <img
          alt="Eightplux World – the collective"
          className="w-full h-full object-cover object-top brightness-[0.5]"
          src={image}
        />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="mb-6 flex justify-center">
          <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 text-[10px] uppercase tracking-widest">
            Eightplux World
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight mb-2">
          the <span className="text-[#FF0000] font-bold">stage</span> is yours
        </h2>
        <p className="text-2xl md:text-4xl font-light text-white mb-10">
          tag us to be featured in the collective
        </p>
        <div className="flex justify-center">
          <button className="bg-white/50 backdrop-blur-sm border border-white text-white px-12 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF0000] hover:border-[#FF0000] transition-all duration-300">
            explore
          </button>
        </div>
      </div>
    </section>
  );
}
