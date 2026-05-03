'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';
import { PDFDocument } from 'pdf-lib';

// --- HELPER FUNCTION: Trigger Download ---
const downloadBlob = (bytes, filename, mimeType) => {
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// --- TOOL 1: PDF MERGER ---
function MergeWorkspace() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleMerge = async () => {
    if (files.length < 2) return alert("Please select at least 2 PDFs to merge.");
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      downloadBlob(pdfBytes, 'stackutil-merged.pdf', 'application/pdf');
    } catch (error) {
      console.error(error);
      alert("Error merging PDFs. Ensure they are valid, unencrypted PDF files.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
        <input type="file" accept=".pdf" multiple onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
      </div>
      {files.length > 0 && (
        <ul className="text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {files.map((f, i) => <li key={i} className="truncate">📄 {f.name}</li>)}
        </ul>
      )}
      <button onClick={handleMerge} disabled={files.length < 2 || isProcessing} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-lg rounded-xl transition-all shadow-md">
        {isProcessing ? "Processing..." : "Merge PDFs"}
      </button>
    </div>
  );
}

// --- TOOL 2: PDF SPLITTER ---
function SplitWorkspace() {
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSplit = async () => {
    if (!file || !pageRange) return alert("Please upload a PDF and enter a page range.");
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();
      
      // Convert user input "1, 3-5" into a clean array of zero-indexed numbers
      const pagesToExtract = new Set();
      const parts = pageRange.split(',');
      for (let part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim()));
          for (let i = start; i <= end; i++) pagesToExtract.add(i - 1);
        } else {
          pagesToExtract.add(parseInt(part.trim()) - 1);
        }
      }

      const validPages = Array.from(pagesToExtract).filter(p => p >= 0 && p < totalPages).sort((a,b) => a-b);
      
      if (validPages.length === 0) throw new Error("Invalid page range");

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, validPages);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      downloadBlob(pdfBytes, 'stackutil-extracted.pdf', 'application/pdf');
    } catch (error) {
      console.error(error);
      alert("Error splitting PDF. Please check your page range syntax (e.g., '1, 3-5').");
    }
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
      </div>
      <input type="text" placeholder="Pages to extract (e.g. 1, 3-5, 8)" value={pageRange} onChange={(e) => setPageRange(e.target.value)} className="w-full p-4 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-700" />
      <button onClick={handleSplit} disabled={!file || !pageRange || isProcessing} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-lg rounded-xl transition-all shadow-md">
        {isProcessing ? "Processing..." : "Extract Pages"}
      </button>
    </div>
  );
}

// --- TOOL 3: IMAGE TO PDF ---
function ImageWorkspace() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return alert("Please select images.");
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg') image = await pdfDoc.embedJpg(imageBytes);
        else if (file.type === 'image/png') image = await pdfDoc.embedPng(imageBytes);
        else continue; // Skip unsupported types

        // Add a blank page matching the image dimensions
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const pdfBytes = await pdfDoc.save();
      downloadBlob(pdfBytes, 'stackutil-images.pdf', 'application/pdf');
    } catch (error) {
      console.error(error);
      alert("Error converting images. Please ensure they are valid JPG or PNG files.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
        <input type="file" accept="image/jpeg, image/png" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
      </div>
      {files.length > 0 && (
        <ul className="text-sm text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {files.map((f, i) => <li key={i} className="truncate">🖼️ {f.name}</li>)}
        </ul>
      )}
      <button onClick={handleConvert} disabled={files.length === 0 || isProcessing} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-lg rounded-xl transition-all shadow-md">
        {isProcessing ? "Processing..." : "Convert to PDF"}
      </button>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function PdfUtility() {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';
  const [dict, setDict] = useState(null);
  const [activeTab, setActiveTab] = useState('merge');

  useEffect(() => {
    getDictionary(lang).then(setDict).catch(() => getDictionary('en').then(setDict));
  }, [lang]);

  if (!dict) return <div className="min-h-screen bg-slate-50"></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20" dir={lang === 'he' ? 'rtl' : 'ltr'}>
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

        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <button onClick={() => setActiveTab('merge')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${activeTab === 'merge' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
            {dict.pdf_app?.tab_merge || "Merge PDFs"}
          </button>
          <button onClick={() => setActiveTab('split')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${activeTab === 'split' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
            {dict.pdf_app?.tab_split || "Split PDF"}
          </button>
          <button onClick={() => setActiveTab('image')} className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${activeTab === 'image' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
            {dict.pdf_app?.tab_image || "Image to PDF"}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 min-h-[400px] flex items-center justify-center">
          {activeTab === 'merge' && <MergeWorkspace />}
          {activeTab === 'split' && <SplitWorkspace />}
          {activeTab === 'image' && <ImageWorkspace />}
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