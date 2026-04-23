export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}/hebrew-date`,
      languages: {
        'en': '/en/hebrew-date',
        'es': '/es/hebrew-date',
        'fr': '/fr/hebrew-date',
        'he': '/he/hebrew-date',
        'x-default': '/en/hebrew-date',
      },
    },
  };
}

export default function Layout({ children }) {
  return children;
}