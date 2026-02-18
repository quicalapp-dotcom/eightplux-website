import Link from 'next/link';

export default function ShopCollectionBanner() {
  return (
    <div className="w-full flex justify-center items-center py-6 bg-[#d4d4d4]">
      <div className="flex items-stretch">
        <Link
          href="/shop"
          className="bg-[#0d0d0d] text-white px-15 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#333] transition-colors duration-200 flex items-center"
        >
          SHOP THE COLLECTION
        </Link>
        <div className="bg-[#f0ede6] text-[#0d0d0d] px-6 py-4 text-xs font-semibold uppercase tracking-widest flex items-center border-l-0">
          20% OFF
        </div>
      </div>
    </div>
  );
}
