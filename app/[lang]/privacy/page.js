import Link from 'next/link';

export default async function Privacy({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <Link href={`/${lang}`} className="text-blue-600 font-bold mb-8 inline-block hover:underline">&larr; Back to Tools</Link>
        <h1 className="text-3xl font-black text-slate-800 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
          <p><strong>Last Updated: May 2026</strong></p>
          <p>At StackUtil, we respect your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
          
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">1. Data Processing</h3>
          <p>The majority of the tools on StackUtil (such as the Password Generator and Unit Converter) process data entirely locally within your web browser. This means your inputs are never sent to or stored on our servers.</p>
          
          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">2. Third-Party APIs</h3>
          <p>Some tools require external data to function properly. For example, our Currency Converter securely connects to ExchangeRate-API, and our Text Translator utilizes the MyMemory Translation API. When using these specific tools, your search parameters may be processed by these third-party services.</p>

          <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">3. Google AdSense & Cookies</h3>
          <p>We use Google AdSense to display advertisements on StackUtil. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet. Users may opt-out of personalized advertising by visiting Google Ads Settings.</p>
        </div>
      </div>
    </div>
  );
}