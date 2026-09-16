import React from 'react';
import { Heart, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/80 border-t border-rose-100 px-6 py-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-rose-500" />
          <span className="font-bold text-slate-700">LifeLink Coordination Network</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <span>Made to save lives with</span>
          <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a href="#privacy" className="hover:text-rose-600 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-rose-600 transition-colors">Terms of Service</a>
          <a href="#compliance" className="hover:text-rose-600 transition-colors">GDPR/HIPAA Compliance</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
