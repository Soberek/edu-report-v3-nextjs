"use client";

export const ResponseDisplay = ({ response }: { response: any }) => (
  <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Wynik:</h2>
    <div className="bg-white p-4 rounded border">
      <pre className="whitespace-pre-wrap text-sm text-gray-700 overflow-x-auto max-h-96 overflow-y-auto">{JSON.stringify(response, null, 2)}</pre>
    </div>
  </div>
);
