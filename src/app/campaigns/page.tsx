'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowUpRight, Plus } from 'lucide-react';

const campaigns = [
    {
        id: 'void',
        title: 'The Void',
        season: 'Spring 2025',
        type: 'Main Campaign',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Ot2c9vv5-mlJg9eapl412CP3uc1hDlHsDk4iUZZFD1pskjJVXTBP6Pr_hvlhIonNV1Lkgna5xDhGnXv3mj6hP-nZJDkzXS3cWtB3eFUbROxCJXt744Dt7K2-QWGjxaeWd7se0fBjZF-OPm7moUbEqKCQy_m957iaf4Z12mWkIPxioQoVvt4uOQZtuk7pgmBUYYSF1mevinOAGl9x7zBF_fUgVGnEYBJhdsbfqjG_nsuVFFOMKD-hAmIY00eZlW4QgzJNVYedfGfz',
        featured: true,
        span: 'col-span-8 row-span-2',
    },
    {
        id: 'street-statement',
        title: 'Street Statement',
        season: 'Winter 24',
        type: 'Editorial',
        video: 'https://videos.pexels.com/video-files/3752636/3752636-hd_1080_1920_24fps.mp4',
        isVideo: true,
        span: 'col-span-4 row-span-2',
    },
    {
        id: 'studio',
        title: 'Studio',
        season: 'Fall 24 Sessions',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArdfgsNIMQMstJ0ysu6C0rVRpYRrwMkx-6YicV9P_Rc4k14KjpvQylNHxYJIMPfvszdg4s1ELWqLmWJVcyv2sDtWLvZLgB9sbEntPDjTmaw60sFSlqkIcJ044MXHGBoRkgcbrJuTJN6aIS0jSLW07_aRI51pmLKPeSHi9IWEQ5EjtwLGaJVhGnYaBItypAETA6DMiBvGP95_8U6WXgaAxReyxnw9vatAYAlXaSRdHtwGsOJlQkGWAIF5nxPkvvaOVCHYOGNEw5ySJL',
        span: 'col-span-4',
    },
    {
        id: 'leather-works',
        title: 'LeatherWorks',
        season: 'Fall 24',
        video: 'https://videos.pexels.com/video-files/3205634/3205634-hd_1920_1080_25fps.mp4',
        isVideo: true,
        span: 'col-span-8',
    },
    {
        id: 'raw-knit',
        title: 'Raw Knit',
        season: 'Pre-Fall 24',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNeyDlUVN6w-FKkFf-2zfd-6-LuBw3hDphS9Jye5bUQsP0puwsWV56Xu2dyeeGo2nKpW2Qbt3hMVLd2tG_VNEb9xvelpPtBEOo412-vn-dgYM4tNtGcyQKnGIZTxIiCNHqq6PAwRlX9Yp80cyy1pHGiMzeVKGIxEJHkEGwnpY7AILbfBBb3LUnf-9nfXP540V8AzP0655BRWltZPR6bit3rc1l6AOFKCHU7aaPkxKE9C8VMzD-YyNATgdmnw1ViWbbEsIaVPF98wZf',
        span: 'col-span-3 row-span-2',
    },
    {
        id: 'intentionality',
        title: 'Intentionality',
        season: 'Editorial Exclusive',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyZlC9BvXQOC0fXsdORuBsOosfqGKQkRGJwU4739Gryc4Mbv3GGyulPtr8TvXu1ncep1G-pSj9XMPwq1d2-_u3drJyZiIYIosY5h-N4TAqNBbIYIGXmlyBGjkcVeFN0Fg_nftkxsshtR6bssd8GQkQwKAIri00LtT13W9OLKqQpBTKbhcGyA8g9w2EEoj1DYrBe3sgJ3yw2riXATCnitBBxTjM0As_3FK5AbY5UuLLpR19ZamN0emnW1FNY-TRKY8g0qiHHVKdPm9D',
        span: 'col-span-9',
    },
];

