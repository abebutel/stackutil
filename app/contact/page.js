import Link from 'next/link';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-10 text-center">
        <div className="text-4xl mb-4">📧</div>
        <h1 className="text-2xl font-bold mb-4">Get in Touch</h1>
        <p className="text-slate-600 mb-8">
          Have a suggestion for a new tool or need another currency added to our converter? We'd love to hear from you.
        </p>
        <a 
          href="mailto:support@stackutil.com" 
          className="inline-block w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          Email support@stackutil.com
        </a>
        <div className="mt-8">
          <Link href="/" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
            ← Back to StackUtil
          </Link>
        </div>
      </div>
    </div>
  );
}