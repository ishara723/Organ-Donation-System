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
    <nav className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Brand logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-teal-400 to-indigo-600 p-2 rounded-lg text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform duration-200">
            <Activity size={20} className="animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
            LifeLink
          </span>
        </Link>

        {/* Mid Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">
            About Donation
          </Link>
          <Link to="/awareness" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">
            Education & FAQs
          </Link>
          {isAuthenticated && (
            <Link to={getDashboardPath()} className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">
              My Dashboard
            </Link>
          )}
        </div>

        {/* Right Auth / Profile Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3.5">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-200">{user.email}</span>
                <Badge variant="info" className="mt-0.5">{user.role}</Badge>
              </div>
              <div className="h-9 w-px bg-slate-800 hidden sm:block"></div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="px-2.5 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut size={18} className="mr-1.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-slate-100">
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
