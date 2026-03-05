'use client';

import React from 'react';
import { Check, Package, CreditCard, Truck, CheckCircle2, Clock } from 'lucide-react';

interface OrderStepperProps {
  currentStatus: string;
  isCancelled?: boolean;
}

const statusWorkflow = [
  { id: 'pending', label: 'Placed', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: CreditCard },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderStepper({ currentStatus, isCancelled }: OrderStepperProps) {
  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg p-6 flex items-center gap-4">
        <div className="bg-red-100 p-2 rounded-full text-red-600">
          <CheckCircle2 className="w-6 h-6 rotate-45" />
        </div>
        <div>
          <h3 className="font-bold text-red-700 uppercase tracking-widest text-xs">Order Cancelled</h3>
          <p className="text-xs text-red-600 mt-1 uppercase tracking-tight">This order has been voided and will not be fulfilled.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusWorkflow.findIndex(s => s.id === currentStatus);

  return (
    <div className="w-full py-8">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out" 
          style={{ width: `${(currentStepIndex / (statusWorkflow.length - 1)) * 100}%` }}
        />

        {statusWorkflow.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isCompleted ? 'bg-black border-black text-white' : 
                  isCurrent ? 'bg-white border-black text-black scale-110 shadow-lg' : 
                  'bg-white border-gray-200 text-gray-300'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              
              <div className="absolute top-12 flex flex-col items-center w-32">
                <span className={`text-[10px] font-bold uppercase tracking-widest text-center ${
                  isCurrent ? 'text-black' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="text-[10px] text-gray-500 lowercase opacity-60 mt-0.5">Current</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
