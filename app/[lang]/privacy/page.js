import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8 md:p-24">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">← Back to Home</Link>
        <h1 className="text-3xl font-black mb-6">Privacy Policy</h1>
        <p className="mb-4">At StackUtil, your privacy is our top priority. Our tools are designed to be "client-side," meaning your data stays in your browser.</p>
        <h2 className="text-xl font-bold mt-8 mb-4">1. No Data Collection</h2>
        <p className="mb-4">Tools like our Password Generator and QR Code Generator process data locally on your device. We do not store, view, or transmit your passwords or text inputs to our servers.</p>
        <h2 className="text-xl font-bold mt-8 mb-4">2. Cookies & Advertising</h2>
        <p className="mb-4">We use Google AdSense to serve ads. Google may use cookies to serve ads based on your prior visits to this website or other websites.</p>
        <p>You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600">Google Ad Settings</a>.</p>
      </div>
    </div>
  );
}