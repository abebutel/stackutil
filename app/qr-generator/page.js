'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRCodeGenerator() {
  const [text, setText] = useState('https://stackutil.com');
  const [fgColor, setFgColor] = useState('#0f172a'); // Slate 900
  const [bgColor, setBgColor] = useState('#ffffff');
  const qrRef = useRef();

  const downloadPNG = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'StackUtil_QRCode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Simple Header */}
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

      <main className="max-w-4xl mx-auto px-6 pt-12">
        export default function PasswordGenerator() { // (or QRCodeGenerator / TimeConverter)
  
  // 1. Add the mobile menu toggle state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. Add the tools array so the menu can render the links
  const tools = [
    { title: "Strong Password Generator", icon: "🔒", link: "/password-generator" },
    { title: "QR Code Generator", icon: "📱", link: "/qr-generator" },
    { title: "Date & Time Converter", icon: "🌍", link: "/time-converter" },
    { title: "Currency Converter", icon: "💱", link: "/currency-converter" }
  ];

  // ... the rest of your existing state variables (password, length, etc.)
        <h1 className="text-3xl font-bold mb-8">Free QR Code Generator</h1>

        {/* AdSense Top Slot */}
        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">
          [AdSense Banner]
        </div>

        {/* Tool UI Layout */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          
          {/* Controls Panel */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-slate-800">Enter URL or Text</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Code Color</label>
                <div className="flex items-center space-x-3">
                  <input 
                    type="color" 
                    value={fgColor} 
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-sm text-slate-500 uppercase">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Background Color</label>
                <div className="flex items-center space-x-3">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-sm text-slate-500 uppercase">{bgColor}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={downloadPNG} 
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download High-Quality PNG
            </button>
          </div>

          {/* Preview Panel */}
          <div className="w-full md:w-80 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wider">Live Preview</p>
            <div 
              ref={qrRef} 
              className="p-4 rounded-xl shadow-inner border border-slate-100 flex items-center justify-center transition-all"
              style={{ backgroundColor: bgColor }}
            >
              <QRCodeCanvas 
                value={text || 'https://stackutil.com'} 
                size={200} 
                bgColor={bgColor} 
                fgColor={fgColor} 
                level={"H"} // High error correction
                includeMargin={false}
              />
            </div>
            <p className="text-xs text-slate-400 mt-6 text-center">
              Code updates automatically as you type.
            </p>
          </div>
        </div>

        {/* SEO Article */}
        <article className="prose prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">How to Maximize the Value of QR Codes</h2>
          <p className="mb-4 text-slate-600 leading-relaxed">
            QR codes bridge the gap between the physical and digital worlds instantly. While they are incredibly popular for opening website URLs, their utility goes much further. Our free generator allows you to create high-resolution, customized codes that fit perfectly with your brand identity.
          </p>
          <h3 className="text-xl font-bold mb-3 mt-8 text-slate-800">Smart Use Cases for Business and Daily Life:</h3>
          <ul className="list-disc pl-6 space-y-3 text-slate-600 marker:text-blue-500">
            <li><strong>Product Packaging & Authentication:</strong> Manufacturers can place a custom-colored QR code on product packaging that links directly to authenticity certificates, warranty registration, or care instructions.</li>
            <li><strong>Contactless Menus & Payments:</strong> Restaurants and retail shops use them to direct customers to digital menus or payment gateways like PayPal and Venmo seamlessly.</li>
            <li><strong>Networking:</strong> Generate a QR code for your digital business card (vCard) or LinkedIn profile. When scanned, your professional information saves directly into the scanner's phone.</li>
            <li><strong>Wi-Fi Access:</strong> Hospitality hosts or office managers can generate a code that instantly connects guests to a secure Wi-Fi network without forcing them to type out complex passwords.</li>
          </ul>
        </article>
      </main>
    </div>
  );
}