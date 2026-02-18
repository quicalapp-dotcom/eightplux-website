export default function Newsletter() {
  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor: '#d4d4d4' }}>
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tight" style={{ color: '#0d0d0d' }}>
          JOIN THE <span style={{ color: '#cf3434' }}>EIGHTPLU+</span> TRIBE
        </h2>
        <p className="text-sm md:text-base font-medium mb-12" style={{ color: '#4d4d4d' }}>
          Subscribe to get notified about new products and personal offers.
        </p>
        
        <form className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch border-2 border-[#0d0d0d] p-1 bg-transparent">
            <input
              type="email"
              placeholder="Your email..."
              className="flex-grow bg-transparent px-6 py-4 focus:outline-none text-[#0d0d0d] font-medium placeholder-[#4d4d4d]/60"
            />
            <button
              type="submit"
              className="bg-[#0d0d0d] text-white px-15 py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#333] transition-colors"
            >
              SUBSCRIBE
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
