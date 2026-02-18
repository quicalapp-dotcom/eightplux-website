import HeroSection from '@/components/home/HeroSection';
import ShopCollectionBanner from '@/components/home/ShopCollectionBanner';
import CollectionGrid from '@/components/home/CollectionGrid';
import WhatsNew from '@/components/home/WhatsNew';
import VoidCollection from '@/components/home/VoidCollection';
import ShopByPalette from '@/components/home/ShopByPalette';
import Highlights from '@/components/home/Highlights';
import Newsletter from '@/components/home/Newsletter';
import TrustBar from '@/components/home/TrustBar';
import Reviews from '@/components/home/Reviews';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ShopCollectionBanner />
      {/* page divider */}
      <div className="px-6 md:px-12" style={{ backgroundColor: '#d4d4d4' }}>
        <hr className="border-0" style={{ height: '2px', backgroundColor: '#0d0d0d' }} />
      </div>
      <WhatsNew />
      <Highlights />
      <ShopByPalette />
      <CollectionGrid />
      <Reviews />
      <Newsletter />
      {/* page divider */}
      <div className="px-6 md:px-12" style={{ backgroundColor: '#d4d4d4' }}>
        <hr className="border-0" style={{ height: '2px', backgroundColor: '#0d0d0d' }} />
      </div>
      <TrustBar />
    </>
  );
}