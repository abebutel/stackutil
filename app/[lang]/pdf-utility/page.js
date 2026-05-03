'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

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

// --- TOOL 2: VISUAL PDF SPLITTER ---
function SplitWorkspace({ dict }) {
  const [file, setFile] = useState(null);
  const [loadedPdf, setLoadedPdf] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState(new Set());
  
  // UI State Options
  const [extractMode, setExtractMode] = useState('all'); // 'all' or 'select'
  const [outputMode, setOutputMode] = useState('single'); // 'single' or 'multiple'
  const [isProcessing, setIsProcessing] = useState(false);

  // Read the PDF when uploaded to get the page count
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      
      setLoadedPdf(pdf);
      setTotalPages(count);
      
      // Default to all pages selected
      const allPages = new Set(Array.from({ length: count }, (_, i) => i));
      setSelectedPages(allPages);
      setExtractMode('all');
    } catch (error) {
      alert("Error reading PDF. It may be encrypted or corrupted.");
    }
    setIsProcessing(false);
  };

  // Handle clicking on a visual page card
  const togglePage = (pageIndex) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageIndex)) {
      newSelection.delete(pageIndex);
    } else {
      newSelection.add(pageIndex);
    }
    setSelectedPages(newSelection);
    setExtractMode('select'); // Automatically switch mode if they start picking pages
  };

  // Handle the 'Extract all pages' button
  const selectAllPages = () => {
    const allPages = new Set(Array.from({ length: totalPages }, (_, i) => i));
    setSelectedPages(allPages);
    setExtractMode('all');
  };

  const handleExtract = async () => {
    if (selectedPages.size === 0) return alert("Please select at least one page.");
    setIsProcessing(true);
    
    try {
      const validPages = Array.from(selectedPages).sort((a, b) => a - b);

      if (outputMode === 'single') {
        // Option 1: Output ONE merged PDF
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(loadedPdf, validPages);
        copiedPages.forEach((page) => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        downloadBlob(pdfBytes, `${file.name.replace('.pdf', '')}_extracted.pdf`, 'application/pdf');
      
      } else {
        // Option 2: Output MULTIPLE PDFs bundled in a ZIP
        const zip = new JSZip();
        
        for (let i = 0; i < validPages.length; i++) {
          const singlePdf = await PDFDocument.create();
          const [copiedPage] = await singlePdf.copyPages(loadedPdf, [validPages[i]]);
          singlePdf.addPage(copiedPage);
          
          const pdfBytes = await singlePdf.save();
          // Add to zip file: "Filename_Page_3.pdf"
          zip.file(`${file.name.replace('.pdf', '')}_Page_${validPages[i] + 1}.pdf`, pdfBytes);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipUrl = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = zipUrl;
        link.download = `${file.name.replace('.pdf', '')}_pages.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(zipUrl);
      }
    } catch (error) {
      console.error(error);
      alert("Error extracting pages.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Step 1: Upload */}
      {!loadedPdf && (
        <div className="max-w-xl mx-auto w-full border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
        </div>
      )}

      {/* Step 2: The Visual Workspace */}
      {loadedPdf && (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE: Visual Grid of Pages */}
          <div className="flex-grow bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-700">Document Pages ({totalPages})</h3>
              <button onClick={() => setLoadedPdf(null)} className="text-sm text-red-600 hover:underline">Change File</button>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto p-2">
              {Array.from({ length: totalPages }).map((_, index) => {
                const isSelected = selectedPages.has(index);
                return (
                  <div 
                    key={index} 
                    onClick={() => togglePage(index)}
                    className={`relative aspect-[1/1.4] rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center bg-white shadow-sm hover:shadow-md
                      ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                  >
                    {/* Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">
                        ✓
                      </div>
                    )}
                    <span className="text-4xl mb-2 text-slate-300">📄</span>
                    <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                      {index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Controls Panel */}
          <div className="lg:w-80 flex flex-col gap-6 shrink-0">
            
            {/* Extract Mode Toggle */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="font-bold text-slate-700 mb-3 text-sm">Extract mode:</p>
              <div className="flex gap-2">
                <button onClick={selectAllPages} className={`flex-1 py-2 px-2 rounded-lg text-sm font-semibold transition-colors border ${extractMode === 'all' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  {dict?.pdf_app?.split_mode_all || "All pages"}
                </button>
                <button onClick={() => setExtractMode('select')} className={`flex-1 py-2 px-2 rounded-lg text-sm font-semibold transition-colors border ${extractMode === 'select' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  {dict?.pdf_app?.split_mode_select || "Select pages"}
                </button>
              </div>
            </div>

            {/* Output Mode Toggle */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="font-bold text-slate-700 mb-3 text-sm">Output format:</p>
              <div className="flex flex-col gap-2">
                <button onClick={() => setOutputMode('single')} className={`w-full py-2 px-3 rounded-lg text-sm font-semibold text-left transition-colors border ${outputMode === 'single' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  📄 {dict?.pdf_app?.split_output_single || "Merge into one PDF"}
                </button>
                <button onClick={() => setOutputMode('multiple')} className={`w-full py-2 px-3 rounded-lg text-sm font-semibold text-left transition-colors border ${outputMode === 'multiple' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  🗂️ {dict?.pdf_app?.split_output_multiple || "Separate PDF files"}
                </button>
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed">
              {outputMode === 'single' 
                ? `The ${selectedPages.size} selected pages will be combined into a single new PDF document.`
                : `The ${selectedPages.size} selected pages will be converted into separate PDF files and downloaded as a ZIP archive.`
              }
            </div>

            {/* Action Button */}
            <button onClick={handleExtract} disabled={selectedPages.size === 0 || isProcessing} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-lg rounded-xl transition-all shadow-md mt-auto">
              {isProcessing 
                ? "Processing..." 
                : (outputMode === 'multiple' ? (dict?.pdf_app?.split_btn_zip || "Download ZIP") : (dict?.pdf_app?.split_btn_extract || "Extract Pages"))
              }
            </button>
          </div>
        </div>
      )}
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
  {activeTab === 'split' && <SplitWorkspace dict={dict} />} {/* <-- Pass dict here */}
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