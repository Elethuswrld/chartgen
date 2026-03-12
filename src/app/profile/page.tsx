'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import AuthGuard from '../../components/AuthGuard';

// A simple toast notification component
const Toast = ({ message, show, onDone }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDone();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  return (
    <div className={`fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      {message}
    </div>
  );
};

export default function Profile() {
  const { user, logout, resetPassword, updateUserProfile } = useAuth();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      await updateUserProfile({ name });
      showToast('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile: ", error);
      showToast('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (user?.email) {
      try {
        await resetPassword(user.email);
        showToast('Password reset email sent!');
      } catch (error) {
        console.error("Error sending password reset email: ", error);
        showToast('Failed to send reset email.');
      }
    }
  };
  
  const showToast = (message) => {
    setToast({ show: true, message });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8">Profile & Settings</h1>
          
          <div className="bg-[#0B0F19] p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              {/* User Avatar Placeholder */}
              <div className="w-24 h-24 bg-[#0E1424] rounded-full flex items-center justify-center text-3xl font-bold border-2 border-blue-600">
                {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome, {name || user?.email}!</h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>

            {/* Profile Update Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full max-w-sm bg-[#0E1424] p-3 rounded-lg border border-white/10 text-gray-300 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
            
            <div className="border-t border-white/10 my-8"></div>

            {/* Other Settings */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Security</h3>
              <button 
                onClick={handlePasswordReset}
                className="text-blue-500 hover:underline"
              >
                Send Password Reset Email
              </button>
              
              <h3 className="text-xl font-bold mt-6">Account Actions</h3>
              <button 
                onClick={logout}
                className="px-6 py-2 bg-red-600/20 border border-red-500/50 hover:bg-red-600/40 text-red-400 rounded-lg font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toast message={toast.message} show={toast.show} onDone={() => setToast({ show: false, message: '' })} />
    </AuthGuard>
  );
}
