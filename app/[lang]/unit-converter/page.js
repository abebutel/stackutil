'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';

const UNITS = {
  Length: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.34, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 },
  Weight: { Gram: 1, Kilogram: 1000, Milligram: 0.001, "Metric Ton": 1000000, Pound: 453.592, Ounce: 28.3495, "Troy Ounce": 31.1035 },
  Area: { "Square Meter": 1, "Square Kilometer": 1000000, Hectare: 10000, Acre: 4046.86, "Square Mile": 2589988.11, "Square Foot": 0.092903, "Square Inch": 0.00064516 },
  Volume: { Liter: 1, Milliliter: 0.001, "Cubic Meter": 1000, "US Gallon": 3.78541, "US Quart": 0.946353, "US Pint": 0.473176, "US Cup": 0.236588, "US Fluid Ounce": 0.0295735 },
  Temperature: { Celsius: 'C', Fahrenheit: 'F', Kelvin: 'K' }
};

export default function UnitConverter() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dict, setDict] = useState(null);
  
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  useEffect(() => {
    getDictionary(lang).then(setDict).catch(() => getDictionary('en').then(setDict));
  }, [lang]);

  const categories = Object.keys(UNITS);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  
  const [fromUnit, setFromUnit] = useState(Object.keys(UNITS[categories[0]])[0]);
  const [toUnit, setToUnit] = useState(Object.keys(UNITS[categories[0]])[1]);
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');

  useEffect(() => {
    const categoryUnits = Object.keys(UNITS[activeCategory]);
    setFromUnit(categoryUnits[0]);
    setToUnit(categoryUnits[1]);
    setFromValue('1');
  }, [activeCategory]);

  useEffect(() => {
    if (fromValue === '') { setToValue(''); return; }
    const val = parseFloat(fromValue);
    if (isNaN(val)) return;
    if (!UNITS[activeCategory][fromUnit] || !UNITS[activeCategory][toUnit]) return;

    if (activeCategory === 'Temperature') {
      let tempCelsius;
      if (fromUnit === 'Celsius') tempCelsius = val;
      else if (fromUnit === 'Fahrenheit') tempCelsius = (val - 32) * 5 / 9;
      else if (fromUnit === 'Kelvin') tempCelsius = val - 273.15;

      let finalTemp;
      if (toUnit === 'Celsius') finalTemp = tempCelsius;
      else if (toUnit === 'Fahrenheit') finalTemp = (tempCelsius * 9 / 5) + 32;
      else if (toUnit === 'Kelvin') finalTemp = tempCelsius + 273.15;
      setToValue(Number(finalTemp.toFixed(4)).toString());
    } else {
      const baseValue = val * UNITS[activeCategory][fromUnit];
      const finalValue = baseValue / UNITS[activeCategory][toUnit];
      setToValue(Number(finalValue.toPrecision(7)).toString());
    }
  }, [fromValue, fromUnit, toUnit, activeCategory]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
  };

  const navTools = [
    { title: dict?.tools?.unit?.title || "Unit Converter", icon: "📏", link: `/${lang}/unit-converter` },
    { title: dict?.tools?.currency?.title || "Currency Converter", icon: "💱", link: `/${lang}/currency-converter` },
    { title: dict?.tools?.time?.title || "Date & Time Converter", icon: "🌍", link: `/${lang}/time-converter` },
    { title: dict?.tools?.password?.title || "Password Generator", icon: "💪", link: `/${lang}/password-generator` },
    { title: dict?.tools?.qr?.title || "QR Code Generator", icon: "📱", link: `/${lang}/qr-generator` }
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
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-8 flex flex-col space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{dict?.nav?.tools || "Available Tools"}</span>
            {navTools.map((tool, idx) => (
              <Link key={idx} href={tool.link} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 font-medium">
                <span>{tool.icon}</span><span>{tool.title}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">📏 {dict?.tools?.unit?.title || "Unit Converter"}</h1>
        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">[AdSense Banner]</div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 md:p-4 mb-12">
          <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-100 mb-6 pb-2 px-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${activeCategory === cat ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="p-4 md:p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-full flex-1">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden">
                  <input type="number" value={fromValue} onChange={(e) => setFromValue(e.target.value)} className="w-full bg-transparent py-6 px-6 text-2xl font-black text-slate-800 outline-none" placeholder="0" />
                  <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="bg-slate-100 font-bold text-slate-700 py-6 px-4 outline-none cursor-pointer border-l border-slate-200 h-full min-w-[140px]">
                    {Object.keys(UNITS[activeCategory]).map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSwap} className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm shrink-0" title="Swap Units">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              </button>
              <div className="w-full flex-1">
                <div className="flex items-center bg-slate-100 border border-transparent rounded-xl overflow-hidden">
                  <div className="w-full bg-transparent py-6 px-6 text-2xl font-black text-blue-600 overflow-hidden text-ellipsis">{toValue || '0'}</div>
                  <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="bg-slate-200 font-bold text-slate-700 py-6 px-4 outline-none cursor-pointer border-l border-slate-300 h-full min-w-[140px]">
                    {Object.keys(UNITS[activeCategory]).map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <article className="prose prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">{dict?.unit_app?.article_title1 || "The Global Measurement Divide"}</h2>
          <p className="mb-4 text-slate-600 leading-relaxed">{dict?.unit_app?.article_p1 || "The world largely operates on two distinct systems..."}</p>
          <h3 className="text-xl font-bold mb-3 mt-8 text-slate-800">{dict?.unit_app?.article_title2 || "The Metric System: A Base-10 Revolution"}</h3>
          <p className="mb-4 text-slate-600 leading-relaxed">{dict?.unit_app?.article_p2 || "Born out of the French Revolution in 1799..."}</p>
          <h3 className="text-xl font-bold mb-3 mt-8 text-slate-800">{dict?.unit_app?.article_title3 || "The Imperial and Avoirdupois Systems"}</h3>
          <p className="mb-4 text-slate-600 leading-relaxed">{dict?.unit_app?.article_p3 || "The British Imperial and US Customary systems..."}</p>
          <p className="text-slate-600 leading-relaxed">{dict?.unit_app?.article_p4 || "When sourcing raw materials globally..."}</p>
        </article>
      </main>
    </div>
  );
}