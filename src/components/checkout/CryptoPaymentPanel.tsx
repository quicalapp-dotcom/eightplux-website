'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, AlertCircle, ExternalLink } from 'lucide-react';

const COINS = [
  { id: 'usdt_trc20', label: 'USDT (TRC-20)', network: 'Tron', color: '#26a17b', envKey: 'NEXT_PUBLIC_WALLET_USDT_TRC20' },
  { id: 'usdt_erc20', label: 'USDT (ERC-20)', network: 'Ethereum', color: '#627eea', envKey: 'NEXT_PUBLIC_WALLET_USDT_ERC20' },
  { id: 'btc',        label: 'Bitcoin',        network: 'Bitcoin',  color: '#f7931a', envKey: 'NEXT_PUBLIC_WALLET_BTC' },
  { id: 'eth',        label: 'Ethereum',       network: 'Ethereum', color: '#627eea', envKey: 'NEXT_PUBLIC_WALLET_ETH' },
];

const walletAddresses: Record<string, string> = {
  usdt_trc20: process.env.NEXT_PUBLIC_WALLET_USDT_TRC20 || '',
  usdt_erc20: process.env.NEXT_PUBLIC_WALLET_USDT_ERC20 || '',
  btc:        process.env.NEXT_PUBLIC_WALLET_BTC || '',
  eth:        process.env.NEXT_PUBLIC_WALLET_ETH || '',
};

interface CryptoPaymentPanelProps {
  total: number;
  currency: string;
  onConfirm: (txHash: string, coin: string) => void;
  loading: boolean;
}

export default function CryptoPaymentPanel({ total, currency, onConfirm, loading }: CryptoPaymentPanelProps) {
  const [selectedCoin, setSelectedCoin]   = useState(COINS[0].id);
  const [copied, setCopied]               = useState(false);
  const [txHash, setTxHash]               = useState('');
  const [txError, setTxError]             = useState('');

  const coin    = COINS.find(c => c.id === selectedCoin)!;
  const address = walletAddresses[selectedCoin];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!txHash.trim()) {
      setTxError('please paste your transaction hash to confirm');
      return;
    }
    setTxError('');
    onConfirm(txHash.trim(), coin.label);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Coin selector */}
      <div>
        <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-gray-400 mb-4">Select coin</p>
        <div className="grid grid-cols-2 gap-2">
          {COINS.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCoin(c.id)}
              className={`flex items-center gap-3 p-4 border text-left transition-all ${
                selectedCoin === c.id
                  ? 'border-black bg-gray-50/50 scale-[1.01]'
                  : 'border-gray-100 opacity-60 hover:opacity-100'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.color }}
              />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">{c.label}</p>
                <p className="text-[9px] text-gray-400 tracking-wider mt-0.5">{c.network}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* QR + address */}
      <div className="flex flex-col items-center gap-6 p-6 border border-gray-100 bg-gray-50/30">
        {address ? (
          <>
            <div className="bg-white p-3 border border-gray-100 shadow-sm">
              <QRCodeSVG
                value={address}
                size={140}
                fgColor="#000000"
                bgColor="#FFFFFF"
                level="M"
              />
            </div>

            <div className="w-full">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 text-center">{coin.label} address</p>
              <div className="flex items-center gap-2 bg-white border border-gray-100 p-3">
                <p className="flex-1 text-[10px] font-mono break-all leading-relaxed text-gray-700">
                  {address}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded transition-colors"
                  title="Copy address"
                >
                  {copied
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <Copy className="w-4 h-4 text-gray-400" />
                  }
                </button>
              </div>
            </div>

            {/* Amount to send */}
            <div className="w-full bg-black text-white p-4 flex justify-between items-center">
              <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Amount due</p>
              <p className="font-black text-sm tracking-widest">{currency === 'NGN' ? '₦' : '$'}{total.toLocaleString()}</p>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-[10px] uppercase tracking-widest font-bold">
              Wallet address not configured.
            </p>
            <p className="text-[9px] text-gray-400 mt-1">
              Set NEXT_PUBLIC_WALLET_{selectedCoin.toUpperCase()} in .env.local
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="space-y-2 border-l-2 border-gray-100 pl-4">
        <p className="text-[10px] uppercase font-black tracking-widest text-gray-700">How to pay</p>
        <ol className="space-y-1.5">
          {[
            `Send the exact amount in ${coin.label} to the address above`,
            'Copy the address or scan the QR code with your wallet app',
            'Paste your transaction hash below once sent',
            'We will confirm & update your order status',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-[9px] uppercase tracking-wider text-gray-500 font-bold leading-relaxed">
              <span className="flex-shrink-0 w-4 h-4 border border-gray-200 rounded-full flex items-center justify-center text-[8px] font-black mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* TX Hash confirmation */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold tracking-[0.25em] text-gray-400">
          Transaction Hash (optional – speeds up verification)
        </label>
        <input
          type="text"
          value={txHash}
          onChange={e => { setTxHash(e.target.value); setTxError(''); }}
          placeholder="0x... or txid..."
          className="w-full border-b border-gray-200 py-3 text-xs font-mono focus:border-black outline-none bg-transparent transition-colors placeholder:text-gray-300"
        />
        {txError && (
          <p className="text-[9px] uppercase font-bold tracking-widest text-[#C72f32]">{txError}</p>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading || !address}
        className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C72f32] transition-all disabled:opacity-40"
      >
        {loading ? 'confirming...' : "I've sent the payment"}
      </button>

      <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest leading-relaxed">
        Your order will be confirmed once our team verifies the transaction on-chain.
      </p>
    </div>
  );
}
