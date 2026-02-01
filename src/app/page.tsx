import Link from 'next/link';
import Image from 'next/image';

// Image URLs from the original design
const images = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAO_vifb1VnEqFLh1n8Fxl68TVv6M_pnPq49qCwoBGHnQvrVQI-gNer1GMv8dRChHk_1Gw0LaIutYDPCBO3jn3R3iLgYIsIrIYrI9jwcomDKDz1RPYWxaZfEeC9_ISBJS0V8yNjl1ct0crXQUSIZd_5P92H8msPM71HdG5Ojw81AEoff9Vl_JU3vnkf-0X1VPKyCK3o9zasQRfKcwqi4bS9snzaB9MqZBBOgYR7hsEqYA8i9k1Ocsy5_pRGixoSoK3ijNscR_e_lL_',
  collection: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyZlC9BvXQOC0fXsdORuBsOosfqGKQkRGJwU4739Gryc4Mbv3GGyulPtr8TvXu1ncep1G-pSj9XMPwq1d2-_u3drJyZiIYIosY5h-N4TAqNBbIYIGXmlyBGjkcVeFN0Fg_nftkxsshtR6bssd8GQkQwKAIri00LtT13W9OLKqQpBTKbhcGyA8g9w2EEoj1DYrBe3sgJ3yw2riXATCnitBBxTjM0As_3FK5AbY5UuLLpR19ZamN0emnW1FNY-TRKY8g0qiHHVKdPm9D',
  product1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArdfgsNIMQMstJ0ysu6C0rVRpYRrwMkx-6YicV9P_Rc4k14KjpvQylNHxYJIMPfvszdg4s1ELWqLmWJVcyv2sDtWLvZLgB9sbEntPDjTmaw60sFSlqkIcJ044MXHGBoRkgcbrJuTJN6aIS0jSLW07_aRI51pmLKPeSHi9IWEQ5EjtwLGaJVhGnYaBItypAETA6DMiBvGP95_8U6WXgaAxReyxnw9vatAYAlXaSRdHtwGsOJlQkGWAIF5nxPkvvaOVCHYOGNEw5ySJL',
  product2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTtHbdm_uh4PzaWhffvpZfH6T4OlMtLtiZLI9nkSZowQ4PN0KqqEDFTugGiWDWmFv0q2ckQQ39RJ01_o0Bk3UinM2fC0VeBSp64oGl0YMdblfZkTa8AQuHVo_p8-q4v60zF8qBvXnc5GHiul-ojGqeMd93h4dF0pYrmbOJ7ZYoUX5MZmOTg5FMnxuCP5oyiSiBRRCQMDiffRAL_tAMEMJR7PXQujRX3knaDXwKUy4NHz8MQmURl-jfFN5evwFUyaKx0tTiK5adRpFW',
  product3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNeyDlUVN6w-FKkFf-2zfd-6-LuBw3hDphS9Jye5bUQsP0puwsWV56Xu2dyeeGo2nKpW2Qbt3hMVLd2tG_VNEb9xvelpPtBEOo412-vn-dgYM4tNtGcyQKnGIZTxIiCNHqq6PAwRlX9Yp80cyy1pHGiMzeVKGIxEJHkEGwnpY7AILbfBBb3LUnf-9nfXP540V8AzP0655BRWltZPR6bit3rc1l6AOFKCHU7aaPkxKE9C8VMzD-YyNATgdmnw1ViWbbEsIaVPF98wZf',
  product4: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjRiiwapBhxLMrAoy6_1_ft9UvkdAm5Mba_9mNSHQ2dITghsQKqOJGc5Yz-k27QHeujR-PMinyiaW6CSzleoGwZOJoc3fxsUuuD5BEQiO3ZbWjUkC5cvGEa70eD68werBr2UNC5IKZZBV1i5J8QCHwAxpORlYCA354Uomh775PyM68nrV7VtZy-kZxAIq1oL6Bln6dGzxVTniWYX0W1nreaXMWHzjFMHpnml2gBnHusI4NZTeVt9aYV3KzKdu5X2fkCPHqu1QxPQ4H',
  product5: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAONEJr7Tczt0KHlX1SSC9TPyHy2oS3b72tPHuAS0ER6awAcq-6kkbN36jPGiG4WzwDRBhjH84FI2lV32n962QW--eTAWvIU1nnnlri9LpQVFjLD5xYTH0Hjp1EgQzdtrm8va5qtpWj9jmdup6kCg7p_LmXTfIvLPvKwlIknIr9gLVfklOK-SAeH9LVaVZ_ZA-4TCSXJXw7PMpXhX54cb8MOqCkXc_hBklTupZwxfdw2po52GXAv7n-fPaRgHl5QqTCQhb7niuSZVDR',
  voidCollection: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Ot2c9vv5-mlJg9eapl412CP3uc1hDlHsDk4iUZZFD1pskjJVXTBP6Pr_hvlhIonNV1Lkgna5xDhGnXv3mj6hP-nZJDkzXS3cWtB3eFUbROxCJXt744Dt7K2-QWGjxaeWd7se0fBjZF-OPm7moUbEqKCQy_m957iaf4Z12mWkIPxioQoVvt4uOQZtuk7pgmBUYYSF1mevinOAGl9x7zBF_fUgVGnEYBJhdsbfqjG_nsuVFFOMKD-hAmIY00eZlW4QgzJNVYedfGfz',
};

