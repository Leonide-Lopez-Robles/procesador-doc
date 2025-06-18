import { type NextRequest, NextResponse } from "next/server"

// 🚨 CÓDIGO v14.0 GEMINI - Usando Gemini API para PDFs
console.log("🚨 CARGANDO v14.0 GEMINI - PDF con Gemini API")

// Función para extraer texto usando Gemini API
async function extractWithGemini(file: File): Promise<string> {
  console.log("🤖 === GEMINI API EXTRACCIÓN ===")

  try {
    // Verificar que tenemos la API key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY no configurado")
    }

    // Convertir archivo a base64 de forma simple y directa
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")

    console.log(`📊 Archivo convertido: ${base64.length} caracteres base64`)

    // Determinar el MIME type
    let mimeType = file.type
    if (!mimeType || mimeType === "application/octet-stream") {
      if (file.name.toLowerCase().endsWith(".pdf")) {
        mimeType = "application/pdf"
      }
    }

    console.log(`📄 MIME type: ${mimeType}`)

    // Llamar a Gemini API con timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Extrae todo el texto de este documento PDF. Devuelve SOLO el texto extraído, sin comentarios adicionales. Si el documento contiene tablas, mantenlas organizadas. Si hay múltiples páginas, incluye todo el contenido.",
                },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 8192,
          },
        }),
      },
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Error Gemini API:", response.status, errorText)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("📄 Respuesta de Gemini recibida")

    // Extraer el texto de la respuesta
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const extractedText = data.candidates[0].content.parts[0].text
      console.log(`✅ Texto extraído con Gemini: ${extractedText.length} caracteres`)
      console.log(`📋 Texto: "${extractedText.substring(0, 200)}..."`)
      return extractedText.trim()
    } else {
      console.log("⚠️ No se encontró texto en la respuesta de Gemini")
      console.log("📄 Respuesta completa:", JSON.stringify(data, null, 2))
      return ""
    }
  } catch (error: any) {
    console.error("❌ Error Gemini:", error)

    // Detectar errores específicos que requieren notificación grande
    if (error.name === "AbortError") {
      throw new Error("TIMEOUT_ERROR: El procesamiento tardó demasiado tiempo")
    }

    if (error.message.includes("Maximum call stack size exceeded")) {
      throw new Error("STACK_OVERFLOW_ERROR: El archivo es demasiado complejo para procesar")
    }

    throw new Error(`Gemini API error: ${error.message}`)
  }
}

// Función para extraer texto de PDF usando Gemini con mejor manejo de errores
async function extractTextFromPDF(file: File): Promise<string> {
  console.log("🚨 === EXTRACTOR PDF v14.0 GEMINI ===")

  try {
    const extractedText = await extractWithGemini(file)

    if (extractedText && extractedText.length > 0) {
      console.log("✅ Extracción con Gemini exitosa")
      return extractedText
    } else {
      console.log("❌ Gemini no pudo extraer texto")
      // En lugar de retornar un string, lanzar error para activar notificación
      throw new Error("GEMINI_NO_TEXT: No se pudo extraer texto del PDF")
    }
  } catch (error: any) {
    console.error("❌ Error en extractor Gemini:", error)

    if (error.message.includes("GEMINI_API_KEY")) {
      throw new Error("GEMINI_CONFIG_ERROR: Gemini API Key no configurado")
    }

    // Re-lanzar TODOS los errores para que sean manejados en el endpoint principal
    throw error
  }
}

async function processText(file: File): Promise<string> {
  console.log("📄 Procesando archivo de texto...")

  try {
    const text = await file.text()

    if (!text || text.trim().length === 0) {
      throw new Error("El archivo de texto está vacío.")
    }

    // Solo verificar que no sea binario
    const binaryRegex = /[\x00-\x08\x0E-\x1F\x7F-\xFF]/g
    const binaryMatches = text.match(binaryRegex)

    if (binaryMatches && binaryMatches.length > text.length * 0.5) {
      throw new Error("El archivo no es un archivo de texto válido. Puede estar dañado o ser un archivo binario.")
    }

    console.log(`✅ Texto procesado exitosamente: ${text.length} caracteres`)
    return text
  } catch (error: any) {
    console.error("❌ Error procesando texto:", error)

    if (error.message.includes("dañado") || error.message.includes("texto") || error.message.includes("vacío")) {
      throw error
    }

    throw new Error("No se pudo leer el archivo de texto. Puede estar dañado o no ser un archivo de texto válido.")
  }
}

// Placeholder function for DOCX processing.  Replace with actual implementation.
async function processDOCX(file: File): Promise<string> {
  console.log("📄 Procesando archivo DOCX (placeholder)...")
  return "DOCX processing not yet implemented."
}

