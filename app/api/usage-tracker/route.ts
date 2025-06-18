import { type NextRequest, NextResponse } from "next/server"

// 📈 Sistema de tracking de uso para Gemini y Google Cloud
console.log("📈 CARGANDO Sistema de Tracking de Uso")

// Simulación de base de datos en memoria (en producción usarías una DB real)
let usageData = {
  gemini: {
    daily: {} as { [date: string]: number },
    monthly: {} as { [month: string]: number },
    total: 0,
  },
  googleCloud: {
    textToSpeech: {
      daily: {} as { [date: string]: number },
      monthly: {} as { [month: string]: number },
      total: 0,
    },
    translation: {
      daily: {} as { [date: string]: number },
      monthly: {} as { [month: string]: number },
      total: 0,
    },
  },
}

function getCurrentDate() {
  return new Date().toISOString().split("T")[0] // YYYY-MM-DD
}

function getCurrentMonth() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` // YYYY-MM
}

function trackUsage(service: string, subService = "", amount = 1) {
  const today = getCurrentDate()
  const currentMonth = getCurrentMonth()

  console.log(`📊 Tracking: ${service}${subService ? `.${subService}` : ""} +${amount}`)

  if (service === "gemini") {
    // Tracking para Gemini
    if (!usageData.gemini.daily[today]) {
      usageData.gemini.daily[today] = 0
    }
    if (!usageData.gemini.monthly[currentMonth]) {
      usageData.gemini.monthly[currentMonth] = 0
    }

    usageData.gemini.daily[today] += amount
    usageData.gemini.monthly[currentMonth] += amount
    usageData.gemini.total += amount
  } else if (service === "googleCloud") {
    // Tracking para Google Cloud services
    const serviceData = usageData.googleCloud[subService as keyof typeof usageData.googleCloud]

    if (serviceData) {
      if (!serviceData.daily[today]) {
        serviceData.daily[today] = 0
      }
      if (!serviceData.monthly[currentMonth]) {
        serviceData.monthly[currentMonth] = 0
      }

      serviceData.daily[today] += amount
      serviceData.monthly[currentMonth] += amount
      serviceData.total += amount
    }
  }

  console.log(`✅ Uso registrado: ${service}${subService ? `.${subService}` : ""} = ${amount}`)
}

function getUsageStats() {
  const today = getCurrentDate()
  const currentMonth = getCurrentMonth()

  return {
    gemini: {
      today: usageData.gemini.daily[today] || 0,
      thisMonth: usageData.gemini.monthly[currentMonth] || 0,
      total: usageData.gemini.total,
      dailyHistory: usageData.gemini.daily,
      monthlyHistory: usageData.gemini.monthly,
    },
    googleCloud: {
      textToSpeech: {
        today: usageData.googleCloud.textToSpeech.daily[today] || 0,
        thisMonth: usageData.googleCloud.textToSpeech.monthly[currentMonth] || 0,
        total: usageData.googleCloud.textToSpeech.total,
      },
      translation: {
        today: usageData.googleCloud.translation.daily[today] || 0,
        thisMonth: usageData.googleCloud.translation.monthly[currentMonth] || 0,
        total: usageData.googleCloud.translation.total,
      },
    },
    lastUpdated: new Date().toISOString(),
  }
}

// Endpoint para registrar uso
export async function POST(request: NextRequest) {
  console.log("📈 === REGISTRAR USO ===")

  try {
    const { service, subService, amount = 1, operation } = await request.json()

    if (!service) {
      return NextResponse.json({ error: "Service es requerido" }, { status: 400 })
    }

    console.log(`📊 Registrando: ${service}.${subService || "main"} - ${operation || "unknown"} (+${amount})`)

    // Registrar el uso
    trackUsage(service, subService, amount)

    // Obtener estadísticas actualizadas
    const stats = getUsageStats()

    return NextResponse.json({
      success: true,
      message: `Uso registrado: ${service}${subService ? `.${subService}` : ""}`,
      usage: stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Error registrando uso:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error registrando uso: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

// Endpoint para obtener estadísticas de uso
export async function GET() {
  console.log("📈 === OBTENER ESTADÍSTICAS ===")

  try {
    const stats = getUsageStats()

    return NextResponse.json({
      success: true,
      usage: stats,
      timestamp: new Date().toISOString(),
      note: "Estadísticas de uso local - En producción se almacenarían en base de datos",
    })
  } catch (error: any) {
    console.error("❌ Error obteniendo estadísticas:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error obteniendo estadísticas: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

// Endpoint para resetear estadísticas (útil para testing)
export async function DELETE() {
  console.log("🗑️ === RESETEAR ESTADÍSTICAS ===")

  try {
    usageData = {
      gemini: {
        daily: {},
        monthly: {},
        total: 0,
      },
      googleCloud: {
        textToSpeech: {
          daily: {},
          monthly: {},
          total: 0,
        },
        translation: {
          daily: {},
          monthly: {},
          total: 0,
        },
      },
    }

    return NextResponse.json({
      success: true,
      message: "Estadísticas reseteadas",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("❌ Error reseteando estadísticas:", error)

    return NextResponse.json(
      {
        success: false,
        error: `Error reseteando estadísticas: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
