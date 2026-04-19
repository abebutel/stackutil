import Link from 'next/link';

export default function Home() {
  const tools = [
    {
      title: "Strong Password Generator",
      desc: "Create secure, randomized passwords instantly.",
      icon: "🔒",
      link: "/password-generator",
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "QR Code Generator",
      desc: "Convert URLs and text to custom QR codes.",
      icon: "📱",
      link: "/qr-generator",
      color: "from-green-400 to-emerald-600"
    },
    {
      title: "Date & Time Converter",
      desc: "Compare global time zones and local sunrise/sunset.",
      icon: "🌍",
      link: "/time-converter",
      color: "from-purple-400 to-indigo-600"
    },
    {
      title: "Currency Converter",
      desc: "Check live and historical exchange rates.",
      icon: "💱",
      link: "/currency-converter",
      color: "from-orange-400 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="text-2xl font-black tracking-tight text-slate-800">
          Stack<span className="text-blue-600">Util</span>
        </div>
        <div className="hidden md:flex space-x-4">
          <input 
            type="text" 
            placeholder="Search tools..." 
            className="px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </nav>

      {/* Hero Section with Gradient Mesh */}
      <header className="relative px-8 py-20 overflow-hidden text-center">
  {/* Keep the gradient mesh background */}
  <div className="absolute top-0 left-1/2 w-full max-w-3xl h-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 blur-3xl opacity-30 -z-10 rounded-full"></div>

  {/* This is the streamlined, gradient centerpiece headline */}
  <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-8">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
      Free Everyday Web Tools.
    </span>
  </h1>
</header>

      {/* Tool Grid & Ad Integration */}
      <main className="max-w-6xl mx-auto px-8 pb-24">
        
        {/* Row 1: First 3 Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {tools.slice(0, 3).map((tool, idx) => (
            <Link href={tool.link} key={idx} className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl bg-gradient-to-br ${tool.color} text-white shadow-md`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Premium AdSlot #1: Leaderboard (Below Row 1) */}
        <div className="w-full max-w-4xl mx-auto h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-10 rounded-lg">
          [AdSense Leaderboard 728x90]
        </div>

        {/* Row 2: Remaining Tools & Native Ad */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.slice(3).map((tool, idx) => (
            <Link href={tool.link} key={idx} className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-2xl bg-gradient-to-br ${tool.color} text-white shadow-md`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          ))}
          
          {/* Native In-Feed Ad Placeholder inside the grid */}
          <div className="relative bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed flex items-center justify-center text-slate-400 text-sm">
            [AdSense Native In-Feed Unit]
          </div>
        </div>
      </main>

      {/* Trust Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-8 text-center text-slate-500 text-sm">
        <div className="max-w-3xl mx-auto mb-6">
          StackUtil is a comprehensive digital toolkit designed to streamline your daily tasks. From securing your online presence to calculating complex global time zone differences, our goal is to provide fast, reliable, and free utilities.
        </div>
        <div className="flex justify-center space-x-6">
          <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </div>
      </footer>
    </div>
  );
}