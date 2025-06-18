import { type NextRequest, NextResponse } from "next/server"
import { webcrypto } from "crypto"

// Función para crear JWT manualmente usando Web Crypto API
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
    // Usar Web Crypto API en lugar de require('crypto')
    const privateKeyPem = credentials.private_key

    // Convertir PEM a formato que Web Crypto puede usar
    const pemHeader = "-----BEGIN PRIVATE KEY-----"
    const pemFooter = "-----END PRIVATE KEY-----"
    const pemContents = privateKeyPem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "")

    // Decodificar base64
    const binaryDer = Buffer.from(pemContents, "base64")

    // Importar la clave privada
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

    // Crear la firma
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
  try {
    const { text, languageCode, voiceName, audioEncoding, speakingRate, pitch } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "El texto es requerido" }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: "El texto no puede exceder 5000 caracteres" }, { status: 400 })
    }

    // Obtener token de acceso
    const accessToken = await getAccessToken()

    // Configurar la solicitud para Google Cloud Text-to-Speech
    const audioConfig: any = {
      audioEncoding: audioEncoding || "MP3",
      speakingRate: speakingRate || 1.0,
    }

    // Solo agregar pitch si no es 0 y la voz lo soporta
    // Las voces Neural y WaveNet generalmente no soportan pitch
    const isNeuralOrWaveNet = voiceName && (voiceName.includes("Neural") || voiceName.includes("WaveNet"))

    if (pitch !== 0 && !isNeuralOrWaveNet) {
      audioConfig.pitch = pitch
      console.log(`🎼 Aplicando pitch: ${pitch} para voz: ${voiceName}`)
    } else if (pitch !== 0 && isNeuralOrWaveNet) {
      console.log(`⚠️ Pitch ignorado para voz Neural/WaveNet: ${voiceName}`)
    } else {
      console.log(`🎼 Pitch en 0, no se aplica`)
    }

    const requestBody = {
      input: { text },
      voice: {
        languageCode: languageCode || "es-ES",
        name: voiceName || "es-ES-Standard-A",
      },
      audioConfig,
    }

    console.log(`🔧 Configuración final:`, JSON.stringify(requestBody, null, 2))

    // Llamar a la API REST de Google Cloud Text-to-Speech
    const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error de Google Cloud:", errorData)

      if (response.status === 401) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
      }

      if (response.status === 403) {
        return NextResponse.json({ error: "Sin permisos para Text-to-Speech API" }, { status: 403 })
      }

      if (response.status === 429) {
        return NextResponse.json({ error: "Límite de cuota excedido" }, { status: 429 })
      }

      return NextResponse.json(
        { error: errorData.error?.message || "Error en la API de Google" },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (!data.audioContent) {
      return NextResponse.json({ error: "No se pudo generar el audio" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      audio: data.audioContent, // Ya viene en base64
      contentType: audioEncoding === "MP3" ? "audio/mpeg" : "audio/wav",
    })
  } catch (error: any) {
    console.error("Error en Text-to-Speech:", error)

    if (error.message.includes("GOOGLE_CLOUD_CREDENTIALS")) {
      return NextResponse.json({ error: "Credenciales de Google Cloud no configuradas" }, { status: 500 })
    }

    if (error.message.includes("JWT")) {
      return NextResponse.json({ error: "Error de autenticación con Google Cloud" }, { status: 500 })
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Endpoint para obtener las voces disponibles
export async function GET() {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch("https://texttospeech.googleapis.com/v1/voices", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error?.message || "Error al obtener voces" },
        { status: response.status },
      )
    }

    const data = await response.json()
    const voices = data.voices || []

    // Organizar voces por idioma y filtrar las más populares
    const voicesByLanguage = voices.reduce((acc: any, voice: any) => {
      const lang = voice.languageCodes?.[0] || "unknown"
      if (!acc[lang]) {
        acc[lang] = []
      }
      acc[lang].push({
        name: voice.name,
        gender: voice.ssmlGender,
        naturalSampleRateHertz: voice.naturalSampleRateHertz,
      })
      return acc
    }, {})

    // Ordenar idiomas para poner español primero
    const sortedLanguages = Object.keys(voicesByLanguage).sort((a, b) => {
      if (a.startsWith("es")) return -1
      if (b.startsWith("es")) return 1
      return a.localeCompare(b)
    })

    const sortedVoices: any = {}
    sortedLanguages.forEach((lang) => {
      sortedVoices[lang] = voicesByLanguage[lang]
    })

    return NextResponse.json({
      success: true,
      voices: sortedVoices,
    })
  } catch (error: any) {
    console.error("Error obteniendo voces:", error)

    if (error.message.includes("GOOGLE_CLOUD_CREDENTIALS")) {
      return NextResponse.json({ error: "Credenciales de Google Cloud no configuradas" }, { status: 500 })
    }

    return NextResponse.json({ error: "Error al obtener las voces disponibles" }, { status: 500 })
  }
}
