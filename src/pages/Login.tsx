import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Layers } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('tanvi@syncspace.dev');
  const [password, setPassword] = useState('syncspace123');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must contain at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      // Redirect to the originally requested page, or dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-workspace-900 flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
        <div className="absolute bottom-0 right-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
        
        <div className="relative z-10 max-w-md space-y-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-4">
            <Layers size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Work anywhere.<br />
            <span className="text-primary-300">Sync everywhere.</span>
          </h1>
          <p className="text-workspace-300 text-lg leading-relaxed max-w-sm mx-auto">
            Experience real-time collaboration with local-first speed. Built for modern teams.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-24 bg-white relative">
        
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-8">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <Layers size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-workspace-900 tracking-tight">SyncSpace</span>
            </div>
            <h2 className="text-3xl font-bold text-workspace-900 tracking-tight">Sign in to your account</h2>
            <p className="mt-2 text-sm text-workspace-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-workspace-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${emailError ? 'border-red-300 focus:ring-red-200' : 'border-workspace-300 focus:ring-primary-100 focus:border-primary-500'} focus:outline-none focus:ring-4 transition-all bg-workspace-50 focus:bg-white text-workspace-900`}
                  placeholder="name@company.com"
                  disabled={isLoading}
                />
                {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-workspace-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${passwordError ? 'border-red-300 focus:ring-red-200' : 'border-workspace-300 focus:ring-primary-100 focus:border-primary-500'} focus:outline-none focus:ring-4 transition-all bg-workspace-50 focus:bg-white text-workspace-900`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 text-center font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Enter Workspace'}
            </button>
            
            <div className="mt-6 p-4 bg-workspace-50 border border-workspace-200 rounded-lg text-center">
              <p className="text-xs text-workspace-500">
                <span className="font-semibold block mb-1">Demo prototype.</span> 
                Credentials are pre-filled — just click Enter Workspace.
              </p>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