const whatsNew = [
  { name: 'The Trench', image: images.product1 },
  { name: 'Studio', image: images.product1 },
  { name: 'Leather', image: images.product2 },
  { name: 'Knitwear', image: images.product3 },
];

const occasions = [
  { name: 'Atelier', image: images.product5 },
  { name: 'Transit', image: images.product4 },
  { name: 'Repose', image: images.product3 },
  { name: 'Nocturne', image: images.product2 },
  { name: 'Exterior', image: images.product1 },
];

const newProducts = [
  { name: 'Silk Trouser', subtitle: 'Relaxed Fit', price: 1100, image: images.product4 },
  { name: 'Cashmere Hoodie', subtitle: 'Heavyweight', price: 890, image: images.product3 },
  { name: 'Calfskin Jacket', subtitle: 'Structured', price: 2450, image: images.product2 },
  { name: 'Derby Boot', subtitle: 'Polished Leather', price: 1350, image: images.product5 },
];

const palettes = [
  { name: 'Charcoal', color: '#2a2a2a', image: images.product2 },
  { name: 'Mist', color: '#e5e5e5', image: images.product3 },
  { name: 'Oxblood', color: '#8b0000', image: images.product1, overlay: true },
  { name: 'Camel', color: '#d2b48c', image: images.product4 },
  { name: 'Obsidian', color: '#000000', image: images.product5 },
  { name: 'Plaster', color: '#f5f5f5', image: images.voidCollection },
];

