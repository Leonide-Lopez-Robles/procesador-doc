import { type NextRequest, NextResponse } from "next/server"
import { webcrypto } from "crypto"

// 🌍 API para traducir texto usando Google Cloud Translation API
console.log("🌍 CARGANDO API de Traducción con Google Cloud")

// Función para crear JWT (reutilizada del text-to-speech)
function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

async function createJWT(credentials: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000)

  const header = {
    alg: "RS256",
    typ: "JWT",
  }

  const payload = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signatureInput = `${encodedHeader}.${encodedPayload}`

  try {
    const privateKeyPem = credentials.private_key
    const pemHeader = "-----BEGIN PRIVATE KEY-----"
    const pemFooter = "-----END PRIVATE KEY-----"
    const pemContents = privateKeyPem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "")
    const binaryDer = Buffer.from(pemContents, "base64")

    const privateKey = await webcrypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["sign"],
    )

    const signature = await webcrypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, Buffer.from(signatureInput))

    const encodedSignature = Buffer.from(signature)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")

    return `${signatureInput}.${encodedSignature}`
  } catch (error) {
    console.error("Error creando JWT:", error)
    throw new Error("Error al crear JWT para autenticación")
  }
}

// Función para obtener el token de acceso
async function getAccessToken(): Promise<string> {
  if (!process.env.GOOGLE_CLOUD_CREDENTIALS) {
    throw new Error("GOOGLE_CLOUD_CREDENTIALS no está configurado")
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
    const jwt = await createJWT(credentials)

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Error obteniendo token:", errorData)
      throw new Error("Error obteniendo token de acceso")
    }

    const tokenData = await response.json()
    return tokenData.access_token
  } catch (error) {
    console.error("Error en getAccessToken:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  console.log("🌍 === ENDPOINT TRADUCIR TEXTO ===")
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

    console.log(`📊 Texto a traducir: ${text.length} caracteres`)
    console.log(`🌍 De: ${sourceLanguage} → A: ${targetLanguage}`)

    // Obtener token de acceso
    const accessToken = await getAccessToken()
    console.log("🔑 Token obtenido exitosamente")

    // Obtener project ID
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS!)
    const projectId = credentials.project_id

    // Configurar la solicitud para Google Cloud Translation API
    const requestBody = {
      contents: [text],
      targetLanguageCode: targetLanguage,
      ...(sourceLanguage !== "auto" && { sourceLanguageCode: sourceLanguage }),
    }

    console.log(`🔧 Configuración de traducción:`, JSON.stringify(requestBody, null, 2))

    // Llamar a la API de Google Cloud Translation
    const response = await fetch(
      `https://translation.googleapis.com/v3/projects/${projectId}/locations/global:translateText`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error de Google Cloud Translation:", errorData)

      if (response.status === 401) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
      }

      if (response.status === 403) {
        return NextResponse.json({ error: "Sin permisos para Translation API" }, { status: 403 })
      }

      if (response.status === 429) {
        return NextResponse.json({ error: "Límite de cuota excedido" }, { status: 429 })
      }

      return NextResponse.json(
        { error: errorData.error?.message || "Error en la API de Google Translation" },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("📄 Respuesta de Translation API recibida")

    if (data.translations && data.translations[0]) {
      const translatedText = data.translations[0].translatedText
      const detectedLanguage = data.translations[0].detectedSourceLanguage || sourceLanguage

      console.log(`✅ Texto traducido: ${translatedText.length} caracteres`)
      console.log(`🔍 Idioma detectado: ${detectedLanguage}`)
      console.log(`📋 Traducción: "${translatedText.substring(0, 100)}..."`)

      return NextResponse.json({
        success: true,
        translatedText,
        detectedSourceLanguage: detectedLanguage,
        targetLanguage,
        originalLength: text.length,
        translatedLength: translatedText.length,
      })
    } else {
      console.log("⚠️ No se encontró traducción en la respuesta")
      return NextResponse.json({ error: "No se pudo obtener la traducción" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("❌ Error en traducción:", error)

    if (error.message.includes("GOOGLE_CLOUD_CREDENTIALS")) {
      return NextResponse.json({ error: "Credenciales de Google Cloud no configuradas" }, { status: 500 })
    }

    if (error.message.includes("JWT")) {
      return NextResponse.json({ error: "Error de autenticación con Google Cloud" }, { status: 500 })
    }

    return NextResponse.json({ error: `Error en traducción: ${error.message}` }, { status: 500 })
  }
}

// Endpoint para obtener idiomas soportados
export async function GET() {
  try {
    const accessToken = await getAccessToken()
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS!)
    const projectId = credentials.project_id

    const response = await fetch(
      `https://translation.googleapis.com/v3/projects/${projectId}/locations/global/supportedLanguages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error?.message || "Error al obtener idiomas soportados" },
        { status: response.status },
      )
    }

    const data = await response.json()
    const languages = data.languages || []

    // Filtrar y organizar idiomas más comunes
    const popularLanguages = [
      { code: "es", name: "🇪🇸 Español" },
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
      totalLanguages: languages.length,
      allLanguages: languages,
    })
  } catch (error: any) {
    console.error("Error obteniendo idiomas:", error)

    if (error.message.includes("GOOGLE_CLOUD_CREDENTIALS")) {
      return NextResponse.json({ error: "Credenciales de Google Cloud no configuradas" }, { status: 500 })
    }

    return NextResponse.json({ error: "Error al obtener los idiomas disponibles" }, { status: 500 })
  }
}
