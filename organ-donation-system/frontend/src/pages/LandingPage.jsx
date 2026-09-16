import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Users, 
  ShieldAlert, 
  ArrowRight,
  ClipboardList,
  Search,
  Sparkles
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { adminService } from '../services/adminService';

const LandingPage = () => {
  const [stats, setStats] = useState({
    donors: 1420,
    requests: 312,
    matches: 284,
  });

  useEffect(() => {
    // Try to fetch real statistics from admin endpoint
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        if (res) {
          setStats({
            donors: res.totalDonors || 1420,
            requests: res.totalRequests || 312,
            matches: res.completedMatches + res.activeMatches || 284,
          });
        }
      } catch (err) {
        // Fallback silently to seeded static stats
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-rose-50/40 to-red-50/60 p-8 md:p-12 border border-rose-100 shadow-sm">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-red-200/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Title, Paragraph, and Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-100/90 text-rose-700 text-xs font-bold rounded-full border border-rose-200 shadow-2xs">
              <div className="relative flex items-center justify-center">
                <span className="animate-pulse-ring absolute h-5 w-5 rounded-full bg-rose-500/40"></span>
                <Activity size={14} className="relative z-10 animate-pulse text-rose-600" />
              </div>
              Modernizing Transplant Coordination
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
              Bridging the Gap <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-rose-500 to-red-500">
                Between Life and Hope
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 text-left leading-relaxed max-w-xl">
              LifeLink is a high-security coordination web platform designed for donors, hospitals, and coordinators. We automate compatibility matching to fast-track organ delivery when every second counts.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/register">
                <Button variant="primary" className="px-6 py-3 font-bold flex items-center gap-2 text-base shadow-md shadow-rose-500/20">
                  Become a Donor
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="px-6 py-3 font-bold text-base border-rose-200 hover:border-rose-400">
                  Hospital Sign In
                </Button>
              </Link>
            </div>

          </div>

          {/* Right Column: User Highlighted Blue Area featuring JUST the Live Red Heartbeat Waveform Line */}
          <div className="lg:col-span-5 w-full flex items-center justify-center p-2">
            <div className="w-full overflow-hidden">
              <svg viewBox="0 0 1000 240" className="w-full h-32 md:h-44 text-red-600 overflow-visible">
                <defs>
                  <filter id="red-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#be123c" floodOpacity="0.5"/>
                  </filter>
                  <linearGradient id="red-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="50%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                </defs>

                {/* Red Heartbeat Line Waveform matching uploaded image */}
                <path
                  d="M 0 120 L 70 120 L 90 135 L 110 95 L 130 145 L 175 10 L 220 230 L 255 120 L 340 120 L 360 135 L 375 105 L 395 125 L 420 80 L 450 190 L 485 70 L 520 120 L 600 120 L 615 140 L 635 100 L 655 135 L 675 110 L 710 230 L 755 15 L 795 120 L 1000 120"
                  fill="none"
                  stroke="url(#red-stroke)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#red-glow)"
                  className="ekg-line"
                />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* Statistics Counter Cards with Live Heartbeat Icons */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center py-6 border border-rose-100 bg-white shadow-xs" hoverable>
          <div className="relative mx-auto h-12 w-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm shadow-rose-200">
            <span className="animate-pulse-ring absolute h-12 w-12 rounded-2xl bg-rose-400/30"></span>
            <Users size={24} className="relative z-10" />
          </div>
          <span className="block text-4xl font-extrabold text-slate-900">{stats.donors.toLocaleString()}</span>
          <span className="text-sm font-semibold text-slate-500 mt-1 block">Registered Donors</span>
        </Card>

        <Card className="text-center py-6 border border-rose-100 bg-white shadow-xs" hoverable>
          <div className="relative mx-auto h-12 w-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm shadow-rose-200">
            <span className="animate-pulse-ring absolute h-12 w-12 rounded-2xl bg-rose-400/30"></span>
            <ClipboardList size={24} className="relative z-10" />
          </div>
          <span className="block text-4xl font-extrabold text-slate-900">{stats.requests.toLocaleString()}</span>
          <span className="text-sm font-semibold text-slate-500 mt-1 block">Active Organ Requests</span>
        </Card>

        <Card className="text-center py-6 border border-rose-100 bg-white shadow-xs" hoverable>
          <div className="relative mx-auto h-12 w-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm shadow-rose-200">
            <span className="animate-pulse-ring absolute h-12 w-12 rounded-2xl bg-rose-400/30"></span>
            <Activity size={24} className="relative z-10 animate-pulse text-white" />
          </div>
          <span className="block text-4xl font-extrabold text-slate-900">{stats.matches.toLocaleString()}</span>
          <span className="text-sm font-semibold text-slate-500 mt-1 block">Transplant Matches Coordinated</span>
        </Card>
      </section>

      {/* Role Explanations Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
            <div className="relative bg-rose-500 p-1 rounded-md text-white">
              <Activity size={14} className="animate-pulse" />
            </div>
            <span>End-To-End Synchronization</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">How LifeLink Coordinates Care</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            A secured, audited network bringing together three vital components of the transplant pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable className="h-full flex flex-col justify-between border border-rose-100 bg-white" title="1. Public & Donors">
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Registered users can record their legal consent, build medical histories (blood type, allergies, conditions), select specific organs they wish to pledge, and supply emergency contact information.
            </p>
            <Link to="/awareness" className="text-rose-600 hover:text-rose-700 text-sm font-bold flex items-center gap-1.5 mt-auto">
              Check eligibility guidelines
              <ArrowRight size={14} />
            </Link>
          </Card>

          <Card hoverable className="h-full flex flex-col justify-between border border-rose-100 bg-white" title="2. Recipient Hospitals">
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Authorized hospital representatives submit patient organ requests including anonymized profiles, select priority indicators, and filter local donor databases using real-time blood and organ compatibility.
            </p>
            <Link to="/login" className="text-rose-600 hover:text-rose-700 text-sm font-bold flex items-center gap-1.5">
              Submit patient request
              <ArrowRight size={14} />
            </Link>
          </Card>

          <Card hoverable className="h-full flex flex-col justify-between border border-rose-100 bg-white" title="3. Administrators">
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Coordinators verify registered donors, approve organ requests submitted by hospitals, run compatibility scripts, and authorize secure matches to speed up transplant schedules.
            </p>
            <Link to="/login" className="text-rose-600 hover:text-rose-700 text-sm font-bold flex items-center gap-1.5">
              Access admin controls
              <ArrowRight size={14} />
            </Link>
          </Card>
        </div>
      </section>

      {/* Info Notice section */}
      <section className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 flex items-start gap-4 text-left">
        <div className="bg-rose-100 text-rose-600 p-2.5 rounded-xl border border-rose-200 flex-shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800">Regulatory Compliance Notice</h4>
          <p className="text-xs text-slate-500 leading-normal">
            LifeLink functions solely as an information coordination and communication log. It does not perform medical diagnosis, integrate directly with hardware, or replace the final clinical decisions made by medical boards and regional regulatory authorities. All medical histories are encrypted at rest.
          </p>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;

