interface StageSectionProps {
  image: string;
}

export default function StageSection({ image }: StageSectionProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-gray-800">
      <div className="absolute inset-0 z-0 text-center">
        <img
          alt="Eightplux stage"
          className="w-full h-full object-cover object-center brightness-[0.5]"
          src={image}
        />
      </div>
      <div className="relative z-10 text-center px-4 w-full">
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.85] mb-12 font-tt flex flex-col items-center tracking-tighter">
          <span className="lowercase drop-shadow-md">
            <span className="text-[#C72f32] font-black">Define</span>
          </span>
          <span className="lowercase text-white/90">your statement</span>
        </h2>
        <div className="flex justify-center w-full max-w-xs sm:max-w-none mx-auto">
          <button className="bg-white/30 backdrop-blur-md border border-white/20 text-white px-16 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500 w-full sm:w-auto">
            explore
          </button>
        </div>
      </div>
    </section>
  );
}
