export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}/time-converter`,
      languages: {
        'en': '/en/time-converter',
        'es': '/es/time-converter',
        'fr': '/fr/time-converter',
        'he': '/he/time-converter',
        'x-default': '/en/time-converter',
      },
    },
  };
}

export default function Layout({ children }) {
  return children;
}