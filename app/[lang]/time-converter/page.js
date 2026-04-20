'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { getDictionary } from '../../getDictionary';

export default function TimeConverter() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dict, setDict] = useState(null);
  
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  useEffect(() => {
    getDictionary(lang).then(setDict).catch(() => getDictionary('en').then(setDict));
  }, [lang]);

  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedCities, setSelectedCities] = useState([]);
  const [localSunData, setLocalSunData] = useState({ city: '', sunrise: null, sunset: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(res => res.json())
      .then(geo => {
        fetch(`https://api.sunrise-sunset.org/json?lat=${geo.latitude}&lng=${geo.longitude}&formatted=0`)
          .then(res => res.json())
          .then(data => {
            if (data.status === "OK") {
              setLocalSunData({ city: geo.city || 'Local Area', sunrise: new Date(data.results.sunrise), sunset: new Date(data.results.sunset) });
            }
          });
      }).catch(err => console.error("Geo fetch failed", err));
    return () => clearInterval(timer);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length < 2) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) { console.error("Search failed", err); }
    setIsSearching(false);
  };

  const addCity = async (cityData) => {
    if (selectedCities.length >= 4) return;
    const cityName = `${cityData.name}, ${cityData.country_code || cityData.country}`;
    if (selectedCities.find(c => c.name === cityName)) { setSearchQuery(''); setSearchResults([]); return; }
    setSearchQuery(''); setSearchResults([]);
    try {
      const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${cityData.latitude}&lng=${cityData.longitude}&formatted=0`);
      const data = await res.json();
      setSelectedCities([...selectedCities, {
        name: cityName, tz: cityData.timezone,
        sunrise: data.status === "OK" ? new Date(data.results.sunrise) : null,
        sunset: data.status === "OK" ? new Date(data.results.sunset) : null
      }]);
    } catch (err) { console.error("Failed", err); }
  };

  const removeCity = (cityName) => setSelectedCities(selectedCities.filter(c => c.name !== cityName));

  
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const navTools = [
    { title: dict?.tools?.unit?.title || "Unit Converter", icon: "📏", link: `/${lang}/unit-converter` },
    { title: dict?.tools?.currency?.title || "Currency Converter", icon: "💱", link: `/${lang}/currency-converter` },
    { title: dict?.tools?.time?.title || "Date & Time Converter", icon: "🌍", link: `/${lang}/time-converter` },
    { title: dict?.tools?.password?.title || "Password Generator", icon: "💪", link: `/${lang}/password-generator` },
    { title: dict?.tools?.qr?.title || "QR Code Generator", icon: "📱", link: `/${lang}/qr-generator` }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href={`/${lang}`} className="text-2xl font-black tracking-tight text-slate-800">
            Stack<span className="text-blue-600">Util</span>
          </Link>
          <div className="flex items-center">
            <LanguageSwitcher />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:text-blue-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-8 flex flex-col space-y-4 md:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{dict.nav?.tools || "Available Tools"}</span>
            {navTools.map((tool, idx) => (
              <Link key={idx} href={tool.link} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 font-medium">
                <span>{tool.icon}</span><span>{tool.title}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">🌍 {dict?.tools.time?.title || "Date & Time Converter"}</h1>
        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">[AdSense Banner]</div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <p className="text-indigo-100 font-semibold mb-1 uppercase tracking-wider text-sm">{localSunData.city ? `Local Time (${localSunData.city})` : 'Your Local Time'}</p>
              <h2 className="text-5xl font-black mb-2 tracking-tight">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</h2>
              <p className="text-xl font-medium text-indigo-50">{time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="mt-6 md:mt-0 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 flex gap-6">
              <div><p className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Sunrise 🌅</p><p className="font-semibold text-lg">{localSunData.sunrise ? localSunData.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p></div>
              <div><p className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Sunset 🌙</p><p className="font-semibold text-lg">{localSunData.sunset ? localSunData.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 relative">
            <h3 className="text-xl font-bold text-slate-800">Compare Cities ({selectedCities.length}/4)</h3>
            <div className="relative z-20 min-w-[280px] w-full md:w-auto">
              <input type="text" placeholder={isSearching ? "Searching..." : "+ Search for a city..."} value={searchQuery} onChange={handleSearch} disabled={selectedCities.length >= 4} className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
              <span className="absolute left-3 top-3 text-slate-400 text-lg">🔍</span>
              {searchResults.length > 0 && (
                <ul className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden max-h-60 overflow-y-auto z-50">
                  {searchResults.map((result) => (
                    <li key={result.id} onClick={() => addCity(result)} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 flex flex-col transition-colors">
                      <span className="font-bold text-slate-800">{result.name}</span>
                      <span className="text-xs text-slate-500 font-medium mt-0.5">{result.admin1 ? `${result.admin1}, ` : ''}{result.country}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCities.map((city) => (
              <div key={city.name} className="relative p-5 border border-slate-100 rounded-xl bg-slate-50 shadow-sm flex flex-col justify-between group">
                <button onClick={() => removeCity(city.name)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors">✕</button>
                <div><h4 className="font-bold text-lg text-slate-800 pr-8">{city.name}</h4><p className="text-xs text-slate-500 mb-4">{city.tz}</p></div>
                <div className="flex justify-between items-end border-t border-slate-200 pt-4">
                  <div>
                    <p className="text-3xl font-black text-slate-800">{time.toLocaleTimeString([], { timeZone: city.tz, hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm font-medium text-slate-600">{time.toLocaleDateString([], { timeZone: city.tz, weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}