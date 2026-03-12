'use client';

import { useAuth } from '../../lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { user, loginWithGoogle, signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmail(email, password);
      // The useEffect will handle the redirect
    } catch (err: any) {
      let errorMessage = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      setError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      // The useEffect will handle the redirect
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0B0F19] rounded-2xl shadow-lg border border-white/10 p-8">
        <h1 className="text-4xl font-extrabold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-400 mb-8">Login to access your trading dashboard.</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-center">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoggingIn}
            className="w-full bg-[#0E1424] p-4 rounded-lg border border-white/10 text-gray-300 outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoggingIn}
            className="w-full bg-[#0E1424] p-4 rounded-lg border border-white/10 text-gray-300 outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            required
          />
          <button 
            type="submit" 
            disabled={isLoggingIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-[#0B0F19] px-2 text-sm text-gray-400">OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-3 bg-[#0E1424] border border-white/10 hover:bg-white/5 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoggingIn ? 'Please wait...' : 'Sign in with Google'}
        </button>
        
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-400">
            <Link href="/reset-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
          </p>
          <p className="text-gray-400 mt-2">
            Don&apos;t have an account? {' '}
            <Link href="/register" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
