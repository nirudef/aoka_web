'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

// Тексты на 3 языках
const translations = {
  ru: {
    title: 'Коллегия адвокатов',
    about: 'О коллегии',
    organs: 'Органы коллегии',
    documents: 'Документы коллегии',
    about_text: `
      <p>Коллегия адвокатов — это профессиональное объединение адвокатов, осуществляющих защиту прав, свобод и законных интересов граждан и организаций.</p>
      <p>Она является самоуправляемой, некоммерческой организацией и действует на основании законодательства Республики Казахстан.</p>
    `,
    organs_text: `
      <p>Высшими органами коллегии являются:</p>
      <ul class="list-disc ml-6">
        <li>Общее собрание адвокатов;</li>
        <li>Совет коллегии;</li>
        <li>Ревизионная комиссия.</li>
      </ul>
    `,
    documents_text: `
      <ul class="list-disc ml-6">
        <li><a href="/docs/ustav.pdf" class="text-blue-600 hover:underline" target="_blank">Устав коллегии</a></li>
        <li><a href="/docs/etik.pdf" class="text-blue-600 hover:underline" target="_blank">Кодекс профессиональной этики адвокатов</a></li>
      </ul>
    `,
  },
  kk: {
    title: 'Адвокаттар алқасы',
    about: 'Алқа туралы',
    organs: 'Алқаның органдары',
    documents: 'Алқаның құжаттары',
    about_text: `
      <p>Адвокаттар алқасы – азаматтар мен ұйымдардың құқықтары мен заңды мүдделерін қорғауды жүзеге асыратын кәсіби бірлестік.</p>
      <p>Ол өзін-өзі басқаратын, коммерциялық емес ұйым болып табылады және Қазақстан Республикасының заңнамасына сәйкес әрекет етеді.</p>
    `,
    organs_text: `
      <p>Алқаның жоғары органдары:</p>
      <ul class="list-disc ml-6">
        <li>Адвокаттардың жалпы жиналысы;</li>
        <li>Алқа кеңесі;</li>
        <li>Тексеру комиссиясы.</li>
      </ul>
    `,
    documents_text: `
      <ul class="list-disc ml-6">
        <li><a href="/docs/ustav.pdf" class="text-blue-600 hover:underline" target="_blank">Алқа жарғысы</a></li>
        <li><a href="/docs/etik.pdf" class="text-blue-600 hover:underline" target="_blank">Адвокаттардың кәсіби этика кодексі</a></li>
      </ul>
    `,
  },
  en: {
    title: 'Bar Association',
    about: 'About the Association',
    organs: 'Governing Bodies',
    documents: 'Documents',
    about_text: `
      <p>The Bar Association is a professional organization of lawyers who provide protection of the rights and legal interests of individuals and entities.</p>
      <p>It is a self-governing, non-profit organization operating under the laws of the Republic of Kazakhstan.</p>
    `,
    organs_text: `
      <p>The main governing bodies are:</p>
      <ul class="list-disc ml-6">
        <li>General Assembly of Lawyers;</li>
        <li>Council of the Association;</li>
        <li>Audit Commission.</li>
      </ul>
    `,
    documents_text: `
      <ul class="list-disc ml-6">
        <li><a href="/docs/ustav.pdf" class="text-blue-600 hover:underline" target="_blank">Charter of the Association</a></li>
        <li><a href="/docs/etik.pdf" class="text-blue-600 hover:underline" target="_blank">Code of Professional Ethics</a></li>
      </ul>
    `,
  },
}

export default function CollegiumClient({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations.ru
  const [activeTab, setActiveTab] = useState<'about' | 'organs' | 'documents' | null>('about')
  const [isMobile, setIsMobile] = useState(false)

  // Определяем мобильное устройство
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderContent = (key: 'about' | 'organs' | 'documents') => (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: t[`${key}_text`] }}
    />
  )

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 min-h-[80vh]">
      <h1 className="text-2xl font-bold mb-8">{t.title}</h1>

      {/* Десктоп — табы слева */}
      {!isMobile ? (
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 border-r pr-4 space-y-2">
            {(['about', 'organs', 'documents'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                  activeTab === key
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {t[key]}
              </button>
            ))}
          </div>

          <div className="col-span-3 bg-white border rounded-xl p-6 shadow-sm">
            {renderContent(activeTab || 'about')}
          </div>
        </div>
      ) : (
        // Мобильная версия — аккордеон
        <div className="space-y-3">
          {(['about', 'organs', 'documents'] as const).map((key) => (
            <div key={key} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab(activeTab === key ? null : key)}
                className="flex justify-between items-center w-full px-4 py-3 bg-gray-50 font-medium text-gray-800"
              >
                {t[key]}
                <ChevronDown
                  className={`w-5 h-5 transform transition-transform ${
                    activeTab === key ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeTab === key && (
                <div className="p-4 bg-white border-t">{renderContent(key)}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
