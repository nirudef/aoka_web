// lib/validation/userForm.ts

export type ValidationErrorKey =
  | 'firstNameRequired'
  | 'lastNameRequired'
  | 'emailInvalid'
  | 'licenseNumberRequired'
  | 'licenseIssuedAtRequired'
  | 'joinedAtRequired'
  | 'iinInvalid'
  | 'phoneInvalid'

/**
 * Валидация формы пользователя
 * @param data — данные формы
 * @param options.isLawyer — true, если редактируемый пользователь — адвокат (или сам адвокат редактирует себя)
 * @returns null если всё ок, иначе — ключ ошибки для локализации
 */
export function validateUserForm(
  data: {
    first_name: string
    last_name: string
    email: string
    license_number?: string | null
    license_issued_at?: string | null
    joined_at?: string | null
    iin?: string
    phone?: string
  },
  options: {
    isLawyer: boolean
  }
): ValidationErrorKey | null {
  const { first_name, last_name, email, license_number, license_issued_at, joined_at, iin, phone } = data

  // 1. Обязательные для всех
  if (!first_name?.trim()) return 'firstNameRequired'
  if (!last_name?.trim()) return 'lastNameRequired'
  if (!email?.includes('@') || !email?.includes('.')) return 'emailInvalid'

  // 2. Обязательно — только для адвоката
  if (options.isLawyer) {
    if (!license_number?.trim()) return 'licenseNumberRequired'
    if (!license_issued_at) return 'licenseIssuedAtRequired'
    if (!joined_at) return 'joinedAtRequired'
  }

  // 3. Формат ИИН (если указан)
  if (iin && !/^\d{12}$/.test(iin)) {
    return 'iinInvalid'
  }

  // 4. Телефон (если указан)
  if (phone && phone.trim() && !/^[\+\d\-\s\(\)]{10,}$/.test(phone)) {
    return 'phoneInvalid'
  }

  return null
}
