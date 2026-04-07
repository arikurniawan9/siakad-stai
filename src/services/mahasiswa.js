import { createClient } from '@/utils/supabase/server'

export async function getMahasiswa({ search = '', page = 1, limit = 10 }) {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('mahasiswa')
    .select('*, profiles!inner(*), program_studi(nama_prodi)', { count: 'exact' })

  if (search) {
    query = query.or(`nim.ilike.%${search}%,profiles.nama_lengkap.ilike.%${search}%`)
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return { data, count, totalPages: Math.ceil(count / limit) }
}

// Mutation functions are moved to actions.js to avoid "next/headers" import errors in Client Components
