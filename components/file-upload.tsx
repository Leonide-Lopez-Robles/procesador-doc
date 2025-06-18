"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Icons
const Upload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-15" />
    <polyline points="17,6 12,1 7,6" />
    <line x1="12" y1="1" x2="12" y2="15" />
  </svg>
)

const FileText = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
)

const Loader2 = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

const AlertTriangle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const Eye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const Brain = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
)

const Zap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </svg>
)

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isProcessing: boolean
  acceptedTypes: string[]
}

export function FileUpload({ onFileUpload, isProcessing, acceptedTypes }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
    setError(null)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setError(null)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    console.log("🚨 DEBUG: Archivo dropeado:", file?.name, file?.type, file?.size)

    if (!file) {
      setError("No se seleccionó ningún archivo")
      return
    }

    if (!isValidFileType(file)) {
      setError("Solo puedes subir documentos PDF o TXT que contengan texto legible")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo 10MB.`)
      return
    }

    if (file.size < 10) {
      setError("El archivo está vacío o es demasiado pequeño")
      return
    }

    console.log("🚨 DEBUG: Llamando onFileUpload con archivo:", file.name)
    onFileUpload(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    console.log("🚨 DEBUG: Archivo seleccionado:", file?.name, file?.type, file?.size)

    if (!file) return

    if (!isValidFileType(file)) {
      setError("Solo puedes subir documentos PDF o TXT que contengan texto legible")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo 10MB.`)
      return
    }

    if (file.size < 10) {
      setError("El archivo está vacío o es demasiado pequeño")
      return
    }

    console.log("🚨 DEBUG: Llamando onFileUpload con archivo:", file.name)
    onFileUpload(file)
  }

  const isValidFileType = (file: File) => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase()
    const allowedTypes = [".pdf", ".txt"]
    console.log("🚨 DEBUG: Verificando extensión:", extension, "contra:", allowedTypes)
    return allowedTypes.includes(extension)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
          isDragOver
            ? "border-blue-500 bg-blue-50 scale-105"
            : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
          isProcessing && "pointer-events-none opacity-50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            {isProcessing ? (
              <div className="p-4 bg-purple-100 rounded-full">
                <Loader2 className="text-purple-600" />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="text-red-600" />
              </div>
            ) : (
              <div className="p-4 bg-blue-100 rounded-full">
                <Upload className="text-blue-600" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {isProcessing
                ? "🔍 Procesando con IA Avanzada..."
                : error
                  ? "Error al procesar archivo"
                  : "Arrastra tu archivo aquí"}
            </h3>
            <p className="text-gray-500">
              {isProcessing
                ? "Google Vision OCR convirtiendo PDF → Imágenes → Texto"
                : error
                  ? error
                  : "o haz clic para seleccionar un archivo"}
            </p>
          </div>

          {!isProcessing && !error && (
            <Button onClick={openFileDialog} variant="outline" className="mt-4">
              <FileText className="mr-2" />
              Seleccionar Archivo
            </Button>
          )}

          {error && (
            <Button
              onClick={() => {
                setError(null)
                openFileDialog()
              }}
              variant="outline"
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            >
              <FileText className="mr-2" />
              Intentar de nuevo
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          {acceptedTypes.map((type) => (
            <span key={type} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {type.toUpperCase()}
            </span>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="text-xs text-purple-700 space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="text-purple-600" />
              <span>
                <strong>IA Avanzada:</strong> Convierte PDF y Texto limpio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="text-purple-600" />
              <span>
                <strong>Texto plano:</strong> Archivos TXT procesados directamente
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="text-purple-600" />
              <span>
                <strong>Solo PDF y TXT:</strong> Archivos que contengan texto legible
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-orange-600" />
              <span>
                <strong>Archivos problemáticos:</strong> Se detectan automáticamente archivos dañados, corruptos o que
                solo contienen imágenes
              </span>
            </div>
            <p className="text-center font-medium text-purple-800 mt-2">
              📄 Solo archivos PDF y TXT con texto | 🔒 Máximo 10MB | ✅ Detección de archivos dañados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

