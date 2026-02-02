'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Heart } from 'lucide-react';

const topics = ['All Topics', 'Community', 'Editorial', 'Events', 'Fashion', 'Music'];

const stories = [
    {
        id: '1',
        title: 'Deconstructing the Silhouette',
        category: 'Style',
        type: 'Essay',
        excerpt: 'How the oversized trend is reshaping our perception of body and space in the post-modern era.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDe-PVvz9Incp6gsP3t_KHIKe2iJVW9lU8B9u2yQLfsNDInWrbxLDsXg5zdcwODVNCnlOv4AhNTKtp4ps6ckRwa6-TEDHhJGX0W4T8xG0mtlPqxWBnuLDWUmL9bTEt_ajTW9GJpF6txQCFs1apg7Da5bPGrG-aXAVFUgZ82PCkfhEG05vLHvSDifk86YpVikmAEAunfeVkOXu9fVK3yhgSyBvO3dkw36iq-2dApdjqFqMJyN8oWQ-D6YJaxxmn9LlGPoFFydh0DKcU',
        wide: true,
        aspect: 'aspect-[4/3]',
    },
    {
        id: '2',
        title: 'The Art of the Detail',
        category: 'Craftsmanship',
        excerpt: 'Why micro-details matter more than logos.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALFormqtBOrYylmde9NfMONHbHQ090wLooMCyq6ohk2JRwnRs1k7yfHLg0364YkPFfUvkxnI2AmgUcKxDAx6xNtTyIUpL2dlHxvuuXXNNTSxmLuWgo9-C3BJQ6xqhRlW9AEccfaBKkCusgiTE83cOMLkrEdvK6R_-6MJVsOWOAuiBxkNlYvb0m8Q4btCWmJNEWKwmL1mER6YJ265DH8fdg_bulyi-jRzdQ1SgNTIyCtqf-JXHo-FAeP7520fe3f3QhG7R1sga5Xw0S',
        aspect: 'aspect-[3/4]',
    },
    {
        id: '3',
        title: 'Backstage: The Paris Edit',
        category: 'Event',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBABS8AjVAc_vqkNxMgimtsWDMMC56I5yFOEfqM4kvaEoko7lXlyLwGuxwBD867_1ZUhBsh-sUqsGROIZt5QLRMj8jUgT8ywW7ZTaNMIJsiosKPmiR0ob2J00q4922KB8F8L7q7edTqPcVhm-iqPqCxi5Qwq6PWmhSvD4fa1knXdbNJyWYSkXgcqmv_5AQSmXffEkbC9JtDWG63Pyu7ckaZ941u4zMPSlTQ40WytAY3nF-f5lApAC0961F91TuRmmetSXUyM8KEnoVH',
        hasVideo: true,
        aspect: 'aspect-video',
    },
];

