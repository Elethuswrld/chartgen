"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Login() {
  const { user, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
      <div className="bg-[#0B0F19] p-8 rounded-2xl shadow-lg border border-white/5 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login to ChartGen</h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-[#0E1424] p-3 rounded-lg border border-white/10 text-sm text-gray-300 outline-none"
              suppressHydrationWarning
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full bg-[#0E1424] p-3 rounded-lg border border-white/10 text-sm text-gray-300 outline-none"
              suppressHydrationWarning
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
            suppressHydrationWarning
          >
            Login
          </button>
        </form>
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>
        <button
          onClick={loginWithGoogle}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
          suppressHydrationWarning
        >
          Login with Google
        </button>
        <p className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
        <p className="text-center text-gray-400 mt-2">
          <Link href="/reset-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}
