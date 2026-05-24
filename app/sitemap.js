export default function sitemap() {
  const baseUrl = 'https://stackutil.com';
  
  // Your supported languages
  const languages = ['en', 'es', 'fr', 'he'];
  
  // All your tool and legal routes
  const routes = [
    '', // This represents the homepage for each language
    '/unit-converter',
    '/currency-converter',
    '/clothing-converter',
    '/time-converter',
    '/hebrew-date',
    '/translator',
    '/password-generator',
    '/qr-generator',
    '/pdf-utility',
    '/about',
    '/contact',
    '/privacy',
    '/terms'
  ];

  const sitemapEntries = [];

  // Generate a URL for every route in every language
  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}