const highlights = [
  {
    title: "That last set doesn't feel possible. Yet.",
    description: "In ultra-supportive gear, your hardest sessions finish as strong as they start.",
    link: "Explore Tech",
    image: images.product1,
  },
  {
    title: "Cut from the cold.",
    description: "Now online in the USA: the limited-edition Team Canada Milano Cortina 2026 collection.",
    link: "Read The Journal",
    image: images.hero,
  },
  {
    title: "Get a feel for all our fabrics.",
    description: "Compare textures, weights, and finishes to find the fabric for you.",
    link: "Explore Materials",
    image: images.voidCollection,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[95vh] w-full overflow-hidden bg-black">
        <Image
          src={images.hero}
          alt="Cinematic fashion editorial visual"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Two Column Collection Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
        <Link href="/shop/women" className="relative h-[80vh] md:h-[110vh] group overflow-hidden cursor-pointer block">
          <Image
            src={images.collection}
            alt="Womens new collection campaign"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          <div className="absolute bottom-10 left-6 md:left-10 z-10">
            <h2 className="text-white text-4xl md:text-6xl font-display font-light mb-4">Women&apos;s Latest</h2>
            <span className="bg-white text-black px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors inline-block">
              Shop Collection
            </span>
          </div>
        </Link>
        <Link href="/shop/men" className="relative h-[80vh] md:h-[110vh] group overflow-hidden cursor-pointer block">
          <Image
            src={images.collection}
            alt="Mens seasonal highlights"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          <div className="absolute bottom-10 left-6 md:left-10 z-10">
            <h2 className="text-white text-4xl md:text-6xl font-display font-light mb-4">Men&apos;s Seasonal</h2>
            <span className="bg-white text-black px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors inline-block">
              Explore Now
            </span>
          </div>
        </Link>
      </section>

      {/* What's New Section */}
      <section className="py-20 px-6 md:px-12 bg-white dark:bg-[#121212]">
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="text-3xl md:text-4xl font-display text-[#1a1a1a] dark:text-white">What&apos;s New at 8+</h2>
          <Link href="/shop?filter=new" className="text-xs uppercase tracking-widest border-b border-[#1a1a1a] pb-1 hover:opacity-50 transition-opacity">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {whatsNew.map((item) => (
            <Link key={item.name} href="/shop" className="group cursor-pointer relative block">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover image-hover-zoom"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-widest font-bold">
                  {item.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* The Void Collection */}
      <section className="w-full bg-[#f0f0f0] dark:bg-[#1a1a1a] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-200 dark:bg-gray-800 skew-x-12 opacity-50 z-0" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-[#666666] uppercase tracking-[0.2em] mb-4 block">Limited Release</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold leading-none mb-6 text-[#1a1a1a] dark:text-white uppercase">
              The Void <br />Collection
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Enter the lottery for exclusive access to the Spring 2025 archival pieces. Application closes in 48 hours.
            </p>
            <Link href="/campaigns/void" className="inline-block bg-black text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform">
              Enter The Draw
            </Link>
          </div>
          <div className="w-full md:w-1/3 aspect-square relative bg-white p-4 shadow-xl rotate-3">
            <Image
              src={images.voidCollection}
              alt="Abstract architectural texture"
              fill
              className="object-cover contrast-125"
            />
          </div>
        </div>
      </section>

      {/* Curated By Occasion */}
      <section className="py-20 px-6 bg-white dark:bg-[#0F0F0F]">
        <h3 className="text-2xl font-display text-center mb-12">Curated By Occasion</h3>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {occasions.map((occasion) => (
            <Link key={occasion.name} href="/shop" className="group flex flex-col items-center gap-4">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-gray-200 group-hover:border-[#1a1a1a] transition-all">
                <Image
                  src={occasion.image}
                  alt={occasion.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-xs uppercase tracking-widest font-medium border-b border-transparent group-hover:border-[#1a1a1a] pb-1">
                {occasion.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Full Width Banner */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src={images.collection}
          alt="Wide cinematic fashion shot"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h2 className="text-white text-4xl md:text-6xl font-display mb-6 tracking-wide drop-shadow-lg">
            Set for <i className="font-serif">Intentionality.</i>
          </h2>
          <p className="text-white text-lg font-light mb-8 max-w-lg drop-shadow-md">
            Step into the soft shapes of our cashmere blend to restore your body and reimagine what&apos;s next.
          </p>
          <div className="flex gap-4">
            <Link href="/shop?category=tops" className="bg-white/90 backdrop-blur text-black px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors">
              Shop Tops
            </Link>
            <Link href="/shop?category=knits" className="bg-white/90 backdrop-blur text-black px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors">
              Explore Knits
            </Link>
          </div>
        </div>
      </section>

      {/* What's New Products Slider */}
      <section className="py-24 px-6 md:px-12 bg-white dark:bg-[#0F0F0F] overflow-hidden">
        <div className="flex justify-between items-end mb-12 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display text-[#1a1a1a] dark:text-white leading-tight">
            What&apos;s new? <br /><span className="text-gray-400">So glad you asked.</span>
          </h2>
          <Link href="/shop?filter=new" className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:opacity-80 transition-opacity rounded-full">
            Shop New
          </Link>
        </div>
        <div className="flex overflow-x-auto hide-scroll gap-6 pb-8 snap-x pl-6 md:pl-[calc((100vw-1280px)/2)]">
          {newProducts.map((product) => (
            <div key={product.name} className="min-w-[280px] md:min-w-[320px] snap-center group">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined text-sm">favorite</span>
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.subtitle}</p>
                </div>
                <span className="text-sm">${product.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Palette */}
      <section className="py-16 px-6 bg-[#fafafa] dark:bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-display mb-10">Shop by Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {palettes.map((palette) => (
              <Link key={palette.name} href={`/shop?color=${palette.name.toLowerCase()}`} className="group text-center block">
                <div className="h-48 mb-3 relative overflow-hidden" style={{ backgroundColor: palette.color }}>
                  {palette.overlay && (
                    <div className="absolute inset-0 bg-red-900 mix-blend-multiply z-10" />
                  )}
                  <Image
                    src={palette.image}
                    alt={palette.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-xs uppercase font-bold tracking-widest">{palette.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Catch the Highlights */}
      <section className="py-24 px-6 md:px-12 bg-white dark:bg-[#0F0F0F]">
        <h2 className="text-4xl font-display mb-12">Catch the Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item) => (
            <Link key={item.title} href="/world" className="group block">
              <div className="aspect-square overflow-hidden mb-6 relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              <h3 className="text-xl font-display mb-2 group-hover:underline decoration-1 underline-offset-4">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
              <span className="text-[10px] uppercase font-bold mt-4 block border-b border-black dark:border-white w-max pb-1">
                {item.link}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-[#111] text-white">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black p-12 md:p-20 relative overflow-hidden shadow-2xl border border-gray-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-display mb-6">Join The Inner Circle</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto font-light">
              Sign up for email marketing, you agree to our Terms of Use and acknowledge our Privacy Policy. Get 15% off your first archival purchase.
            </p>
            <form className="max-w-md mx-auto flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-b border-gray-500 text-white placeholder-gray-500 px-4 py-3 focus:outline-none focus:border-white transition-colors text-center w-full"
              />
              <button
                type="submit"
                className="bg-white text-black font-bold uppercase tracking-[0.2em] text-xs py-4 px-8 hover:bg-gray-200 transition-colors mt-4 w-full md:w-auto mx-auto"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
