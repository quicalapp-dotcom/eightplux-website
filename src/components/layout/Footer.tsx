import Link from 'next/link';
import { Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-white py-20 px-6 md:px-12 font-metropolis">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* FEATURES */}
          <div>
            <h3 className="text-sm font-black uppercase mb-8 tracking-widest">FEATURES</h3>
            <ul className="space-y-4 text-[10px] font-medium opacity-80 uppercase tracking-widest">
              <li><Link href="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
              <li><Link href="/shop" className="hover:opacity-100 transition-opacity">Shop</Link></li>
              <li><Link href="/campaign" className="hover:opacity-100 transition-opacity">Campaign</Link></li>
              <li><Link href="/world-of-8" className="hover:opacity-100 transition-opacity">The World of 8+</Link></li>
            </ul>
          </div>

          {/* MENU */}
          <div>
            <h3 className="text-sm font-black uppercase mb-8 tracking-widest">MENU</h3>
            <ul className="space-y-4 text-[10px] font-medium opacity-80 uppercase tracking-widest">
              <li><Link href="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link href="/contact" className="hover:opacity-100 transition-opacity">Contact Us</Link></li>
              <li><Link href="/account" className="hover:opacity-100 transition-opacity">My Account</Link></li>
              <li><Link href="/login" className="hover:opacity-100 transition-opacity">Login</Link></li>
            </ul>
          </div>

          {/* CONTACT US */}
          <div>
            <h3 className="text-sm font-black uppercase mb-8 tracking-widest">CONTACT US</h3>
            <div className="space-y-6 text-[10px] font-medium opacity-80 uppercase tracking-widest">
              <div>
                <p className="mb-1 opacity-60">Address:</p>
                <p>7, Tajudeen Anjorin, Onilekere, Ikeja</p>
              </div>
              <div>
                <p className="mb-1 opacity-60">Phone:</p>
                <p>+234 809 222 4579</p>
              </div>
              <div>
                <p className="mb-1 opacity-60">Email:</p>
                <p>eightplux@gmail.com</p>
              </div>
              <div>
                <p className="mb-1 opacity-60">Working Days/Hours:</p>
                <p>Mon - Sun / 9:00am - 8:00pm</p>
              </div>
            </div>
          </div>

          {/* FOLLOW US */}
          <div>
            <h3 className="text-sm font-black uppercase mb-8 tracking-widest">FOLLOW US</h3>
            <ul className="space-y-6 text-[10px] font-medium opacity-80 uppercase tracking-widest">
              <li>
                <a href="https://instagram.com/eightplux" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:opacity-100 transition-opacity">
                  <span className="p-1 bg-white text-black"><Instagram size={14} fill="currentColor" /></span>
                  @eightplux
                </a>
              </li>
              <li>
                <a href="https://twitter.com/eightplux" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:opacity-100 transition-opacity">
                  <span className="p-1 bg-white text-black"><Twitter size={14} fill="currentColor" /></span>
                  @eightplux
                </a>
              </li>
              <li>
                <a href="https://tiktok.com/@eightplux" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:opacity-100 transition-opacity">
                  <span className="p-1 bg-white text-black"><Youtube size={14} fill="currentColor" /></span>
                  @eightplux
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-white/20 mb-12" />

        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] font-medium opacity-60 uppercase tracking-widest">
          <p>© 2026 EightPlux</p>
        </div>
      </div>
    </footer>
  );
}
