import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'DONOR', // Default role
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
    return regex.test(pwd);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be 8+ characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol (@#$%^&+=)';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await register(formData.email, formData.password, formData.role);
      setSuccess(true);
      
      // Auto redirect to Login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error(err);
      setErrors({
        submit: err.response?.data?.message || 'Registration failed. The email may already be in use.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-rose-200">
            <Activity size={24} className="animate-pulse" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Register to join the LifeLink organ coordination network
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200">
                <CheckCircle size={36} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Account Created Successfully!</h3>
              <p className="text-sm text-slate-500">
                Your account is ready. Redirecting you to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errors.submit && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 flex items-center gap-3">
                  <AlertTriangle size={18} className="flex-shrink-0" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Role selector tabs */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select User Role
                </label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  {['DONOR', 'HOSPITAL', 'ADMIN'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => selectRole(role)}
                      className={`py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                        formData.role === role
                          ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                {formData.role === 'ADMIN' && (
                  <p className="mt-2 text-xs text-amber-600 flex items-start gap-1">
                    <ShieldCheck size={12} className="mt-0.5 flex-shrink-0" />
                    <span>Admins require default credentials approval or system verification parameters.</span>
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="you@domain.com"
                  required
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="••••••••"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Must be at least 8 characters, with 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol.
                </p>
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5"
                loading={loading}
              >
                Sign Up
              </Button>

            </form>
          )}

          {!success && (
            <div className="mt-6 text-center text-sm text-slate-500 border-t border-rose-100 pt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-rose-600 hover:underline">
                Sign In
              </Link>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default Register;
