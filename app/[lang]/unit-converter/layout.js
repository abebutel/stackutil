export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}/unit-converter`,
      languages: {
        'en': '/en/unit-converter',
        'es': '/es/unit-converter',
        'fr': '/fr/unit-converter',
        'he': '/he/unit-converter',
        'x-default': '/en/unit-converter',
      },
    },
  };
}

export default function Layout({ children }) {
  return children;
}