import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { 
  FileText, 
  Search, 
  Plus, 
  Activity, 
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const HospitalDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await requestService.getMyRequests();
      setRequests(data || []);
      
      // Calculate statistics
      if (data && data.length > 0) {
        const tempStats = { total: data.length, pending: 0, approved: 0, completed: 0 };
        data.forEach(req => {
          if (req.status === 'PENDING' || req.status === 'UNDER_REVIEW') tempStats.pending++;
          else if (req.status === 'APPROVED' || req.status === 'MATCHED') tempStats.approved++;
          else if (req.status === 'COMPLETED') tempStats.completed++;
        });
        setStats(tempStats);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load your hospital dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="animate-spin text-teal-400" size={32} />
        <p className="text-sm text-slate-400">Loading hospital records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Hospital Portal</h1>
          <p className="text-slate-400 text-sm">Manage recipient requests and compatibility matches.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/hospital/requests?create=true">
            <Button variant="primary" className="text-xs font-bold flex items-center gap-1">
              <Plus size={16} />
              New Organ Request
            </Button>
          </Link>
          <Link to="/hospital/search">
            <Button variant="outline" className="text-xs font-bold flex items-center gap-1">
              <Search size={16} />
              Search Donors
            </Button>
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 flex items-center gap-3">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stats Counter */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-slate-900 bg-slate-950/20 text-center">
          <span className="block text-3xl font-extrabold text-slate-100">{stats.total}</span>
          <span className="text-xs text-slate-400 mt-1 block font-semibold uppercase tracking-wider">Total Requests</span>
        </Card>
        <Card className="p-4 border border-slate-900 bg-slate-950/20 text-center">
          <span className="block text-3xl font-extrabold text-amber-500">{stats.pending}</span>
          <span className="text-xs text-slate-400 mt-1 block font-semibold uppercase tracking-wider">Pending Review</span>
        </Card>
        <Card className="p-4 border border-slate-900 bg-slate-950/20 text-center">
          <span className="block text-3xl font-extrabold text-teal-400">{stats.approved}</span>
          <span className="text-xs text-slate-400 mt-1 block font-semibold uppercase tracking-wider">Active Search</span>
        </Card>
        <Card className="p-4 border border-slate-900 bg-slate-950/20 text-center">
          <span className="block text-3xl font-extrabold text-indigo-400">{stats.completed}</span>
          <span className="text-xs text-slate-400 mt-1 block font-semibold uppercase tracking-wider">Completed</span>
        </Card>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card 
            title="Recent Recipient Requests" 
            subtitle="Piped to active compatibility checking"
            className="border border-slate-900"
            actions={
              <Link to="/hospital/requests" className="text-xs text-teal-400 hover:underline font-bold">
                View All Requests
              </Link>
            }
          >
            {requests.length > 0 ? (
              <div className="divide-y divide-slate-800/60">
                {requests.slice(0, 5).map((req) => (
                  <div key={req.requestId} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-200">Patient: {req.patientName} ({req.patientAge}y)</span>
                        <Badge variant="info">{req.patientBloodType}</Badge>
                      </div>
                      <p className="text-xs text-slate-400">
                        Requested: {req.organType?.name} &bull; Urgency: <span className="font-semibold">{req.urgencyLevel}</span>
                      </p>
                      <p className="text-[10px] text-slate-500">Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge>{req.status}</Badge>
                      {req.status === 'APPROVED' && (
                        <Link to={`/hospital/search?requestId=${req.requestId}&bloodType=${req.patientBloodType}&organTypeId=${req.organType?.organTypeId}`}>
                          <Button variant="outline" className="text-[10px] font-bold px-2 py-1 flex items-center gap-1">
                            <Search size={12} />
                            Find Donors
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-sm">
                No requests registered yet. Complete a new form to begin.
              </div>
            )}
          </Card>
        </div>

        {/* Dashboard Sidebar Quick links */}
        <div className="space-y-4">
          <Card title="Quick Resources" className="border border-slate-900 h-full">
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-teal-400 font-bold mb-1">
                  <Activity size={14} />
                  Matching Algorithm Details
                </div>
                <p className="text-slate-400 leading-normal">
                  Our system checks for blood compatibility:
                </p>
                <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
                  <li>O- is universal donor.</li>
                  <li>AB+ is universal recipient.</li>
                  <li>Matches require active donor consent and admin approval.</li>
                </ul>
              </div>

              <div className="h-px bg-slate-900"></div>

              <div className="space-y-2.5">
                <Link to="/hospital/requests?create=true" className="block">
                  <Button variant="secondary" className="w-full text-xs font-bold flex items-center justify-center gap-1.5 py-2.5">
                    <Plus size={14} />
                    Register New Patient
                  </Button>
                </Link>
                
                <Link to="/hospital/search" className="block">
                  <Button variant="outline" className="w-full text-xs font-bold flex items-center justify-center gap-1.5 py-2.5 border-slate-700 hover:border-slate-500">
                    <Search size={14} />
                    Open Compatibility Database
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default HospitalDashboard;