const miniCampaigns = [
    {
        id: 'womens-core',
        title: "Women's Core",
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyZlC9BvXQOC0fXsdORuBsOosfqGKQkRGJwU4739Gryc4Mbv3GGyulPtr8TvXu1ncep1G-pSj9XMPwq1d2-_u3drJyZiIYIosY5h-N4TAqNBbIYIGXmlyBGjkcVeFN0Fg_nftkxsshtR6bssd8GQkQwKAIri00LtT13W9OLKqQpBTKbhcGyA8g9w2EEoj1DYrBe3sgJ3yw2riXATCnitBBxTjM0As_3FK5AbY5UuLLpR19ZamN0emnW1FNY-TRKY8g0qiHHVKdPm9D',
    },
    {
        id: 'mens-seasonal',
        title: "Men's Seasonal",
        video: 'https://videos.pexels.com/video-files/5532857/5532857-hd_1080_1920_25fps.mp4',
        isVideo: true,
    },
    {
        id: 'nocturne',
        title: 'Nocturne',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTtHbdm_uh4PzaWhffvpZfH6T4OlMtLtiZLI9nkSZowQ4PN0KqqEDFTugGiWDWmFv0q2ckQQ39RJ01_o0Bk3UinM2fC0VeBSp64oGl0YMdblfZkTa8AQuHVo_p8-q4v60zF8qBvXnc5GHiul-ojGqeMd93h4dF0pYrmbOJ7ZYoUX5MZmOTg5FMnxuCP5oyiSiBRRCQMDiffRAL_tAMEMJR7PXQujRX3knaDXwKUy4NHz8MQmURl-jfFN5evwFUyaKx0tTiK5adRpFW',
        wide: true,
    },
];

