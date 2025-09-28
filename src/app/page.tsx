import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <header className="text-center mb-24">
          <div className="mb-12">
            {/* Animated Logo */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl mb-8 shadow-2xl transform hover:scale-110 transition-all duration-500 hover:rotate-3">
              <span className="text-4xl filter drop-shadow-lg">📊</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 leading-tight tracking-tight">
              Edu Report V3
            </h1>
            
            {/* Subtitle */}
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light mb-4">
              Kompleksowy system zarządzania edukacją zdrowotną
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Zarządzaj szkołami, generuj raporty, śledź zadania i twórz treści edukacyjne z pomocą AI
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/login"
              className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="mr-3 text-2xl group-hover:animate-bounce">🚀</span>
              Rozpocznij pracę
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center px-10 py-5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-lg rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="mr-3 text-2xl group-hover:rotate-12 transition-transform duration-300">📝</span>
              Zarejestruj się
            </Link>
          </div>
        </header>

        {/* Features Grid */}
        <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {/* School Management */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transform hover:-translate-y-2">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🏫</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Zarządzanie Szkołami</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Kompletna baza szkół z zaawansowanym filtrowaniem, statystykami i operacjami zbiorczymi.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>CRUD operacje na szkołach</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Filtrowanie po typie i mieście</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>Statystyki wizualne</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Eksport danych</li>
            </ul>
          </div>

          {/* Report Generation */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/50 transform hover:-translate-y-2">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📊</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Generowanie Raportów</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Twórz profesjonalne raporty IZRZ, dokumenty PDF i Word z szablonami.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Generator IZRZ</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>Eksport do PDF/Word</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>Szablony dokumentów</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>Integracja z Excel</li>
            </ul>
          </div>

          {/* AI Content Generation */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover:border-green-300/50 dark:hover:border-green-500/50 transform hover:-translate-y-2">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🤖</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">AI Content Generator</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Twórz treści edukacyjne z pomocą GPT-4o i integracji z Unsplash.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Generowanie postów</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>Automatyczne obrazy</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>Podgląd w czasie rzeczywistym</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>Szablony treści</li>
            </ul>
          </div>

          {/* Task Management */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover:border-orange-300/50 dark:hover:border-orange-500/50 transform hover:-translate-y-2">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📅</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Zarządzanie Zadaniami</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Planuj i śledź zadania edukacyjne z zaawansowanym systemem filtrów.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>Harmonogram zadań</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>Statystyki postępu</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>Filtrowanie i wyszukiwanie</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>Śledzenie terminów</li>
            </ul>
          </div>

          {/* Educational Modules */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover:border-indigo-300/50 dark:hover:border-indigo-500/50 transform hover:-translate-y-2">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📚</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Moduły Edukacyjne</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Specjalistyczne moduły: edukacja o czerniaku, śledzenie nawyków, kalendarz świąt.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-center"><span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>Quiz o czerniaku</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-violet-500 rounded-full mr-3"></span>Śledzenie nawyków</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>Kalendarz świąt</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>Baza kontaktów</li>
            </ul>
          </div>

          {/* Analytics & Insights */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50 hover:border-cyan-300/50 dark:hover:border-cyan-500/50 transform hover:-translate-y-2">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📈</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Analityka i Statystyki</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Wizualizuj dane i śledź postępy z zaawansowanymi dashboardami.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <li className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>Statystyki szkół</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>Wskaźniki ukończenia</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Eksport danych</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-cyan-600 rounded-full mr-3"></span>Aktualizacje na żywo</li>
            </ul>
          </div>
        </main>

        {/* Technology Stack */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 mb-24 shadow-2xl border border-white/20 dark:border-gray-700/50">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nowoczesna Technologia
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            <div className="group flex flex-col items-center transform hover:scale-110 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl">⚛️</span>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">React 19</span>
            </div>
            <div className="group flex flex-col items-center transform hover:scale-110 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl text-white">▲</span>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">Next.js 15</span>
            </div>
            <div className="group flex flex-col items-center transform hover:scale-110 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl text-white font-bold">TS</span>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">TypeScript</span>
            </div>
            <div className="group flex flex-col items-center transform hover:scale-110 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl text-white">🔥</span>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Firebase</span>
            </div>
            <div className="group flex flex-col items-center transform hover:scale-110 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl text-white">🤖</span>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">OpenAI</span>
            </div>
            <div className="group flex flex-col items-center transform hover:scale-110 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl text-white">🎨</span>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Material-UI</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-3xl p-16 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="20" cy="20" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Gotowy na start?</h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Dołącz do tysięcy edukatorów, którzy już korzystają z Edu Report V3
            </p>
            <Link
              href="/login"
              className="group inline-flex items-center px-12 py-6 bg-white text-blue-600 font-bold text-xl rounded-2xl hover:bg-gray-100 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-white/25"
            >
              <span className="mr-4 text-3xl group-hover:animate-bounce">🚀</span>
              Rozpocznij teraz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}