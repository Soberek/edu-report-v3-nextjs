export const metadata = {
  title: "Dziękujemy za zakup",
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-xl mx-auto p-12 bg-white rounded-3xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dziękujemy za zakup!</h1>
        <p className="text-gray-700 mb-6">Twoja płatność została przetworzona pomyślnie. Wkrótce otrzymasz potwierdzenie na email.</p>
        <a href="/dietetyk" className="inline-block bg-green-600 text-white px-6 py-3 rounded-2xl">
          Wróć do strony
        </a>
      </div>
    </div>
  );
}
