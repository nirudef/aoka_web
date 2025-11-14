// components/GlobalNotification.tsx
'use client'

import { useEffect, useState } from 'react'

export default function GlobalNotification({ t }: { t: any }) {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const msg = sessionStorage.getItem('globalSuccess')
    const exp = Number(sessionStorage.getItem('globalSuccessExpires') || 0)
    if (msg && Date.now() < exp) {
      setMessage(msg)
      // Очищаем, чтобы не показалось снова
      sessionStorage.removeItem('globalSuccess')
      sessionStorage.removeItem('globalSuccessExpires')

      // Автоскрытие
      const timer = setTimeout(() => setMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!message) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md p-4 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in">
      {message}
    </div>
  )
}
