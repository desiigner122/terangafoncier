import React, { useState } from 'react';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

const AuthDebugPage = () => {
  const { user, profile, loading, signIn, signOut, revalidate } = useAuth();
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage('Signing in...');
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setMessage(`Sign in error: ${error.message}`);
      } else {
        setMessage('Sign in successful!');
      }
    } catch (error) {
      setMessage(`Sign in exception: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    setMessage('Signing out...');
    try {
      await signOut();
      setMessage('Signed out successfully');
    } catch (error) {
      setMessage(`Sign out error: ${error.message}`);
    }
  };

  const handleRevalidate = async () => {
    setMessage('Revalidating...');
    try {
      await revalidate();
      setMessage('Revalidation complete');
    } catch (error) {
      setMessage(`Revalidation error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Current State</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user ? `${user.email} (${user.id})` : 'Not logged in'}</p>
          <p><strong>Profile:</strong> {profile ? `${profile.role} - ${profile.verification_status}` : 'No profile'}</p>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
          {message}
        </div>
      )}

      {!user ? (
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Sign In
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
          <button
            onClick={handleRevalidate}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Revalidate
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthDebugPage;



