import { Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StackUtil | Free Everyday Web Tools",
  description: "Your go to FREE online tools hub",
};

// We receive the `lang` parameter from the folder structure
export default function RootLayout({ children, params: { lang } }) {
  return (
    // Set text direction to RTL if Hebrew, otherwise LTR
    <html lang={lang} dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <head>
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