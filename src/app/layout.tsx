// src/app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Procesador de Documentos',
  description: 'Extrae, traduce y resume texto de imágenes y PDFs con Google Cloud',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-black">{children}</body>
    </html>
  )
}
