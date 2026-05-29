import { Inter } from "next/font/google";
import Script from "next/script";
import Link from "next/link"; // <-- Added Link import
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://stackutil.com'),
  title: "StackUtil | Your go to FREE online tools hub",
  description: "Your go to FREE online tools hub",
};

export default async function RootLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return (
    <html lang={lang} dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6470302408006463"
          crossOrigin="anonymous"
          strategy="beforeInteractive" 
        />
      </head>
      {/* Added flex classes to the body so the footer always pushes to the bottom */}
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        
        {/* Main Content */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="w-full bg-white border-t border-slate-200 py-8 mt-12">
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm font-semibold text-slate-500">
              <Link href={`/${lang}/about`} className="hover:text-blue-600 transition-colors">About Us</Link>
              <Link href={`/${lang}/contact`} className="hover:text-blue-600 transition-colors">Contact</Link>
              <Link href={`/${lang}/privacy`} className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href={`/${lang}/terms`} className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            </div>
            <p className="text-xs text-slate-400">&copy; 2026 StackUtil. All rights reserved.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}