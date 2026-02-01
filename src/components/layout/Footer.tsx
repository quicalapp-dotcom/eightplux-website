import Link from 'next/link';

const footerLinks = {
    shop: [
        { name: 'New Arrivals', href: '/shop?filter=new' },
        { name: 'Ready to Wear', href: '/shop' },
        { name: 'Accessories', href: '/shop?category=accessories' },
        { name: 'Footwear', href: '/shop?category=footwear' },
    ],
    service: [
        { name: 'Contact', href: '/contact' },
        { name: 'Shipping', href: '/contact#shipping' },
        { name: 'Returns', href: '/contact#returns' },
        { name: 'Size Guide', href: '/size-guide' },
    ],
    legal: [
        { name: 'Terms', href: '/terms' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Accessibility', href: '/accessibility' },
    ],
};

const socialLinks = [
    { name: 'IG', href: 'https://instagram.com/eightplux' },
    { name: 'FB', href: 'https://facebook.com/eightplux' },
    { name: 'TW', href: 'https://twitter.com/eightplux' },
];

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-[#050505] text-primary dark:text-gray-400 pt-20 pb-0 border-t border-gray-200 dark:border-gray-900 overflow-hidden">
            <div className="container mx-auto px-6 mb-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {/* Shop Links */}
                    <div>
                        <h5 className="text-xs font-bold text-primary dark:text-white uppercase tracking-widest mb-6">
                            Shop
                        </h5>
                        <ul className="space-y-4 text-xs tracking-wide text-gray-500">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary dark:hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Service Links */}
                    <div>
                        <h5 className="text-xs font-bold text-primary dark:text-white uppercase tracking-widest mb-6">
                            Service
                        </h5>
                        <ul className="space-y-4 text-xs tracking-wide text-gray-500">
                            {footerLinks.service.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary dark:hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h5 className="text-xs font-bold text-primary dark:text-white uppercase tracking-widest mb-6">
                            Legal
                        </h5>
                        <ul className="space-y-4 text-xs tracking-wide text-gray-500">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-primary dark:hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="col-span-2 md:col-span-1">
                        <h5 className="text-xs font-bold text-primary dark:text-white uppercase tracking-widest mb-6">
                            Connect
                        </h5>
                        <div className="flex space-x-6 mb-8">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary dark:text-white hover:opacity-50 transition-opacity text-xs font-bold"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase leading-relaxed">
                            © 2024 Eightplux Inc.<br />
                            Paris / Los Angeles / Tokyo
                        </p>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row justify-between items-end border-t border-gray-100 dark:border-gray-800 mt-16">
                    <div className="text-[10px] uppercase text-gray-400 mb-2">
                        Site by Special Offer, Inc.
                    </div>
                </div>
            </div>

            {/* Editorial Tagline Section */}
            <div className="w-full bg-[#f8f8f8] dark:bg-[#0a0a0a] pt-12 pb-2 md:pt-24 flex flex-col items-center justify-end overflow-hidden">
                <div className="relative w-full flex flex-col items-center">
                    <svg
                        className="text-black dark:text-white mb-6 w-24 h-24 md:w-32 md:h-32"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="0.8"
                        viewBox="0 0 24 24"
                    >
                        <path d="M18.8 8.6c-.6-.4-1.3-.6-2-.6-1.5 0-2.8.9-3.4 2.2-.4-.9-1.2-1.6-2.2-1.9-.3-.1-.7-.1-1-.1-2.4 0-4.3 1.9-4.3 4.3 0 .4.1.8.2 1.2l-.7.2c-.4.1-.7.5-.7.9s.3.8.7.9h.1l5.7-1.4c.5-.1.9-.6.8-1.1-.1-.5-.6-.9-1.1-.8l-3.3.8c-.2-1.8 1.2-3.4 3-3.4.6 0 1.2.2 1.6.6.4.4.7 1 .7 1.6 0 .5.4.9.9.9s.9-.4.9-.9c0-1.2.8-2.2 2-2.2.4 0 .8.1 1.1.4.3.3.5.7.5 1.1 0 .9-.5 1.7-1.3 2-.4.2-.6.7-.4 1.1.2.4.7.6 1.1.4 1.4-.6 2.3-1.9 2.3-3.5 0-1.4-.9-2.7-2.2-3.1z" />
                        <path d="M3 14s4-2 6 2" />
                    </svg>
                    <div className="mega-text font-display italic font-black text-center text-primary dark:text-white leading-[0.7] tracking-tighter w-full select-none pointer-events-none">
                        Let it fly
                    </div>
                </div>
            </div>
        </footer>
    );
}
