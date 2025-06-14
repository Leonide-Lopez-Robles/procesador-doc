import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 flex flex-col items-center pt-5 text-center">

      <h1 className="text-4xl font-bold mb-2">Procesador de Documentos</h1>
      <p className="text-gray-700 mb-8">Extrae, traduce y resume texto de imágenes y PDFs</p>

      <div className="flex gap-6">
        <Link href="/imagenes">
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded shadow">
            imagenes
          </button>
        </Link>
        <Link href="/pdf">
          <button className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded shadow">
            PDF
          </button>
        </Link>
      </div>
    </div>
  );
}