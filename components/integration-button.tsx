"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// Componente para integrar en el proyecto principal
export function PDFProcessorButton() {
  const router = useRouter()

  const handleClick = () => {
    // Redirigir al procesador de PDFs
    router.push("/pdf-processor")
  }

  return (
    <Button
      onClick={handleClick}
      className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded shadow"
    >
      PDF
    </Button>
  )
}
