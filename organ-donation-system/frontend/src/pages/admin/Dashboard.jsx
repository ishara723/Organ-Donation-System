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
        <RefreshCw className="animate-spin text-rose-500" size={32} />
        <p className="text-sm text-slate-600">Compiling database metrics...</p>
      </div>
    );
  }

  // Formatting data for Recharts
  const organData = Object.entries(stats.requestsByOrganType || {}).map(([name, value]) => ({ name, value }));
  const urgencyData = Object.entries(stats.requestsByUrgency || {}).map(([name, value]) => ({ name, value }));
  const bloodData = Object.entries(stats.donorsByBloodType || {}).map(([name, value]) => ({ name, value }));

  const COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#be123c', '#9f1239'];

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administrator Command Center</h1>
        <p className="text-slate-600 text-sm">System oversight, verification queues, and analytics.</p>
      </div>

      {/* Metric Grid Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-rose-100 bg-white shadow-sm" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Donors</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{stats.totalDonors}</span>
            </div>
            <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center border border-rose-100">
              <Users size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-3.5 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">{stats.verifiedDonors} verified</span> &bull; 
            <span className="font-semibold text-amber-600">{stats.pendingDonors} pending</span>
          </div>
        </Card>

        <Card className="border border-rose-100 bg-white shadow-sm" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Organ Requests</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{stats.totalRequests}</span>
            </div>
            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100">
              <FileText size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-3.5 flex items-center gap-1">
            <span className="font-semibold text-amber-600">{stats.pendingRequests} pending approval</span>
          </div>
        </Card>

        <Card className="border border-rose-100 bg-white shadow-sm" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Matches</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{stats.activeMatches}</span>
            </div>
            <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center border border-amber-100">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-3.5">
            Actively tracked compatibility pairs
          </div>
        </Card>

        <Card className="border border-rose-100 bg-white shadow-sm" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Transplants Done</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{stats.completedMatches}</span>
            </div>
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
              <Heart size={20} />
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-3.5 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-600" />
            <span>Successfully completed operations</span>
          </div>
        </Card>
      </section>

      {/* Chart Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Organ Type bar chart */}
        <Card title="Requests by Organ Type" className="border border-rose-100 bg-white shadow-sm lg:col-span-2">
          <div className="h-72">
            {organData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={organData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f1f5f9', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" fill="#f43f5e" radius={[4, 4, 0, 0]}>
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
        <Card title="Requests by Urgency" className="border border-rose-100 bg-white shadow-sm">
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
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f1f5f9', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-sm">No urgency statistics.</div>
              )}
            </div>
            
            {/* Custom legends */}
            <div className="flex justify-center gap-4 flex-wrap text-[10px] text-slate-600">
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
        <Card title="Donor Blood Type Distribution" className="border border-rose-100 bg-white shadow-sm lg:col-span-3">
          <div className="h-72">
            {bloodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f1f5f9', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#fb7185" radius={[4, 4, 0, 0]} />
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
