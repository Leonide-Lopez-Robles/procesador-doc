"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

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

const ExternalLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const Copy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2 2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const Sparkles = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
)

const Globe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

export function SetupGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exampleCredentials = `{
  "type": "service_account",
  "project_id": "tu-project-id",
  "private_key_id": "key-id-ejemplo",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nTU_PRIVATE_KEY_AQUI\\n-----END PRIVATE KEY-----\\n",
  "client_email": "tu-service-account@tu-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs/tu-service-account%40tu-project.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Configuración Completa v15.0
            </h1>
            <Globe className="text-green-600" />
          </div>
          
        </div>

        

        <div className="grid gap-6">
          {/* Paso 1 - Gemini API */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-purple-500">1</Badge>Configurar Gemini API
              </CardTitle>
              <CardDescription>Para extracción de PDFs, resúmenes y traducciones </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Ve a{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Google AI Studio <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Haz clic en "Create API Key"</li>
                  <li>Selecciona tu proyecto de Google Cloud</li>
                  <li>Copia la API Key generada</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Paso 2 - Google Cloud APIs */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-500">2</Badge>
                 Google Cloud APIs
              </CardTitle>
              <CardDescription>Habilitar Text-to-Speech y Translation APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm mb-3">Habilita estas APIs en tu proyecto:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <a
                      href="https://console.cloud.google.com/apis/library/texttospeech.googleapis.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Cloud Text-to-Speech API <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <a
                      href="https://console.cloud.google.com/apis/library/translate.googleapis.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Cloud Translation API <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 3 - Service Account */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-green-500">3</Badge>🔧 Service Account
              </CardTitle>
              <CardDescription>Crear cuenta de servicio con permisos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    Ve a{" "}
                    <a
                      href="https://console.cloud.google.com/iam-admin/serviceaccounts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline inline-flex items-center gap-1"
                    >
                      IAM & Admin → Service Accounts <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Crea un Service Account</li>
                  <li>Asigna estos roles:</li>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <code className="bg-gray-200 px-1 rounded">Cloud Text-to-Speech Client</code>
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">Cloud Translation API User</code>
                    </li>
                  </ul>
                  <li>Descarga las credenciales JSON</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Paso 4 - Variables de entorno */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-orange-500">4</Badge>🔧 Variables de Entorno
              </CardTitle>
              <CardDescription>Archivo .env.local completo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300"># .env.local</span>
                  <button
                    onClick={() =>
                      copyToClipboard(`# Gemini API para PDFs y resúmenes
GEMINI_API_KEY=tu-gemini-api-key-aqui

# Google Cloud para Text-to-Speech y Translation
GOOGLE_CLOUD_PROJECT_ID=tu-project-id
GOOGLE_CLOUD_CREDENTIALS=${exampleCredentials.replace(/\n/g, "")}`)
                    }
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copiar todo
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-400"># Gemini API para PDFs y resúmenes</div>
                  <div>GEMINI_API_KEY=tu-gemini-api-key-aqui</div>
                  <div className="mt-3 text-gray-400"># Google Cloud para Text-to-Speech y Translation</div>
                  <div>GOOGLE_CLOUD_PROJECT_ID=tu-project-id</div>
                  <div>GOOGLE_CLOUD_CREDENTIALS={"{"}</div>
                  <div className="ml-2">"type": "service_account",</div>
                  <div className="ml-2">"project_id": "tu-project-id",</div>
                  <div className="ml-2">...</div>
                  <div>{"}"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funcionalidades */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" />✅ Funcionalidades Completas v15.0
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">🤖</span>
                  <span>
                    <strong>Gemini AI:</strong> Extracción de PDFs y resúmenes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🎵</span>
                  <span>
                    <strong>Text-to-Speech:</strong> Audio de alta calidad
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">🌍</span>
                  <span>
                    <strong>Translation:</strong> +100 idiomas disponibles
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">📝</span>
                  <span>
                    <strong>4 tipos de resumen:</strong> General, corto, puntos, detallado
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">🔄</span>
                  <span>
                    <strong>Flujo completo:</strong> PDF → Texto → Resumen → Traducir → Audio
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600">⚡</span>
                  <span>
                    <strong>Detección automática:</strong> Idioma origen detectado
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>🎉 Suite completa configurada:</strong> Extrae texto de PDFs, genera resúmenes, traduce a cualquier
            idioma y convierte todo a audio de alta calidad.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

/*84<Alert className="border-purple-200 bg-purple-50">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>🎯 Nueva funcionalidad:</strong> Ahora puedes traducir texto y resúmenes a más de 100 idiomas usando
            Google Cloud Translation API.
          </AlertDescription>
        </Alert>*/
/*<p className="text-xl text-gray-600">
             🤖 **Gemini** + 🎵 **Text-to-Speech** + 🌍 **Translation** = Suite completa de IA
          </p>*/
