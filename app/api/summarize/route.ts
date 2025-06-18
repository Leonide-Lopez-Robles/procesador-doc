import { type NextRequest, NextResponse } from "next/server"

// 🤖 API para resumir texto usando Gemini
console.log("🤖 CARGANDO API de Resumen con Gemini")

export async function POST(request: NextRequest) {
  console.log("🤖 === ENDPOINT RESUMIR TEXTO ===")
  console.log("📅", new Date().toISOString())

  try {
    const { text, summaryType = "general" } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "El texto es requerido para resumir" }, { status: 400 })
    }

    if (text.length < 50) {
      return NextResponse.json({ error: "El texto es demasiado corto para resumir" }, { status: 400 })
    }

    // Verificar que tenemos la API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY no configurado" }, { status: 500 })
    }

    console.log(`📊 Texto a resumir: ${text.length} caracteres`)
    console.log(`🎯 Tipo de resumen: ${summaryType}`)

    // Configurar el prompt según el tipo de resumen
    let prompt = ""
    switch (summaryType) {
      case "short":
        prompt = `Resume el siguiente texto en máximo 2-3 oraciones, capturando solo los puntos más importantes:

${text}

Resumen corto:`
        break
      case "bullets":
        prompt = `Resume el siguiente texto en puntos clave usando viñetas. Máximo 5 puntos principales:

${text}

Puntos clave:
•`
        break
      case "detailed":
        prompt = `Crea un resumen detallado del siguiente texto, manteniendo la información importante pero reduciendo la longitud en aproximadamente 50%:

${text}

Resumen detallado:`
        break
      default: // general
        prompt = `Resume el siguiente texto de manera clara y concisa, manteniendo las ideas principales:

${text}

Resumen:`
    }

    console.log(`📝 Prompt configurado para tipo: ${summaryType}`)

    // Llamar a Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3, // Más determinístico para resúmenes
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Error Gemini API:", response.status, errorText)
      return NextResponse.json(
        { error: `Error de Gemini API: ${response.status} - ${errorText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("📄 Respuesta de Gemini recibida")

    // Extraer el resumen de la respuesta
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const summary = data.candidates[0].content.parts[0].text.trim()
      console.log(`✅ Resumen generado: ${summary.length} caracteres`)
      console.log(`📋 Resumen: "${summary.substring(0, 100)}..."`)

      return NextResponse.json({
        success: true,
        summary,
        originalLength: text.length,
        summaryLength: summary.length,
        compressionRatio: Math.round((1 - summary.length / text.length) * 100),
        summaryType,
      })
    } else {
      console.log("⚠️ No se encontró resumen en la respuesta de Gemini")
      console.log("📄 Respuesta completa:", JSON.stringify(data, null, 2))
      return NextResponse.json({ error: "No se pudo generar el resumen" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("❌ Error en resumen:", error)

    if (error.message.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ error: "Gemini API Key no configurado" }, { status: 500 })
    }

    return NextResponse.json({ error: `Error generando resumen: ${error.message}` }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ACTIVO",
    service: "Gemini Text Summarizer",
    version: "v1.0",
    summaryTypes: ["general", "short", "bullets", "detailed"],
    timestamp: new Date().toISOString(),
    geminiConfigured: process.env.GEMINI_API_KEY ? "✅ Configurado" : "❌ Falta GEMINI_API_KEY",
  })
}
