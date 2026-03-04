interface CasualSectionProps {
  image: string;
}

export default function CasualSection({ image }: CasualSectionProps) {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-[#4A2C2A]">
      <div className="absolute inset-0 z-0">
        <img
          alt="Eightplux Casual collection"
          className="w-full h-full object-contain object-center brightness-[0.7]"
          src={image}
        />
      </div>
      <div className="absolute inset-0 z-[1] opacity-40 mix-blend-multiply bg-amber-900" />
      <div className="relative z-10 text-center px-4">
        <div className="mb-6">
          <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 text-[10px] uppercase tracking-widest">
            Eightplux Casual
          </span>
        </div>
        <h2 className="text-4xl md:text-7xl font-light text-white mb-10 font-tt">
          dress easy, live <span className="text-[#C72f32] font-bold">bold</span>
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-xs sm:max-w-none mx-auto">
          <button className="bg-white text-black px-10 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#C72f32] hover:text-white transition-all duration-300 w-full sm:w-40">
            explore
          </button>
          <button className="bg-white text-black px-10 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#C72f32] hover:text-white transition-all duration-300 w-full sm:w-40">
            watch
          </button>
        </div>
      </div>
    </section>
  );
}
