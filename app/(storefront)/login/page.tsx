'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error || 'Invalid email or password');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white border border-brand-sand rounded-card p-8 shadow-subtle space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl text-brand-charcoal">Welcome Back</h1>
          <p className="text-brand-muted text-sm font-sans">
            Access your orders, addresses, and account preferences.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-brand-error/10 border border-brand-error/20 rounded-card flex items-center gap-3 text-brand-error">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              {...register('email')}
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
            />
            {errors.email && (
              <p className="text-xs text-brand-error mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label htmlFor="password" className="text-xs font-semibold text-brand-charcoal">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-brand-muted hover:text-brand-terracotta transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              {...register('password')}
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
            />
            {errors.password && (
              <p className="text-xs text-brand-error mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[44px] bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-semibold rounded-btn transition-colors shadow-subtle flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6 text-center border-t border-brand-sand/50">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-white text-xs text-brand-muted">
            or continue with
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={() => signIn('google', { callbackUrl })}
          className="w-full h-[44px] border border-brand-sand hover:border-brand-charcoal text-brand-charcoal font-semibold rounded-btn transition-all bg-white flex items-center justify-center gap-2 text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>

        <p className="text-center font-sans text-xs text-brand-muted">
          New to the SHA Closet?{' '}
          <Link href="/signup" className="text-brand-terracotta hover:underline font-semibold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto px-6 py-24 text-center font-sans text-xs text-brand-muted">
        Loading sign in...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
