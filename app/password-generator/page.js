'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasswordGenerator() {
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

    // Guarantee minimums
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

    // Combine and shuffle
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
      {/* Simple Header */}
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <Link href="/" className="text-xl font-black tracking-tight text-slate-800 hover:opacity-80">
          Stack<span className="text-blue-600">Util</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold mb-8">Strong Password Generator</h1>

        {/* AdSense Top Slot */}
        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">
          [AdSense Banner]
        </div>

        {/* Tool UI Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12">
          {/* Output Display */}
          <div className="relative flex items-center bg-slate-100 rounded-xl p-4 mb-8 border border-slate-200">
            <input 
              type="text" 
              value={password} 
              readOnly 
              className="bg-transparent w-full text-2xl font-mono tracking-wider text-slate-800 focus:outline-none"
            />
            <button onClick={generatePassword} className="p-2 hover:bg-slate-200 rounded-lg transition-colors mr-2 text-xl" title="Regenerate">
              🔄
            </button>
            <button onClick={copyToClipboard} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-semibold">Password Length</label>
                <span className="text-blue-600 font-bold">{length}</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="128" 
                value={length} 
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={includeUpper} onChange={() => setIncludeUpper(!includeUpper)} className="w-5 h-5 accent-blue-600 rounded" />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={includeLower} onChange={() => setIncludeLower(!includeLower)} className="w-5 h-5 accent-blue-600 rounded" />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="w-5 h-5 accent-blue-600 rounded" />
                <span>Numbers (0-9)</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="w-5 h-5 accent-blue-600 rounded" />
                <span>Symbols (!@#$%)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm text-slate-500 mb-1">Minimum Numbers</label>
                <input type="number" min="0" value={minNumbers} onChange={(e) => setMinNumbers(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-1">Minimum Symbols</label>
                <input type="number" min="0" value={minSymbols} onChange={(e) => setMinSymbols(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* SEO Article */}
        <article className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold mb-4">The Importance of Strong Passwords</h2>
          <p className="mb-4 text-slate-600 leading-relaxed">
            In an era where automated brute-force attacks can test billions of password combinations per second, a simple phrase or personal date is no longer enough to protect your accounts. A strong password acts as the frontline defense for your financial data, business emails, and personal privacy.
          </p>
          <h3 className="text-xl font-bold mb-3 mt-8">What Makes a Password Truly Secure?</h3>
          <p className="mb-4 text-slate-600 leading-relaxed">
            A secure password isn't just about complexity; it's about length and unpredictability. Cybersecurity experts recommend passwords that are at least 14 characters long and include a random mix of uppercase letters, lowercase letters, numbers, and symbols. 
          </p>
          <p className="text-slate-600 leading-relaxed">
            Avoid using dictionary words, sequential numbers (like 1234), or easily guessable information. By using a random generator, you eliminate human bias, creating a cryptographic string that would take modern computers centuries to crack. Remember to pair your strong, unique passwords with a reputable password manager and Two-Factor Authentication (2FA) for maximum security.
          </p>
        </article>
      </main>
    </div>
  );
}