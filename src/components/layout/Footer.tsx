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


        </footer>
    );
}
