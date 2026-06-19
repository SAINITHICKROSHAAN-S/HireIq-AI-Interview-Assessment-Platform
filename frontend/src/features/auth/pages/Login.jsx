import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../hooks/useAuthMutations';
import { AlertCircle, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Integrate React Query Login mutation
  const { mutate: loginUser, isPending, error } = useLoginMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  // Format backend validation and exception strings
  const getErrorMessage = () => {
    if (!error) return null;
    const responseData = error.response?.data;
    if (typeof responseData === 'string') {
      return responseData;
    }
    if (responseData && typeof responseData === 'object') {
      const firstField = Object.keys(responseData)[0];
      if (firstField && responseData[firstField]) {
        // e.g. "email: Must be a well-formed email address"
        return `${firstField.charAt(0).toUpperCase() + firstField.slice(1)}: ${responseData[firstField]}`;
      }
    }
    return 'Invalid email or password. Please try again.';
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white light:text-black font-sans">Welcome back</h2>
        <p className="text-sm text-zinc-500 light:text-zinc-400">
          Enter your credentials to access your HireIQ account
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start space-x-2.5 rounded-xl bg-red-950/20 border border-red-900/30 p-4 text-xs text-red-400">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600">Email Address</label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              required
              disabled={isPending}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-3 pl-10 pr-4 text-sm text-white light:text-black placeholder-zinc-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600">Password</label>
          </div>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              required
              disabled={isPending}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-3 pl-10 pr-4 text-sm text-white light:text-black placeholder-zinc-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm">
        <span className="text-zinc-500 light:text-zinc-400">Don't have an account? </span>
        <Link to="/register" className="font-semibold text-brand-500 hover:text-brand-400 transition-colors">
          Sign Up
        </Link>
      </div>

      <div className="pt-4 border-t border-zinc-900/60 text-center">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-2">Demo credentials</p>
        <div className="flex justify-center space-x-2">
          <button 
            type="button"
            disabled={isPending}
            onClick={() => { setEmail('recruiter@hireiq.com'); setPassword('password'); }}
            className="text-[10px] px-2 py-1 rounded bg-zinc-900 light:bg-zinc-100 text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Recruiter Fill
          </button>
          <button 
            type="button"
            disabled={isPending}
            onClick={() => { setEmail('candidate@hireiq.com'); setPassword('password'); }}
            className="text-[10px] px-2 py-1 rounded bg-zinc-900 light:bg-zinc-100 text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Candidate Fill
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
