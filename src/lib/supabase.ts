import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { UserPermission, AccountingConfig } from '../types'

const url = import.meta.env.VITE_SUPABASE_URL || ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase: SupabaseClient = createClient(url, key)

export async function fetchUsers(): Promise<UserPermission[]> {
  const { data, error } = await supabase
    .from('user_permissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function upsertUser(user: UserPermission): Promise<UserPermission> {
  const { data, error } = await supabase
    .from('user_permissions')
    .upsert(user, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('user_permissions').delete().eq('id', id)
  if (error) throw error
}

export async function fetchAccountingConfig(): Promise<AccountingConfig | null> {
  const { data, error } = await supabase
    .from('accounting_config')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertAccountingConfig(
  config: AccountingConfig
): Promise<AccountingConfig> {
  const { data, error } = await supabase
    .from('accounting_config')
    .upsert(config, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}
