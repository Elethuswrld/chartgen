"use client";

import React from "react";
import Link from "next/link";

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
      <div className="bg-[#0B0F19] p-8 rounded-2xl shadow-lg border border-white/5 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>
        <form>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Enter your email address
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-[#0E1424] p-3 rounded-lg border border-white/10 text-sm text-gray-300 outline-none"
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
            Send Reset Link
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          <Link href="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}