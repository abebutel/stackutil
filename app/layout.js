import { Inter } from "next/font/google";
import Script from "next/script"; // This was missing
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StackUtil | Free Everyday Web Tools",
  description: "convert currencies, generate qr codes and more - FREE.",
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