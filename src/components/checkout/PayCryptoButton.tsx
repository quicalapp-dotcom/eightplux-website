"use client";

import { useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";

interface PayCryptoButtonProps {
  amount: number;
  currency?: string;
  orderId?: string;
  email?: string;
  onSuccess?: (paymentId: string, orderId: string) => void;
  onError?: (error: string) => void;
}

export default function PayCryptoButton({
  amount,
  currency = "usd",
  orderId,
  email,
  onSuccess,
  onError,
}: PayCryptoButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/crypto/create-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          email,
          orderId,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      if (data.invoice_url) {
        // Redirect to NOWPayments checkout
        window.location.href = data.invoice_url;
        onSuccess?.(data.payment_id, data.order_id);
      } else {
        throw new Error("No invoice URL received");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      onError?.(error.message || "Payment creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C72f32] transition-all disabled:opacity-40 flex items-center justify-center gap-3"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating Invoice...</span>
        </>
      ) : (
        <>
          <span>Pay with Crypto</span>
          <ExternalLink className="w-3 h-3" />
        </>
      )}
    </button>
  );
}
