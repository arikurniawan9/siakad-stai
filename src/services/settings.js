import prisma from '@/lib/prisma'

export async function getSettings() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 1 }
    })
    return settings || { school_name: 'SIAKAD', school_logo_url: '/Wikimedia-logo.png' }
  } catch (error) {
    console.error('Error fetching settings with Prisma:', error)
    return { school_name: 'SIAKAD', school_logo_url: '/Wikimedia-logo.png' }
  }
}
