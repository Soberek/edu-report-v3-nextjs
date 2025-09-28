import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <header className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Edu Report V3
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Kompleksowy system zarządzania edukacją zdrowotną. Zarządzaj szkołami, generuj raporty, 
              śledź zadania i twórz treści edukacyjne z pomocą AI.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Rozpocznij pracę
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              📝 Zarejestruj się
            </Link>
          </div>
        </header>

        {/* Features Grid */}
        <main className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* School Management */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-4xl mb-4">🏫</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Zarządzanie Szkołami</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Kompletna baza szkół z zaawansowanym filtrowaniem, statystykami i operacjami zbiorczymi.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• CRUD operacje na szkołach</li>
              <li>• Filtrowanie po typie i mieście</li>
              <li>• Statystyki wizualne</li>
              <li>• Eksport danych</li>
            </ul>
          </div>

          {/* Report Generation */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Generowanie Raportów</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Twórz profesjonalne raporty IZRZ, dokumenty PDF i Word z szablonami.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Generator IZRZ</li>
              <li>• Eksport do PDF/Word</li>
              <li>• Szablony dokumentów</li>
              <li>• Integracja z Excel</li>
            </ul>
          </div>

          {/* AI Content Generation */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">AI Content Generator</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Twórz treści edukacyjne z pomocą GPT-4o i integracji z Unsplash.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Generowanie postów</li>
              <li>• Automatyczne obrazy</li>
              <li>• Podgląd w czasie rzeczywistym</li>
              <li>• Szablony treści</li>
            </ul>
          </div>

          {/* Task Management */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-4xl mb-4">📅</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Zarządzanie Zadaniami</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Planuj i śledź zadania edukacyjne z zaawansowanym systemem filtrów.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Harmonogram zadań</li>
              <li>• Statystyki postępu</li>
              <li>• Filtrowanie i wyszukiwanie</li>
              <li>• Śledzenie terminów</li>
            </ul>
          </div>

          {/* Educational Modules */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Moduły Edukacyjne</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Specjalistyczne moduły: edukacja o czerniaku, śledzenie nawyków, kalendarz świąt.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Quiz o czerniaku</li>
              <li>• Śledzenie nawyków</li>
              <li>• Kalendarz świąt</li>
              <li>• Baza kontaktów</li>
            </ul>
          </div>

          {/* Analytics & Insights */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="text-4xl mb-4">📈</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Analityka i Statystyki</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Wizualizuj dane i śledź postępy z zaawansowanymi dashboardami.
            </p>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Statystyki szkół</li>
              <li>• Wskaźniki ukończenia</li>
              <li>• Eksport danych</li>
              <li>• Aktualizacje na żywo</li>
            </ul>
          </div>
        </main>

        {/* Technology Stack */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-20 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Nowoczesna Technologia</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                <span className="text-xl">⚛️</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">React 19</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-black dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                <span className="text-xl text-white">▲</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Next.js 15</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                <span className="text-xl text-white">TS</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">TypeScript</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-xl text-white">🔥</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Firebase</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-xl text-white">🤖</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">OpenAI</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-xl text-white">🎨</span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Material-UI</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Gotowy na start?</h2>
          <p className="text-xl mb-8 opacity-90">
            Dołącz do tysięcy edukatorów, którzy już korzystają z Edu Report V3
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🚀 Rozpocznij teraz
          </Link>
        </div>
      </div>
    </div>
  );
}
