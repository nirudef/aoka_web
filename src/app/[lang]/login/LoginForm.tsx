'use client'

import { useState } from 'react'

export default function LoginForm({ lang, t }: { lang: string; t: any }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      const data = await res.json()
      window.location.href = `/${lang}/cabinet`
    } else {
      const data = await res.json()
      setError(data.error || 'Ошибка входа')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t.login.email || 'Электронная почта'}
        </label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-700 dark:text-white"
          placeholder={t.login.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t.login.password || 'Пароль'}
        </label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-700 dark:text-white"
          placeholder={t.login.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg
                   transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {t.login.submit || 'Войти'}
      </button>
    </form>
  )
}
