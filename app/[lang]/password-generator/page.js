'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasswordGenerator() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tools = [
    { title: "Currency Converter", icon: "💱", link: "/currency-converter" },
    { title: "Strong Password Generator", icon: "💪", link: "/password-generator" },
    { title: "QR Code Generator", icon: "📱", link: "/qr-generator" },
    { title: "Date & Time Converter", icon: "🌍", link: "/time-converter" }
  ];

  const [password, setPassword] = useState('');
  const [length, setLength] = useState(14);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [minNumbers, setMinNumbers] = useState(1);
  const [minSymbols, setMinSymbols] = useState(1);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    let newPassword = '';
    
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (includeUpper) charset += upper;
    if (includeLower) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === '') return setPassword('');

    let guaranteedChars = '';
    if (includeNumbers) {
      for (let i = 0; i < minNumbers; i++) {
        guaranteedChars += numbers[Math.floor(Math.random() * numbers.length)];
      }
    }
    if (includeSymbols) {
      for (let i = 0; i < minSymbols; i++) {
        guaranteedChars += symbols[Math.floor(Math.random() * symbols.length)];
      }
    }

    const remainingLength = Math.max(0, length - guaranteedChars.length);
    
    for (let i = 0; i < remainingLength; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    const finalPassword = (guaranteedChars + newPassword).split('').sort(() => 0.5 - Math.random()).join('').slice(0, length);
    setPassword(finalPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, minNumbers, minSymbols]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-800">
            Stack<span className="text-blue-600">Util</span>
          </Link>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:text-blue-600 focus:outline-none">
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
                <span>{tool.icon}</span>
                <span>{tool.title}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold mb-8">💪 Password Generator</h1>

        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">
          [AdSense Banner]
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12">
          <div className="relative flex items-center bg-slate-100 rounded-xl p-4 mb-8 border border-slate-200">
            <input type="text" value={password} readOnly className="bg-transparent w-full text-2xl font-mono tracking-wider text-slate-800 focus:outline-none" />
            <button onClick={generatePassword} className="p-2 hover:bg-slate-200 rounded-lg transition-colors mr-2 text-xl" title="Regenerate">🔄</button>
            <button onClick={copyToClipboard} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="font-semibold text-slate-700">Password Length</label>
                {/* NEW: Input field linked to the slider */}
                <input 
                  type="number" 
                  min="5" 
                  max="128" 
                  value={length} 
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-20 p-2 text-center font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input 
                type="range" 
                min="5" 
                max="128" 
                value={length} 
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={includeUpper} onChange={() => setIncludeUpper(!includeUpper)} className="w-5 h-5 accent-blue-600 rounded" />
                <span className="text-sm font-medium">Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={includeLower} onChange={() => setIncludeLower(!includeLower)} className="w-5 h-5 accent-blue-600 rounded" />
                <span className="text-sm font-medium">Lowercase (a-z)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="w-5 h-5 accent-blue-600 rounded" />
                <span className="text-sm font-medium">Numbers (0-9)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="w-5 h-5 accent-blue-600 rounded" />
                <span className="text-sm font-medium">Symbols (!@#$%)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1">Min Numbers</label>
                <input type="number" min="0" value={minNumbers} onChange={(e) => setMinNumbers(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1">Min Symbols</label>
                <input type="number" min="0" value={minSymbols} onChange={(e) => setMinSymbols(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <article className="prose prose-slate max-w-none bg-white p-8 rounded-2xl border border-slate-100">
          <h2 className="text-2xl font-bold mb-4">The Importance of Strong Passwords</h2>
          <p className="mb-4 text-slate-600 leading-relaxed">In an era where automated brute-force attacks can test billions of combinations per second, a simple phrase is no longer enough. A strong password acts as the frontline defense for your privacy.</p>
          <h3 className="text-xl font-bold mb-3 mt-8">What Makes a Password Truly Secure?</h3>
          <p className="mb-4 text-slate-600 leading-relaxed">Experts recommend passwords that are at least 14 characters long and include a random mix of characters. By using a random generator, you eliminate human bias and create a cryptographic string that is mathematically difficult to crack.</p>
        </article>
      </main>
    </div>
  );
}