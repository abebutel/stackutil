'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';

export default function Home() {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';
  const [dict, setDict] = useState(null);
  const [isDictLoading, setIsDictLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsDictLoading(true);
    getDictionary(lang).then((newDict) => {
      if (isMounted) {
        setDict(newDict);
        setIsDictLoading(false);
      }
    }).catch(() => {
      getDictionary('en').then((fallbackDict) => {
        if (isMounted) {
          setDict(fallbackDict);
          setIsDictLoading(false);
        }
      });
    });

    return () => { isMounted = false; };
  }, [lang]);

  if (isDictLoading || !dict) {
    return <div className="min-h-screen bg-slate-50"></div>;
  }

  // All 8 Tools properly sequenced
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
      title: dict?.tools?.translator?.title || "Text Translator",
      desc: dict?.tools?.translator?.desc || "Translate text instantly across dozens of languages.",
      icon: "🗣️", 
      link: `/${lang}/translator`,
      color: "from-indigo-400 to-purple-500",
      bubbleLabel: dict?.tools?.translator?.bubble || "Translate",
      bubbleIcon: "🗣️"
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="text-2xl font-black tracking-tight text-slate-800">
            Stack<span className="text-blue-600">Util</span>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* NEW HERO SECTION WITH AD SENSE TEXT */}
      <header className="py-16 px-6 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-800">
          Stack<span className="text-blue-600">Util</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-4">
          {dict?.home_seo?.hero_subtitle || "Your Comprehensive Digital Toolkit"}
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {dict?.home_seo?.hero_desc || "StackUtil provides fast, reliable, and free online utilities to streamline your daily tasks. From securing your online presence to calculating complex global time zone differences, everything runs instantly right in your browser."}
        </p>
      </header>

      {/* Main Tools Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsList.map((tool, index) => (
            <Link key={index} href={tool.link} className="group block h-full">
              <div className="bg-white rounded-2xl p-6 h-full border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center text-3xl shadow-inner bg-gradient-to-br ${tool.color}`}>
                  {tool.icon}
                </div>
                <h2 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-slate-500 leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* NEW SEO TEXT BLOCK (Replaces the old superfluous links) */}
        <section className="mt-24 max-w-4xl mx-auto bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {dict?.home_seo?.seo_title || "Why Choose StackUtil?"}
          </h2>
          <div className="prose prose-slate text-slate-600 space-y-4">
            <p>{dict?.home_seo?.seo_p1 || "In today's fast-paced digital world, finding a quick conversion tool or calculator usually means navigating through a maze of pop-ups and bloated websites. StackUtil is different. We built a clean, friction-free hub of everyday tools that process your data securely and instantly."}</p>
            <p>{dict?.home_seo?.seo_p2 || "Whether you are a developer needing a strong password, a traveler checking exchange rates, or a student converting metric units, our tools are designed to work seamlessly across all your devices. Because we utilize client-side processing for most of our utilities, your private data never even leaves your screen."}</p>
          </div>
        </section>

      </main>
    </div>
  );
}