export default function CampaignsPage() {
    return (
        <div className="bg-[#050505] text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                    >
                        <source src="https://videos.pexels.com/video-files/5804368/5804368-hd_1920_1080_25fps.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
                    <h1 className="text-6xl md:text-9xl font-display font-bold text-white uppercase tracking-tighter mb-4 mix-blend-difference leading-[0.8]">
                        Visual<br /><span className="italic font-light">Archive</span>
                    </h1>
                    <p className="text-gray-300 text-sm md:text-lg max-w-lg mx-auto font-light tracking-wider mt-6">
                        Explore the avant-garde narrative of Eightplux through high-energy seasonal campaigns and editorial motion.
                    </p>

                    <div className="mt-12 flex justify-center space-x-12 text-xs uppercase tracking-[0.2em] font-bold">
                        <button className="relative pb-2 border-b-2 border-white text-white transition-all">
                            Current Season
                        </button>
                        <button className="relative pb-2 text-gray-500 hover:text-white transition-all">
                            Legacy Archive
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
                    <span className="text-[10px] uppercase tracking-[0.3em] mb-2 opacity-70">Scroll</span>
                    <span className="material-symbols-outlined text-sm">↓</span>
                </div>
            </section>

            {/* Campaign Grid */}
            <section className="px-4 md:px-8 pb-32 w-full max-w-[2100px] mx-auto -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-2 md:gap-4 auto-rows-[minmax(200px,auto)]">
                    {/* The Void - Main Campaign */}
                    <article className="group relative md:col-span-6 lg:col-span-8 md:row-span-2 aspect-[4/3] overflow-hidden bg-[#111] cursor-pointer">
                        <Image
                            src={campaigns[0].image!}
                            alt={campaigns[0].title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                            <div className="relative">
                                <h2 className="text-5xl md:text-8xl font-display font-black text-white leading-none tracking-tighter mix-blend-overlay opacity-50 absolute -top-12 -left-4 select-none pointer-events-none">
                                    VOID
                                </h2>
                                <h2 className="text-4xl md:text-7xl font-display text-white mb-2 tracking-wide relative z-10">
                                    The Void
                                </h2>
                                <div className="flex items-center space-x-4 mb-6">
                                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-white/10 px-2 py-1 backdrop-blur-sm">
                                        Spring 2025
                                    </span>
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">
                                        Main Campaign
                                    </span>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 transition-all bg-white text-black px-10 py-4 text-sm uppercase tracking-widest font-bold hover:bg-gray-200 translate-y-4 group-hover:translate-y-0 duration-300">
                                    Explore Campaign
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Street Statement - Video */}
                    <article className="group relative md:col-span-3 lg:col-span-4 md:row-span-2 aspect-[9/16] md:aspect-auto overflow-hidden bg-[#111] cursor-pointer">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-700"
                        >
                            <source src="https://videos.pexels.com/video-files/3752636/3752636-hd_1080_1920_24fps.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-b from-transparent via-transparent to-black/90">
                            <div className="self-end">
                                <Play className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                            </div>
                            <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                                <h2 className="text-3xl font-display italic text-white mb-1 leading-none">
                                    Street<br />Statement
                                </h2>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4 border-l-2 border-white pl-2 mt-2">
                                    Winter 24
                                </span>
                                <button className="opacity-0 group-hover:opacity-100 transition-all border border-white/50 text-white px-6 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black hover:border-white translate-y-4 group-hover:translate-y-0 duration-300">
                                    Watch Film
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Studio - Square */}
                    <article className="group relative md:col-span-3 lg:col-span-4 aspect-square overflow-hidden bg-[#111] cursor-pointer">
                        <Image
                            src={campaigns[2].image!}
                            alt={campaigns[2].title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                            <h2 className="text-3xl md:text-5xl font-display text-white tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150 group-hover:scale-100 transform origin-center">
                                Studio
                            </h2>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/80 backdrop-blur-md">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-display text-white">Fall 24 Sessions</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </div>
                    </article>

                    {/* LeatherWorks - Wide Video */}
                    <article className="group relative md:col-span-6 lg:col-span-8 aspect-[16/7] overflow-hidden bg-[#111] cursor-pointer">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                        >
                            <source src="https://videos.pexels.com/video-files/3205634/3205634-hd_1920_1080_25fps.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full pointer-events-none mix-blend-difference z-10">
                            <h2 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tight uppercase group-hover:tracking-widest transition-all duration-700">
                                Leather<span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>Works</span>
                            </h2>
                        </div>
                        <div className="absolute bottom-6 right-6">
                            <button className="opacity-0 group-hover:opacity-100 transition-all bg-white text-black rounded-full p-4 hover:scale-110 translate-y-4 group-hover:translate-y-0 duration-300">
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </div>
                    </article>

                    {/* Raw Knit - Tall */}
                    <article className="group relative md:col-span-3 lg:col-span-3 row-span-2 aspect-[3/5] overflow-hidden bg-[#111] cursor-pointer">
                        <Image
                            src={campaigns[4].image!}
                            alt={campaigns[4].title}
                            fill
                            className="object-cover opacity-90 group-hover:opacity-60 grayscale transition-all duration-500"
                        />
                        <div className="absolute top-0 left-0 w-full h-full p-6 flex flex-col items-start justify-between border border-white/10 group-hover:border-white/50 transition-colors m-0">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest -rotate-90 origin-top-left translate-y-24 -translate-x-2">
                                Pre-Fall 24
                            </span>
                            <div className="w-full text-right">
                                <h2 className="text-4xl font-display text-white mb-1">Raw Knit</h2>
                            </div>
                        </div>
                    </article>

                    {/* Intentionality - Wide */}
                    <article className="group relative md:col-span-6 lg:col-span-9 aspect-[21/9] overflow-hidden bg-[#1a1a1a] cursor-pointer">
                        <Image
                            src={campaigns[5].image!}
                            alt={campaigns[5].title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-black/30 group-hover:bg-transparent transition-colors">
                            <div className="relative z-10 group-hover:scale-110 transition-transform duration-700">
                                <h2 className="text-5xl md:text-8xl font-display italic text-white mb-2 mix-blend-overlay">
                                    Intentionality
                                </h2>
                                <span className="text-xs font-bold text-white bg-black px-4 py-1 uppercase tracking-widest inline-block mb-6">
                                    Editorial Exclusive
                                </span>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-all absolute bottom-8 bg-white/90 backdrop-blur text-black px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-white translate-y-4 group-hover:translate-y-0 duration-300">
                                Read Story
                            </button>
                        </div>
                    </article>

                    {/* Mini Campaign Grid */}
                    <div className="md:col-span-6 lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-2">
                        {/* Women's Core */}
                        <article className="group relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] cursor-pointer">
                            <Image
                                src={miniCampaigns[0].image!}
                                alt={miniCampaigns[0].title}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-transparent to-transparent">
                                <h2 className="text-lg font-display text-white mb-0 leading-none">Women&apos;s Core</h2>
                            </div>
                        </article>

                        {/* Men's Seasonal - Video */}
                        <article className="group relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] cursor-pointer">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                            >
                                <source src="https://videos.pexels.com/video-files/5532857/5532857-hd_1080_1920_25fps.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-transparent to-transparent">
                                <h2 className="text-lg font-display text-white mb-0 leading-none">Men&apos;s Seasonal</h2>
                            </div>
                        </article>

                        {/* Nocturne - Wide */}
                        <article className="group relative col-span-2 aspect-[16/9] md:aspect-auto overflow-hidden bg-[#1a1a1a] cursor-pointer">
                            <Image
                                src={miniCampaigns[2].image!}
                                alt={miniCampaigns[2].title}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h2 className="text-4xl font-display text-white tracking-[0.5em] uppercase border-y border-white/30 py-4 w-full text-center hover:bg-white/10 transition-colors cursor-pointer">
                                    Nocturne
                                </h2>
                            </div>
                        </article>
                    </div>
                </div>

                {/* Load More */}
                <div className="flex justify-center mt-32 relative">
                    <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                    <button className="relative bg-[#050505] px-8 text-xs uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-white transition-colors z-10 flex items-center gap-2 group">
                        <Plus className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        Load Previous Seasons
                    </button>
                </div>
            </section>
        </div>
    );
}