const materialStories = [
    { title: 'Material Focus: Raw Denim', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfqPoXQafLULd8Q6_Zix7Jd6Z-uGxMrMqg0qRrtGO23EZZxsXxUWtvfKoglsJcv26mZu5R1BEgn9VxXmy12W-mi7Bo82gERKkUXMB4X3OKgawEQL_7LMNQ7-KAcDWVRC2nkYIccd9s7idcdcwMt9Jd8MqttHYlmKAlHb4RRvOw9QLd_PXEM3l9Eg32jfg65ma1A-6yqOE943Wz0wBbz1BEaUlEfQjYbi4jYMKyryfC0ebwL9ZkT7YrI4lE2d3fEa6YqOxnBDqe4vtL' },
    { title: 'Nightlife: Lagos Underground', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtBIOtUjfdwXkPTVNMFmX07eToAYFGguUOQiIbKMUL3fk4s1CBkWLwXhTJpWZXorZx9vvP74dp_IDnCAH-VoTPtSQmgqTFXDb2sh06iH1E9CT6_BhgL3fJEs37LYc7J5RILKA3q6eT-MrGY4z0KHh9MUinDiUJYXrWOOme_sZGFaxQxDbweJYelGjWEpV_Z_bbWOFu6VEtY6SmI73wbK657W7mBnTIudoMPJaIz5OQAYyUzOec6drTMygXlRU6ynDbh_qDM2IBPy2T' },
    { title: 'Object of Desire: The 8+ Boot', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmMvNxWEFRMyeKJpEkyDt5iAYfuWvBJOD07heJxUy9pMxhixoylo9Hrg6aFVJgu651zsJJtI6Ix-w3NoPLN3P6fxbx8T3b2nbqH__KidFTVFUwXfg0nk3Vk_aElJk4ErSsM4fW3ZPCP8S6nFdbeZ3HdveNR72hjz-d0TdBN0nHGkEC1oRcBLgycfY2kqFMSxfr0hFsz6oZ3QQMa6mhGXd5oq4Ck9XZEKwAiCPEOJJ4LOOccqIjMScc2_SlEGY4lWWMwqYHL4oM2ahu' },
];

const communityPosts = [
    { user: '@fashion_killa', caption: 'Rocking the new seasonal fit. Love the texture.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhF1tiPIM-MjbZDlmtFlmOLc2nW2w9swhhIwfS-kN89sAZMPVsypEFbEAGtSfSnCIozS51uzX9TDR8-vzwj5aTZyqB6AzvTitqftILZ3Spi1zVV1_OKU_Hqr78pIIQbNaeN8-9eedG8W8S-uPWv4ALw9_VNmWXzPJbVaI41Fysfmifh4sR6qLug5tCWx5Unxk2ZZFHoZDBxnC6ziZ_wU-JSRxmPZWTic6JvW6lVLB7fHT6xcM-WDak3nWEVAIJdNvnWt18Z7gZ-Gnf' },
    { user: '@urban_nomad', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbdg9CNVOxgKvReciVfycB1WU1PK4ZyNUKj0ta8B5Wji4KCNm1VFJWyLIMPHJHaH-51Ps-c7H2TfQhpWpN0U6zOVIN5jhUyCouTc_5nBM9sztu7j7pmh3ROWL4rj6B90GqbsoKM2D89OAx0AnymvtKNTVvtd-281sUJ6xb2IOiD3zCIu47JmAO8_W9N-I5kfkk1CZNX0N43FbJ5sIhCacUK6uLP6wvFqLuxJhzhr79R7VxZ8kjCgZ-mNrzlWHaL1qrHOs4_ypsoygg' },
    { user: '@street_visions', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0QIGgMZSjzav0BxT0bHz1Si5hg6oX6tS_O-59cPjqaMH2DfRszW6Z96-xx2dy7ndRoAQbvsSKJmJ-nSzjA6G9cM8u8OGoAJpe-Oep6Sbs1nYCZ_XoznXwhBQh_5yVzis-wNIs63wCKvvtcR2lCv32w6V19Fkysf1J0PkzhYHGPS9TEJurGXTSd6XS-cwiPCSUNCK-G-22DP-vzRe84TZZnuleZ7abk0MkGkoIz9MQW7ChlWLrtIWiJu_FPqJg4ApoHGogQ1zpXnsJ' },
    { user: '@art_of_visage', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD04YeSJsqtI0ViDlNPg4PrZFAN-NmLQ3ailgh-R2GR6Z2GUUYGEPuIzxeYjLhKIsEzaFXY1_-Xg8NBLYKJKxJjMcTeiar3R9Pze2SheobQkl1L6Ox0cwzn-FWhzPXv7C-zTACqBf7pMqB0f69TQdu8kwv9UuxqRLfokDs-zxlHNXPVSZLspqTRowjY0wGqVe0beox1-0cCY9TSEYNBH41WJyKJ4woZSIHFbygK8-e9yPrSEr2fJT5nG6J8GQDertEJTGDfXQZIwV4E' },
    { user: '@minimal_style', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYEygY-f52_RbyobEuu4_TlNVXeXe__aCWyx68PZ6OwijuYkFRCoZbSXehBcFHWzw8exB9VyHSyq3KupZnsSX2sCQMquFHGIYwEyVAW9VlmS6EFSeoubCiYwYcEK8qtvCzQaikh2c1tqQxnmWy_m6l0c29KExgtpUDn0sx4TkSgnRuspcKh7ms8saOZdMQ_xmhwARUbWadzeHgU4lmohBnol8WdSRGu_1sH_hD9AiZ3nxsX1XHAnRToQdvSC8SwdimNGVVd5aPLGXz' },
    { user: '@josh_styles', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrjqrVihLArJnUiJWySzXcmwpjeoyKw353VL2rrL0-o87a6IoD_m8rpze3eQs8QS3fyjhupay7xyUea_K0EFQ5o9WLO_Amr6uYZF4lKGEk7ukHhBKuCXoWR2R2xqMR7oAz7fJVXh_Y-jUsBxAhaFcgcwChPTrflJks8A4LOezAlmyFE2HbWUCpWKgVt0pp7xCO486xyX-Dfy1ETq8s1_3wTrTFiy4bVTiUs9-wWaS83f8M0KSLS91CFMP6XOnvIjpHE6F37ngw3RNr' },
    { user: '@daily_kit', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAED83_vwHenQ9ZoHHAZARDW_mJUe-_ZEO8D3-l_v5rDVJr36Qge5l9_Ps3eimdP23rDkpsYsAqqDzUO46CEZT3kOV1LzgSgy9gg7qxGKBv_Sr_7Iw6C2LKDYRdNLqwNDGONxFQbiGSUcbLQR36-C8fC9VJzWXNje6OH_oT7VwwWBW0YdkPJrw-slQxRrtVsTJHPFF6PMXrH8-matLWIzmwjsVkImWO7wGZ9QWZO4hoRWZaahlfO7ansicdTGOkxYvP2Ket9f4ChT2I' },
];

export default function WorldPage() {
    return (
        <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-gray-100 min-h-screen">
            {/* Hero - Cover Story */}
            <header className="pt-32 pb-16 px-6 md:px-12 max-w-[1440px] mx-auto">
                <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden mb-8">
                    <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9MC4LDJsYHbQ4hFQeucy-zLK6KikD6ZJq0y0Rud_uUKK4YKjdUY0hScILElMKtwpZp5m-i2vyi6E8EJr6n18cksamNzSrqQY04JDb8K7IWIqHYFOZ3GJ2eqsFnTZwkh8wY8zzmXrrrNmhM_qxG94iRjT9cEyrk8esW952CQOe7R6eVsf4a_Kajyl0Rj3fCTrKwVBowzhGFblt2YMv2yTSBAhzu9Ta6YVBWFmB3CXfulc8BbjN-rrIrypjNakjma2OrLoC-61CH3Mw"
                        alt="Cover Story"
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 md:p-16">
                        <span className="text-white text-sm tracking-[0.3em] uppercase mb-4 border-l-2 border-red-600 pl-4">
                            Cover Story
                        </span>
                        <h1 className="text-white font-display text-5xl md:text-7xl lg:text-8xl italic font-bold leading-none max-w-4xl">
                            The Modern <br /> <span className="not-italic text-red-600">Manifesto</span>
                        </h1>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-3 text-sm font-bold tracking-widest uppercase py-2 border-t border-black dark:border-white">
                        Issue 08 — Oct 2023
                    </div>
                    <div className="md:col-span-6 md:col-start-5 font-display text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400">
                        &quot;Fashion is not just what you wear; it&apos;s the dialogue between the self and the world. Eightplux explores the intersection of street culture, high art, and the raw authenticity of the individual.&quot;
                    </div>
                </div>
            </header>

            {/* Culture & Stories Section */}
            <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-24">
                <div className="flex justify-between items-end mb-12 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <h2 className="font-display text-4xl italic">Culture & Stories</h2>
                    <Link href="#" className="text-sm font-medium uppercase tracking-widest hover:text-red-600 transition-colors flex items-center gap-2">
                        View Archive <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 gap-x-8">
                    {/* Main Article */}
                    <article className="md:col-span-7 group cursor-pointer">
                        <div className="overflow-hidden mb-4 relative aspect-[4/3]">
                            <Image src={stories[0].image} alt={stories[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-white dark:bg-black text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                {stories[0].type}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-red-600 text-xs font-bold tracking-widest uppercase">{stories[0].category}</span>
                            <h3 className="font-display text-3xl md:text-4xl group-hover:text-red-600 transition-colors">{stories[0].title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">{stories[0].excerpt}</p>
                        </div>
                    </article>

                    {/* Side Article */}
                    <article className="md:col-span-4 md:col-start-9 flex flex-col justify-end group cursor-pointer">
                        <div className="overflow-hidden mb-4 relative aspect-[3/4]">
                            <Image src={stories[1].image} alt={stories[1].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-red-600 text-xs font-bold tracking-widest uppercase">{stories[1].category}</span>
                            <h3 className="font-display text-2xl md:text-3xl group-hover:text-red-600 transition-colors">{stories[1].title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{stories[1].excerpt}</p>
                        </div>
                    </article>

                    {/* Quote Block */}
                    <div className="md:col-span-5 flex items-center justify-center p-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#141414]">
                        <blockquote className="font-display text-3xl italic text-center leading-tight">
                            &quot;We don&apos;t follow trends. We observe the chaotic beauty of the streets and refine it.&quot;
                            <footer className="mt-6 text-sm font-sans not-italic uppercase tracking-widest text-red-600">
                                — J.O.L., Creative Director
                            </footer>
                        </blockquote>
                    </div>

                    {/* Video Article */}
                    <article className="md:col-span-7 group cursor-pointer">
                        <div className="overflow-hidden mb-4 relative aspect-video">
                            <Image src={stories[2].image} alt={stories[2].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                <Play className="w-12 h-12 text-white opacity-80" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-red-600 text-xs font-bold tracking-widest uppercase">{stories[2].category}</span>
                            <h3 className="font-display text-2xl md:text-3xl group-hover:text-red-600 transition-colors">{stories[2].title}</h3>
                        </div>
                    </article>

                    {/* Material Stories Grid */}
                    {materialStories.map((story) => (
                        <article key={story.title} className="md:col-span-4 group cursor-pointer mt-8">
                            <div className="overflow-hidden mb-4 aspect-square">
                                <Image src={story.image} alt={story.title} width={400} height={400} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            </div>
                            <h4 className="font-bold text-lg">{story.title}</h4>
                        </article>
                    ))}
                </div>
            </section>

            {/* Join The Collective - Parallax Section */}
            <section
                className="relative w-full h-[60vh] bg-fixed bg-center bg-cover mb-24 flex items-center justify-center"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAXvq_oK8wSwjdWXcXU5UQvRAIN2PqvC-US97_PvCy24YszVYrl-o-lUAq42LzKHqfRpoolx6_cb75iH10JosL5j0OjAQSYskYIV2vKAesXnftxMFlBJNoUZluSFLnkvLNR7RfpqwbXhXfnvnc3YN-NHAx4UxmF4OiWG68M6rkxv8taN5eZtRlH-qOhvKkoxFl2R9Ebhcby7YZxkAKfiFScpgaIjyzOHeyYwEW7rvGNfWicp2RzRUqK7xxVBOFhjVFojUoW3R47GtdO')" }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center text-white px-6">
                    <h2 className="font-display text-5xl md:text-7xl mb-6">Join The Collective</h2>
                    <p className="max-w-xl mx-auto text-lg mb-8 font-light tracking-wide">
                        Be part of the movement. Get exclusive access to drops, events, and editorial content.
                    </p>
                    <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                        <input
                            className="bg-transparent border border-white text-white placeholder-white/70 px-6 py-3 focus:ring-0 focus:border-red-600 w-full outline-none"
                            placeholder="ENTER YOUR EMAIL"
                            type="email"
                        />
                        <button className="bg-white text-black hover:bg-red-600 hover:text-white transition-colors px-8 py-3 font-bold tracking-widest text-sm uppercase">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>

            {/* Community Section - #EightpluxWorld */}
            <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-32">
                <div className="text-center mb-16">
                    <span className="text-red-600 font-bold tracking-[0.2em] uppercase text-sm mb-2 block">Community</span>
                    <h2 className="font-display text-4xl md:text-5xl italic">#EightpluxWorld</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Tag us to be featured in the collective.</p>
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4">
                    {communityPosts.map((post, index) => (
                        <div key={index} className="break-inside-avoid relative group overflow-hidden">
                            <Image
                                src={post.image}
                                alt={post.user}
                                width={400}
                                height={500}
                                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                                <Heart className="w-8 h-8 mb-2" />
                                <p className="text-sm font-bold">{post.user}</p>
                                {post.caption && (
                                    <p className="text-xs mt-2 text-center opacity-80">&ldquo;{post.caption}&rdquo;</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 uppercase text-sm font-bold tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all">
                        Load More
                    </button>
                </div>
            </section>

            {/* Let It Fly */}
            <section className="bg-white text-black py-32 flex flex-col items-center justify-center text-center overflow-hidden relative">
                <img
                    src="/fly-dove.png"
                    alt="Flying dove"
                    className="w-auto h-[25vw] max-h-[300px] object-contain mb-4"
                />
                <p className="text-sm uppercase tracking-[0.3em] mt-4 text-black">Beyond Boundaries • Est. 2022</p>
            </section>
        </div>
    );
}
