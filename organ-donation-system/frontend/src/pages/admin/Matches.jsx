import React, { useState, useEffect } from 'react';
import { matchService } from '../../services/matchService';
import { requestService } from '../../services/requestService';
import { adminService } from '../../services/adminService';
import { 
  Heart, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Plus,
  Hospital,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [compatibleDonors, setCompatibleDonors] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [fetchingCompat, setFetchingCompat] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Modal states
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // New match form state
  const [formData, setFormData] = useState({
    requestId: '',
    donorId: '',
    notes: ''
  });

  const loadInitialData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const matchData = await matchService.getAllMatches();
      setMatches(matchData || []);

      // Fetch approved requests for new match creation
      const reqList = await requestService.searchRequests({ status: 'APPROVED' });
      setApprovedRequests(reqList || []);
      
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load matching database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // When request ID is selected in the creation form, fetch compatible donors
  useEffect(() => {
    const fetchCompatDonors = async () => {
      if (!formData.requestId) {
        setCompatibleDonors([]);
        return;
      }
      setFetchingCompat(true);
      try {
        const donorsList = await matchService.getCompatibleDonors(formData.requestId);
        setCompatibleDonors(donorsList || []);
        
        // Auto-select first compatible donor if available
        if (donorsList && donorsList.length > 0) {
          setFormData(prev => ({ ...prev, donorId: donorsList[0].donorId }));
        } else {
          setFormData(prev => ({ ...prev, donorId: '' }));
        }
      } catch (err) {
        console.error(err);
        setCompatibleDonors([]);
      } finally {
        setFetchingCompat(false);
      }
    };

    fetchCompatDonors();
  }, [formData.requestId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenNewModal = () => {
    setFormData({
      requestId: approvedRequests[0]?.requestId || '',
      donorId: '',
      notes: ''
    });
    setCompatibleDonors([]);
    setIsNewModalOpen(true);
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!formData.requestId || !formData.donorId) {
      alert('Please select both a request and a compatible donor.');
      return;
    }

    setSubmitting(true);
    try {
      await matchService.createMatch(
        parseInt(formData.donorId, 10),
        parseInt(formData.requestId, 10),
        formData.notes
      );
      setSuccessMsg('Compatibility match created and authorized successfully!');
      setIsNewModalOpen(false);
      loadInitialData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to create match.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Update transplant match status to ${status.toLowerCase()}?`)) return;
    setUpdating(true);
    try {
      await matchService.updateMatchStatus(id, status);
      setSuccessMsg(`Match status updated to ${status.toLowerCase()}!`);
      setIsDetailsModalOpen(false);
      loadInitialData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update match status.');
    } finally {
      setUpdating(false);
    }
  };

  const openDetails = (match) => {
    setSelectedMatch(match);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="animate-spin text-rose-500" size={32} />
        <p className="text-sm text-slate-600">Loading matches coordinator...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transplant Match Coordinator</h1>
          <p className="text-slate-600 text-sm">Authorise donor-recipient matches and track surgical completions.</p>
        </div>
        
        <Button variant="primary" onClick={handleOpenNewModal} className="text-xs font-bold flex items-center gap-1.5 self-start">
          <Plus size={16} />
          Create Compatibility Match
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 flex items-center gap-3">
          <CheckCircle size={18} className="flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 flex items-center gap-3">
          <AlertTriangle size={18} className="flex-shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Matches queue */}
      <Card title="Active Transplant Matches" subtitle="Immunologically compatible matches pending surgical finalization" className="border border-rose-100 bg-white shadow-sm">
        {matches.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider text-left">
                  <th className="pb-3 pt-2">Match ID</th>
                  <th className="pb-3 pt-2">Donor Reference</th>
                  <th className="pb-3 pt-2">Recipient Request</th>
                  <th className="pb-3 pt-2">Organ type</th>
                  <th className="pb-3 pt-2">Status</th>
                  <th className="pb-3 pt-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {matches.map((m) => (
                  <tr key={m.matchId} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3.5 font-mono text-slate-400 text-xs">#{m.matchId}</td>
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{m.donor?.fullName}</span>
                        <span className="text-[10px] text-slate-500">Donor ID: #{m.donor?.donorId} &bull; Blood: {m.donor?.bloodType}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{m.request?.patientName}</span>
                        <span className="text-[10px] text-slate-500">Request: #{m.request?.requestId} &bull; Blood: {m.request?.patientBloodType}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-medium">{m.request?.organType?.name}</td>
                    <td className="py-3.5">
                      <Badge>{m.status}</Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => openDetails(m)}
                          className="hover:bg-slate-100 p-1.5 rounded-lg text-slate-600"
                        >
                          <Eye size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No transplant matches have been recorded yet.
          </div>
        )}
      </Card>

      {/* Details Match Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={`Review Match Coordination (ID: #${selectedMatch?.matchId})`}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <div>
              {selectedMatch && selectedMatch.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button 
                    variant="primary" 
                    onClick={() => handleUpdateStatus(selectedMatch.matchId, 'COMPLETED')}
                    loading={updating}
                  >
                    Mark Surgery Completed
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleUpdateStatus(selectedMatch.matchId, 'CANCELLED')}
                    loading={updating}
                  >
                    Cancel Match
                  </Button>
                </div>
              )}
            </div>
            <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedMatch && (
          <div className="space-y-6 text-sm text-slate-700 text-left">
            
            {/* Visual match indicator */}
            <div className="flex items-center justify-center gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="text-center">
                <Badge variant="secondary" className="mb-1">{selectedMatch.donor?.bloodType}</Badge>
                <span className="block font-semibold text-slate-900">{selectedMatch.donor?.fullName}</span>
                <span className="text-[10px] text-slate-500">Donor #{selectedMatch.donor?.donorId}</span>
              </div>
              
              <div className="flex flex-col items-center gap-1.5 px-6">
                <Heart size={20} className="text-rose-500 fill-rose-500/20" />
                <ArrowRight size={20} className="text-slate-400" />
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{selectedMatch.request?.organType?.name}</span>
              </div>

              <div className="text-center">
                <Badge variant="secondary" className="mb-1">{selectedMatch.request?.patientBloodType}</Badge>
                <span className="block font-semibold text-slate-900">{selectedMatch.request?.patientName}</span>
                <span className="text-[10px] text-slate-500">Recipient Request #{selectedMatch.request?.requestId}</span>
              </div>
            </div>

            {/* Coordination details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Hospital size={14} className="text-rose-500" /> Hospital Delivery
                </h4>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                  {selectedMatch.request?.hospitalName} <br />
                  <span className="text-slate-500 text-[10px]">Location: {selectedMatch.request?.hospitalLocation}</span>
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Calendar size={14} className="text-rose-500" /> Match Date
                </h4>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                  Logged: {new Date(selectedMatch.createdAt).toLocaleString()} <br />
                  <span className="text-slate-500 text-[10px]">Status: {selectedMatch.status}</span>
                </p>
              </div>
            </div>

            {/* Match notes */}
            {selectedMatch.notes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Match Coordination Notes</h4>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs leading-normal text-slate-700">
                  {selectedMatch.notes}
                </p>
              </div>
            )}

          </div>
        )}
      </Modal>

      {/* Creation Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Create Donor-Recipient Compatibility Match"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsNewModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreateMatch} 
              loading={submitting} 
              disabled={!formData.requestId || !formData.donorId}
            >
              Confirm Match
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateMatch} className="space-y-4">
          
          <Input
            label="1. Select Active Approved Request"
            type="select"
            name="requestId"
            value={formData.requestId}
            onChange={handleChange}
            options={approvedRequests.map(r => ({ 
              value: r.requestId, 
              label: `Req #${r.requestId}: ${r.patientName} (${r.patientBloodType}) - Needs ${r.organType?.name}` 
            }))}
            placeholder="Select approved recipient request..."
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              2. Select Compatible Donor
            </label>
            {fetchingCompat ? (
              <div className="flex items-center justify-center p-4 border border-slate-200 bg-slate-50 rounded-lg text-xs gap-2 text-slate-600">
                <RefreshCw size={14} className="animate-spin text-rose-500" />
                Querying compatibility matrices...
              </div>
            ) : compatibleDonors.length > 0 ? (
              <Input
                type="select"
                name="donorId"
                value={formData.donorId}
                onChange={handleChange}
                options={compatibleDonors.map(d => ({
                  value: d.donorId,
                  label: `Donor #${d.donorId}: ${d.fullName} (${d.bloodType})`
                }))}
                placeholder="Select compatible donor..."
                required
              />
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle size={14} className="text-rose-600" />
                No verified compatible donors available for the selected request.
              </div>
            )}
          </div>

          <Input
            label="Match Coordination Notes"
            type="textarea"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Input surgical timeline, transportation coordination parameters, and clinical team details..."
            rows={3.5}
          />

        </form>
      </Modal>

    </div>
  );
};

export default AdminMatches;
