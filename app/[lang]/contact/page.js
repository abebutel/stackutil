import Link from 'next/link';

export default async function Contact({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
        <Link href={`/${lang}`} className="text-blue-600 font-bold mb-8 inline-block hover:underline">&larr; Back to Tools</Link>
        <h1 className="text-3xl font-black text-slate-800 mb-6">Contact Us</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-8">
          <p>We would love to hear from you. Whether you have a question about one of our tools, a suggestion for a new feature, or need to report a bug, your feedback helps make StackUtil better.</p>
        </div>

        {/* Contact Form */}
        <div className="bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-200">
          {/* NOTE: Replace the action URL with your free Formspree URL once you create an account */}
          <form action="https://formspree.io/f/mlgzgeob" method="POST" className="space-y-6">
            
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Your Email Address</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                required 
                className="w-full p-4 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
                placeholder="you@example.com" 
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">How can we help?</label>
              <textarea 
                name="message" 
                id="message" 
                rows="5" 
                required 
                className="w-full p-4 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow" 
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl transition-all shadow-md">
              Send Message
            </button>
            
          </form>
        </div>

      </div>
    </div>
  );
}