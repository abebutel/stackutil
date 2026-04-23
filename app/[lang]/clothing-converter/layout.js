export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}/clothing-converter`,
      languages: {
        'en': '/en/clothing-converter',
        'es': '/es/clothing-converter',
        'fr': '/fr/clothing-converter',
        'he': '/he/clothing-converter',
        'x-default': '/en/clothing-converter',
      },
    },
  };
}

export default function Layout({ children }) {
  return children;
}