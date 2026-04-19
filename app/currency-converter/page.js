'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CURRENCIES = {
  USD: { name: 'US Dollar', flag: '🇺🇸' },
  EUR: { name: 'Euro', flag: '🇪🇺' },
  ILS: { name: 'Israeli New Shekel', flag: '🇮🇱' },
  GBP: { name: 'British Pound', flag: '🇬🇧' },
  MXN: { name: 'Mexican Peso', flag: '🇲🇽' },
  CNY: { name: 'Chinese Yuan', flag: '🇨🇳' },
  JPY: { name: 'Japanese Yen', flag: '🇯🇵' },
  CAD: { name: 'Canadian Dollar', flag: '🇨🇦' },
  AUD: { name: 'Australian Dollar', flag: '🇦🇺' },
  CHF: { name: 'Swiss Franc', flag: '🇨🇭' },
  THB: { name: 'Thai Baht', flag: '🇹🇭' },
};

export default function CurrencyConverter() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tools = [
    { title: "Strong Password Generator", icon: "🔒", link: "/password-generator" },
    { title: "QR Code Generator", icon: "📱", link: "/qr-generator" },
    { title: "Date & Time Converter", icon: "🌍", link: "/time-converter" },
    { title: "Currency Converter", icon: "💱", link: "/currency-converter" }
  ];

  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState('1');
  const [fromCur, setFromCur] = useState('USD');
  const [toCur, setToCur] = useState('ILS');
  const [lastUpdated, setLastUpdated] = useState('');

  // Zero-Cost Caching Strategy
  useEffect(() => {
    const fetchRates = async () => {
      const cached = localStorage.getItem('stackutil_exchange_rates');
      if (cached) {
        const parsedData = JSON.parse(cached);
        // If data is less than 24 hours old, use the cache
        if (Date.now() - parsedData.timestamp < 86400000) {
          setRates(parsedData.rates);
          setLastUpdated(parsedData.date);
          return;
        }
      }

      // Otherwise, fetch fresh data (Free tier, no API key required)
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.result === 'success') {
          setRates(data.rates);
          setLastUpdated(data.time_last_update_utc.slice(0, 16));
          // Save to cache
          localStorage.setItem('stackutil_exchange_rates', JSON.stringify({
            rates: data.rates,
            date: data.time_last_update_utc.slice(0, 16),
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error("Failed to fetch rates", error);
      }
    };

    fetchRates();
  }, []);

  const handleSwap = () => {
    setFromCur(toCur);
    setToCur(fromCur);
  };

  const getConvertedAmount = () => {
    if (!rates || !amount) return '0.00';
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return '0.00';
    
    // Convert to USD first (base), then to target
    const amountInUSD = fromCur === 'USD' ? amountNum : amountNum / rates[fromCur];
    const finalAmount = amountInUSD * rates[toCur];
    
    return finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Navigation */}
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-800">
            Stack<span className="text-blue-600">Util</span>
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:text-blue-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-8 flex flex-col space-y-4 md:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Available Tools</span>
            {tools.map((tool, idx) => (
              <Link key={idx} href={tool.link} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 font-medium">
                <span>{tool.icon}</span><span>{tool.title}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">Live Currency Converter</h1>

        {/* AdSense Top Slot */}
        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">
          [AdSense Banner]
        </div>

        {/* Converter App */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-400 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* From */}
            <div className="w-full flex-1">
              <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Amount</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden">
                <select 
                  value={fromCur} 
                  onChange={(e) => setFromCur(e.target.value)}
                  className="bg-transparent font-bold text-slate-700 py-4 pl-4 pr-2 outline-none cursor-pointer border-r border-slate-200"
                >
                  {Object.entries(CURRENCIES).map(([code, {flag}]) => (
                    <option key={code} value={code}>{flag} {code}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent py-4 px-4 text-2xl font-black text-slate-800 outline-none"
                  min="0"
                />
              </div>
            </div>

            {/* Swap Button */}
            <button 
              onClick={handleSwap}
              className="mt-6 md:mt-0 p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm"
              title="Swap Currencies"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </button>

            {/* To */}
            <div className="w-full flex-1">
              <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Converted</label>
              <div className="flex items-center bg-slate-100 border border-transparent rounded-xl overflow-hidden">
                <select 
                  value={toCur} 
                  onChange={(e) => setToCur(e.target.value)}
                  className="bg-slate-200 font-bold text-slate-700 py-4 pl-4 pr-2 outline-none cursor-pointer"
                >
                  {Object.entries(CURRENCIES).map(([code, {flag}]) => (
                    <option key={code} value={code}>{flag} {code}</option>
                  ))}
                </select>
                <div className="w-full bg-transparent py-4 px-4 text-2xl font-black text-blue-600 overflow-hidden text-ellipsis">
                  {rates ? getConvertedAmount() : 'Loading...'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-400">
            {rates ? `Market rates last updated: ${lastUpdated} UTC` : 'Fetching live exchange rates...'}
            <div className="mt-8 text-center">
  <p className="text-sm text-slate-400 mb-2">
    {rates ? `Market rates last updated: ${lastUpdated} UTC` : 'Fetching live exchange rates...'}
  </p>
  <Link href="/contact" className="text-xs text-blue-500 hover:underline">
    Need another currency? Request it here.
  </Link>
</div>
          </div>
        </div>

        
        {/* SEO Article */}
        <article className="prose prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Understanding Exchange Rates</h2>
          <p className="mb-4 text-slate-600 leading-relaxed">
            Exchange rates dictate the value of one currency against another, fluctuating constantly based on global economics, inflation rates, and geopolitical events. Whether you are pricing international goods, buying raw materials overseas, or budgeting a vacation, accurate currency conversion is vital.
          </p>
          <p className="text-slate-600 leading-relaxed">
            When using a currency converter, you are typically seeing the "interbank" rate—the rate banks use when trading with each other. Consumer rates at airports or credit card processors will often include a slight markup. Tracking these market rates daily helps you forecast future costs for global transactions and maintain healthy profit margins.
          </p>
        </article>
      </main>
    </div>
  );
}