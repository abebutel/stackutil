export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}/pdf-utility`,
      languages: {
        'en': '/en/pdf-utility',
        'es': '/es/pdf-utility',
        'fr': '/fr/pdf-utility',
        'he': '/he/pdf-utility',
        'x-default': '/en/pdf-utility',
      },
    },
  };
}

export default function Layout({ children }) {
  return children;
}