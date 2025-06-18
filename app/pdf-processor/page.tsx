"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/file-upload"
import { Textarea } from "@/components/ui/textarea"
import { ErrorNotification } from "@/components/error-notification"

// Icons
const Volume2 = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
)

const Download = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
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

const Cloud = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
)

const CheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const AlertCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const Sparkles = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
)

const Edit = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const Eye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const Settings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const Globe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const RefreshCw = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
)

interface Voice {
  name: string
  gender: string
  naturalSampleRateHertz: number
}

interface VoicesByLanguage {
  [key: string]: Voice[]
}

interface QuotaInfo {
  googleCloud: {
    textToSpeech: {
      remaining: number
      total: number
      resetDate: string
    }
    translation: {
      remaining: number
      total: number
      resetDate: string
    }
  }
  gemini: {
    remaining: number
    total: number
    resetDate: string
  }
}

interface ErrorInfo {
  title: string
  message: string
  suggestions?: string
  fileInfo?: {
    name: string
    size: string
    type: string
  }
}

export default function GoogleTextToSpeechApp() {
  const [text, setText] = useState("")
  const [fileName, setFileName] = useState("")
  const [extractionMethod, setExtractionMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingVoices, setIsLoadingVoices] = useState(true)
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [voices, setVoices] = useState<VoicesByLanguage>({})
  const [selectedLanguage, setSelectedLanguage] = useState("es-ES")
  const [selectedVoice, setSelectedVoice] = useState("")
  const [audioEncoding, setAudioEncoding] = useState("MP3")
  const [speakingRate, setSpeakingRate] = useState([1.0])
  const [pitch, setPitch] = useState([0.0])
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [characterCount, setCharacterCount] = useState(0)
  const [isConfigured, setIsConfigured] = useState(false)
  const [isEditingText, setIsEditingText] = useState(false)
  const [summary, setSummary] = useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summaryType, setSummaryType] = useState("general")
  const [showSummary, setShowSummary] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [showTranslation, setShowTranslation] = useState(false)
  const [availableLanguages, setAvailableLanguages] = useState([])
  const [detectedLanguage, setDetectedLanguage] = useState("")
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null)
  const [isLoadingQuotas, setIsLoadingQuotas] = useState(false)

  // Error notification state
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null)

  const { toast } = useToast()

  const loadAvailableLanguages = async () => {
    try {
      // Usar la API de Gemini para traducción con banderas actualizadas
      const response = await fetch("/api/translate-gemini")

      if (!response.ok) {
        console.warn("No se pudo cargar la API de traducción, usando idiomas por defecto")
        setAvailableLanguages([
          { code: "es", name: "🇲🇽 Español" },
          { code: "en", name: "🇺🇸 English" },
          { code: "fr", name: "🇫🇷 Français" },
          { code: "de", name: "🇩🇪 Deutsch" },
          { code: "it", name: "🇮🇹 Italiano" },
          { code: "pt", name: "🇧🇷 Português" },
          { code: "ja", name: "🇯🇵 日本語" },
          { code: "ko", name: "🇰🇷 한국어" },
          { code: "zh", name: "🇨🇳 中文" },
          { code: "ar", name: "🇸🇦 العربية" },
        ])
        return
      }

      const data = await response.json()
      if (data.success && data.popularLanguages) {
        // Actualizar las banderas en la respuesta
        const updatedLanguages = data.popularLanguages.map((lang: any) => {
          if (lang.code === "es") {
            return { ...lang, name: "🇲🇽 Español" }
          }
          return lang
        })
        setAvailableLanguages(updatedLanguages)
      } else {
        setAvailableLanguages([
          { code: "es", name: "🇲🇽 Español" },
          { code: "en", name: "🇺🇸 English" },
          { code: "fr", name: "🇫🇷 Français" },
          { code: "de", name: "🇩🇪 Deutsch" },
          { code: "it", name: "🇮🇹 Italiano" },
        ])
      }
    } catch (error) {
      console.error("Error cargando idiomas:", error)
      setAvailableLanguages([
        { code: "es", name: "🇲🇽 Español" },
        { code: "en", name: "🇺🇸 English" },
        { code: "fr", name: "🇫🇷 Français" },
        { code: "de", name: "🇩🇪 Deutsch" },
        { code: "it", name: "🇮🇹 Italiano" },
      ])
    }
  }

  const loadQuotaInfo = async () => {
    setIsLoadingQuotas(true)
    try {
      const response = await fetch("/api/quota-info")
      const data = await response.json()

      if (data.success) {
        setQuotaInfo(data.quotas)
      } else {
        console.warn("No se pudo cargar información de cuotas:", data.error)
        // Datos de ejemplo si no se puede cargar
        setQuotaInfo({
          googleCloud: {
            textToSpeech: {
              remaining: 850000,
              total: 1000000,
              resetDate: "2024-02-01",
            },
            translation: {
              remaining: 450000,
              total: 500000,
              resetDate: "2024-02-01",
            },
          },
          gemini: {
            remaining: 1450,
            total: 1500,
            resetDate: "2024-02-01",
          },
        })
      }
    } catch (error) {
      console.error("Error cargando cuotas:", error)
      // Datos de ejemplo en caso de error
      setQuotaInfo({
        googleCloud: {
          textToSpeech: {
            remaining: 850000,
            total: 1000000,
            resetDate: "2024-02-01",
          },
          translation: {
            remaining: 450000,
            total: 500000,
            resetDate: "2024-02-01",
          },
        },
        gemini: {
          remaining: 1450,
          total: 1500,
          resetDate: "2024-02-01",
        },
      })
    } finally {
      setIsLoadingQuotas(false)
    }
  }

  const handleTranslateText = async (textToTranslate = text) => {
    if (!textToTranslate.trim()) {
      toast({
        title: "⚠️ Texto requerido",
        description: "Necesitas texto para poder traducir",
        variant: "destructive",
      })
      return
    }

    if (textToTranslate.length > 30000) {
      toast({
        title: "📏 Texto muy largo",
        description: "El texto no puede exceder 30,000 caracteres para traducir",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)

    try {
      // Usar la API de Gemini para traducción
      const response = await fetch("/api/translate-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToTranslate,
          targetLanguage,
          sourceLanguage: "auto",
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTranslatedText(data.translatedText)
        setDetectedLanguage(data.detectedSourceLanguage)
        setShowTranslation(true)

        const targetLangName =
          availableLanguages.find((lang: any) => lang.code === targetLanguage)?.name || targetLanguage
        const sourceLangName =
          availableLanguages.find((lang: any) => lang.code === data.detectedSourceLanguage)?.name ||
          data.detectedSourceLanguage

        toast({
          title: "🤖 Traducción completada con Gemini",
          description: `${sourceLangName} → ${targetLangName} (${data.originalLength} → ${data.translatedLength} caracteres)`,
        })

        // Recargar cuotas después de usar Gemini
        await loadQuotaInfo()
      } else {
        toast({
          title: "❌ Error al traducir",
          description: data.error || "Error desconocido",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "🔌 Error de conexión",
        description: "No se pudo conectar con el servicio de traducción",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  // Cargar voces disponibles
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const response = await fetch("/api/text-to-speech")
        const data = await response.json()

        if (data.success) {
          setVoices(data.voices)
          setIsConfigured(true)

          if (data.voices["es-ES"] && data.voices["es-ES"].length > 0) {
            setSelectedVoice(data.voices["es-ES"][0].name)
          } else if (Object.keys(data.voices).length > 0) {
            const firstLang = Object.keys(data.voices)[0]
            setSelectedLanguage(firstLang)
            setSelectedVoice(data.voices[firstLang][0].name)
          }

          // Cargar idiomas de traducción y cuotas
          await loadAvailableLanguages()
          await loadQuotaInfo()

          toast({
            title: "🎉 Conectado exitosamente",
            description: `${Object.keys(data.voices).length} idiomas disponibles con voces de IA`,
          })
        } else {
          setIsConfigured(false)
          toast({
            title: "❌ Error de configuración",
            description: data.error || "No se pudieron cargar las voces disponibles",
            variant: "destructive",
          })
        }
      } catch (error) {
        setIsConfigured(false)
        toast({
          title: "🔌 Error de conexión",
          description: "No se pudo conectar con Google Cloud Text-to-Speech",
          variant: "destructive",
        })
      } finally {
        setIsLoadingVoices(false)
      }
    }

    loadVoices()
  }, [toast])

  // Actualizar contador de caracteres
  useEffect(() => {
    setCharacterCount(text.length)
  }, [text])

  // Actualizar voz seleccionada cuando cambia el idioma
  useEffect(() => {
    if (voices[selectedLanguage] && voices[selectedLanguage].length > 0) {
      setSelectedVoice(voices[selectedLanguage][0].name)
    }
  }, [selectedLanguage, voices])

  const clearAllContent = () => {
    setText("")
    setFileName("")
    setExtractionMethod("")
    setSummary("")
    setShowSummary(false)
    setTranslatedText("")
    setShowTranslation(false)
    setDetectedLanguage("")
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
  }

  const showError = (title: string, message: string, suggestions?: string, fileInfo?: any) => {
    setErrorInfo({
      title,
      message,
      suggestions,
      fileInfo,
    })
    setShowErrorNotification(true)
  }

  const handleFileUpload = async (file: File) => {
    console.log("🚨 DEBUG: handleFileUpload llamado con:", file.name, file.type, file.size)

    // Validar tipo de archivo ANTES de procesar
    const fileName = file.name.toLowerCase()
    const isValidType = fileName.endsWith(".pdf") || fileName.endsWith(".txt")

    if (!isValidType) {
      // Limpiar todo el contenido
      clearAllContent()

      // Para errores de validación local, usar toast normal
      toast({
        title: "❌ Tipo de archivo no permitido",
        description: "Solo puedes subir documentos PDF o TXT que contengan texto legible",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño antes de enviar
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      clearAllContent()
      // Para errores de validación local, usar toast normal
      toast({
        title: "📏 Archivo demasiado grande",
        description: `El archivo es de ${(file.size / 1024 / 1024).toFixed(2)}MB. El tamaño máximo es 10MB. Usa un archivo más pequeño.`,
        variant: "destructive",
      })
      return
    }

    if (file.size < 10) {
      clearAllContent()
      // Para errores de validación local, usar toast normal
      toast({
        title: "📄 Archivo vacío",
        description: "El archivo está vacío o es demasiado pequeño. Sube un archivo que contenga texto.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingFile(true)
    setFileName(file.name)
    setExtractionMethod("")

    try {
      console.log("🚨 DEBUG: Creando FormData...")
      const formData = new FormData()
      formData.append("file", file)

      console.log("🚨 DEBUG: Enviando fetch a /api/process-file...")
      const response = await fetch("/api/process-file", {
        method: "POST",
        body: formData,
      })

      console.log("🚨 DEBUG: Respuesta recibida:", response.status, response.statusText)

      const data = await response.json()
      console.log("🚨 DEBUG: Datos de respuesta:", data)

      if (data.success) {
        setText(data.text)
        setExtractionMethod(data.extractionMethod || "")

        const methodName = getMethodDisplayName(data.extractionMethod)
        toast({
          title: "📄 Archivo procesado exitosamente",
          description: `Extraído con ${methodName} (${data.text.length} caracteres)`,
        })

        // Mostrar advertencias si las hay
        if (data.warnings && data.warnings.length > 0) {
          setTimeout(() => {
            toast({
              title: "⚠️ Advertencias",
              description: data.warnings.join(". "),
              variant: "destructive",
            })
          }, 2000)
        }

        // Recargar cuotas después de usar Gemini
        if (data.extractionMethod === "gemini-api") {
          await loadQuotaInfo()
        }
      } else {
        console.error("🚨 DEBUG: Error en respuesta:", data.error)
        clearAllContent()

        // SOLO mostrar la notificación grande para errores del servidor que tienen showInUI: true
        if (data.showInUI) {
          showError(data.errorTitle || "❌ Error procesando archivo", data.error, data.suggestion, data.fileInfo)
        } else {
          // Para otros errores, usar toast normal
          toast({
            title: data.errorTitle || "❌ Error procesando archivo",
            description: data.error,
            variant: "destructive",
          })

          // Mostrar sugerencias como toast adicional si existen
          if (data.suggestion) {
            setTimeout(() => {
              toast({
                title: "💡 Sugerencias",
                description: data.suggestion,
              })
            }, 2000)
          }
        }
      }
    } catch (error) {
      console.error("🚨 DEBUG: Error en fetch:", error)
      clearAllContent()

      let errorMessage = "No se pudo procesar el archivo. "
      let errorTitle = "🔌 Error de conexión"
      let suggestions = ""

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage += "Verifica tu conexión a internet e intenta nuevamente."
        suggestions =
          "• Verifica tu conexión a internet\n• Intenta nuevamente en unos momentos\n• Contacta soporte si el problema persiste"
      } else if (error instanceof Error && error.message.includes("timeout")) {
        errorMessage += "El procesamiento tardó demasiado tiempo. Intenta con un archivo más pequeño."
        errorTitle = "⏱️ Tiempo agotado"
        suggestions =
          "• Usa un archivo más pequeño\n• Simplifica el contenido del PDF\n• Convierte a texto plano (.txt)\n• Divide el documento en partes"
      } else if (error instanceof Error && error.message.includes("stack")) {
        errorMessage =
          "El archivo es demasiado complejo para procesar. Convierte el PDF a texto plano (.txt) o usa un archivo más simple."
        errorTitle = "💾 Archivo muy complejo"
        suggestions =
          "• Convierte el PDF a texto plano (.txt)\n• Usa un PDF más simple\n• Divide el documento en secciones\n• Verifica que el PDF no esté corrupto"
      } else {
        errorMessage += "Error interno del servidor. Intenta nuevamente en unos momentos."
        suggestions =
          "• Intenta nuevamente en unos minutos\n• Verifica que el archivo no esté dañado\n• Usa un archivo diferente\n• Contacta soporte si persiste"
      }

      // Para errores de conexión/red, mostrar notificación grande
      showError(errorTitle, errorMessage, suggestions, {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.type || "Desconocido",
      })
    } finally {
      setIsProcessingFile(false)
    }
  }

  const getMethodDisplayName = (method: string) => {
    const methods: { [key: string]: string } = {
      "gemini-api": "🤖 Gemini AI",
      mammoth: "📝 Mammoth (DOCX)",
      text: "📝 Texto plano",
    }
    return methods[method] || method
  }

  const handleSummarizeText = async () => {
    if (!text.trim()) {
      toast({
        title: "⚠️ Texto requerido",
        description: "Necesitas texto para poder resumir",
        variant: "destructive",
      })
      return
    }

    if (text.length < 50) {
      toast({
        title: "📏 Texto muy corto",
        description: "El texto debe tener al menos 50 caracteres para resumir",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingSummary(true)

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          summaryType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSummary(data.summary)
        setShowSummary(true)

        toast({
          title: "🤖 Resumen generado exitosamente",
          description: `Reducido ${data.compressionRatio}% (${data.originalLength} → ${data.summaryLength} caracteres)`,
        })

        // Recargar cuotas después de usar Gemini
        await loadQuotaInfo()
      } else {
        toast({
          title: "❌ Error al generar resumen",
          description: data.error || "Error desconocido",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "🔌 Error de conexión",
        description: "No se pudo conectar con el servicio de resumen",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      toast({
        title: "⚠️ Texto requerido",
        description: "Por favor sube un archivo o ingresa texto para convertir",
        variant: "destructive",
      })
      return
    }

    if (text.length > 5000) {
      toast({
        title: "📏 Texto muy largo",
        description: "El texto no puede exceder 5000 caracteres",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          languageCode: selectedLanguage,
          voiceName: selectedVoice,
          audioEncoding,
          speakingRate: speakingRate[0],
          pitch: pitch[0],
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }

        const audioBlob = new Blob([Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))], {
          type: data.contentType,
        })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        toast({
          title: "🎵 Audio generado exitosamente",
          description: `Archivo de ${Math.round(audioBlob.size / 1024)}KB listo para reproducir`,
        })

        // Recargar cuotas después de usar Google Cloud
        await loadQuotaInfo()
      } else {
        toast({
          title: "❌ Error al generar audio",
          description: data.error || "Error desconocido",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "🔌 Error de conexión",
        description: "No se pudo conectar con el servicio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!audioUrl) return

    const a = document.createElement("a")
    a.href = audioUrl
    a.download = `${fileName ? fileName.split(".")[0] : "audio"}-tts.${audioEncoding.toLowerCase()}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({
      title: "⬇️ Descarga iniciada",
      description: "El archivo de audio se está descargando",
    })
  }

  const getLanguageName = (code: string) => {
    const languageNames: { [key: string]: string } = {
      "es-ES": "🇲🇽 Español (México)",
      "es-US": "🇲🇽 Español (Estados Unidos)",
      "es-MX": "🇲🇽 Español (México)",
      "en-US": "🇺🇸 English (United States)",
      "en-GB": "🇬🇧 English (United Kingdom)",
      "fr-FR": "🇫🇷 Français",
      "de-DE": "🇩🇪 Deutsch",
      "it-IT": "🇮🇹 Italiano",
      "pt-BR": "🇧🇷 Português (Brasil)",
      "ja-JP": "🇯🇵 日本語",
      "ko-KR": "🇰🇷 한국어",
      "zh-CN": "🇨🇳 中文 (简体)",
    }
    return languageNames[code] || code
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  const getQuotaColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100
    if (percentage > 50) return "text-green-600"
    if (percentage > 20) return "text-yellow-600"
    return "text-red-600"
  }

  if (isLoadingVoices) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Cloud className="text-blue-600" />
                <Sparkles className="absolute -top-2 -right-2 text-purple-500" />
              </div>
            </div>
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Conectando con Google Cloud</h3>
            <p className="text-sm text-gray-500">Verificando credenciales y cargando voces de IA...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Error Notification */}
        {errorInfo && (
          <ErrorNotification
            isOpen={showErrorNotification}
            onClose={() => {
              setShowErrorNotification(false)
              setErrorInfo(null)
            }}
            error={errorInfo}
          />
        )}

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Cloud className="text-blue-600" />
              <Sparkles className="absolute -top-1 -right-1 text-purple-500 w-4 h-4" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Procesador de documentos en formato pdf y txt
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convierte documentos y texto en audio, traducelos o haz un resumen.
          </p>
        </div>

        {/* Status Alert */}
        {isConfigured ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>🎉 Configuración exitosa:</strong> Conectado a Google Cloud Text-to-Speech API y Gemini AI.
              {Object.keys(voices).length} idiomas disponibles con múltiples voces de IA.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>❌ Error de configuración:</strong> No se pudo conectar con Google Cloud.{" "}
              <a href="/setup" className="underline font-medium">
                Ver guía de configuración
              </a>
            </AlertDescription>
          </Alert>
        )}

        {/* Quota Information */}
        {quotaInfo && (
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">📊 Estado de Cuotas</span>
                <Button variant="outline" size="sm" onClick={loadQuotaInfo} disabled={isLoadingQuotas}>
                  {isLoadingQuotas ? <Loader2 className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                  Actualizar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600">🎵</span>
                    <span className="font-medium">Text-to-Speech</span>
                  </div>
                  <div
                    className={`text-lg font-bold ${getQuotaColor(quotaInfo.googleCloud.textToSpeech.remaining, quotaInfo.googleCloud.textToSpeech.total)}`}
                  >
                    {formatNumber(quotaInfo.googleCloud.textToSpeech.remaining)}
                  </div>
                  <div className="text-xs text-gray-500">
                    de {formatNumber(quotaInfo.googleCloud.textToSpeech.total)} caracteres
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">🌍</span>
                    <span className="font-medium">Translation</span>
                  </div>
                  <div
                    className={`text-lg font-bold ${getQuotaColor(quotaInfo.googleCloud.translation.remaining, quotaInfo.googleCloud.translation.total)}`}
                  >
                    {formatNumber(quotaInfo.googleCloud.translation.remaining)}
                  </div>
                  <div className="text-xs text-gray-500">
                    de {formatNumber(quotaInfo.googleCloud.translation.total)} caracteres
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-purple-600">🤖</span>
                    <span className="font-medium">Gemini AI</span>
                  </div>
                  <div
                    className={`text-lg font-bold ${getQuotaColor(quotaInfo.gemini.remaining, quotaInfo.gemini.total)}`}
                  >
                    {formatNumber(quotaInfo.gemini.remaining)}
                  </div>
                  <div className="text-xs text-gray-500">de {formatNumber(quotaInfo.gemini.total)} llamadas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!isConfigured && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <Settings className="mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Configuración Requerida</h3>
              <p className="text-gray-600 mb-4">
                Para usar esta aplicación, necesitas configurar las credenciales de Google Cloud.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href="/setup">Ver Guía de Configuración</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {isConfigured && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* File Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">📄 Subir Documento</CardTitle>
                  <CardDescription>Sube archivos PDF o TXT.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    isProcessing={isProcessingFile}
                    acceptedTypes={[".txt", ".pdf"]}
                  />
                  {fileName && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        📎 <strong>Archivo cargado:</strong> {fileName}
                      </p>
                      {extractionMethod && (
                        <p className="text-xs text-blue-600 mt-1">
                          🔧 <strong>Método:</strong> {getMethodDisplayName(extractionMethod)}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Text Preview/Editor */}
              {text && (
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        📝 {isEditingText ? "Editar Texto" : "Texto Extraído"}
                        {extractionMethod === "gemini-api" && <Eye className="text-purple-600" />}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSummarizeText}
                          disabled={!text.trim() || text.length < 50 || isGeneratingSummary}
                        >
                          {isGeneratingSummary ? (
                            <>
                              <Loader2 className="mr-1 w-3 h-3" />
                              Resumiendo...
                            </>
                          ) : (
                            <>
                              <Sparkles className="mr-1" />
                              Resumir
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTranslateText(text)}
                          disabled={!text.trim() || isTranslating}
                        >
                          {isTranslating ? (
                            <>
                              <Loader2 className="mr-1 w-3 h-3" />
                              Traduciendo...
                            </>
                          ) : (
                            <>
                              <Globe className="mr-1" />
                              Traducir
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsEditingText(!isEditingText)}>
                          <Edit className="mr-1" />
                          {isEditingText ? "Vista previa" : "Editar"}
                        </Button>
                        {quotaInfo && (
                          <>
                            <Badge variant={characterCount > 5000 ? "destructive" : "secondary"}>
                              {characterCount.toLocaleString()}/5,000 caracteres
                            </Badge>
                            <Badge variant="outline" className="text-purple-600">
                              🤖 Gemini: {formatNumber(quotaInfo.gemini.remaining)}
                            </Badge>
                            <Badge variant="outline" className="text-blue-600">
                              🎵 TTS: {formatNumber(quotaInfo.googleCloud.textToSpeech.remaining)}
                            </Badge>
                          </>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingText ? (
                      <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-40 text-sm"
                        placeholder="Edita el texto aquí..."
                      />
                    ) : (
                      <div className="max-h-40 overflow-y-auto p-4 bg-gray-50 rounded-lg border text-sm whitespace-pre-wrap">
                        {text}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Summary Section */}
              {showSummary && summary && (
                <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        🤖 Resumen Generado por IA
                        <Badge variant="outline" className="bg-purple-100 text-purple-700">
                          Gemini
                        </Badge>
                      </span>
                      <div className="flex items-center gap-2">
                        <Select value={summaryType} onValueChange={setSummaryType}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">📝 General</SelectItem>
                            <SelectItem value="short">⚡ Corto</SelectItem>
                            <SelectItem value="bullets">📋 Puntos clave</SelectItem>
                            <SelectItem value="detailed">📖 Detallado</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSummarizeText}
                          disabled={isGeneratingSummary}
                        >
                          {isGeneratingSummary ? <Loader2 className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTranslateText(summary)}
                          disabled={isTranslating || !summary}
                        >
                          {isTranslating ? <Loader2 className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setText(summary)}>
                          Usar resumen
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-white rounded-lg border border-purple-200 text-sm whitespace-pre-wrap">
                      {summary}
                    </div>
                    <div className="mt-3 flex gap-4 text-xs text-purple-600">
                      <span>📊 Original: {text.length} caracteres</span>
                      <span>📝 Resumen: {summary.length} caracteres</span>
                      <span>📉 Reducción: {Math.round((1 - summary.length / text.length) * 100)}%</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Translation Section */}
              {showTranslation && translatedText && (
                <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        🌍 Traducción Automática
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          Gemini AI
                        </Badge>
                        {detectedLanguage && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-700">
                            Detectado:{" "}
                            {availableLanguages.find((lang: any) => lang.code === detectedLanguage)?.name ||
                              detectedLanguage}
                          </Badge>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableLanguages.map((lang: any) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTranslateText(text)}
                          disabled={isTranslating}
                        >
                          {isTranslating ? <Loader2 className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setText(translatedText)}>
                          Usar traducción
                        </Button>
                      </div>
                    </CardTitle>
                    <CardContent>
                      <div className="p-4 bg-white rounded-lg border border-green-200 text-sm whitespace-pre-wrap">
                        {translatedText}
                      </div>
                      <div className="mt-3 flex gap-4 text-xs text-green-600">
                        <span>📊 Original: {text.length} caracteres</span>
                        <span>🌍 Traducido: {translatedText.length} caracteres</span>
                        <span>
                          🎯 Idioma:{" "}
                          {availableLanguages.find((lang: any) => lang.code === targetLanguage)?.name || targetLanguage}
                        </span>
                      </div>
                    </CardContent>
                  </CardHeader>
                </Card>
              )}
            </div>

            {/* Controls Section */}
            <div className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">🎛️ Configuración de Voz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>🌍 Idioma</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(voices).map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {getLanguageName(lang)} ({voices[lang].length} voces)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>🎤 Voz</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una voz" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices[selectedLanguage]?.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name.replace(`${selectedLanguage}-`, "")} ({voice.gender})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>🎵 Formato de audio</Label>
                    <Select value={audioEncoding} onValueChange={setAudioEncoding}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MP3">MP3 (Recomendado)</SelectItem>
                        <SelectItem value="WAV">WAV (Alta calidad)</SelectItem>
                        <SelectItem value="OGG_OPUS">OGG Opus (Comprimido)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>⚡ Velocidad: {speakingRate[0]}x</Label>
                    <Slider
                      value={speakingRate}
                      onValueChange={setSpeakingRate}
                      max={2.0}
                      min={0.25}
                      step={0.25}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      🎼 Tono: {pitch[0] > 0 ? "+" : ""}
                      {pitch[0]} semitonos
                      {selectedVoice && (selectedVoice.includes("Neural") || selectedVoice.includes("WaveNet")) && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          No soportado por esta voz
                        </Badge>
                      )}
                    </Label>
                    <Slider
                      value={pitch}
                      onValueChange={setPitch}
                      max={20.0}
                      min={-20.0}
                      step={1.0}
                      className="w-full"
                      disabled={
                        selectedVoice && (selectedVoice.includes("Neural") || selectedVoice.includes("WaveNet"))
                      }
                    />
                    {selectedVoice && (selectedVoice.includes("Neural") || selectedVoice.includes("WaveNet")) && (
                      <p className="text-xs text-gray-500">ℹ️ Las voces Neural y WaveNet no soportan ajuste de tono</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6 space-y-4">
                  <Button
                    onClick={handleGenerateAudio}
                    className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={!text.trim() || isLoading || characterCount > 5000 || !isConfigured}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2" />
                        Generando audio...
                      </>
                    ) : (
                      <>
                        <Volume2 className="mr-2" />
                        Generar Audio
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    disabled={!audioUrl}
                    size="lg"
                    className="w-full h-12 text-lg border-2"
                  >
                    <Download className="mr-2" />
                    Descargar Audio
                  </Button>
                </CardContent>
              </Card>

              {/* Audio Player */}
              {audioUrl && (
                <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="pt-6">
                    <Label className="text-green-800 font-medium flex items-center gap-2 mb-3">
                      🎵 Audio generado exitosamente
                    </Label>
                    <audio controls className="w-full" src={audioUrl}>
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        
      </div>
    </div>
  )
}

