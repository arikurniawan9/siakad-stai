import prisma from '@/lib/prisma'

export async function getMahasiswa({ search = '', page = 1, limit = 10 }) {
  const skip = (page - 1) * limit

  // Query menggunakan Prisma
  const where = search ? {
    OR: [
      { nim: { contains: search, mode: 'insensitive' } },
      { profile: { nama_lengkap: { contains: search, mode: 'insensitive' } } }
    ]
  } : {}

  const [data, count] = await Promise.all([
    prisma.mahasiswa.findMany({
      where,
      include: {
        profile: true,
        program_studi: true
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit
    }),
    prisma.mahasiswa.count({ where })
  ])

  // Konversi BigInt ke String untuk JSON compatibility (karena id prodi adalah BigInt)
  const serializedData = JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ))

  return { 
    data: serializedData, 
    count, 
    totalPages: Math.ceil(count / limit) 
  }
}
