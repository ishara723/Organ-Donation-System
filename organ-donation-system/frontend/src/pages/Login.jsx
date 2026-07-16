import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      // Route user to their appropriate dashboard based on their role
      if (user.role === 'DONOR') navigate('/donor/dashboard');
      else if (user.role === 'HOSPITAL') navigate('/hospital/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md space-y-8">
        
        {/* Branding Branding */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-teal-400 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Activity size={24} className="animate-pulse" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-100">
            Welcome to LifeLink
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Access your secure organ coordination workspace
          </p>
        </div>

        {/* Login Card Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 flex items-center gap-3">
                <AlertTriangle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@hospital.org or donor@mail.com"
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center cursor-pointer select-none">
                <input type="checkbox" className="h-4 w-4 bg-slate-900 border-slate-700 text-teal-500 rounded focus:ring-teal-500/50" />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#reset" className="text-teal-400 hover:underline">Forgot password?</a>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5"
              loading={loading}
            >
              Sign In
            </Button>

          </form>

          <div className="mt-6 text-center text-sm text-slate-400 border-t border-slate-800 pt-6">
            New to LifeLink?{' '}
            <Link to="/register" className="font-semibold text-teal-400 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Login;
