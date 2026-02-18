import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* ABOUT US */}
          <div className="lg:pr-12">
            <h3 className="text-lg font-black uppercase mb-8 tracking-widest">ABOUT US</h3>
            <p className="text-sm font-light leading-relaxed opacity-80 text-justify md:text-left">
              Eightplux is a clothing brand focused on everyday movement,
              comfort, and self-expression. We design thoughtfully made pieces
              intended to be worn often and lived in fully — clothing that
              supports real life rather than standing apart from it. Rooted in
              intention and subtle design, each collection is created to move
              with you, adapt to your routine, and feel natural wherever your
              day takes you.
            </p>
          </div>

          {/* SHOP */}
          <div className="lg:pl-12">
            <h3 className="text-lg font-black uppercase mb-8 tracking-widest">SHOP</h3>
            <ul className="space-y-4 text-sm font-medium opacity-80">
              <li><Link href="/shop" className="hover:opacity-100 transition-opacity">All Products</Link></li>
              <li><Link href="/shop?category=skirts" className="hover:opacity-100 transition-opacity">Skirts</Link></li>
              <li><Link href="/shop?category=shoes" className="hover:opacity-100 transition-opacity">Shoes</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:opacity-100 transition-opacity">Accessories</Link></li>
              <li><Link href="/shop?category=shorts" className="hover:opacity-100 transition-opacity">Shorts</Link></li>
              <li><Link href="/shop?category=tops" className="hover:opacity-100 transition-opacity">Tops</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-lg font-black uppercase mb-8 tracking-widest">LEGAL</h3>
            <ul className="space-y-4 text-sm font-medium opacity-80">
              <li><Link href="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:opacity-100 transition-opacity">Refund Policy</Link></li>
              <li><Link href="/terms-of-use" className="hover:opacity-100 transition-opacity">Terms of Use</Link></li>
            </ul>
          </div>

          {/* CONTACT US */}
          <div>
            <h3 className="text-lg font-black uppercase mb-8 tracking-widest">CONTACT US</h3>
            <p className="text-sm font-medium mb-8 opacity-80 leading-relaxed">
              Have a question? Give us a call or fill out the contact form. We'd love to hear from you
            </p>
            <div className="space-y-3 mb-8">
              <p className="text-sm font-medium">+234 809 0000 0000</p>
              <p className="text-sm font-medium">support@eightplux.com</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors">
                <Youtube size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-white/20 mb-12" />

        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] md:text-sm font-medium opacity-60">
          <p>© 2025, EightPlux. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
