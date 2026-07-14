'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

interface AuthProviderClientProps {
  children: React.ReactNode;
}

export default function AuthProviderClient({ children }: AuthProviderClientProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
