import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  User, 
  FileText, 
  Search, 
  Users, 
  Heart,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive 
        ? 'bg-rose-50 text-rose-600 border-l-4 border-rose-500 shadow-sm' 
        : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/60'
    }`;

  const renderDonorLinks = () => (
    <>
      <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-500/80">
        Donor Portal
      </div>
      <NavLink to="/donor/dashboard" className={linkClass}>
        <Home size={18} />
        Dashboard
      </NavLink>
      <NavLink to="/donor/profile" className={linkClass}>
        <User size={18} />
        Medical Profile
      </NavLink>
    </>
  );

  const renderHospitalLinks = () => (
    <>
      <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-500/80">
        Hospital Portal
      </div>
      <NavLink to="/hospital/dashboard" className={linkClass}>
        <Home size={18} />
        Dashboard
      </NavLink>
      <NavLink to="/hospital/requests" className={linkClass}>
        <FileText size={18} />
        Organ Requests
      </NavLink>
      <NavLink to="/hospital/search" className={linkClass}>
        <Search size={18} />
        Find Donors
      </NavLink>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-500/80">
        Admin Console
      </div>
      <NavLink to="/admin/dashboard" className={linkClass}>
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>
      <NavLink to="/admin/donors" className={linkClass}>
        <ShieldCheck size={18} />
        Verifications
      </NavLink>
      <NavLink to="/admin/requests" className={linkClass}>
        <FileText size={18} />
        Request Approvals
      </NavLink>
      <NavLink to="/admin/matches" className={linkClass}>
        <Heart size={18} />
        Matches Manager
      </NavLink>
    </>
  );

  return (
    <aside className="w-64 bg-white border-r border-rose-100 min-h-[calc(100vh-65px)] p-4 flex flex-col gap-5 select-none">
      <div className="flex flex-col gap-0.5 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
        <span className="text-[11px] font-medium text-slate-400">Log-in Session</span>
        <span className="text-sm font-semibold truncate text-slate-800">{user.email}</span>
      </div>
      <div className="h-px bg-slate-100"></div>
      
      <nav className="flex flex-col gap-1.5">
        {user.role === 'DONOR' && renderDonorLinks()}
        {user.role === 'HOSPITAL' && renderHospitalLinks()}
        {user.role === 'ADMIN' && renderAdminLinks()}
      </nav>
    </aside>
  );
};

export default Sidebar;