export async function POST(request: NextRequest) {
  console.log("🚨 === ENDPOINT v14.0 GEMINI ===")
  console.log("📅", new Date().toISOString())

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se encontró archivo" }, { status: 400 })
    }

    console.log(`📁 ARCHIVO: ${file.name} (${file.size} bytes)`)

    let extractedText = ""
    let method = ""

    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()

    try {
      if (fileName.endsWith(".pdf") || fileType.includes("pdf")) {
        console.log("🔍 PDF DETECTADO - USANDO GEMINI API")
        extractedText = await extractTextFromPDF(file)
        method = "gemini-api"
      } else if (fileName.endsWith(".docx") || fileType.includes("wordprocessingml")) {
        extractedText = await processDOCX(file)
        method = "mammoth"
      } else if (fileName.endsWith(".txt") || fileType.includes("text/plain")) {
        extractedText = await processText(file)
        method = "text"
      } else {
        return NextResponse.json({ error: `Tipo no soportado: ${file.type}` }, { status: 400 })
      }
    } catch (processingError: any) {
      // Errores específicos de Gemini que requieren notificación grande
      if (processingError.message.includes("The document has no pages")) {
        return NextResponse.json(
          {
            error: "El archivo PDF está dañado o no contiene páginas válidas. No se puede extraer texto.",
            errorTitle: "📄 PDF dañado o vacío",
            suggestion:
              "• El PDF puede estar corrupto o dañado\n• Verifica que el archivo se abra correctamente en un visor PDF\n• Intenta con un PDF diferente\n• Convierte el documento a texto plano (.txt)\n• Re-guarda el PDF desde la aplicación original",
            fileInfo: {
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
              type: file.type || "Desconocido",
            },
            showInUI: true,
          },
          { status: 400 },
        )
      }

      if (processingError.message.includes("GEMINI_NO_TEXT")) {
        return NextResponse.json(
          {
            error: "El PDF no contiene texto extraíble. Puede ser un PDF de solo imágenes o estar escaneado.",
            errorTitle: "🖼️ PDF sin texto extraíble",
            suggestion:
              "• El PDF contiene solo imágenes escaneadas\n• Usa un software de OCR para extraer texto\n• Convierte las imágenes a texto usando herramientas online\n• Intenta con un PDF que tenga texto seleccionable",
            fileInfo: {
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
              type: file.type || "Desconocido",
            },
            showInUI: true,
          },
          { status: 400 },
        )
      }

      if (processingError.message.includes("GEMINI_CONFIG_ERROR")) {
        return NextResponse.json(
          {
            error: "Gemini API no está configurado correctamente. Verifica las variables de entorno.",
            errorTitle: "🔧 Error de configuración",
            suggestion:
              "• Verifica que GEMINI_API_KEY esté configurado\n• Revisa la guía de configuración\n• Contacta al administrador del sistema\n• Intenta con un archivo de texto (.txt) como alternativa",
            fileInfo: {
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
              type: file.type || "Desconocido",
            },
            showInUI: true,
          },
          { status: 500 },
        )
      }

      // Errores generales de la API de Gemini
      if (processingError.message.includes("Gemini API error:")) {
        let errorTitle = "🤖 Error de Gemini API"
        let errorMessage = "No se pudo procesar el archivo PDF con Gemini API."
        let suggestions =
          "• El archivo puede estar dañado o ser incompatible\n• Intenta con un PDF más simple\n• Verifica tu conexión a internet\n• Convierte a texto plano (.txt) como alternativa"

        // Detectar errores específicos en el mensaje
        if (processingError.message.includes("400")) {
          errorTitle = "📄 Archivo no válido"
          errorMessage = "El archivo PDF no es válido o no se puede procesar."
          suggestions =
            "• Verifica que el archivo no esté dañado\n• Usa un PDF con texto seleccionable\n• Re-guarda el PDF desde la aplicación original\n• Convierte a texto plano (.txt)"
        } else if (processingError.message.includes("403")) {
          errorTitle = "📊 Límite de API alcanzado"
          errorMessage = "Se ha alcanzado el límite de procesamiento de Gemini API."
          suggestions =
            "• Intenta nuevamente en unos minutos\n• Verifica las cuotas en el panel de control\n• Usa un archivo de texto (.txt) como alternativa\n• Contacta soporte si persiste"
        } else if (processingError.message.includes("413")) {
          errorTitle = "📏 Archivo demasiado grande"
          errorMessage = "El archivo PDF es demasiado grande para procesar."
          suggestions =
            "• Reduce el tamaño del archivo PDF\n• Divide el documento en partes más pequeñas\n• Usa un archivo de máximo 10MB\n• Convierte a texto plano (.txt)"
        }

        return NextResponse.json(
          {
            error: errorMessage,
            errorTitle: errorTitle,
            suggestion: suggestions,
            fileInfo: {
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
              type: file.type || "Desconocido",
            },
            showInUI: true,
          },
          { status: 400 },
        )
      }

      // Para otros errores, re-lanzar
      throw processingError
    }

    const finalText = extractedText.trim()

    if (!finalText) {
      return NextResponse.json(
        {
          error: "No se pudo extraer texto del archivo",
          details: "El archivo podría estar vacío o corrupto",
        },
        { status: 400 },
      )
    }

    console.log(`🎉 === RESULTADO FINAL ===`)
    console.log(`📊 Caracteres: ${finalText.length}`)
    console.log(`🔧 Método: ${method}`)
    console.log(`📋 Texto: "${finalText.substring(0, 100)}..."`)

    return NextResponse.json({
      success: true,
      text: finalText,
      extractionMethod: method,
      stats: {
        fileName: file.name,
        fileSize: file.size,
        textLength: finalText.length,
      },
    })
  } catch (error: any) {
    console.error("❌ ERROR:", error)
    return NextResponse.json(
      {
        error: `Error: ${error.message}`,
        details: "Verifica que GEMINI_API_KEY esté configurado correctamente",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ACTIVO",
    version: "v14.0 GEMINI",
    method: "Gemini API para PDFs + Google Cloud Text-to-Speech",
    timestamp: new Date().toISOString(),
    requirements: {
      gemini: process.env.GEMINI_API_KEY ? "✅ Configurado" : "❌ Falta GEMINI_API_KEY",
      googleCloud: process.env.GOOGLE_CLOUD_CREDENTIALS ? "✅ Configurado" : "❌ Falta GOOGLE_CLOUD_CREDENTIALS",
    },
  })
}

