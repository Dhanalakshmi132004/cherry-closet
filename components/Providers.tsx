'use server';

import React from 'react';
import AuthProviderClient from './AuthProviderClient';

interface ProvidersProps {
  children: React.ReactNode;
}

export default async function Providers({ children }: ProvidersProps) {
  return <AuthProviderClient>{children}</AuthProviderClient>;
}
