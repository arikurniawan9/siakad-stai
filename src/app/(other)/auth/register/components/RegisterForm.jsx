'use client';

import React, { useState, useEffect } from 'react';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { registerUser, isFirstUser } from '../../actions';

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [isAdminRegistration, setIsAdminRegistration] = useState(false);
  const router = useRouter();

  // Cek apakah ini user pertama (admin)
  useEffect(() => {
    const checkFirstUser = async () => {
      const isFirst = await isFirstUser();
      setIsAdminRegistration(isFirst);
    };
    checkFirstUser();
  }, []);

  const registerSchema = yup.object({
    nama_lengkap: yup.string().required('Mohon masukkan nama lengkap Anda'),
    email: yup.string().email('Email tidak valid').required('Mohon masukkan email Anda'),
    password: yup.string().min(6, 'Password minimal 6 karakter').required('Mohon masukkan password Anda'),
    confirm_password: yup.string()
      .oneOf([yup.ref('password'), null], 'Password tidak cocok')
      .required('Konfirmasi password wajib diisi')
  });

  const { handleSubmit, control } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      // Tentukan role: user pertama = admin, lainnya = mahasiswa
      const role = isAdminRegistration ? 'admin' : 'mahasiswa';

      const result = await registerUser({
        email: values.email,
        password: values.password,
        nama_lengkap: values.nama_lengkap,
        role: role
      });

      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        setTimeout(() => router.push('/auth/login'), 1500);
      }
    } catch (err) {
      console.error('Register error:', err);
      toast.error('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isAdminRegistration && (
        <div className="alert alert-warning border-0 small mb-3">
          <i className="ri:admin-line me-1"></i>
          <strong>Pendaftaran Administrator:</strong> Anda adalah user pertama yang terdaftar. 
          Anda akan otomatis mendapatkan akses <strong>Administrator</strong>.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="text-start mb-3">
        <TextFormInput 
          control={control} 
          name="nama_lengkap" 
          label="Nama Lengkap" 
          placeholder="Masukkan nama lengkap" 
          containerClassName="mb-3" 
        />
        
        <TextFormInput 
          control={control} 
          name="email" 
          label="Email" 
          type="email" 
          placeholder="Masukkan email" 
          containerClassName="mb-3" 
        />
        
        <TextFormInput 
          control={control} 
          name="password" 
          label="Password" 
          type="password" 
          placeholder="Masukkan password" 
          containerClassName="mb-3" 
        />

        <TextFormInput 
          control={control} 
          name="confirm_password" 
          label="Konfirmasi Password" 
          type="password" 
          placeholder="Ulangi password" 
          containerClassName="mb-4" 
        />

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
