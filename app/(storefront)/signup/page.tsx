'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white border border-brand-sand rounded-card p-8 shadow-subtle space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl text-brand-charcoal">Create Account</h1>
          <p className="text-brand-muted text-sm font-sans">
            Register to save addresses, track orders, and checkout faster.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-brand-error/10 border border-brand-error/20 rounded-card flex items-center gap-3 text-brand-error">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-brand-success/10 border border-brand-success/20 rounded-card flex items-center gap-3 text-brand-success">
            <CheckCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">Account created! Redirecting to login...</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="name" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Sarah Jenkins"
              {...register('name')}
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
            />
            {errors.name && (
              <p className="text-xs text-brand-error mt-1">{errors.name.message}</p>
            )}
          </div>

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
            <label htmlFor="password" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Password
            </label>
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

          <div>
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-brand-charcoal block mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className="w-full px-3 py-2 bg-white border border-brand-sand rounded-btn text-sm text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:border-brand-terracotta"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-brand-error mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full h-[44px] bg-brand-terracotta hover:bg-brand-terracottaHover text-brand-cream font-semibold rounded-btn transition-colors shadow-subtle flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Register'}
          </button>
        </form>

        <p className="text-center font-sans text-xs text-brand-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-terracotta hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
