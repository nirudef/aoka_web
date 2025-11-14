'use client'

import React from 'react'

interface Props {
  userId: string
}

export default function DeleteUserButton({ userId }: Props) {
  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      alert('Пользователь удалён')
      window.location.reload() // Можно потом заменить на state обновления списка
    } else {
      const data = await res.json()
      alert(data.error || 'Ошибка удаления пользователя')
    }
  }

  return (
    <button className="text-red-600 hover:underline" onClick={handleDelete}>
      Удалить
    </button>
  )
}
