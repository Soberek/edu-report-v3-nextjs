import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <Image className="mx-auto mb-8 dark:invert" src="/next.svg" alt="Logo Next.js" width={180} height={38} priority />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Witamy w EduReport v3</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Wspomagaj pracę edukatora promocji zdrowia w inspekcji sanitarnej. Twórz sprawozdania, zarządzaj programami edukacyjnymi w
            szkołach i usprawniaj działania bez wysiłku.
          </p>
        </header>

        <main className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Łatwe Tworzenie Sprawozdań</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Generuj kompleksowe sprawozdania zdrowotne i edukacyjne za pomocą intuicyjnych narzędzi i szablonów dostosowanych do potrzeb
              inspekcji sanitarnej.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Zarządzanie Programami Edukacyjnymi</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Efektywnie organizuj i monitoruj programy promocji zdrowia w szkołach, z możliwością współpracy w czasie rzeczywistym.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Bezpieczne i Skalowalne</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Zbudowane z Next.js dla maksymalnej wydajności, bezpieczeństwa i skalowalności, idealne dla instytucji sanitarnych.
            </p>
          </div>
        </main>

        <div className="text-center">
          <a
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            href="/dashboard"
          >
            Rozpocznij
          </a>
          <a
            className="inline-block ml-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dowiedz się Więcej
          </a>
        </div>
      </div>
    </div>
  );
}
