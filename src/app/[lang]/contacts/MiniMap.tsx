// src/app/[lang]/contacts/MiniMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function MiniMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy load при появлении в viewport
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { rootMargin: '100px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Инициализация карты
  useEffect(() => {
    if (!isVisible || loaded || !ref.current) return;

    const init = () => {
      if (!window.google?.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=marker&loading=async`;
        script.async = true;
        script.onload = () => setLoaded(true);
        document.head.appendChild(script);
      } else {
        setLoaded(true);
      }
    };

    init();
  }, [isVisible, loaded]);

  // Рендер карты
  useEffect(() => {
    if (loaded && ref.current) {
      new google.maps.Map(ref.current, {
        center: { lat: 43.238949, lng: 76.889709 },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: false,
        scrollwheel: false,
        draggable: false,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID, // ← рекомендуется
      });
    }
  }, [loaded]);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="h-48 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center"
      >
        {!loaded && !isVisible && (
          <span className="text-gray-500">Карта загрузится при прокрутке</span>
        )}
        {!loaded && isVisible && (
          <div className="animate-pulse text-gray-500">Загрузка карты...</div>
        )}
      </div>
      <button
        onClick={() => document.getElementById('branches')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded shadow text-sm font-medium text-blue-600 hover:bg-gray-50 transition"
      >
        Показать все филиалы
      </button>
    </div>
  );
}
