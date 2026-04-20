'use client';
import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 1. Updated Tools Array (Currency first, Time last)
const tools = [
  {
    title: "Currency Converter",
    desc: "Check live and historical exchange rates.",
    icon: "💱",
    link: "/currency-converter",
    color: "from-orange-400 to-red-500"
  },
  {
    title: "Strong Password Generator",
    desc: "Create secure, randomized passwords instantly.",
    icon: "🔒",
    link: "/password-generator",
    color: "from-blue-400 to-blue-600"
  },
  {
    title: "QR Code Generator",
    desc: "Convert URLs and text to custom QR codes.",
    icon: "📱",
    link: "/qr-generator",
    color: "from-green-400 to-emerald-600"
  },
  {
    title: "Date & Time Converter",
    desc: "Compare global time zones and local sunrise/sunset.",
    icon: "🌍",
    link: "/time-converter",
    color: "from-purple-400 to-indigo-600"
  }
];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      {/* Updated Navigation with Collapsible Menu */}
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-800">
            Stack<span className="text-blue-600">Util</span>
          </Link>
          
          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:text-blue-600 focus:outline-none"
          >
            {/* Controls Container */}
<div className="flex items-center">
  <LanguageSwitcher />
  
  {/* Mobile Menu Toggle Button */}
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Collapsible Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-8 flex flex-col space-y-4 md:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Available Tools</span>
            {tools.map((tool, idx) => (
              <Link 
                key={idx} 
                href={tool.link} 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 font-medium"
              >
                <span>{tool.icon}</span>
                <span>{tool.title}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Streamlined Hero Section with Quick Links */}
      <header className="relative px-6 py-10 md:py-20 overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 blur-3xl opacity-30 -z-10 rounded-full"></div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Free Everyday Web Tools.
          </span>
        </h1>

        {/* Updated Quick Link Pills */}
<div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
  {tools.map((tool, idx) => {
    // Custom labels for the bubbles
    let label = tool.title.replace(' Generator', '').replace(' Converter', '');
    let icon = tool.icon;

    if (tool.link === "/currency-converter") {
      label = "Converter";
      icon = "💵💶"; // USD and Euro symbols
    }
    
    if (tool.link === "/password-generator") {
      label = "Password";
      icon = "💪"; // Muscular guy character
    }

    return (
      <Link 
        key={idx} 
        href={tool.link}
        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-white hover:shadow-sm hover:border-blue-300 transition-all flex items-center gap-2"
      >
        <span>{icon}</span>
        {label}
      </Link>
    );
  })}
</div>
      </header>

      {/* Tool Grid & Ad Integration */}
      <main className="max-w-6xl mx-auto px-8 pb-24">
        
        {/* Row 1: First 3 Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {tools.slice(0, 3).map((tool, idx) => (
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

        {/* Premium AdSlot #1: Leaderboard (Below Row 1) */}
        <div className="w-full max-w-4xl mx-auto h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-10 rounded-lg">
          [AdSense Leaderboard 728x90]
        </div>

        {/* Row 2: Remaining Tools & Native Ad */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.slice(3).map((tool, idx) => (
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
          
          {/* Native In-Feed Ad Placeholder inside the grid */}
          <div className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed flex items-center justify-center text-slate-400 text-sm">
            [AdSense Native In-Feed Unit]
          </div>
        </div>
      </main>

      {/* Trust Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-8 text-center text-slate-500 text-sm">
        <div className="max-w-3xl mx-auto mb-6">
          StackUtil is a comprehensive digital toolkit designed to streamline your daily tasks. From securing your online presence to calculating complex global time zone differences, our goal is to provide fast, reliable, and free utilities.
        </div>
        <div className="flex justify-center space-x-6">
          <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </div>
      </footer>
    </div>
  );
}