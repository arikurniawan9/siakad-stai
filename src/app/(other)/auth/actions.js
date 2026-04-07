'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Login user dengan Supabase Auth + Prisma
 * @param {Object} formData - { email, password }
 * @returns {Object } - { success, message, user }
 */
export async function loginUser(formData) {
  const { email, password } = formData;

  try {
    // 1. Login via Supabase Auth
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        success: false,
        message: authError.message || 'Email atau password salah'
      };
    }

    // 2. Ambil data user dari database via Prisma
    const user = await prisma.user.findUnique({
      where: { id: authData.user.id },
      include: {
        mahasiswa: true,
        dosen: true,
        pendaftar: true
      }
    });

    if (!user) {
      // User ada di Supabase Auth tapi tidak ada di database
      await supabase.auth.signOut();
      return {
        success: false,
        message: 'Akun tidak ditemukan di database. Hubungi administrator.'
      };
    }

    // 3. Return success
    return {
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        nama_lengkap: user.nama_lengkap,
        role: user.role
      }
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan sistem'
    };
  }
}

/**
 * Register user baru dengan Supabase Auth + Prisma
 * @param {Object} formData - { email, password, nama_lengkap, role? }
 * @returns {Object } - { success, message }
 */
export async function registerUser(formData) {
  const { email, password, nama_lengkap, role = 'mahasiswa' } = formData;

  try {
    // 1. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        success: false,
        message: 'Email sudah terdaftar'
      };
    }

    // 2. Register ke Supabase Auth
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nama_lengkap,
          role: role
        }
      }
    });

    if (authError) {
      return {
        success: false,
        message: authError.message || 'Gagal mendaftar'
      };
    }

    // 3. Jika tidak ada error, buat user di database via Prisma
    if (authData.user) {
      await prisma.user.create({
        data: {
          id: authData.user.id,
          email: email,
          nama_lengkap: nama_lengkap,
          role: role
        }
      });

      // Jika role mahasiswa, buat entry kosong di tabel mahasiswa
      if (role === 'mahasiswa') {
        // NIM akan diisi admin nanti
        // Kita buat placeholder saja
      }

      // Jika role dosen, buat entry di tabel dosen
      if (role === 'dosen') {
        await prisma.dosen.create({
          data: {
            id: authData.user.id,
            user_id: authData.user.id,
            nama_lengkap: nama_lengkap
          }
        });
      }
    }

    return {
      success: true,
      message: 'Pendaftaran berhasil! Silakan login.'
    };

  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan sistem'
    };
  }
}

/**
 * Logout user
 */
export async function logoutUser() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/');
    redirect('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Ambil data lengkap dari database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        mahasiswa: {
          include: {
            program_studi: true
          }
        },
        dosen: true,
        pendaftar: true
      }
    });

    return dbUser;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Cek apakah ini user pertama (untuk admin otomatis)
 */
export async function isFirstUser() {
  try {
    const count = await prisma.user.count();
    return count === 0;
  } catch (error) {
    console.error('Check first user error:', error);
    return false;
  }
}
