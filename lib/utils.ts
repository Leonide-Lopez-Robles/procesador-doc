export type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === "string") {
      classes.push(input)
    } else if (typeof input === "number") {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const nested = cn(...input)
      if (nested) classes.push(nested)
    }
  }

  // Función simple para merge de clases de Tailwind
  const classMap = new Map<string, string>()

  for (const cls of classes.join(" ").split(" ")) {
    if (!cls) continue

    // Extraer el prefijo de la clase (ej: 'bg', 'text', 'p', etc.)
    const prefix = cls.split("-")[0]
    classMap.set(prefix, cls)
  }

  return Array.from(classMap.values()).join(" ")
}
