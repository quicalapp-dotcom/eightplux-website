"use client";

import { useState } from "react";
import { useCurrencyStore } from "@/stores/currencyStore";

interface PaystackButtonProps {
  email: string;
  amount: number;
  orderId: string;
}

export default function PaystackButton({ email, amount, orderId }: PaystackButtonProps) {
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrencyStore();
  
  console.log('PaystackButton props:', {
    email,
    amount,
    orderId,
    currency,
  });

  const handlePay = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/payments/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          orderId,
          currency: "USD",
        }),
      });

      const data = await res.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }

    } catch (error) {
      console.error("Paystack error:", error);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-green-600 text-white px-6 py-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Processing..." : "Pay with Paystack"}
    </button>
  );
}
