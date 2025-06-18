import { type NextRequest, NextResponse } from "next/server"

// 🌍 API de traducción usando Gemini como alternativa
console.log("🌍 CARGANDO API de Traducción con Gemini (Alternativa)")

export async function POST(request: NextRequest) {
  console.log("🌍 === ENDPOINT TRADUCIR CON GEMINI ===")
  console.log("📅", new Date().toISOString())

  try {
    const { text, targetLanguage, sourceLanguage = "auto" } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "El texto es requerido para traducir" }, { status: 400 })
    }

    if (!targetLanguage) {
      return NextResponse.json({ error: "El idioma de destino es requerido" }, { status: 400 })
    }

    if (text.length > 30000) {
      return NextResponse.json({ error: "El texto no puede exceder 30,000 caracteres" }, { status: 400 })
    }

    // Verificar que tenemos la API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY no configurado" }, { status: 500 })
    }

    console.log(`📊 Texto a traducir: ${text.length} caracteres`)
    console.log(`🌍 De: ${sourceLanguage} → A: ${targetLanguage}`)

    // Mapear códigos de idioma a nombres completos
    const languageNames: { [key: string]: string } = {
      es: "español",
      en: "inglés",
      fr: "francés",
      de: "alemán",
      it: "italiano",
      pt: "portugués",
      ru: "ruso",
      ja: "japonés",
      ko: "coreano",
      zh: "chino",
      ar: "árabe",
      hi: "hindi",
      th: "tailandés",
      vi: "vietnamita",
      nl: "holandés",
      sv: "sueco",
      da: "danés",
      no: "noruego",
      fi: "finlandés",
      pl: "polaco",
    }

    const targetLangName = languageNames[targetLanguage] || targetLanguage
    const sourceLangName = sourceLanguage !== "auto" ? languageNames[sourceLanguage] || sourceLanguage : "automático"

    // Crear prompt para traducción
    const prompt = `Traduce el siguiente texto al ${targetLangName}. Devuelve SOLO la traducción, sin comentarios adicionales ni explicaciones.

Texto a traducir:
${text}

Traducción al ${targetLangName}:`

    console.log(`📝 Prompt configurado para traducir a: ${targetLangName}`)

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
            temperature: 0.1, // Más determinístico para traducciones
            topK: 1,
            topP: 1,
            maxOutputTokens: 8192,
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

    // Extraer la traducción de la respuesta
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const translatedText = data.candidates[0].content.parts[0].text.trim()
      console.log(`✅ Texto traducido: ${translatedText.length} caracteres`)
      console.log(`📋 Traducción: "${translatedText.substring(0, 100)}..."`)

      return NextResponse.json({
        success: true,
        translatedText,
        detectedSourceLanguage: sourceLanguage === "auto" ? "es" : sourceLanguage, // Gemini no detecta idioma automáticamente
        targetLanguage,
        originalLength: text.length,
        translatedLength: translatedText.length,
        method: "gemini-ai",
      })
    } else {
      console.log("⚠️ No se encontró traducción en la respuesta de Gemini")
      console.log("📄 Respuesta completa:", JSON.stringify(data, null, 2))
      return NextResponse.json({ error: "No se pudo generar la traducción" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("❌ Error en traducción con Gemini:", error)

    if (error.message.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ error: "Gemini API Key no configurado" }, { status: 500 })
    }

    return NextResponse.json({ error: `Error en traducción: ${error.message}` }, { status: 500 })
  }
}

// Endpoint para obtener idiomas soportados
export async function GET() {
  const popularLanguages = [
    { code: "es", name: "🇲🇽 Español" },
    { code: "en", name: "🇺🇸 English" },
    { code: "fr", name: "🇫🇷 Français" },
    { code: "de", name: "🇩🇪 Deutsch" },
    { code: "it", name: "🇮🇹 Italiano" },
    { code: "pt", name: "🇧🇷 Português" },
    { code: "ru", name: "🇷🇺 Русский" },
    { code: "ja", name: "🇯🇵 日本語" },
    { code: "ko", name: "🇰🇷 한국어" },
    { code: "zh", name: "🇨🇳 中文" },
    { code: "ar", name: "🇸🇦 العربية" },
    { code: "hi", name: "🇮🇳 हिन्दी" },
    { code: "th", name: "🇹🇭 ไทย" },
    { code: "vi", name: "🇻🇳 Tiếng Việt" },
    { code: "nl", name: "🇳🇱 Nederlands" },
    { code: "sv", name: "🇸🇪 Svenska" },
    { code: "da", name: "🇩🇰 Dansk" },
    { code: "no", name: "🇳🇴 Norsk" },
    { code: "fi", name: "🇫🇮 Suomi" },
    { code: "pl", name: "🇵🇱 Polski" },
  ]

  return NextResponse.json({
    success: true,
    popularLanguages,
    totalLanguages: popularLanguages.length,
    method: "gemini-ai",
    status: "Traducción con Gemini AI disponible",
    timestamp: new Date().toISOString(),
  })
}
