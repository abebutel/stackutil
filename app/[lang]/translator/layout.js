export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}/translator`,
      languages: {
        'en': '/en/translator',
        'es': '/es/translator',
        'fr': '/fr/translator',
        'he': '/he/translator',
        'x-default': '/en/translator',
      },
    },
  };
}

export default function Layout({ children }) {
  return children;
}