'use client';

import { useNotificationContext } from '@/context/useNotificationContext';
import useQueryParams from '@/hooks/useQueryParams';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { createClient } from '@/utils/supabase/client';

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotificationContext();
  const queryParams = useQueryParams();
  const supabase = createClient();

  const loginFormSchema = yup.object({
    email: yup.string().email('Mohon masukkan email yang valid').required('Email wajib diisi'),
    password: yup.string().required('Password wajib diisi')
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const login = handleSubmit(async (values) => {
    setLoading(true);
    try {
      // 1. Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        showNotification({ message: authError.message, variant: 'danger' });
        setLoading(false);
        return;
      }

      // 2. Check if Profile exists in public.profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        // If auth success but no profile found, it means data is inconsistent
        await supabase.auth.signOut();
        showNotification({ 
          message: 'Akun Anda terdaftar di sistem autentikasi tetapi data profil tidak ditemukan. Hubungi Admin.', 
          variant: 'danger' 
        });
      } else {
        showNotification({ message: 'Berhasil masuk. Mengalihkan...', variant: 'success' });
        router.push(queryParams['redirectTo'] ?? '/dashboard');
        router.refresh();
      }
    } catch (err) {
      showNotification({ message: 'Terjadi kesalahan sistem', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  });

  return { loading, login, control };
};

export default useSignIn;
