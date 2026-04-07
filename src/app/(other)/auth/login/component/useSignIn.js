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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        showNotification({
          message: error.message,
          variant: 'danger'
        });
      } else {
        showNotification({
          message: 'Berhasil masuk. Mengalihkan...',
          variant: 'success'
        });
        
        // Check user role for redirection if needed
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        router.push(queryParams['redirectTo'] ?? '/dashboard');
        router.refresh();
      }
    } catch (err) {
      showNotification({
        message: 'Terjadi kesalahan sistem',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  });

  return {
    loading,
    login,
    control
  };
};

export default useSignIn;
