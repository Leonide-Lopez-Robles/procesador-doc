"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const CheckCircle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const AlertTriangle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const Github = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const Shield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const Copy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2 2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

export function GitHubIntegrationGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Github className="text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Integración con GitHub
            </h1>
            <Shield className="text-blue-600" />
          </div>
          <p className="text-xl text-gray-600">🔐 Sube tu proyecto de forma segura protegiendo tus credenciales</p>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>✅ Proyecto listo:</strong> Tu aplicación está completamente preparada para colaboración segura en
            GitHub.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {/* Paso 1 - Preparar archivos */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-purple-500">1</Badge>📁 Preparar Archivos para GitHub
              </CardTitle>
              <CardDescription>Organizar el proyecto y proteger credenciales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">🔧 Comandos de preparación:</h4>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300"># En tu directorio del proyecto</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(`# Verificar que .env.local no esté en git
git status

# Si aparece .env.local, removerlo
git rm --cached .env.local

# Verificar .gitignore
cat .gitignore | grep -E "\.env|credentials"`)
                      }
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div># Verificar que .env.local no esté en git</div>
                    <div>git status</div>
                    <div className="mt-2"># Si aparece .env.local, removerlo</div>
                    <div>git rm --cached .env.local</div>
                    <div className="mt-2"># Verificar .gitignore</div>
                    <div>cat .gitignore | grep -E "\.env|credentials"</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 2 - Integrar con el botón PDF */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-blue-500">2</Badge>🔗 Integrar con el Botón PDF
              </CardTitle>
              <CardDescription>
                Modificar el proyecto principal para que el botón PDF abra tu aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">📝 Modificar src/app/page.tsx:</h4>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">// Reemplazar el botón PDF existente</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(`import { useRouter } from 'next/navigation'

// Dentro del componente
const router = useRouter()

// Reemplazar el botón PDF con:
<button 
  onClick={() => router.push('/pdf-processor')}
  className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded shadow"
>
  PDF
</button>`)
                      }
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div>
                      import {"{"} useRouter {"}"} from 'next/navigation'
                    </div>
                    <div className="mt-2">// Dentro del componente</div>
                    <div>const router = useRouter()</div>
                    <div className="mt-2">// Reemplazar el botón PDF con:</div>
                    <div>{"<button"}</div>
                    <div> onClick={"{() => router.push('/pdf-processor')"}</div>
                    <div>
                      {" "}
                      className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded shadow"
                    </div>
                    <div>{">"}</div>
                    <div> PDF</div>
                    <div>{"</button>"}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 3 - Estructura de carpetas */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-green-500">3</Badge>📂 Estructura del Proyecto
              </CardTitle>
              <CardDescription>Organización recomendada de archivos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">🗂️ Estructura recomendada:</h4>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs">
                  <div className="space-y-1">
                    <div>procesador-doc/</div>
                    <div>├── src/</div>
                    <div>│ └── app/</div>
                    <div>│ ├── page.tsx (proyecto principal)</div>
                    <div>│ └── pdf-processor/</div>
                    <div>│ └── page.tsx (tu aplicación)</div>
                    <div>├── components/ (componentes compartidos)</div>
                    <div>├── app/ (tu aplicación completa)</div>
                    <div>├── .env.local (TUS credenciales - NO subir)</div>
                    <div>├── .env.example (ejemplo para colaboradores)</div>
                    <div>├── .gitignore (protege credenciales)</div>
                    <div>└── README.md (documentación)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 4 - Comandos de Git */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-orange-500">4</Badge>🚀 Subir a GitHub
              </CardTitle>
              <CardDescription>Comandos para subir tu proyecto de forma segura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-3">💻 Comandos de Git:</h4>
                <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300"># Comandos para subir el proyecto</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(`# Agregar todos los archivos (excepto .env.local)
git add .

# Verificar que .env.local NO aparezca
git status

# Hacer commit
git commit -m "feat: Agregar procesador de documentos con IA

- Integración con Google Cloud Text-to-Speech
- Extracción de PDFs con Gemini AI
- Traducción automática
- Resúmenes inteligentes
- Monitoreo de cuotas en tiempo real
- Configuración segura para colaboradores"

# Subir al repositorio
git push origin main`)
                      }
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div># Agregar todos los archivos (excepto .env.local)</div>
                    <div>git add .</div>
                    <div className="mt-2"># Verificar que .env.local NO aparezca</div>
                    <div>git status</div>
                    <div className="mt-2"># Hacer commit</div>
                    <div>git commit -m "feat: Agregar procesador de documentos con IA"</div>
                    <div className="mt-2"># Subir al repositorio</div>
                    <div>git push origin main</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 5 - Instrucciones para colaboradores */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="bg-indigo-500">5</Badge>👥 Instrucciones para Colaboradores
              </CardTitle>
              <CardDescription>Qué deben hacer tus colaboradores para ejecutar el proyecto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-indigo-800 mb-3">📋 Pasos para colaboradores:</h4>
                <div className="space-y-3 text-sm text-indigo-700">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      1
                    </Badge>
                    <div>
                      <strong>Clonar el repositorio:</strong>
                      <code className="block bg-white p-2 rounded mt-1 text-xs">
                        git clone https://github.com/Leonide-Lopez-Robles/procesador-doc.git
                      </code>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      2
                    </Badge>
                    <div>
                      <strong>Instalar dependencias:</strong>
                      <code className="block bg-white p-2 rounded mt-1 text-xs">npm install</code>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      3
                    </Badge>
                    <div>
                      <strong>Copiar .env.example a .env.local:</strong>
                      <code className="block bg-white p-2 rounded mt-1 text-xs">cp .env.example .env.local</code>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      4
                    </Badge>
                    <div>
                      <strong>Configurar sus propias APIs</strong> (siguiendo DEPLOYMENT-GUIDE.md)
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      5
                    </Badge>
                    <div>
                      <strong>Ejecutar:</strong>
                      <code className="block bg-white p-2 rounded mt-1 text-xs">npm run dev</code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verificación de seguridad */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>🔐 Verificación de seguridad:</strong>
            <div className="mt-2 space-y-1 text-sm">
              <div>✅ .env.local está en .gitignore</div>
              <div>✅ .env.example creado para colaboradores</div>
              <div>✅ README.md con instrucciones completas</div>
              <div>✅ DEPLOYMENT-GUIDE.md con configuración detallada</div>
              <div>❌ NUNCA subas archivos con credenciales reales</div>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>🎉 ¡Listo para colaborar!</strong> Tu proyecto está configurado de forma segura. Cada colaborador
            podrá ejecutar la aplicación con sus propias credenciales sin comprometer la seguridad.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
