"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Icons
const RefreshCw = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
)

const AlertTriangle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const CheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const TrendingUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
)

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
  lastUpdated?: string
  projectId?: string
  dataSource?: string
}

interface UsageStats {
  gemini: {
    today: number
    thisMonth: number
    total: number
  }
  googleCloud: {
    textToSpeech: {
      today: number
      thisMonth: number
      total: number
    }
    translation: {
      today: number
      thisMonth: number
      total: number
    }
  }
}

export function QuotaMonitor() {
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const loadQuotaInfo = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Cargar información de cuotas
      const quotaResponse = await fetch("/api/quota-info")
      const quotaData = await quotaResponse.json()

      if (quotaData.success) {
        setQuotaInfo(quotaData.quotas)
      } else {
        setError(quotaData.error || "Error cargando cuotas")
        if (quotaData.quotas) {
          setQuotaInfo(quotaData.quotas) // Usar datos de fallback
        }
      }

      // Cargar estadísticas de uso
      const usageResponse = await fetch("/api/usage-tracker")
      const usageData = await usageResponse.json()

      if (usageData.success) {
        setUsageStats(usageData.usage)
      }

      setLastRefresh(new Date())
    } catch (err: any) {
      setError(`Error de conexión: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadQuotaInfo()
    // Auto-refresh cada 5 minutos
    const interval = setInterval(loadQuotaInfo, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

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

  const getQuotaStatus = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100
    if (percentage > 50) return { status: "Bueno", color: "bg-green-100 text-green-800" }
    if (percentage > 20) return { status: "Precaución", color: "bg-yellow-100 text-yellow-800" }
    return { status: "Crítico", color: "bg-red-100 text-red-800" }
  }

  if (!quotaInfo) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Cargando información de cuotas...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con información general */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              📊 Monitor de Cuotas en Tiempo Real
              {quotaInfo.dataSource === "real-apis" ? (
                <Badge className="bg-green-100 text-green-800">Datos Reales</Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">Estimaciones</Badge>
              )}
            </span>
            <Button variant="outline" size="sm" onClick={loadQuotaInfo} disabled={isLoading}>
              <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Actualizando..." : "Actualizar"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {/* Text-to-Speech */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🎵</span>
                  <span className="font-medium">Text-to-Speech</span>
                </div>
                <Badge
                  className={
                    getQuotaStatus(
                      quotaInfo.googleCloud.textToSpeech.remaining,
                      quotaInfo.googleCloud.textToSpeech.total,
                    ).color
                  }
                >
                  {
                    getQuotaStatus(
                      quotaInfo.googleCloud.textToSpeech.remaining,
                      quotaInfo.googleCloud.textToSpeech.total,
                    ).status
                  }
                </Badge>
              </div>

              <div
                className={`text-2xl font-bold ${getQuotaColor(quotaInfo.googleCloud.textToSpeech.remaining, quotaInfo.googleCloud.textToSpeech.total)}`}
              >
                {formatNumber(quotaInfo.googleCloud.textToSpeech.remaining)}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                de {formatNumber(quotaInfo.googleCloud.textToSpeech.total)} caracteres
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${
                    (quotaInfo.googleCloud.textToSpeech.remaining / quotaInfo.googleCloud.textToSpeech.total) * 100 > 50
                      ? "bg-green-500"
                      : (quotaInfo.googleCloud.textToSpeech.remaining / quotaInfo.googleCloud.textToSpeech.total) *
                            100 >
                          20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${(quotaInfo.googleCloud.textToSpeech.remaining / quotaInfo.googleCloud.textToSpeech.total) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="text-xs text-gray-500">Resetea: {quotaInfo.googleCloud.textToSpeech.resetDate}</div>

              {usageStats && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Hoy: {usageStats.googleCloud.textToSpeech.today}</span>
                    <span>Este mes: {usageStats.googleCloud.textToSpeech.thisMonth}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Translation */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">🌍</span>
                  <span className="font-medium">Translation</span>
                </div>
                <Badge
                  className={
                    getQuotaStatus(quotaInfo.googleCloud.translation.remaining, quotaInfo.googleCloud.translation.total)
                      .color
                  }
                >
                  {
                    getQuotaStatus(quotaInfo.googleCloud.translation.remaining, quotaInfo.googleCloud.translation.total)
                      .status
                  }
                </Badge>
              </div>

              <div
                className={`text-2xl font-bold ${getQuotaColor(quotaInfo.googleCloud.translation.remaining, quotaInfo.googleCloud.translation.total)}`}
              >
                {formatNumber(quotaInfo.googleCloud.translation.remaining)}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                de {formatNumber(quotaInfo.googleCloud.translation.total)} caracteres
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${
                    (quotaInfo.googleCloud.translation.remaining / quotaInfo.googleCloud.translation.total) * 100 > 50
                      ? "bg-green-500"
                      : (quotaInfo.googleCloud.translation.remaining / quotaInfo.googleCloud.translation.total) * 100 >
                          20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${(quotaInfo.googleCloud.translation.remaining / quotaInfo.googleCloud.translation.total) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="text-xs text-gray-500">Resetea: {quotaInfo.googleCloud.translation.resetDate}</div>

              {usageStats && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Hoy: {usageStats.googleCloud.translation.today}</span>
                    <span>Este mes: {usageStats.googleCloud.translation.thisMonth}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Gemini */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">🤖</span>
                  <span className="font-medium">Gemini AI</span>
                </div>
                <Badge className={getQuotaStatus(quotaInfo.gemini.remaining, quotaInfo.gemini.total).color}>
                  {getQuotaStatus(quotaInfo.gemini.remaining, quotaInfo.gemini.total).status}
                </Badge>
              </div>

              <div
                className={`text-2xl font-bold ${getQuotaColor(quotaInfo.gemini.remaining, quotaInfo.gemini.total)}`}
              >
                {formatNumber(quotaInfo.gemini.remaining)}
              </div>
              <div className="text-xs text-gray-500 mb-2">de {formatNumber(quotaInfo.gemini.total)} llamadas</div>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${
                    (quotaInfo.gemini.remaining / quotaInfo.gemini.total) * 100 > 50
                      ? "bg-green-500"
                      : (quotaInfo.gemini.remaining / quotaInfo.gemini.total) * 100 > 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{
                    width: `${(quotaInfo.gemini.remaining / quotaInfo.gemini.total) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="text-xs text-gray-500">Resetea: {quotaInfo.gemini.resetDate}</div>

              {usageStats && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Hoy: {usageStats.gemini.today}</span>
                    <span>Este mes: {usageStats.gemini.thisMonth}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                {quotaInfo.projectId && <span>📋 Proyecto: {quotaInfo.projectId}</span>}
                {quotaInfo.dataSource && (
                  <span>🔧 Fuente: {quotaInfo.dataSource === "real-apis" ? "APIs Reales" : "Estimaciones"}</span>
                )}
              </div>
              {lastRefresh && <span>🕒 Actualizado: {lastRefresh.toLocaleTimeString()}</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de cuotas bajas */}
      {quotaInfo && (
        <div className="space-y-2">
          {(quotaInfo.googleCloud.textToSpeech.remaining / quotaInfo.googleCloud.textToSpeech.total) * 100 < 20 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>⚠️ Cuota Text-to-Speech crítica:</strong> Solo quedan{" "}
                {formatNumber(quotaInfo.googleCloud.textToSpeech.remaining)} caracteres (
                {Math.round(
                  (quotaInfo.googleCloud.textToSpeech.remaining / quotaInfo.googleCloud.textToSpeech.total) * 100,
                )}
                %)
              </AlertDescription>
            </Alert>
          )}

          {(quotaInfo.googleCloud.translation.remaining / quotaInfo.googleCloud.translation.total) * 100 < 20 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>⚠️ Cuota Translation crítica:</strong> Solo quedan{" "}
                {formatNumber(quotaInfo.googleCloud.translation.remaining)} caracteres (
                {Math.round(
                  (quotaInfo.googleCloud.translation.remaining / quotaInfo.googleCloud.translation.total) * 100,
                )}
                %)
              </AlertDescription>
            </Alert>
          )}

          {(quotaInfo.gemini.remaining / quotaInfo.gemini.total) * 100 < 20 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>⚠️ Cuota Gemini crítica:</strong> Solo quedan {formatNumber(quotaInfo.gemini.remaining)} llamadas
                ({Math.round((quotaInfo.gemini.remaining / quotaInfo.gemini.total) * 100)}%)
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
