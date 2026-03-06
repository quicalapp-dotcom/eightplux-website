'use client';

import { useState } from 'react';
import { Plus, Minus, Send } from 'lucide-react';

const faqs = [
    {
        category: 'Shipping',
        questions: [
            { q: 'Where do you ship?', a: 'We ship globally via DHL Express. All orders are tracked and insured.' },
            { q: 'How long does shipping take?', a: 'Domestic orders take 2-3 business days. International orders take 3-7 business days depending on location.' },
            { q: 'Do I have to pay duties?', a: 'For most countries, duties are included in the price. For some regions, you may be responsible for import taxes upon delivery.' }
        ]
    },
    {
        category: 'Returns',
        questions: [
            { q: 'What is your return policy?', a: 'Returns are accepted within 14 days of delivery. Items must be unworn, unwashed, and with original tags attached.' },
            { q: 'How do I start a return?', a: 'Visit our returns portal with your order number and email to generate a return label.' },
            { q: 'When will I get my refund?', a: 'Refunds are processed within 5-7 business days after we receive and inspect your return.' }
        ]
    },
    {
        category: 'Payments',
        questions: [
            { q: 'What payment methods do you accept?', a: 'We accept Visa, MasterCard, American Express, PayPal, and Crypto via NOWPayments.' },
            { q: 'Is my payment information secure?', a: 'Yes, all transactions are encrypted and processed through secure payment gateways (Stripe, Paystack, NOWPayments).' }
        ]
    },
    {
        category: 'Sizing',
        questions: [
            { q: 'How does your sizing run?', a: 'Our garments are designed with an oversized, relaxed fit. We recommend sizing down for a more standard fit.' },
            { q: 'Where can I find size charts?', a: 'Detailed measurements are available on each product page under the "Size Guide" tab.' }
        ]
    }
];

export default function ContactPage() {
    const [openSection, setOpenSection] = useState<string | null>('Shipping');

    const toggleSection = (category: string) => {
        setOpenSection(openSection === category ? null : category);
    };

    return (
        <div className="bg-white dark:bg-[#0A0A0A] text-black dark:text-gray-100 min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="font-display text-4xl md:text-6xl mb-4 text-center">Contact & Support</h1>
                <p className="text-gray-500 text-center mb-16 tracking-wide uppercase text-xs">
                    We are here to help. Reach out to us for any inquiries.
                </p>

                <div className="grid md:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div>
                        <h2 className="font-display text-2xl mb-8 border-b border-black dark:border-white pb-4">Contact Us</h2>
                        <form className="space-y-6">
                            <div className="space-y-1">
                                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-gray-500">Name</label>
                                <input type="text" id="name" className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 focus:border-red-600 focus:ring-0 transition-colors" placeholder="Your Name" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                                <input type="email" id="email" className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 focus:border-red-600 focus:ring-0 transition-colors" placeholder="your@email.com" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-widest text-gray-500">Subject</label>
                                <select id="subject" className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 focus:border-red-600 focus:ring-0 transition-colors">
                                    <option>General Inquiry</option>
                                    <option>Order Status</option>
                                    <option>Returns & Exchanges</option>
                                    <option>Press & Wholesale</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-gray-500">Message</label>
                                <textarea id="message" rows={4} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-2 focus:border-red-600 focus:ring-0 transition-colors resize-none" placeholder="How can we help?"></textarea>
                            </div>
                            <button type="submit" className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all flex items-center gap-2">
                                Send Message <Send className="w-3 h-3" />
                            </button>
                        </form>
                    </div>

                    {/* FAQ Accordion */}
                    <div>
                        <h2 className="font-display text-2xl mb-8 border-b border-black dark:border-white pb-4">FAQ</h2>
                        <div className="space-y-4">
                            {faqs.map((section) => (
                                <div key={section.category} className="border-b border-gray-200 dark:border-gray-800 pb-4">
                                    <button
                                        onClick={() => toggleSection(section.category)}
                                        className="w-full flex justify-between items-center py-2 group"
                                    >
                                        <span className="text-sm font-bold uppercase tracking-widest group-hover:text-red-600 transition-colors">
                                            {section.category}
                                        </span>
                                        {openSection === section.category ? (
                                            <Minus className="w-4 h-4 text-red-600" />
                                        ) : (
                                            <Plus className="w-4 h-4 group-hover:text-red-600 transition-colors" />
                                        )}
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${openSection === section.category ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {section.questions.map((item, idx) => (
                                                <div key={idx}>
                                                    <p className="font-bold text-black dark:text-white mb-1">{item.q}</p>
                                                    <p>{item.a}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold uppercase tracking-widest text-xs mb-2">Need immediate assistance?</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Our support team is available Monday through Friday, 9am - 6pm EST.
                            </p>
                            <a href="mailto:support@eightplux.com" className="text-red-600 hover:text-red-500 font-bold text-sm underline decoration-1 underline-offset-4">
                                support@eightplux.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
