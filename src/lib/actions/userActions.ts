// lib/actions/userActions.ts
'use server'

import { clearUserCache } from '@/lib/getCurrentUser'

export async function revalidateUser() {
  await clearUserCache()
  return { success: true }
}
