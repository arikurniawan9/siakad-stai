'use client';

import { Suspense } from 'react';

/**
 * AuthProtectionWrapper
 * Protection logic is now handled by Supabase Middleware for better security and performance.
 * This wrapper remains as a shell to maintain template structure compatibility.
 */
const AuthProtectionWrapper = ({ children }) => {
  return <Suspense>{children}</Suspense>;
};

export default AuthProtectionWrapper;
