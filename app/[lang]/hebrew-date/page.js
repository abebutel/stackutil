'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';

const GREG_MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// The API strictly requires these exact English strings, so we keep them as a constant fallback
const HEB_MONTHS_API = ["Nisan", "Iyyar", "Sivan", "Tamuz", "Av", "Elul", "Tishrei", "Cheshvan", "Kislev", "Tevet", "Sh'vat", "Adar I", "Adar II", "Adar"];

export default function HebrewDate() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dict, setDict] = useState(null);
  
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';
  const [isDictLoading, setIsDictLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsDictLoading(true);
    getDictionary(lang).then((newDict) => {
      if (isMounted) { setDict(newDict); setIsDictLoading(false); }
    }).catch(() => {
      getDictionary('en').then((fallbackDict) => {
        if (isMounted) { setDict(fallbackDict); setIsDictLoading(false); }
      });
    });
    return () => { isMounted = false; };
  }, [lang]);

  // States
  const [todayHebrew, setTodayHebrew] = useState('');
  const [todayGreg, setTodayGreg] = useState('');
  const [mode, setMode] = useState('g2h'); 
  
  const [gDay, setGDay] = useState(new Date().getDate());
  const [gMonth, setGMonth] = useState(new Date().getMonth() + 1);
  const [gYear, setGYear] = useState(new Date().getFullYear());
  
  const [hDay, setHDay] = useState(1);
  const [hMonth, setHMonth] = useState('Tishrei');
  const [hYear, setHYear] = useState(5784);

  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamically load translated month arrays
  const displayGregMonths = dict?.hebrew_app?.greg_months || GREG_MONTHS_EN;
  const displayHebMonths = dict?.hebrew_app?.heb_months || HEB_MONTHS_API;

  useEffect(() => {
    const fetchToday = async () => {
      const today = new Date();
      const gy = today.getFullYear();
      const gm = today.getMonth() + 1;
      const gd = today.getDate();

      setTodayGreg(today.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      
      try {
        const res = await fetch(`https://www.hebcal.com/converter?cfg=json&gy=${gy}&gm=${gm}&gd=${gd}&g2h=1&strict=1`);
        const data = await res.json();
        
        setTodayHebrew(lang === 'he' ? data.hebrew : `${data.hd} ${data.hm} ${data.hy}`);
        
        setHDay(data.hd);
        setHMonth(data.hm); // API strictly uses English internally
        setHYear(data.hy);
      } catch (err) {
        console.error("Failed to fetch current date", err);
      }
    };
    fetchToday();
  }, [lang]);

  const handleConvert = async () => {
    setIsLoading(true);
    try {
      let url = '';
      if (mode === 'g2h') {
        url = `https://www.hebcal.com/converter?cfg=json&gy=${gYear}&gm=${gMonth}&gd=${gDay}&g2h=1&strict=1`;
      } else {
        url = `https://www.hebcal.com/converter?cfg=json&hy=${hYear}&hm=${hMonth}&hd=${hDay}&h2g=1&strict=1`;
      }
      const res = await fetch(url);
      const data = await res.json();
      
      if (mode === 'g2h') {
        setResult(lang === 'he' ? data.hebrew : `${data.hd} ${data.hm} ${data.hy}`);
      } else {
        const gregDate = new Date(data.gy, data.gm - 1, data.gd);
        setResult(gregDate.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      }
    } catch (err) {
      setResult('Error calculating date.');
    }
    setIsLoading(false);
  };

  if (isDictLoading || !dict) return <div className="min-h-screen bg-slate-50"></div>;

  const navTools = [
    { title: dict?.tools?.unit?.title || "Unit Converter", icon: "📏", link: `/${lang}/unit-converter` },
    { title: dict?.tools?.currency?.title || "Currency Converter", icon: "💱", link: `/${lang}/currency-converter` },
    { title: dict?.tools?.clothing?.title || "Size Converter", icon: "👕", link: `/${lang}/clothing-converter` },
    { title: dict?.tools?.time?.title || "Date & Time Converter", icon: "🌍", link: `/${lang}/time-converter` },
    { title: dict?.tools?.hebrew?.title || "Hebrew Date", icon: "🕍", link: `/${lang}/hebrew-date` },
    { title: dict?.tools?.translator?.title || "Text Translator", icon: "🗣️", link: `/${lang}/translator` },
    { title: dict?.tools?.password?.title || "Password Generator", icon: "💪", link: `/${lang}/password-generator` },
    { title: dict?.tools?.qr?.title || "QR Code Generator", icon: "📱", link: `/${lang}/qr-generator` }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href={`/${lang}`} className="text-2xl font-black tracking-tight text-slate-800">
            Stack<span className="text-blue-600">Util</span>
          </Link>
          <div className="flex items-center gap-4">
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

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">🕍 {dict?.tools?.hebrew?.title || "Hebrew Date Converter"}</h1>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 mb-8 text-white flex flex-col items-center justify-center text-center">
          <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-2">{dict?.hebrew_app?.today || "Today's Date"}</p>
          <h2 className="text-3xl font-black mb-1">{todayHebrew || '...'}</h2>
          <p className="text-lg text-blue-100">{todayGreg}</p>
        </div>

        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">[AdSense Banner]</div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-12">
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button onClick={() => { setMode('g2h'); setResult(''); }} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === 'g2h' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              {dict?.hebrew_app?.g2h || "Gregorian to Hebrew"}
            </button>
            <button onClick={() => { setMode('h2g'); setResult(''); }} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === 'h2g' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              {dict?.hebrew_app?.h2g || "Hebrew to Gregorian"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{dict?.hebrew_app?.day || "Day"}</label>
              <input type="number" value={mode === 'g2h' ? gDay : hDay} onChange={(e) => mode === 'g2h' ? setGDay(e.target.value) : setHDay(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500" min="1" max="31" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{dict?.hebrew_app?.month || "Month"}</label>
              <select value={mode === 'g2h' ? gMonth : hMonth} onChange={(e) => mode === 'g2h' ? setGMonth(e.target.value) : setHMonth(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                {mode === 'g2h' 
                  ? displayGregMonths.map((m, i) => <option key={`g-${i}`} value={i+1}>{m}</option>)
                  : displayHebMonths.map((m, i) => <option key={`h-${i}`} value={HEB_MONTHS_API[i]}>{m}</option>) /* Show translated text, but save English API string as value */
                }
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{dict?.hebrew_app?.year || "Year"}</label>
              <input type="number" value={mode === 'g2h' ? gYear : hYear} onChange={(e) => mode === 'g2h' ? setGYear(e.target.value) : setHYear(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <button onClick={handleConvert} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl transition-all shadow-md mb-8">
            {isLoading ? (dict?.hebrew_app?.loading || "Calculating...") : (dict?.hebrew_app?.convert || "Convert Date")}
          </button>

          {result && (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <p className="text-sm font-bold text-slate-400 uppercase mb-2">{dict?.hebrew_app?.result || "Conversion Result"}</p>
              <p className="text-3xl font-black text-blue-600">{result}</p>
            </div>
          )}
          
          <p className="text-xs text-slate-400 mt-4 text-center">{dict?.hebrew_app?.sunset_warning || "* Note: Hebrew dates begin at sunset the night before."}</p>
        </div>

        <article className="prose prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">{dict?.hebrew_app?.article_title1 || "Understanding the Lunisolar Calendar"}</h2>
          <p className="mb-4 text-slate-600 leading-relaxed">{dict?.hebrew_app?.article_p1 || "Unlike the Gregorian calendar, which is strictly solar (based on the Earth's revolution around the sun), the Hebrew calendar is 'lunisolar'. This means the months are based on the phases of the moon, while the years are synchronized with the solar seasons."}</p>
          <h3 className="text-xl font-bold mb-3 mt-8 text-slate-800">{dict?.hebrew_app?.article_title2 || "The 19-Year Leap Cycle"}</h3>
          <p className="text-slate-600 leading-relaxed">{dict?.hebrew_app?.article_p2 || "A purely lunar year is about 354 days long, falling 11 days short of the solar year. Without adjustment, holidays like Passover (a spring festival) would drift into winter. To prevent this, the Hebrew calendar uses a 19-year cycle where an entire 'leap month' (Adar I) is added 7 times during the cycle, keeping the calendar perfectly aligned with the seasons."}</p>
        </article>
      </main>
    </div>
  );
}