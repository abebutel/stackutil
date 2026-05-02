import Link from 'next/link';

export default async function About({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <Link href={`/${lang}`} className="text-blue-600 font-bold mb-8 inline-block hover:underline">&larr; Back to Tools</Link>
        <h1 className="text-3xl font-black text-slate-800 mb-6">About StackUtil</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
          <p>Welcome to StackUtil, your go-to destination for fast, reliable, and free online utilities.</p>
          <p>StackUtil was born out of a simple frustration: finding a quick conversion tool or calculator online usually meant navigating through a maze of pop-ups, paywalls, and bloated websites. We wanted to build something better.</p>
          <p>Our mission is to provide a clean, user-friendly hub of everyday tools that process data securely and quickly. Whether you are calculating exchange rates across the globe, generating secure passwords, or converting Hebrew dates, our tools are designed to be frictionless.</p>
          <p>We are constantly expanding our lineup of tools. Thank you for making StackUtil a part of your daily workflow!</p>
        </div>
      </div>
    </div>
  );
}