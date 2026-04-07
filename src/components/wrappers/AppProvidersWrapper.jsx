'use client';

import { NotificationProvider } from '@/context/useNotificationContext';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';
const LayoutProvider = dynamic(() => import('@/context/useLayoutContext').then(mod => mod.LayoutProvider), {
  ssr: false
});

const AppProvidersWrapper = ({
  children
}) => {
  return <>
        <LayoutProvider>
          <NotificationProvider>
            {children}
            <ToastContainer theme="colored" />
          </NotificationProvider>
        </LayoutProvider>
    </>;
};
export default AppProvidersWrapper;
