import Link from 'next/link';

export default async function Contact({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <Link href={`/${lang}`} className="text-blue-600 font-bold mb-8 inline-block hover:underline">&larr; Back to Tools</Link>
        <h1 className="text-3xl font-black text-slate-800 mb-6">Contact Us</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
          <p>We would love to hear from you. Whether you have a question about one of our tools, a suggestion for a new feature, or need to report a bug, your feedback helps make StackUtil better.</p>
          <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Get in Touch</h3>
            <p className="text-slate-600 mb-4">You can reach our support team directly via email:</p>
            <a href="mailto:support@stackutil.com" className="text-xl font-black text-blue-600 hover:text-blue-800">support@stackutil.com</a>
          </div>
          <p className="text-sm text-slate-400 text-center mt-8">Please allow 24-48 hours for a response to general inquiries.</p>
        </div>
      </div>
    </div>
  );
}