'use client'

import { useEffect, useRef, useState } from 'react'

interface BranchTranslation {
  name: string
  address: string
  description?: string
}

interface Branch {
  id: string
  phone?: string
  email?: string
  latitude?: string
  longitude?: string
  translations: {
    ru: BranchTranslation
    kk: BranchTranslation
    en: BranchTranslation
  }
}

interface Props {
  branches: Branch[]
  lang: 'ru' | 'kk' | 'en'
}

// --- глобальный промис загрузки карты, чтобы не грузить повторно ---
let googleMapsPromise: Promise<void> | null = null

function loadGoogleMaps(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()

  // если уже загружено — не грузим второй раз
  if (googleMapsPromise) return googleMapsPromise

  googleMapsPromise = new Promise<void>((resolve, reject) => {
    if (window.google?.maps) {
      resolve()
      return
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })

  return googleMapsPromise
}

export default function ContactsMap({ branches, lang }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  useEffect(() => {
    let map: google.maps.Map

    loadGoogleMaps().then(() => {
      if (!mapRef.current) return

      map = new google.maps.Map(mapRef.current, {
        center: { lat: 43.25, lng: 76.95 },
        zoom: 10,
      })

      const bounds = new google.maps.LatLngBounds()

      markersRef.current = branches
        .filter(b => b.latitude && b.longitude)
        .map(b => {
          const position = { lat: parseFloat(b.latitude!), lng: parseFloat(b.longitude!) }

          const marker = new google.maps.Marker({
            position,
            map,
            title: b.translations[lang]?.name || b.translations.ru.name,
          })

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <strong>${b.translations[lang]?.name || b.translations.ru.name}</strong><br/>
              ${b.translations[lang]?.address || b.translations.ru.address}<br/>
              ${b.phone ?? ''}<br/>
              ${b.email ?? ''}
            `,
          })

          marker.addListener('click', () => {
            infoWindow.open(map, marker)
            setHighlightedId(b.id)
          })

          bounds.extend(position)
          return { id: b.id, marker, infoWindow }
        })

      map.fitBounds(bounds)
    })
  }, [branches, lang])

  const handleHighlight = (id: string | null) => {
    setHighlightedId(id)
    markersRef.current.forEach(m => {
      m.marker.setAnimation(m.id === id ? google.maps.Animation.BOUNCE : null)
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="sm:w-2/3 h-96 rounded-lg overflow-hidden" ref={mapRef}></div>

      <div className="sm:w-1/3 flex flex-col gap-3 overflow-y-auto max-h-96">
        {branches.map(b => {
          const t = b.translations[lang] || b.translations.ru
          return (
            <div
              key={b.id}
              className={`border p-2 rounded cursor-pointer hover:bg-gray-100 ${
                highlightedId === b.id ? 'bg-yellow-100' : ''
              }`}
              onMouseEnter={() => handleHighlight(b.id)}
              onMouseLeave={() => handleHighlight(null)}
              onClick={() => handleHighlight(b.id)}
            >
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm">{t.address}</p>
              {b.phone && <p className="text-xs">Телефон: {b.phone}</p>}
              {b.email && <p className="text-xs">Email: {b.email}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
