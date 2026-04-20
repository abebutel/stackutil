'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';

export default function QRGenerator() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dict, setDict] = useState(null);
  
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  useEffect(() => {
    getDictionary(lang).then(setDict).catch(() => getDictionary('en').then(setDict));
  }, [lang]);

  const [text, setText] = useState('https://stackutil.com');
  const [qrUrl, setQrUrl] = useState('');

  // Zero-cost QR Generation using goqr.me API
  useEffect(() => {
    if (text.trim() === '') {
      setQrUrl('');
      return;
    }
    const encodedText = encodeURIComponent(text);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedText}`);
  }, [text]);

  const handleDownload = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'stackutil-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  
  const navTools = [
    { title: dict?.tools.currency?.title || "Currency Converter", icon: "💱", link: `/${lang}/currency-converter` },
    { title: dict?.tools.password?.title || "Password Generator", icon: "💪", link: `/${lang}/password-generator` },
    { title: dict?.tools.qr?.title || "QR Code Generator", icon: "📱", link: `/${lang}/qr-generator` },
    { title: dict?.tools.time?.title || "Date & Time Converter", icon: "🌍", link: `/${lang}/time-converter` }
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
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-8 flex flex-col space-y-4 md:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{dict.nav?.tools || "Available Tools"}</span>
            {navTools.map((tool, idx) => (
              <Link key={idx} href={tool.link} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 font-medium">
                <span>{tool.icon}</span><span>{tool.title}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">📱 {dict?.tools.qr?.title || "QR Code Generator"}</h1>
        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">[AdSense Banner]</div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          
          <div className="w-full flex-1">
            <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Link or Text</label>
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL, text, or Wi-Fi details..."
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none font-medium mb-4"
            />
          </div>

          <div className="w-full flex-1 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <div className="w-48 h-48 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-6 shadow-sm overflow-hidden p-2">
              {qrUrl ? <img src={qrUrl} alt="Generated QR Code" className="w-full h-full object-contain" /> : <span className="text-slate-400">Waiting for input...</span>}
            </div>
            
            <button 
              onClick={handleDownload}
              disabled={!qrUrl}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-200"
            >
              Download PNG
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}