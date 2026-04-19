import { Inter } from "next/font/google";
import Script from "next/script"; // This was missing
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StackUtil | Free Everyday Web Tools",
  description: "Instantly generate passwords, convert currencies, and format data right in your browser. Fast, secure, and built for modern workflows.",
  metadataBase: new URL('https://stackutil.com'),
  openGraph: {
    title: 'StackUtil | Free Everyday Web Tools',
    description: 'convert currencies, generate qr codes & more - FREE',
    url: 'https://stackutil.com',
    siteName: 'StackUtil',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense with more aggressive strategy for verification */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6470302408006463"
          crossOrigin="anonymous"
          strategy="beforeInteractive" 
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}