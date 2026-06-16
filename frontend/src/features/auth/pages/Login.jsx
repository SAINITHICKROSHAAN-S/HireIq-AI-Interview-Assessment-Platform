import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import api from '../../../services/api';
import { AlertCircle, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, role } = response.data;
      
      login(token, response.data.email, role);

      // Redirect based on role
      if (role.toUpperCase() === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white light:text-black">Welcome back</h2>
        <p className="text-sm text-zinc-500 light:text-zinc-400">
          Enter your credentials to access your HireIQ account
        </p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-xl bg-red-950/20 border border-red-900/30 p-4 text-xs text-red-400">
          <AlertCircle size={16} />
          <span>{error}</span>
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
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-3 pl-10 pr-4 text-sm text-white light:text-black placeholder-zinc-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 light:border-zinc-200 bg-zinc-950/50 light:bg-zinc-50 py-3 pl-10 pr-4 text-sm text-white light:text-black placeholder-zinc-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center space-x-2 rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
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
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-2">Demo accounts</p>
        <div className="flex justify-center space-x-2">
          <button 
            onClick={() => { setEmail('recruiter@hireiq.com'); setPassword('password'); }}
            className="text-[10px] px-2 py-1 rounded bg-zinc-900 light:bg-zinc-100 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Recruiter Quick Fill
          </button>
          <button 
            onClick={() => { setEmail('candidate@hireiq.com'); setPassword('password'); }}
            className="text-[10px] px-2 py-1 rounded bg-zinc-900 light:bg-zinc-100 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Candidate Quick Fill
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
