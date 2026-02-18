import Link from 'next/link';
import Image from 'next/image';

const collectionImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyZlC9BvXQOC0fXsdORuBsOosfqGKQkRGJwU4739Gryc4Mbv3GGyulPtr8TvXu1ncep1G-pSj9XMPwq1d2-_u3drJyZiIYIosY5h-N4TAqNBbIYIGXmlyBGjkcVeFN0Fg_nftkxsshtR6bssd8GQkQwKAIri00LtT13W9OLKqQpBTKbhcGyA8g9w2EEoj1DYrBe3sgJ3yw2riXATCnitBBxTjM0As_3FK5AbY5UuLLpR19ZamN0emnW1FNY-TRKY8g0qiHHVKdPm9D';

export default function FullWidthBanner() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <Image src={collectionImage} alt="Wide cinematic fashion shot" fill className="object-cover" />
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
  );
}
