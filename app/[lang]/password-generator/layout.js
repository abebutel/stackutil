export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return {
    alternates: {
      canonical: `/${lang}/password-generator`,
      languages: {
        'en': '/en/password-generator',
        'es': '/es/password-generator',
        'fr': '/fr/password-generator',
        'he': '/he/password-generator',
        'x-default': '/en/password-generator',
      },
    },
  };
}

export default function Layout({ children }) {
  return children;
}