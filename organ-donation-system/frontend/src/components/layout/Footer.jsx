import React from 'react';
import { Heart, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950/60 border-t border-slate-900 px-6 py-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-teal-400" />
          <span className="font-semibold text-slate-300">LifeLink Coordination Network</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <span>Made to save lives with</span>
          <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#compliance" className="hover:text-slate-300 transition-colors">GDPR/HIPAA Compliance</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
