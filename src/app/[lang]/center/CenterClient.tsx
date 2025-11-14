'use client'

import { useState, useEffect } from 'react'

const translations = {
  ru: {
    title: 'Центр повышения квалификации и стажировки',
    about: 'О центре',
    programs: 'Программы обучения',
    internship: 'Стажировка',
    about_text: `
      <p>Центр повышения квалификации и стажировки при Коллегии адвокатов обеспечивает профессиональное развитие адвокатов, стажёров и практикантов.</p>
      <p>Основные направления деятельности Центра:</p>
      <ul>
        <li>Организация обучающих курсов и семинаров;</li>
        <li>Проведение стажировок и тренингов;</li>
        <li>Повышение уровня правовой культуры и профессиональной этики.</li>
      </ul>
    `,
    programs_text: `
      <p>Центр реализует образовательные программы по актуальным направлениям юриспруденции, включая:</p>
      <ul>
        <li>Новые подходы в уголовном процессе;</li>
        <li>Медиация и альтернативное разрешение споров;</li>
        <li>Актуальные вопросы гражданского и административного права;</li>
        <li>Профессиональная этика адвоката.</li>
      </ul>
    `,
    internship_text: `
      <p>Стажировка является обязательным этапом подготовки адвоката.</p>
      <p>Центр организует прохождение стажировки под руководством опытных наставников и обеспечивает практическое обучение на реальных делах.</p>
    `,
  },
  kk: {
    title: 'Біліктілікті арттыру және тағылымдама орталығы',
    about: 'Орталық туралы',
    programs: 'Оқыту бағдарламалары',
    internship: 'Тағылымдама',
    about_text: `
      <p>Адвокаттар алқасы жанындағы Біліктілікті арттыру және тағылымдама орталығы адвокаттар мен тағылымдамадан өтушілердің кәсіби дамуын қамтамасыз етеді.</p>
      <ul>
        <li>Оқыту курстары мен семинарларды ұйымдастыру;</li>
        <li>Тағылымдамалар мен тренингтер өткізу;</li>
        <li>Құқықтық мәдениет пен кәсіби этиканы арттыру.</li>
      </ul>
    `,
    programs_text: `
      <p>Орталық келесі бағыттар бойынша оқу бағдарламаларын жүзеге асырады:</p>
      <ul>
        <li>Қылмыстық процестегі жаңа тәсілдер;</li>
        <li>Медиация және дауларды баламалы шешу;</li>
        <li>Азаматтық және әкімшілік құқықтағы өзекті мәселелер;</li>
        <li>Адвокаттың кәсіби этикасы.</li>
      </ul>
    `,
    internship_text: `
      <p>Тағылымдама – адвокатты даярлаудың міндетті кезеңі.</p>
      <p>Орталық тәжірибелі тәлімгерлердің басшылығымен тағылымдамадан өтуді және нақты істер бойынша тәжірибелік оқытуды қамтамасыз етеді.</p>
    `,
  },
  en: {
    title: 'Center for Professional Development and Internship',
    about: 'About the Center',
    programs: 'Training Programs',
    internship: 'Internship',
    about_text: `
      <p>The Center for Professional Development and Internship ensures the continuous education and practical training of lawyers and trainees.</p>
      <ul>
        <li>Organizing educational courses and seminars;</li>
        <li>Conducting internships and training sessions;</li>
        <li>Promoting legal culture and professional ethics.</li>
      </ul>
    `,
    programs_text: `
      <p>The Center offers training programs on current legal topics such as:</p>
      <ul>
        <li>New approaches in criminal procedure;</li>
        <li>Mediation and alternative dispute resolution;</li>
        <li>Modern issues in civil and administrative law;</li>
        <li>Professional ethics of a lawyer.</li>
      </ul>
    `,
    internship_text: `
      <p>Internship is an essential stage in the preparation of a lawyer.</p>
      <p>The Center provides practical training under the supervision of experienced mentors.</p>
    `,
  },
}

// interface Props {
//   lang: keyof typeof translations
// }

export default function CenterClient({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations.ru
  const [activeTab, setActiveTab] = useState<'about' | 'programs' | 'internship' | null>('about')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderContent = (key: 'about' | 'programs' | 'internship') => (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: t[`${key}_text`] }}
    />
  )

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 min-h-[80vh]">
      <h1 className="text-2xl font-bold mb-8">{t.title}</h1>

      {/* Десктоп */}
      {!isMobile ? (
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 border-r pr-4 space-y-2">
            {(['about', 'programs', 'internship'] as const).map((key) => (
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
        // Мобильный аккордеон
        <div className="space-y-3">
          {(['about', 'programs', 'internship'] as const).map((key) => (
            <div key={key} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab(activeTab === key ? null : key)}
                className="flex justify-between items-center w-full px-4 py-3 bg-gray-50 font-medium text-gray-800"
              >
                {t[key]}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 transform transition-transform ${
                    activeTab === key ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
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
