import { Truck, Headphones, Package, ShieldCheck } from 'lucide-react';

export default function TrustBar() {
  const items = [
    {
      icon: <Truck size={48} strokeWidth={1} />,
      title: 'SHIPPING',
      description: 'We ship worldwide. T&C Apply',
    },
    {
      icon: <Headphones size={48} strokeWidth={1} />,
      title: 'CUSTOMER SERVICE',
      description: 'A question? contact us at +234-809-6753355',
    },
    {
      icon: <Package size={48} strokeWidth={1} />,
      title: 'REFER A FRIEND',
      description: 'Refer a friend and get 5% off each other',
    },
    {
      icon: <ShieldCheck size={48} strokeWidth={1} />,
      title: 'SECURE PAYMENTS',
      description: 'Your payment information is processed securely',
    },
  ];

  return (
    <section className="py-36 px-6 md:px-12" style={{ backgroundColor: '#d4d4d4' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center text-[#0d0d0d]">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="mb-6 opacity-80">
              {item.icon}
            </div>
            <h3 className="text-lg font-black uppercase mb-3 tracking-wider">
              {item.title}
            </h3>
            <p className="text-sm font-medium leading-relaxed opacity-80 max-w-[240px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
