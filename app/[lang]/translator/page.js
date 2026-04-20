'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';

// Top 12 most common languages for a clean UI
const LANGUAGES = {
  en: "English", es: "Spanish", fr: "French", he: "Hebrew",
  de: "German", it: "Italian", pt: "Portuguese", zh: "Chinese",
  ja: "Japanese", ar: "Arabic", ru: "Russian", hi: "Hindi"
};

export default function Translator() {
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

  // Translator States
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Set initial languages based on site locale
  useEffect(() => {
    if (lang === 'he') { setSourceLang('he'); setTargetLang('en'); }
    else if (lang === 'fr') { setSourceLang('fr'); setTargetLang('en'); }
    else if (lang === 'es') { setSourceLang('es'); setTargetLang('en'); }
    else { setSourceLang('en'); setTargetLang('es'); }
  }, [lang]);

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText('');
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    setIsLoading(true);
    try {
      // MyMemory Free Translation API
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${sourceLang}|${targetLang}`);
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        setOutputText(data.responseData.translatedText);
      } else {
        setOutputText(dict?.translator_app?.error || "Translation failed. Please try again.");
      }
    } catch (error) {
      setOutputText(dict?.translator_app?.error || "Translation failed. Please try again.");
    }
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isDictLoading || !dict) return <div className="min-h-screen bg-slate-50"></div>;

  const navTools = [
    { title: dict?.tools?.unit?.title || "Unit Converter", icon: "📏", link: `/${lang}/unit-converter` },
    { title: dict?.tools?.currency?.title || "Currency Converter", icon: "💱", link: `/${lang}/currency-converter` },
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

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">🗣️ {dict?.tools?.translator?.title || "Text Translator"}</h1>
        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">[AdSense Banner]</div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-8 mb-12">
          
          {/* Controls Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="w-full md:w-5/12">
              <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                {Object.entries(LANGUAGES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
              </select>
            </div>
            
            <button onClick={handleSwap} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm shrink-0" title="Swap Languages">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </button>

            <div className="w-full md:w-5/12">
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                {Object.entries(LANGUAGES).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
              </select>
            </div>
          </div>

          {/* Text Areas */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 relative">
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={dict?.translator_app?.source_text || "Enter text to translate..."}
                className="w-full h-48 md:h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl text-lg resize-none outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleTranslate}
                disabled={isLoading || !inputText}
                className="absolute bottom-4 right-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (dict?.translator_app?.translating || "Translating...") : (dict?.translator_app?.translate_btn || "Translate")}
              </button>
            </div>

            <div className="w-full md:w-1/2 relative">
              <textarea 
                value={outputText}
                readOnly
                placeholder={dict?.translator_app?.translation || "Translation will appear here..."}
                className="w-full h-48 md:h-64 p-4 bg-blue-50 border border-blue-100 rounded-xl text-lg resize-none outline-none text-blue-900"
                dir={['he', 'ar'].includes(targetLang) ? 'rtl' : 'ltr'}
              />
              <button 
                onClick={copyToClipboard}
                disabled={!outputText}
                className="absolute bottom-4 right-4 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {copied ? (dict?.translator_app?.copied || "Copied!") : (dict?.translator_app?.copy || "Copy")}
              </button>
            </div>
          </div>
        </div>

        <article className="prose prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">{dict?.translator_app?.article_title1 || "Machine Translation vs. Human Nuance"}</h2>
          <p className="mb-4 text-slate-600 leading-relaxed">{dict?.translator_app?.article_p1 || "Modern translation tools use advanced Neural Machine Translation (NMT) to predict the context of entire sentences rather than translating word-by-word. This makes them incredibly fast and reliable for everyday communication, travel, and basic document understanding."}</p>
          <h3 className="text-xl font-bold mb-3 mt-8 text-slate-800">{dict?.translator_app?.article_title2 || "The Limits of AI Translation"}</h3>
          <p className="text-slate-600 leading-relaxed">{dict?.translator_app?.article_p2 || "While perfect for quick utility, automated translators can still struggle with cultural idioms, heavy slang, and highly technical jargon. Always be cautious when translating legal or medical documents where nuance is critical."}</p>
        </article>
      </main>
    </div>
  );
}