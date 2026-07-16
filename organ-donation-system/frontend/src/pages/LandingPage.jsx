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
    // Try to fetch real statistics from admin endpoint, fallback to seeded data on error/unauth
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
        // Fallback silently to seeded static stats for public landing page
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-8 md:p-12 border border-slate-900 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-semibold rounded-full border border-teal-500/20">
            <Sparkles size={12} />
            Modernizing Transplant Coordination
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-left leading-tight">
            Bridging the Gap <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400">
              Between Life and Hope
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-300 text-left max-w-2xl leading-relaxed">
            LifeLink is a high-security coordination web platform designed for donors, hospitals, and coordinators. We automate compatibility matching to fast-track organ delivery when every second counts.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link to="/register">
              <Button variant="primary" className="px-6 py-3 font-bold flex items-center gap-2">
                Become a Donor
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="px-6 py-3 font-bold border-slate-700 text-slate-300 hover:text-slate-100 hover:border-slate-500">
                Hospital Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Counter Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center py-6 border border-slate-900" hoverable>
          <div className="mx-auto h-12 w-12 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-400 mb-4 border border-teal-500/20">
            <Users size={24} />
          </div>
          <span className="block text-4xl font-extrabold text-slate-100">{stats.donors.toLocaleString()}</span>
          <span className="text-sm font-medium text-slate-400 mt-1 block">Registered Donors</span>
        </Card>

        <Card className="text-center py-6 border border-slate-900" hoverable>
          <div className="mx-auto h-12 w-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
            <ClipboardList size={24} />
          </div>
          <span className="block text-4xl font-extrabold text-slate-100">{stats.requests.toLocaleString()}</span>
          <span className="text-sm font-medium text-slate-400 mt-1 block">Active Organ Requests</span>
        </Card>

        <Card className="text-center py-6 border border-slate-900" hoverable>
          <div className="mx-auto h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
            <Heart size={24} />
          </div>
          <span className="block text-4xl font-extrabold text-slate-100">{stats.matches.toLocaleString()}</span>
          <span className="text-sm font-medium text-slate-400 mt-1 block">Transplant Matches Coordinated</span>
        </Card>
      </section>

      {/* Role Explanations Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-100">How LifeLink Coordinates Care</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A secured, audited network bringing together three vital components of the transplant pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable className="h-full border border-slate-900" title="1. Public & Donors">
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Registered users can record their legal consent, build medical histories (blood type, allergies, conditions), select specific organs they wish to pledge, and supply emergency contact information.
            </p>
            <Link to="/awareness" className="text-teal-400 hover:text-teal-300 text-sm font-bold flex items-center gap-1.5 mt-auto">
              Check eligibility guidelines
              <ArrowRight size={14} />
            </Link>
          </Card>

          <Card hoverable className="h-full border border-slate-900" title="2. Recipient Hospitals">
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Authorized hospital representatives submit patient organ requests including anonymized profiles, select priority indicators, and filter local donor databases using real-time blood and organ compatibility.
            </p>
            <Link to="/login" className="text-teal-400 hover:text-teal-300 text-sm font-bold flex items-center gap-1.5">
              Submit patient request
              <ArrowRight size={14} />
            </Link>
          </Card>

          <Card hoverable className="h-full border border-slate-900" title="3. Administrators">
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Coordinators verify registered donors, approve organ requests submitted by hospitals, run compatibility scripts, and authorize secure matches to speed up transplant schedules.
            </p>
            <Link to="/login" className="text-teal-400 hover:text-teal-300 text-sm font-bold flex items-center gap-1.5">
              Access admin controls
              <ArrowRight size={14} />
            </Link>
          </Card>
        </div>
      </section>

      {/* Info Notice section */}
      <section className="bg-slate-950 p-6 rounded-xl border border-slate-900 flex items-start gap-4">
        <div className="bg-teal-500/10 text-teal-400 p-2.5 rounded-lg border border-teal-500/20 flex-shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-200">Regulatory Compliance Notice</h4>
          <p className="text-xs text-slate-400 leading-normal">
            LifeLink functions solely as an information coordination and communication log. It does not perform medical diagnosis, integrate directly with hardware, or replace the final clinical decisions made by medical boards and regional regulatory authorities. All medical histories are encrypted at rest.
          </p>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
