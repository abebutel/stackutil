'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract the current language from the URL (e.g., /en/password-generator -> en)
  const currentLocale = pathname.split('/')[1] || 'en';

  const switchLanguage = (e) => {
    const newLocale = e.target.value;
    const pathSegments = pathname.split('/');
    pathSegments[1] = newLocale; // Swap the language code
    router.push(pathSegments.join('/')); // Navigate to the new URL
  };

  return (
    <select
      value={currentLocale}
      onChange={switchLanguage}
      className="bg-transparent text-sm font-bold text-slate-600 cursor-pointer focus:outline-none hover:text-blue-600 transition-colors mr-2 sm:mr-4 border-none appearance-none"
    >
      <option value="en">🇺🇸 EN</option>
      <option value="es">🇪🇸 ES</option>
      <option value="fr">🇫🇷 FR</option>
      <option value="he">🇮🇱 HE</option>
    </select>
  );
}