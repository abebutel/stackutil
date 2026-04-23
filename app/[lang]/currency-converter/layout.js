export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}/currency-converter`,
      languages: {
        'en': '/en/currency-converter',
        'es': '/es/currency-converter',
        'fr': '/fr/currency-converter',
        'he': '/he/currency-converter',
        'x-default': '/en/currency-converter',
      },
    },
  };
}

export default function Layout({ children }) {
  return children;
}