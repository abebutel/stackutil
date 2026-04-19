'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Pre-defined database of cities with coordinates for the free Sunrise API
const CITY_DB = [
  { name: "New York, USA", tz: "America/New_York", lat: 40.7128, lng: -74.0060 },
  { name: "London, UK", tz: "Europe/London", lat: 51.5074, lng: -0.1278 },
  { name: "Tokyo, Japan", tz: "Asia/Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Modi'in-Maccabim-Re'ut, Israel", tz: "Asia/Jerusalem", lat: 31.8903, lng: 35.0104 },
  { name: "Sydney, Australia", tz: "Australia/Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Dubai, UAE", tz: "Asia/Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Singapore", tz: "Asia/Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Paris, France", tz: "Europe/Paris", lat: 48.8566, lng: 2.3522 },
];

export default function TimeConverter() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedCities, setSelectedCities] = useState([]);
  const [localSunData, setLocalSunData] = useState({ sunrise: '--:--', sunset: '--:--' });

  // Hydration fix & real-time clock tick
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Fetch local sunrise/sunset using geolocation (fails gracefully if blocked)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`);
          const data = await res.json();
          if (data.status === "OK") {
            setLocalSunData({
              sunrise: new Date(data.results.sunrise),
              sunset: new Date(data.results.sunset)
            });
          }
        } catch (err) {
          console.error("Failed to fetch local sun data.");
        }
      });
    }
    return () => clearInterval(timer);
  }, []);

  const addCity = (e) => {
    const cityName = e.target.value;
    if (!cityName) return;
    
    const cityData = CITY_DB.find(c => c.name === cityName);
    if (cityData && selectedCities.length < 4 && !selectedCities.find(c => c.name === cityName)) {
      // Fetch sunrise/sunset for the added city
      fetch(`https://api.sunrise-sunset.org/json?lat=${cityData.lat}&lng=${cityData.lng}&formatted=0`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "OK") {
            setSelectedCities([...selectedCities, {
              ...cityData,
              sunrise: new Date(data.results.sunrise),
              sunset: new Date(data.results.sunset)
            }]);
          }
        });
    }
    e.target.value = ""; // Reset dropdown
  };

  const removeCity = (cityName) => {
    setSelectedCities(selectedCities.filter(c => c.name !== cityName));
  };

  // Prevent hydration errors by not rendering time until client mounts
  if (!mounted) return null;

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Navigation */}
      {/* Updated Navigation with Collapsible Menu */}
      <nav className="px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-800">
            Stack<span className="text-blue-600">Util</span>
          </Link>
          
          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:text-blue-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Collapsible Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-8 flex flex-col space-y-4 md:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Available Tools</span>
            {tools.map((tool, idx) => (
              <Link 
                key={idx} 
                href={tool.link} 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 text-slate-600 hover:text-blue-600 font-medium"
              >
                <span>{tool.icon}</span>
                <span>{tool.title}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        export default function PasswordGenerator() { // (or QRCodeGenerator / TimeConverter)
  
  // 1. Add the mobile menu toggle state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. Add the tools array so the menu can render the links
  const tools = [
    { title: "Strong Password Generator", icon: "🔒", link: "/password-generator" },
    { title: "QR Code Generator", icon: "📱", link: "/qr-generator" },
    { title: "Date & Time Converter", icon: "🌍", link: "/time-converter" },
    { title: "Currency Converter", icon: "💱", link: "/currency-converter" }
  ];

  // ... the rest of your existing state variables (password, length, etc.)
        <h1 className="text-3xl font-bold mb-8 text-slate-800">Global Date & Time Converter</h1>

        {/* AdSense Top Slot */}
        <div className="w-full h-24 bg-slate-200 border border-slate-300 border-dashed flex items-center justify-center text-slate-400 text-sm mb-8 rounded-lg">
          [AdSense Banner]
        </div>

        {/* Local Time Card (Hero) */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <p className="text-indigo-100 font-semibold mb-1 uppercase tracking-wider text-sm">Your Local Time</p>
              <h2 className="text-5xl font-black mb-2 tracking-tight">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h2>
              <p className="text-xl font-medium text-indigo-50">
                {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-indigo-200 text-sm mt-1 border border-indigo-400/30 inline-block px-3 py-1 rounded-full bg-indigo-900/20">
                Zone: {localTz}
              </p>
            </div>
            <div className="mt-6 md:mt-0 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 flex gap-6">
              <div>
                <p className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Sunrise 🌅</p>
                <p className="font-semibold text-lg">
                  {localSunData.sunrise instanceof Date ? localSunData.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </p>
              </div>
              <div>
                <p className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Sunset 🌙</p>
                <p className="font-semibold text-lg">
                  {localSunData.sunset instanceof Date ? localSunData.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Cities Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-slate-800">Compare Cities ({selectedCities.length}/4)</h3>
            <select 
              onChange={addCity} 
              disabled={selectedCities.length >= 4}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 min-w-[200px]"
            >
              <option value="">+ Add a City...</option>
              {CITY_DB.filter(c => !selectedCities.find(sc => sc.name === c.name)).map(city => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCities.map((city) => (
              <div key={city.name} className="relative p-5 border border-slate-100 rounded-xl bg-slate-50 shadow-sm flex flex-col justify-between group">
                <button 
                  onClick={() => removeCity(city.name)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                  title="Remove City"
                >
                  ✕
                </button>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 pr-8">{city.name}</h4>
                  <p className="text-xs text-slate-500 mb-4">{city.tz}</p>
                </div>
                
                <div className="flex justify-between items-end border-t border-slate-200 pt-4">
                  <div>
                    <p className="text-3xl font-black text-slate-800">
                      {time.toLocaleTimeString([], { timeZone: city.tz, hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      {time.toLocaleDateString([], { timeZone: city.tz, weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right text-xs font-semibold text-slate-500 space-y-1">
                    <p>🌅 {city.sunrise ? city.sunrise.toLocaleTimeString([], { timeZone: city.tz, hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                    <p>🌙 {city.sunset ? city.sunset.toLocaleTimeString([], { timeZone: city.tz, hour: '2-digit', minute: '2-digit' }) : '--:--'}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {selectedCities.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                Select a city from the dropdown to compare time zones and daylight hours.
              </div>
            )}
          </div>
        </div>

        {/* SEO Article */}
        <article className="prose prose-slate max-w-none bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Mastering Global Time Zones</h2>
          <p className="mb-4 text-slate-600 leading-relaxed">
            Whether you are coordinating a remote team meeting, scheduling international client calls, or planning a trip abroad, managing time zone differences can be a logistical headache. Miscalculating a time difference can lead to missed deadlines or awkward 3:00 AM phone calls.
          </p>
          <h3 className="text-xl font-bold mb-3 mt-8 text-slate-800">How a Time Converter Keeps You Synchronized</h3>
          <p className="mb-4 text-slate-600 leading-relaxed">
            A reliable time zone converter removes the guesswork from daylight saving time shifts and complex UTC offsets. By visualizing multiple cities side-by-side alongside their local sunrise and sunset times, you can easily pinpoint the perfect overlap for global business hours. Always ensure you are checking the date as well as the time—when it's late afternoon in New York, it may already be the next business day in Tokyo or Sydney!
          </p>
        </article>
      </main>
    </div>
  );
}