export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}/qr-generator`,
      languages: {
        'en': '/en/qr-generator',
        'es': '/es/qr-generator',
        'fr': '/fr/qr-generator',
        'he': '/he/qr-generator',
        'x-default': '/en/qr-generator',
      },
    },
  };
}

export default function Layout({ children }) {
  return children;
}