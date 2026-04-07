'use client';

import React, { useState } from 'react';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const registerSchema = yup.object({
    name: yup.string().required('Mohon masukkan nama lengkap Anda'),
    email: yup.string().email('Email tidak valid').required('Mohon masukkan email Anda'),
    password: yup.string().min(6, 'Password minimal 6 karakter').required('Mohon masukkan password Anda')
  });

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
            role: 'mahasiswa'
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Email ini sudah terdaftar. Jika Anda menghapus data di tabel, Anda juga harus menghapusnya di menu Authentication Supabase.');
        } else {
          toast.error('Gagal mendaftar: ' + error.message);
        }
      } else {
        toast.success('Pendaftaran berhasil! Silakan login.');
        setTimeout(() => router.push('/auth/login'), 1500);
      }
    } catch (err) {
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="text-start mb-3">
        <TextFormInput control={control} name="name" label="Nama Lengkap" placeholder="Masukkan nama lengkap" containerClassName="mb-3" />
        <TextFormInput control={control} name="email" label="Email" type="email" placeholder="Masukkan email" containerClassName="mb-3" />
        <TextFormInput control={control} name="password" label="Password" type="password" placeholder="Masukkan password" containerClassName="mb-4" />
        
        <div className="d-grid">
          <button className="btn btn-primary fw-semibold py-2" type="submit" disabled={loading}>
            {loading ? 'Sedang Memproses...' : 'Daftar Sekarang'}
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
