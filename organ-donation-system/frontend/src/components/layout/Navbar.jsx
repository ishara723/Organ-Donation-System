import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, LogOut, LogIn, User as UserIcon } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'DONOR') return '/donor/dashboard';
    if (user.role === 'HOSPITAL') return '/hospital/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative bg-gradient-to-br from-red-500 to-rose-500 p-2 rounded-xl text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
            <span className="animate-pulse-ring absolute h-7 w-7 rounded-xl bg-rose-400/40"></span>
            <Activity size={20} className="relative z-10 animate-pulse text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500">
            LifeLink
          </span>
        </Link>

        {/* Mid Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors">
            About Donation
          </Link>
          <Link to="/awareness" className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors">
            Education & FAQs
          </Link>
          {isAuthenticated && (
            <Link to={getDashboardPath()} className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors">
              My Dashboard
            </Link>
          )}
        </div>

        {/* Right Auth / Profile Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3.5">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-800">{user.email}</span>
                <Badge variant="info" className="mt-0.5">{user.role}</Badge>
              </div>
              <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="px-2.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                <LogOut size={18} className="mr-1.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-rose-600 hover:bg-rose-50">
                  <LogIn size={16} className="mr-1.5" />
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
