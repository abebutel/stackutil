'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getDictionary } from '../getDictionary';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'es': '/es',
        'fr': '/fr',
        'he': '/he',
        'x-default': '/en', // Fallback for unmatched languages
      },
    },
  };
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dict, setDict] = useState(null);
  
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  useEffect(() => {
    getDictionary(lang)
      .then(setDict)
      .catch(() => getDictionary('en').then(setDict));
  }, [lang]);

  // Early return removed to stabilize the React component tree and prevent Error 310
  
  const toolsList = [
    {
      title: dict?.tools?.unit?.title || "Unit Converter",
      desc: dict?.tools?.unit?.desc || "Convert length, weight, temperature, area, and volume.",
      icon: "📏",
      link: `/${lang}/unit-converter`,
      color: "from-teal-400 to-emerald-500",
      bubbleLabel: dict?.tools?.unit?.bubble || "Units",
      bubbleIcon: "📏"
    },
    {
      title: dict?.tools?.currency?.title || "Currency Converter",
      desc: dict?.tools?.currency?.desc || "Check live and historical exchange rates.",
      icon: "💱",
      link: `/${lang}/currency-converter`,
      color: "from-orange-400 to-red-500",
      bubbleLabel: dict?.tools?.currency?.bubble || "Converter",
      bubbleIcon: "💵💶"
    },
    {
      title: dict?.tools?.clothing?.title || "Size Converter",
      desc: dict?.tools?.clothing?.desc || "Convert shoe and clothing sizes internationally.",
      icon: "👕",
      link: `/${lang}/clothing-converter`,
      color: "from-pink-400 to-rose-500",
      bubbleLabel: dict?.tools?.clothing?.bubble || "Sizes",
      bubbleIcon: "👕"
    },
    {
      title: dict?.tools?.time?.title || "Date & Time Converter",
      desc: dict?.tools?.time?.desc || "Compare global time zones and local sunrise/sunset.",
      icon: "🌍",
      link: `/${lang}/time-converter`,
      color: "from-purple-400 to-indigo-600",
      bubbleLabel: dict?.tools?.time?.bubble || "Time",
      bubbleIcon: "🌍"
    },
    {
      title: dict?.tools?.hebrew?.title || "Hebrew Date",
      desc: dict?.tools?.hebrew?.desc || "Convert between Gregorian and Hebrew calendar dates.",
      icon: "🕍",
      link: `/${lang}/hebrew-date`,
      color: "from-blue-500 to-indigo-600",
      bubbleLabel: dict?.tools?.hebrew?.bubble || "Hebrew Date",
      bubbleIcon: "🕍"
    },
    {
      title: dict?.tools?.password?.title || "Strong Password Generator",
      desc: dict?.tools?.password?.desc || "Create secure, randomized passwords instantly.",
      icon: "💪", 
      link: `/${lang}/password-generator`,
      color: "from-blue-400 to-blue-600",
      bubbleLabel: dict?.tools?.password?.bubble || "Password",
      bubbleIcon: "💪"
    },
    {
      title: dict?.tools?.translator?.title || "Text Translator",
      desc: dict?.tools?.translator?.desc || "Translate text instantly across dozens of languages.",
      icon: "🗣️", 
      link: `/${lang}/translator`,
      color: "from-indigo-400 to-purple-500",
      bubbleLabel: dict?.tools?.translator?.bubble || "Translate",
      bubbleIcon: "🗣️"
    },
    {
      title: dict?.tools?.qr?.title || "QR Code Generator",
      desc: dict?.tools?.qr?.desc || "Convert URLs and text to custom QR codes.",
      icon: "📱",
      link: `/${lang}/qr-generator`,
      color: "from-green-400 to-emerald-600",
      bubbleLabel: dict?.tools?.qr?.bubble || "QR Code",
      bubbleIcon: "📱"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href={`/${lang}`} className="text-2xl font-black tracking-tight text-slate-800">
            Stack<span className="text-blue-600">Util</span>
          </Link>
          
          <div className="flex items-center">
            <LanguageSwitcher />
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
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-8 flex flex-col space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {dict?.nav?.tools || "Available Tools"}
            </span>
            {toolsList.map((tool, idx) => (
              <Link key={idx} href={tool.link} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 font-medium">
                <span>{tool.icon}</span><span>{tool.title}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <header className="relative px-6 py-10 md:py-20 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 blur-3xl opacity-30 -z-10 rounded-full"></div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {dict?.home?.hero_title || "Free Everyday Web Tools."}
          </span>
        </h1>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mt-8">
          {toolsList.map((tool, idx) => (
            <Link key={idx} href={tool.link} className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-white hover:shadow-sm hover:border-blue-300 transition-all flex items-center gap-2">
              <span>{tool.bubbleIcon}</span>
              {tool.bubbleLabel}
            </Link>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 pb-24 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {toolsList.slice(0, 3).map((tool, idx) => (
            <Link href={tool.link} key={idx} className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl bg-gradient-to-br ${tool.color} text-white shadow-md`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
        
        <div className="w-full max-w-4xl mx-auto h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-10 rounded-lg">
          [AdSense Leaderboard 728x90]
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsList.slice(3).map((tool, idx) => (
            <Link href={tool.link} key={idx} className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl bg-gradient-to-br ${tool.color} text-white shadow-md`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          ))}
          <div className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed flex items-center justify-center text-slate-400 text-sm">
            [AdSense Native In-Feed Unit]
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 px-8 text-center text-slate-500 text-sm">
        <div className="max-w-3xl mx-auto mb-6">
          StackUtil is a comprehensive digital toolkit designed to streamline your daily tasks. From securing your online presence to calculating complex global time zone differences, our goal is to provide fast, reliable, and free utilities.
        </div>
        <div className="flex justify-center space-x-6">
          <Link href={`/${lang}/privacy`} className="hover:text-blue-600">Privacy Policy</Link>
          <Link href={`/${lang}/terms`} className="hover:text-blue-600">Terms of Service</Link>
          <Link href={`/${lang}/contact`} className="hover:text-blue-600">Contact</Link>
        </div>
      </footer>
    </div>
  );
}