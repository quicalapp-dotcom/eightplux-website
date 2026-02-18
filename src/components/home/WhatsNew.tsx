import Link from 'next/link';
import Image from 'next/image';

type WhatsNewItem = {
  name: string;
  imageUrl: string;
  linkUrl?: string;
  price?: string;
  isSale?: boolean;
}

const fallbackItems: WhatsNewItem[] = [
  { name: 'DNA Capsule Hoodie', imageUrl: '/lg.jpg',  linkUrl: '/shop', price: '$129', isSale: true  },
  { name: 'DNA Capsule Hoode', imageUrl: '/bb.jpg',  linkUrl: '/shop', price: '$129', isSale: false },
  { name: 'DNA Capsule Hood', imageUrl: '/sg.jpg',  linkUrl: '/shop', price: '$129', isSale: false },
  { name: 'DNA Capsule Hoodi', imageUrl: '/wb.jpg',  linkUrl: '/shop', price: '$129', isSale: true  },
  { name: 'DNA Capsule Hoodie', imageUrl: '/bg.jpg',  linkUrl: '/shop', price: '$129', isSale: false },
];

export default function WhatsNew() {
  const data = fallbackItems;
  const featureItem = data[0];
  const gridItems = data.slice(1, 5);

  return (
    <section className="py-20 px-6 md:px-12" style={{ backgroundColor: '#d4d4d4' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <h2 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tight" style={{ color: '#0d0d0d' }}>
          NEW DROP
        </h2>
        <p className="max-w-xs text-[10px] md:text-xs leading-relaxed font-medium" style={{ color: '#4d4d4d' }}>
          Here, you can explore a variety of features designed to enhance your experience. 
          Whether you&apos;re looking, Let&apos;s get started!
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Feature Product (Left) */}
        <div className="group relative bg-[#e5e5e5] aspect-[5/6] lg:aspect-auto overflow-hidden">
          {featureItem.isSale && (
            <div className="absolute top-6 left-6 z-10 bg-[#cf3434] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
              -20%
            </div>
          )}
          <Image
            src={featureItem.imageUrl}
            alt={featureItem.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Frosted glass overlay label */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-5"
            style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(8px)' }}>
            <h3 className="text-lg font-black uppercase text-[#0d0d0d] leading-tight tracking-wide">
              {featureItem.name}
            </h3>
            <p className="text-sm text-[#4d4d4d] font-semibold mt-0.5">
              {featureItem.price || '$129'}
            </p>
          </div>
        </div>


        {/* Small Products (Right 2x2) */}
        <div className="grid grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((index) => {
            const item = gridItems[index];
            const isPlaceholder = !item;
            const saleIndices = [2]; 

            return (
              <div key={index} className="flex flex-col">
                 <div className="relative aspect-square bg-[#e5e5e5] p-2 mb-4 overflow-hidden group">
                    {saleIndices.includes(index) && (
                      <div className="absolute top-4 left-4 z-10 bg-[#cf3434] text-white text-[8px] font-bold px-2 py-1 rounded-full">
                        -20%
                      </div>
                    )}
                    {!isPlaceholder && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                 </div>
                 <div>
                    <h4 className="text-xs font-bold text-[#0d0d0d] truncate">
                      {item?.name || 'DNA Capsule Hoodie'}
                    </h4>
                    <p className="text-[10px] text-[#4d4d4d] font-medium mt-0.5">
                      {item?.price || '$129'}
                    </p>
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="flex justify-center">
        <Link
          href="/shop"
          className="bg-[#000] text-white px-12 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#333] transition-colors duration-200"
        >
          SEE ALL PRODUCTS
        </Link>
      </div>
    </section>
  );
}

