'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface CheckoutHeaderProps {
  currentStep: number;
  steps: string[];
  setCurrentStep: (step: number) => void;
}

export default function CheckoutHeader({ currentStep, steps, setCurrentStep }: CheckoutHeaderProps) {
  return (
    <header className="mb-12">
      <Link href="/">
        <Image 
          src="/Eightplus logocam.png" 
          alt="eightplux" 
          width={120} 
          height={40} 
          className="object-contain"
          priority
        />
      </Link>
      
      <nav className="flex items-center gap-2 mt-8 text-[10px] uppercase tracking-widest text-gray-400">
        <Link href="/cart" className="hover:text-black transition-colors">cart</Link>
        <ChevronRight className="w-3 h-3" />
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={`${i === currentStep ? 'text-black font-bold' : (i < currentStep ? 'text-[#C72f32] hover:underline' : 'cursor-default')} uppercase transition-all`}
              disabled={i >= currentStep}
            >
              {step.toLowerCase()}
            </button>
            {i < steps.length - 1 && <ChevronRight className="w-3 h-3" />}
          </div>
        ))}
      </nav>
    </header>
  );
}
