'use client';

import { useNotificationContext } from '@/context/useNotificationContext';
import useQueryParams from '@/hooks/useQueryParams';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { loginUser } from '../../actions';

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotificationContext();
  const queryParams = useQueryParams();

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
      // Call server action untuk login
      const result = await loginUser({
        email: values.email,
        password: values.password
      });

      if (!result.success) {
        showNotification({ message: result.message, variant: 'danger' });
        setLoading(false);
        return;
      }

      // Login berhasil
      showNotification({ message: result.message, variant: 'success' });
      
      // Redirect sesuai role
      const redirectTo = queryParams['redirectTo'] ?? '/dashboard';
      router.push(redirectTo);
      router.refresh();
      
    } catch (err) {
      console.error('Login error:', err);
      showNotification({ message: 'Terjadi kesalahan sistem', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  });

  return { loading, login, control };
};

export default useSignIn;
