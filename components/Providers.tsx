'use server';

import React from 'react';
import AuthProviderClient from './AuthProviderClient';
import { ThemeProvider } from './ThemeProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export default async function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProviderClient>{children}</AuthProviderClient>
    </ThemeProvider>
  );
}
