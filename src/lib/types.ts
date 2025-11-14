// lib/types.ts
export type User = {
  id: string
  email: string
  verified: boolean
  first_name?: string
  last_name?: string
  middle_name?: string
  iin?: string
  phone?: string
  license_number?: string
  license_issued_at?: string | null
  joined_at?: string | null
  branch_id?: string | null
  law_office_id?: string | null
  address?: string
  roles: string[]
}

export type CurrentUser = User | null

// export type Article = {
//   slug: string
//   title: string
//   lead?: string
//   published_at: string
// }
