'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-brand-cream/10 transition-colors text-brand-error/90 hover:text-brand-error"
    >
      <LogOut size={18} />
      Sign Out
    </button>
  );
}
