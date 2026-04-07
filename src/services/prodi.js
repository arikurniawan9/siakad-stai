import prisma from '@/lib/prisma'

export async function getProdis() {
  try {
    const data = await prisma.programStudi.findMany({
      orderBy: { nama_prodi: 'asc' }
    })
    
    // Convert BigInt to String for JSON compatibility
    return JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))
  } catch (error) {
    console.error('Error fetching prodis:', error)
    return []
  }
}
