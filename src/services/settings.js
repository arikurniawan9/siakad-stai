import { createClient } from '@/utils/supabase/server'

export async function getSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching settings:', error)
    return { school_name: 'SIAKAD' } // Fallback
  }
  return data
}
