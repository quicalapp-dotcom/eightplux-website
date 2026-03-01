'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Add custom scrollbar styles
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #1a1a1a;
      }
      ::-webkit-scrollbar-thumb {
        background: #333; 
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #FF0000; 
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <main className="bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white font-sans antialiased selection:bg-[#FF0000] selection:text-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Basketball players on court" 
            className="w-full h-full object-cover object-top brightness-[0.7]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj1ESDZ-JF3rw5qbB2p8jyXk7git6JL8umWUssktwclwOQtWyNWmJ-EYf3v5AyVXoPeng8_mmfqZCTU7Z04v1PdNhUrdsqNRD_ZnTSG5Okmn0HFnhS6JA3xoh8TR9o1i1TlC67Qhr3qAVamJ2JViRnlrjqLPyxH4EgPbqyVgLWkwUxNhRYn_hgT5vF408IX20E8FYr44OOSNwvWvAWTcYcMhaj85V-3M_JrpzoF7uPx-3rxnepcjRcMhOwbsTuCQRTxP6a8qJ9Pwk"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto mt-16">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-light text-white leading-tight tracking-tight mb-2">
            yOu've been <span className="text-[#FF0000] font-bold">grounded</span><br/>
            long enough
          </h1>
          <div className="relative mb-12">
            <h2 className="font-[Dancing_Script] text-6xl md:text-8xl text-[#FF0000] transform -rotate-6 opacity-90 inline-block drop-shadow-lg">Let it Fly</h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            <button className="bg-white text-black px-12 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF0000] hover:text-white transition-all duration-300 min-w-[160px]">
              shop xx
            </button>
            <button className="bg-white text-black px-12 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF0000] hover:text-white transition-all duration-300 min-w-[160px]">
              shop xy
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          <div className="w-3 h-3 bg-white rounded-full cursor-pointer"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full cursor-pointer hover:bg-white transition-colors"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full cursor-pointer hover:bg-white transition-colors"></div>
        </div>
      </section>

      {/* Sport Section */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Close up of black shirt fashion" 
            className="w-full h-full object-cover object-center brightness-[0.6]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0KAqIYuM4Og0hVJ3bOrrR86WXmdfsL-TeIJCJaXO342xH-KxgFphN6xUZ9STsoner90IzLMyHqhNcxM2Jai-qDmXTRhO5DzKCVx0FRe6i3tI6SEP5lD6HTsHt1ieZ_TWYYPVYlW_GpT6oDyAiHDPLlzrlm942cGGVQefTQ0I9UK9rVJVUlv2a6AOXMelq7dHz4TEdPpd7PUJoCuwCzzgY_OuvsKmEVdkBpqsn-jgMwZ1FkwQ4lpSZL9_Yshnwb29iNmWsoHsGlw8"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="mb-6">
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 text-[10px] uppercase tracking-widest">Eightplux Sport</span>
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

      {/* Casual Section */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-[#4A2C2A]">
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-multiply bg-amber-900"></div>
        <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>
        <div className="relative z-10 text-center px-4">
          <div className="mb-6">
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 text-[10px] uppercase tracking-widest">Eightplux Casual</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-light text-white mb-10">
            dress easy live <span className="text-[#FF0000] font-bold">bold</span>
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

      {/* Style Section */}
      <section className="py-20 bg-white dark:bg-[#0A0A0A]">
        <div className="max-w-[1920px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-gray-200 dark:border-gray-800 pb-8">
            <div className="mb-4 md:mb-0">
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 text-[10px] uppercase tracking-widest font-bold">Eightplux Style</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-light text-right w-full md:w-auto dark:text-white">
              every look is a <span className="font-bold">statement</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
              <img 
                alt="Model in white top" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJjCf9YfJjh_rfyfLmYRM5W2aB4JmFUjrX7IOh1nygY1cuM7P1L8NX-HkcgCEt2ysmrYeqy955O5PK_mMOQR48jxn89PCEpojDZjLc617UI3xUpJAcFF89nSodZtk39ZHk6aH_6ZQc2ozr76LCJT8OEb51kRYgxAnWwvcEAA9MrDg_vIOybDzc6xHpM_XoDmT3dyIw3dudxTtIqCMPTamtYYOYNelPN03Sv-lL2ejiNGujQHXUajdiPUJ1x42ytc5gehu0WEF6Lkk"
              />
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/80 backdrop-blur text-black px-6 py-2 text-[10px] uppercase tracking-widest font-bold">Jesus top</span>
              </div>
            </div>
            <div className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
              <img 
                alt="Model in printed top" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3QzsI0Wn7ltCoDbcUj47r-eNvkPPGP1FACDQQsaFjuKUBf6yJBHgDMDtDJIN680eEJUYElSPBMvK3Swn9X2ZYVvI52kl7spxvhfteDIMJnguroQToBllY4DhyHin-kRpbfHx26rwEnqaHylkDJkVgEOihqv-uPR6UXa9kcuN20tuHRKyEw-eQ0KKWNpNt3Z6ozwlplL_-oLFruDzHc86qupXkz9-ARtJg_non68k6mjICwxWx3o6mVa1keaQSGkI0pA1T0rNoCtU"
              />
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/80 backdrop-blur text-black px-6 py-2 text-[10px] uppercase tracking-widest font-bold">Jesus top</span>
              </div>
            </div>
            <div className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
              <img 
                alt="Model in crop top" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApg8sfZTT5Iig_UIqPagZOzIztxsJIsFqguPf4i_XGvMJCoSkRJCIVZWk_XUw424koIZGWdYhUGVb3UpCkMj-Vj6yHComcNeXz_VQOKMr-Rpep7kuhZRJfSVdepVCkYB2jJHf-BqpX793NYEu_0zCpZKe_sNbgLJmWc1HtY04GsjIuKs1Im-4v5uQ03DfjuvK3nb6bWzeX_L0Wrzgm18N7cbhRrZSJoMA7jnjrs-4KgJsxHcGSZZWBCALuG4ygl7ytWYmiXunMKtI"
              />
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/80 backdrop-blur text-black px-6 py-2 text-[10px] uppercase tracking-widest font-bold">crop top</span>
              </div>
            </div>
            <div className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
              <img 
                alt="Model in tank top" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmqOuzq10aWUQgfNXpu9qGDUvUey21HmjVKREPC8QoNdWNv9oFvj6rZHeOL8DoDugklv9UP4OLAIfDYuipuTVRWRAkeRTzziSsCP5hYMndfbRuHS4VndcRTpbLoJKYcOk7SXoKDyJed8nVdv7f9JpkXqWkL_VyMNFKki1xX7zMRg4arUPtfc3JWlPhtRSBZ5LLgMS4gk0wHM1levWxw_MnLYO4YPugoZsG81BqWUfUvdZvVM68PPdmVYyEWYgy916yX_6ZPXm70Dg"
              />
              <div className="absolute bottom-6 left-6">
                <span className="bg-white/80 backdrop-blur text-black px-6 py-2 text-[10px] uppercase tracking-widest font-bold">tank top</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* World Section */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Urban group shot" 
            className="w-full h-full object-cover object-top brightness-[0.5]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo2kHuC-sRoRuTFWjnRA0QEiIdCWi9kqc6EF1gtAfE8Yi2F9Be4emg4byl6lf5g0lIIU6791fCFf4hP7T_ZMvK9rXBiDWseDGOuCzmeW80jLjibZbQ82a1VlhQnaIENhqMysY1SltpXWUTNd2pQXLf-6E90tDOPuUgwpxWIv0GRBGXa207Lgl1nFC551PG8uM0bKYpCuAAFWJr3jpmD7dplKvbuV3TgX8zD4SSnFDLdEZpstyvQyVgS38PyP863XgDeuExh1SWO3k"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="mb-6 flex justify-center">
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 text-[10px] uppercase tracking-widest">Eightplux World</span>
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

      {/* Stage Section */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-end justify-center pb-20 bg-gray-800">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Models with car" 
            className="w-full h-full object-cover object-center brightness-[0.6]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARxsYUGfzpgGD3NqMVTOhViOIrsnBKO-P8rNUqRS-bxqUpS8z60Tu5rpomxWQWVuGwaSXrAgKeX3HYFhU46rR6DoWcIYddJvbIs0rtR6Zki0wm_l_5nM9Z5uHBE2HcJrK76qcNPQKDv5S87ftc7OWo0bcH01Z6CnoOmFuxM_vIxrA4NLZEUupGkdTV2e4u1iMcu4De99no7I0SyJFx65_4SIjq13F9NzQHi34Tqq1IIuZ3aV0wixjW3snreTcPCGwvK3JhTDlzVTA"
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
    </main>
  );
}