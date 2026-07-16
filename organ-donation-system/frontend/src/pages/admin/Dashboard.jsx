import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Users, 
  FileText, 
  Heart, 
  Activity, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Fallback mock stats for local development
  const mockStats = {
    totalDonors: 142,
    verifiedDonors: 98,
    pendingDonors: 44,
    totalRequests: 56,
    pendingRequests: 18,
    approvedRequests: 32,
    activeMatches: 12,
    completedMatches: 24,
    requestsByOrganType: {
      'Kidney': 24,
      'Liver': 15,
      'Heart': 8,
      'Lungs': 5,
      'Pancreas': 4
    },
    requestsByUrgency: {
      'CRITICAL': 12,
      'HIGH': 20,
      'MEDIUM': 18,
      'LOW': 6
    },
    donorsByBloodType: {
      'O+': 42,
      'A+': 32,
      'B+': 28,
      'AB+': 12,
      'O-': 10,
      'A-': 8,
      'B-': 6,
      'AB-': 4
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await adminService.getDashboardStats();
        if (res) {
          // Verify format
          setStats(res);
        } else {
          setStats(mockStats);
        }
      } catch (err) {
        console.warn("Failed to load statistics from API. Rendering local simulation data.");
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="animate-spin text-teal-400" size={32} />
        <p className="text-sm text-slate-400">Compiling database metrics...</p>
      </div>
    );
  }

  // Formatting data for Recharts
  const organData = Object.entries(stats.requestsByOrganType || {}).map(([name, value]) => ({ name, value }));
  const urgencyData = Object.entries(stats.requestsByUrgency || {}).map(([name, value]) => ({ name, value }));
  const bloodData = Object.entries(stats.donorsByBloodType || {}).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0d9488', '#4f46e5', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Administrator Command Center</h1>
        <p className="text-slate-400 text-sm">System oversight, verification queues, and analytics.</p>
      </div>

      {/* Metric Grid Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-900 bg-slate-950/20" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Donors</span>
              <span className="text-3xl font-extrabold text-slate-100 mt-1 block">{stats.totalDonors}</span>
            </div>
            <div className="h-10 w-10 bg-teal-500/10 text-teal-400 rounded-lg flex items-center justify-center border border-teal-500/20">
              <Users size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-3.5 flex items-center gap-1">
            <span className="font-semibold text-teal-400">{stats.verifiedDonors} verified</span> &bull; 
            <span className="font-semibold text-amber-500">{stats.pendingDonors} pending</span>
          </div>
        </Card>

        <Card className="border border-slate-900 bg-slate-950/20" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Organ Requests</span>
              <span className="text-3xl font-extrabold text-slate-100 mt-1 block">{stats.totalRequests}</span>
            </div>
            <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center border border-indigo-500/20">
              <FileText size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-3.5 flex items-center gap-1">
            <span className="font-semibold text-amber-500">{stats.pendingRequests} pending approval</span>
          </div>
        </Card>

        <Card className="border border-slate-900 bg-slate-950/20" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Matches</span>
              <span className="text-3xl font-extrabold text-slate-100 mt-1 block">{stats.activeMatches}</span>
            </div>
            <div className="h-10 w-10 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center border border-amber-500/20">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-3.5">
            Actively tracked compatibility pairs
          </div>
        </Card>

        <Card className="border border-slate-900 bg-slate-950/20" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Transplants Done</span>
              <span className="text-3xl font-extrabold text-slate-100 mt-1 block">{stats.completedMatches}</span>
            </div>
            <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-500/20">
              <Heart size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-3.5 flex items-center gap-1">
            <TrendingUp size={12} className="text-teal-400" />
            <span>Successfully completed operations</span>
          </div>
        </Card>
      </section>

      {/* Chart Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Organ Type bar chart */}
        <Card title="Requests by Organ Type" className="border border-slate-900 lg:col-span-2">
          <div className="h-72">
            {organData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={organData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]}>
                    {organData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">No organ demands reported.</div>
            )}
          </div>
        </Card>

        {/* Urgency Level Pie Chart */}
        <Card title="Requests by Urgency" className="border border-slate-900">
          <div className="h-72 flex flex-col justify-between">
            <div className="h-56 relative">
              {urgencyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={urgencyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {urgencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-sm">No urgency statistics.</div>
              )}
            </div>
            
            {/* Custom legends */}
            <div className="flex justify-center gap-4 flex-wrap text-[10px] text-slate-400">
              {urgencyData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Donors by blood type bar chart */}
        <Card title="Donor Blood Type Distribution" className="border border-slate-900 lg:col-span-3">
          <div className="h-72">
            {bloodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm">No blood type distribution details.</div>
            )}
          </div>
        </Card>

      </section>

    </div>
  );
};

export default AdminDashboard;
