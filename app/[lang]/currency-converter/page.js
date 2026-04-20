'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';

const CURRENCIES = {
  USD: { name: 'US Dollar', flag: '🇺🇸' },
  EUR: { name: 'Euro', flag: '🇪🇺' },
  ILS: { name: 'Israeli New Shekel', flag: '🇮🇱' },
  THB: { name: 'Thai Baht', flag: '🇹🇭' },
  GBP: { name: 'British Pound', flag: '🇬🇧' },
  MXN: { name: 'Mexican Peso', flag: '🇲🇽' },
  CNY: { name: 'Chinese Yuan', flag: '🇨🇳' },
  JPY: { name: 'Japanese Yen', flag: '🇯🇵' },
  CAD: { name: 'Canadian Dollar', flag: '🇨🇦' },
  AUD: { name: 'Australian Dollar', flag: '🇦🇺' },
  CHF: { name: 'Swiss Franc', flag: '🇨🇭' }
};

export default function CurrencyConverter() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dict, setDict] = useState(null);
  
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  useEffect(() => {
    getDictionary(lang).then(setDict).catch(() => getDictionary('en').then(setDict));
  }, [lang]);

  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState('1');
  const [fromCur, setFromCur] = useState('USD');
  const [toCur, setToCur] = useState('ILS');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      const cached = localStorage.getItem('stackutil_exchange_rates');
      if (cached) {
        const parsedData = JSON.parse(cached);
        if (Date.now() - parsedData.timestamp < 86400000) {
          setRates(parsedData.rates);
          setLastUpdated(parsedData.date);
          return;
        }
      }
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.result === 'success') {
          setRates(data.rates);
          setLastUpdated(data.time_last_update_utc.slice(0, 16));
          localStorage.setItem('stackutil_exchange_rates', JSON.stringify({
            rates: data.rates, date: data.time_last_update_utc.slice(0, 16), timestamp: Date.now()
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
    const amountInUSD = fromCur === 'USD' ? amountNum : amountNum / rates[fromCur];
    const finalAmount = amountInUSD * rates[toCur];
    return finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (!dict) return <div className="min-h-screen bg-slate-50"></div>;

  const navTools = [
    { title: dict.tools?.currency?.title || "Currency Converter", icon: "💱", link: `/${lang}/currency-converter` },
    { title: dict.tools?.password?.title || "Password Generator", icon: "💪", link: `/${lang}/password-generator` },
    { title: dict.tools?.qr?.title || "QR Code Generator", icon: "📱", link: `/${lang}/qr-generator` },
    { title: dict.tools?.time?.title || "Date & Time Converter", icon: "🌍", link: `/${lang}/time-converter` }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href={`/${lang}`} className="text-2xl font-black tracking-tight text-slate-800">
            Stack<span className="text-blue-600">Util</span>
          </Link>
          <div className="flex items-center">
            <LanguageSwitcher />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:text-blue-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-8 flex flex-