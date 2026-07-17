'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-[calc(100vh-160px)] flex">
      {/* ─── LEFT PANEL: Brand Showcase ─── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-brand-dark">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-brand-blue-600/20 blur-[120px] animate-float" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-blue-400/15 blur-[100px] animate-float-delayed" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-brand-blue-800/20 blur-[80px]" />
        </div>

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating Decorative Elements */}
        <div className="absolute top-[15%] left-[10%] w-20 h-20 border border-brand-blue-400/20 rounded-2xl rotate-12 animate-float" />
        <div className="absolute top-[60%] right-[15%] w-16 h-16 border border-brand-blue-300/15 rounded-full animate-float-delayed" />
        <div className="absolute bottom-[20%] left-[20%] w-12 h-12 bg-brand-blue-500/10 rounded-xl rotate-45 animate-float" />
        <div className="absolute top-[35%] right-[25%] w-3 h-3 bg-brand-blue-400/40 rounded-full animate-float-delayed" />
        <div className="absolute top-[75%] left-[40%] w-2 h-2 bg-brand-blue-300/50 rounded-full animate-float" />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="relative w-12 h-12">
              <Image
                src="/logo.png"
                alt="The SHA closet"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-serif text-brand-white text-xl tracking-wider">
              <span className="font-light text-sm tracking-[0.12em] text-brand-blue-200">The</span>{' '}
              <span className="font-black bg-gradient-to-r from-brand-blue-300 to-brand-blue-500 bg-clip-text text-transparent">SHA</span>{' '}
              <span className="font-light text-sm tracking-[0.12em] text-brand-blue-200">closet</span>
            </span>
          </div>

          {/* Hero Text */}
          <div className="space-y-6 max-w-lg">
            <h1 className="font-serif text-5xl xl:text-6xl text-brand-white font-black leading-[1.1] animate-fade-in-up">
              Welcome{' '}
              <span className="bg-gradient-to-r from-brand-blue-300 via-brand-blue-400 to-brand-blue-600 bg-clip-text text-transparent">
                back
              </span>
              <span className="text-brand-blue-400">.</span>
            </h1>
            <p className="text-brand-blue-200/70 text-lg leading-relaxed font-light animate-fade-in-up animation-delay-200">
              Your handcrafted treasures await. Sign in to track orders, manage your wishlist, and discover new arrivals.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-12 animate-fade-in-up animation-delay-300">
            {['Track Orders', 'Wishlist', 'Exclusive Drops', 'Early Access'].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 rounded-full border border-brand-blue-400/20 bg-brand-blue-500/5 text-brand-blue-200 text-xs font-medium tracking-wide backdrop-blur-sm"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Bottom Testimonial */}
          <div className="mt-16 p-6 rounded-2xl bg-brand-white/5 backdrop-blur-md border border-brand-white/10 max-w-md animate-fade-in-up animation-delay-400">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-brand-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-brand-white/80 text-sm leading-relaxed italic">
              &ldquo;Each piece feels like it was made just for me. The quality and attention to detail is extraordinary.&rdquo;
            </p>
            <p className="text-brand-blue-300 text-xs font-semibold mt-3">— Happy Customer</p>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Login Form ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 bg-gradient-to-b from-brand-blue-50/50 via-brand-white to-brand-white relative overflow-hidden">
        {/* Subtle background blobs */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-brand-blue-100/40 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-brand-blue-200/20 blur-[60px] pointer-events-none" />

        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="The SHA closet"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-serif text-brand-dark text-lg tracking-wider">
            <span className="font-light text-xs tracking-[0.12em] text-brand-muted">The</span>{' '}
            <span className="font-black bg-gradient-to-r from-brand-blue-600 to-brand-blue-800 bg-clip-text text-transparent">SHA</span>{' '}
            <span className="font-light text-xs tracking-[0.12em] text-brand-muted">closet</span>
          </span>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-[420px] relative z-10 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue-50 border border-brand-blue-100 text-brand-blue-600 text-xs font-semibold tracking-wide mb-6">
              <Sparkles size={14} />
              MEMBER LOGIN
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-brand-dark font-black">
              Sign In
            </h2>
            <p className="text-brand-muted text-sm mt-2">
              Access your orders, addresses & preferences
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-fade-in-up">
              <AlertCircle size={18} className="shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-semibold text-brand-dark block tracking-wide uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/50" />
                <input
                  type="email"
                  id="login-email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="w-full pl-11 pr-4 py-3.5 bg-brand-white border-2 border-brand-blue-100 rounded-xl text-sm text-brand-dark placeholder:text-brand-muted/40 focus:ring-0 focus:border-brand-blue-400 transition-colors duration-200 outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-xs font-semibold text-brand-dark block tracking-wide uppercase">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-brand-blue-500 hover:text-brand-blue-700 transition-colors font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full pl-11 pr-12 py-3.5 bg-brand-white border-2 border-brand-blue-100 rounded-xl text-sm text-brand-dark placeholder:text-brand-muted/40 focus:ring-0 focus:border-brand-blue-400 transition-colors duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted/50 hover:text-brand-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] bg-gradient-to-r from-brand-blue-600 to-brand-blue-700 hover:from-brand-blue-700 hover:to-brand-blue-800 text-brand-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-blue-600/25 hover:shadow-brand-blue-700/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-blue-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-brand-white text-xs text-brand-muted font-medium">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full h-[52px] border-2 border-brand-blue-100 hover:border-brand-blue-300 text-brand-dark font-semibold rounded-xl transition-all duration-200 bg-brand-white hover:bg-brand-blue-50 flex items-center justify-center gap-3 text-sm group"
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
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-brand-muted mt-8">
            New to The SHA closet?{' '}
            <Link
              href="/signup"
              className="text-brand-blue-600 hover:text-brand-blue-800 font-semibold transition-colors hover:underline underline-offset-2"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Bottom decoration */}
        <p className="absolute bottom-6 text-[11px] text-brand-muted/50 tracking-wider">
          &copy; {new Date().getFullYear()} The SHA closet. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-brand-muted">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
