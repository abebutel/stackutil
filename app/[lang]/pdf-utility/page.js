'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { getDictionary } from '../../../getDictionary';

export default function PdfUtility() {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';
  const [dict, setDict] = useState(null);
  
  // Tab State: 'merge', 'split', or 'image'
  const [activeTab, setActiveTab] = useState('merge');

  useEffect(() => {
    getDictionary(lang).then(setDict).catch(() => getDictionary('en').then(setDict));
  }, [lang]);

  if (!dict) return <div className="min-h-screen bg-slate-50"></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href={`/${lang}`} className="text-2xl font-black tracking-tight text-slate-800 hover:opacity-80 transition-opacity">
            Stack<span className="text-blue-600">Util</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/${lang}`} className="text-blue-600 font-bold hover:underline flex items-center gap-2">
            <span dir="ltr">{lang === 'he' ? '→' : '←'}</span> Back to Tools
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-10 text-slate-800">
          {dict.pdf_app?.title || "Secure PDF Utilities"}
        </h1>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab('merge')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${activeTab === 'merge' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {dict.pdf_app?.tab_merge || "Merge PDFs"}
          </button>
          <button 
            onClick={() => setActiveTab('split')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${activeTab === 'split' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {dict.pdf_app?.tab_split || "Split PDF"}
          </button>
          <button 
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${activeTab === 'image' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {dict.pdf_app?.tab_image || "Image to PDF"}
          </button>
        </div>

        {/* Tool Workspace Area (Logic goes here next!) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 min-h-[400px] flex items-center justify-center">
          <p className="text-slate-400 font-semibold text-lg">
            {activeTab === 'merge' && "PDF Merge Workspace Ready..."}
            {activeTab === 'split' && "PDF Split Workspace Ready..."}
            {activeTab === 'image' && "Image to PDF Workspace Ready..."}
          </p>
        </div>

        {/* AdSense SEO Article */}
        <article className="prose prose-slate max-w-none bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100 mt-12">
          <h2 className="text-2xl md:text-3xl font-black mb-8 text-slate-800 border-b border-slate-100 pb-4">
            {dict?.pdf_app?.article_title || "The Ultimate Browser-Based PDF Toolkit"}
          </h2>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                {dict?.pdf_app?.how_to_title || "How to Merge, Split, and Convert"}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {dict?.pdf_app?.how_to_text || "Select your desired tool from the tabs above..."}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-slate-800 flex items-center gap-2">
                🔒 {dict?.pdf_app?.privacy_title || "Why Client-Side Processing Matters"}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {dict?.pdf_app?.privacy_text || "Most free PDF websites force you to upload your sensitive documents..."}
              </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                💡 {dict?.pdf_app?.faq_title || "Frequently Asked Questions"}
              </h3>
              <h4 className="text-lg font-semibold text-slate-700 mb-2">
                {dict?.pdf_app?.faq_q1 || "Is there a limit to the file size I can process?"}
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                {dict?.pdf_app?.faq_a1 || "Because the processing utilizes your device's local memory..."}
              </p>
            </section>
          </div>
        </article>

      </main>
    </div>
  );
}