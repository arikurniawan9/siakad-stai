'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createProdi(values) {
  try {
    await prisma.programStudi.create({
      data: {
        nama_prodi: values.nama_prodi,
        kode_prodi: values.kode_prodi,
        fakultas: values.fakultas
      }
    });
    revalidatePath('/prodi');
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteProdi(id) {
  try {
    await prisma.programStudi.delete({
      where: { id: BigInt(id) }
    });
    revalidatePath('/prodi');
  } catch (error) {
    throw new Error(error.message);
  }
}
