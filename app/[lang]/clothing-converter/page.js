'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';

// Regional Size Matrices
const SIZE_DATA = {
  shoes: {
    men: {
      US: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13", "14"],
      UK: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12", "13"],
      EU: ["40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "46", "47", "48", "49"],
      JP: ["25", "25.5", "26", "26.5", "27", "27.5", "28", "28.5", "29", "29.5", "30", "31", "32"]
    },
    women: {
      US: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"],
      UK: ["3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"],
      EU: ["35", "36", "37", "37.5", "38", "38.5", "39", "40", "41", "41.5", "42", "42.5", "43"],
      JP: ["22", "22.5", "23", "23.5", "24", "24.5", "25", "25.5", "26", "26.5", "27", "27.5", "28"]
    },
    kids: {
      US: ["10", "11", "12", "13", "1", "2", "3", "4", "5", "6"],
      UK: ["9", "10", "11", "12", "13", "1", "2", "3", "4", "5"],
      EU: ["27", "28", "30", "31", "32", "33", "34", "36", "37", "38"],
      JP: ["16", "17", "18", "19", "20", "21", "22", "23", "24", "25"]
    }
  },
  clothing: {
    men: {
      US: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
      UK: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
      EU: ["44", "46", "48", "50", "52", "54", "56"],
      JP: ["S", "M", "L", "LL", "3L", "4L", "5L"]
    },
    women: {
      US: ["0", "2", "4", "6", "8", "10", "12", "14", "16"],
      UK: ["4", "6", "8", "10", "12", "14", "16", "18", "20"],
      EU: ["32", "34", "36", "38", "40", "42", "44", "46", "48"],
      JP: ["5", "7", "9", "11", "13", "15", "17", "19", "21"]
    }
  }
};

export default function ClothingConverter() {
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
  const [category, setCategory] = useState('shoes');
  const [gender, setGender] = useState('men');
  const [fromRegion, setFromRegion] = useState('US');
  const [toRegion, setToRegion] = useState('EU');
  
  // We need to reset the size selection if the category/gender changes
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  // Handle cascading resets
  useEffect(() => {
    setSelectedSizeIndex(0);
    // If we switch to clothing and kids is selected, fallback to men (since we didn't do kids clothing matrix to keep it clean)
    if (category === 'clothing' && gender === 'kids') {
      setGender('men');
    }
  }, [category, gender]);

  const handleSwap = () => {
    const temp = fromRegion;
    setFromRegion(toRegion);
    setToRegion(temp);
  };

  const getResult = () => {
    const matrix = SIZE_DATA[category]?.[gender];
    if (!matrix) return "-";
    return matrix[toRegion][selectedSizeIndex] || "-";
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

  const currentMatrix = SIZE_DATA[category]?.[gender];
  const fromSizesArray = currentMatrix ? currentMatrix[fromRegion] : [];

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

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">👕 {dict?.tools?.clothing?.title || "Size Converter"}</h1>
        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">[AdSense Banner]</div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 mb-12 relative overflow-hidden">
          
          {/* Category & Gender Selectors */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{dict?.clothing_app?.category || "Category"}</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setCategory('shoes')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${category === 'shoes' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>👟 {dict?.clothing_app?.shoes || "Shoes"}</button>
                <button onClick={() => setCategory('clothing')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${category === 'clothing' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>👕 {dict?.clothing_app?.clothing || "Clothing"}</button>
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{dict?.clothing_app?.gender || "Gender"}</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setGender('men')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${gender === 'men' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>{dict?.clothing_app?.men || "Men"}</button>
                <button onClick={() => setGender('women')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${gender === 'women' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>{dict?.clothing_app?.women || "Women"}</button>
                {category === 'shoes' && (
                  <button onClick={() => setGender('kids')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${gender === 'kids' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>{dict?.clothing_app?.kids || "Kids"}</button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 mb-8"></div>

          {/* Converter UI */}
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-full flex-1">
              <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{dict?.clothing_app?.from || "From Region"}</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden">
                <select value={fromRegion} onChange={(e) => setFromRegion(e.target.value)} className="bg-transparent font-bold text-slate-700 py-4 pl-4 pr-2 outline-none cursor-pointer border-r border-slate-200">
                  <option value="US">US</option>
                  <option value="UK">UK</option>
                  <option value="EU">EU</option>
                  <option value="JP">JP</option>
                </select>
                <select value={selectedSizeIndex} onChange={(e) => setSelectedSizeIndex(parseInt(e.target.value))} className="w-full bg-transparent py-4 px-4 text-2xl font-black text-slate-800 outline-none cursor-pointer">
                  {fromSizesArray.map((sizeStr, index) => (
                    <option key={index} value={index}>{sizeStr}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button onClick={handleSwap} className="mt-6 md:mt-0 p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm shrink-0" title="Swap">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </button>
            
            <div className="w-full flex-1">
              <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{dict?.clothing_app?.to || "To Region"}</label>
              <div className="flex items-center bg-slate-100 border border-transparent rounded-xl overflow-hidden">
                <select value={toRegion} onChange={(e) => setToRegion(e.target.value)} className="bg-slate-200 font-bold text-slate-700 py-4 pl-4 pr-2 outline-none cursor-pointer border-r border-slate-300">
                  <option value="US">US</option>
                  <option value="UK">UK</option>
                  <option value="EU">EU</option>
                  <option value="JP">JP</option>
                </select>
                <div className="w-full bg-transparent py-4 px-4 text-2xl font-black text-blue-600 overflow-hidden text-ellipsis flex items-center">
                  {getResult()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <article className="prose prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">{dict?.clothing_app?.article_title1 || "Navigating International Sizing"}</h2>
          <p className="mb-4 text-slate-600 leading-relaxed">{dict?.clothing_app?.article_p1 || "Buying clothes or shoes from overseas can be frustrating. A size 8 shoe in the US is completely different from a size 8 in the UK, and clothing sizes in Europe and Asia use entirely different baseline measurements."}</p>
          <h3 className="text-xl font-bold mb-3 mt-8 text-slate-800">{dict?.clothing_app?.article_title2 || "Why Sizes Vary"}</h3>
          <p className="text-slate-600 leading-relaxed">{dict?.clothing_app?.article_p2 || "Different regions developed their sizing standards independently. US and UK sizes historically rely on inches and the Imperial system, while EU and JP sizes rely on centimeters and the metric system. Always double-check specific brand sizing charts, as 'vanity sizing' can cause variations even within the same country!"}</p>
        </article>
      </main>
    </div>
  );
}