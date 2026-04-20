import { NextResponse } from "next/server";

const locales = ['en', 'he'];
const defaultLocale = 'en';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the pathname already has a locale (e.g., /en/about or /he/contact)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // If no locale is present, redirect to the default English locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip Next.js internal files, images, and API routes
    '/((?!_next|api|favicon.ico|opengraph-image.png|ads.txt).*)',
  ],
};