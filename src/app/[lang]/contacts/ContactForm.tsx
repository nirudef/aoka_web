// src/app/[lang]/contacts/ContactForm.tsx
'use client'

import { useState } from 'react'

interface Props {
  lang: 'ru' | 'kk' | 'en'
}

export default function ContactForm({ lang }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, lang }),
      })

      if (!res.ok) throw new Error('Ошибка при отправке')
      setSent(true)
      // Очистка полей после отправки
      setName('')
      setEmail('')
      setMessage('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>✅ Сообщение успешно отправлено</span>
        </div>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Отправить ещё
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Ваше имя *
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Сообщение *
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Отправить сообщение
      </button>

      <p className="text-xs text-gray-500">
        Отправляя форму, вы соглашаетесь с обработкой персональных данных.
      </p>
    </form>
  )
}
