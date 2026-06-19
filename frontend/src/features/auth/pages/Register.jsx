import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterMutation } from '../hooks/useAuthMutations';
import { AlertCircle, Lock, Mail, User, ArrowRight, Loader2, Award } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CANDIDATE');

  // Integrate React Query Register mutation
  const { mutate: registerUser, isPending, error } = useRegisterMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({ 
      name, 
      email, 
      password, 
      role: role.toUpperCase() 
    });
  };

  // Format backend validation and duplicate account messages
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
    return 'Failed to register account. Please check inputs and try again.';
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white light:text-black">Create an account</h2>
        <p className="text-sm text-zinc-500 light:text-zinc-400">
          Get started with HireIQ today
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
          <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600">Full Name</label>
          <div className="relative">
            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              required
              disabled={isPending}
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-3 pl-10 pr-4 text-sm text-white light:text-black placeholder-zinc-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

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
          <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600">Password</label>
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

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-400 light:text-zinc-600">I am a</label>
          <div className="relative">
            <Award className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <select
              disabled={isPending}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950 light:bg-zinc-50 py-3 pl-10 pr-4 text-sm text-white light:text-black focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="CANDIDATE">Candidate (Taking assessments & analyzing resume)</option>
              <option value="RECRUITER">Recruiter (Creating assessments & viewing analytics)</option>
            </select>
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
              <span>Sign Up</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm">
        <span className="text-zinc-500 light:text-zinc-400">Already have an account? </span>
        <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-400 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
