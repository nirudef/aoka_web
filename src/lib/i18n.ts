import fs from 'fs'
import path from 'path'

export function getTranslations(locale: string) {
  const filePath = path.join(process.cwd(), 'locales', `${locale}.json`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}
