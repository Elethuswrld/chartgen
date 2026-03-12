'use client';

import { useAuth } from '../../lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const color = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-700'][strength];
  const width = `${(strength / 5) * 100}%`;

  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width }}></div>
    </div>
  );
};

export default function Register() {
  const { user, signUpWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
    }

    setIsRegistering(true);
    try {
      await signUpWithEmail(email, password);
      // On successful signup, Firebase automatically logs the user in.
      // The useEffect will redirect to dashboard.
    } catch (err) {
        let errorMessage = 'Failed to register. Please try again.';
        if (err.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please login or use a different email.';
        } else if (err.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        } else if (err.code === 'auth/weak-password') {
            errorMessage = 'The password is too weak. Please choose a stronger password.';
        }
        setError(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleGoogleSignUp = async () => {
    setError('');
    setIsRegistering(true);
    try {
      await loginWithGoogle();
    } catch (err) {
        setError('Failed to sign up with Google. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0B0F19] rounded-2xl shadow-lg border border-white/10 p-8">
        <h1 className="text-4xl font-extrabold text-center mb-2">Create Your Account</h1>
        <p className="text-center text-gray-400 mb-8">Join ChartGen to start trading smarter.</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-center">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isRegistering}
            className="w-full bg-[#0E1424] p-4 rounded-lg border border-white/10 text-gray-300 outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isRegistering}
            className="w-full bg-[#0E1424] p-4 rounded-lg border border-white/10 text-gray-300 outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            required
          />
          <PasswordStrengthIndicator password={password} />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isRegistering}
            className="w-full bg-[#0E1424] p-4 rounded-lg border border-white/10 text-gray-300 outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            required
          />
          <button 
            type="submit" 
            disabled={isRegistering}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {isRegistering ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-[#0B0F19] px-2 text-sm text-gray-400">OR</span>
        </div>

        <button
          onClick={handleGoogleSignUp}
          disabled={isRegistering}
          className="w-full flex items-center justify-center gap-3 bg-[#0E1424] border border-white/10 hover:bg-white/5 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {isRegistering ? 'Please wait...' : 'Sign up with Google'}
        </button>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? {' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
