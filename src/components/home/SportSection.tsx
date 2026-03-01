interface SportSectionProps {
  image: string;
}

export default function SportSection({ image }: SportSectionProps) {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-black">
      <div className="absolute inset-0 z-0">
        <img
          alt="Eightplux Sport collection"
          className="w-full h-full object-cover object-center brightness-[0.6]"
          src={image}
        />
      </div>
      <div className="relative z-10 text-center px-4">
        <div className="mb-6">
          <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 text-[10px] uppercase tracking-widest">
            Eightplux Sport
          </span>
        </div>
        <h2 className="text-4xl md:text-7xl font-light text-white mb-10">
          play <span className="text-[#FF0000] font-bold">beyond</span> limit
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="bg-white text-black px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF0000] hover:text-white transition-all duration-300 w-40">
            explore
          </button>
          <button className="bg-white text-black px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF0000] hover:text-white transition-all duration-300 w-40">
            watch
          </button>
        </div>
      </div>
    </section>
  );
}
