"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Icons
const AlertTriangle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const X = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const FileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
)

const Lightbulb = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21h6" />
    <path d="M12 3a6 6 0 0 1 6 6c0 3-2 5.5-2 8h-8c0-2.5-2-5-2-8a6 6 0 0 1 6-6z" />
  </svg>
)

const Copy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2 2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

interface ErrorNotificationProps {
  isOpen: boolean
  onClose: () => void
  error: {
    title: string
    message: string
    suggestions?: string
    fileInfo?: {
      name: string
      size: string
      type: string
    }
  }
}

export function ErrorNotification({ isOpen, onClose, error }: ErrorNotificationProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showFileInfo, setShowFileInfo] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Mostrar sugerencias después de 2 segundos
      const suggestionsTimer = setTimeout(() => {
        setShowSuggestions(true)
      }, 2000)

      // Mostrar información del archivo después de 4 segundos
      const fileInfoTimer = setTimeout(() => {
        setShowFileInfo(true)
      }, 4000)

      return () => {
        clearTimeout(suggestionsTimer)
        clearTimeout(fileInfoTimer)
      }
    } else {
      setShowSuggestions(false)
      setShowFileInfo(false)
    }
  }, [isOpen])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getErrorIcon = () => {
    if (error.title.includes("dañado") || error.title.includes("corrupto")) {
      return "📄"
    } else if (error.title.includes("imágenes")) {
      return "🖼️"
    } else if (error.title.includes("grande")) {
      return "📏"
    } else if (error.title.includes("complejo")) {
      return "💾"
    } else if (error.title.includes("tiempo")) {
      return "⏱️"
    } else if (error.title.includes("límite")) {
      return "📊"
    } else if (error.title.includes("conexión")) {
      return "🔌"
    }
    return "❌"
  }

  const getErrorColor = () => {
    if (error.title.includes("dañado") || error.title.includes("corrupto")) {
      return "border-red-300 bg-red-50"
    } else if (error.title.includes("imágenes")) {
      return "border-orange-300 bg-orange-50"
    } else if (error.title.includes("grande")) {
      return "border-yellow-300 bg-yellow-50"
    } else if (error.title.includes("complejo")) {
      return "border-purple-300 bg-purple-50"
    } else if (error.title.includes("tiempo")) {
      return "border-blue-300 bg-blue-50"
    } else if (error.title.includes("límite")) {
      return "border-indigo-300 bg-indigo-50"
    } else if (error.title.includes("conexión")) {
      return "border-gray-300 bg-gray-50"
    }
    return "border-red-300 bg-red-50"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Notification */}
      <Card
        className={`relative w-full max-w-2xl shadow-2xl border-2 ${getErrorColor()} animate-in fade-in-0 zoom-in-95 duration-300`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-red-200 flex items-center justify-center text-2xl">
                {getErrorIcon()}
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {error.title}
                  <Badge variant="destructive" className="text-xs">
                    Error
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">No se pudo procesar el archivo</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 -mt-2 -mr-2"
            >
              <X />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Message */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Descripción del problema:</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{error.message}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(error.message)}
                  className="mt-3 text-xs"
                >
                  <Copy className="mr-1" />
                  Copiar error
                </Button>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {showSuggestions && error.suggestions && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-3">
                <Lightbulb className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Cómo solucionarlo:</h4>
                  <div className="text-blue-800 leading-relaxed whitespace-pre-line text-sm">{error.suggestions}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(error.suggestions)}
                    className="mt-3 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Copy className="mr-1" />
                    Copiar sugerencias
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* File Info */}
          {showFileInfo && error.fileInfo && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-3">
                <FileText className="text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">📋 Información del archivo:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Nombre:</span>
                      <p className="text-gray-600 break-all">{error.fileInfo.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tamaño:</span>
                      <p className="text-gray-600">{error.fileInfo.size}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Tipo:</span>
                      <p className="text-gray-600">{error.fileInfo.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button onClick={onClose} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Entendido, intentar de nuevo
            </Button>
            <Button variant="outline" onClick={() => window.open("/setup", "_blank")} className="flex-1">
              Ver guía de configuración
            </Button>
          </div>

          {/* Quick Tips */}
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <h5 className="font-medium text-green-900 mb-2 text-sm">🎯 Consejos rápidos:</h5>
            <ul className="text-xs text-green-800 space-y-1">
              <li>• Verifica que el archivo no esté dañado antes de subirlo</li>
              <li>• Sube PDFs que contengan solo texto</li>
              <li>• Archivos más pequeños se procesan más rápido</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
