import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { adminService } from '../../services/adminService';
import { 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Check,
  X,
  Hospital,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filterPending, setFilterPending] = useState(true); // Default to pending requests
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let data = [];
      if (filterPending) {
        data = await adminService.getPendingRequests();
      } else {
        // Fetch all requests
        data = await requestService.searchRequests({});
      }
      setRequests(data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load recipient requests database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterPending]);

  const handleUpdateStatus = async (id, status) => {
    if (status === 'REJECTED' && !reviewNotes) {
      alert('Please provide reason notes for rejection.');
      return;
    }

    setUpdating(true);
    try {
      await requestService.updateStatus(id, status, reviewNotes);
      setSuccessMsg(`Request successfully ${status.toLowerCase()}!`);
      setIsModalOpen(false);
      fetchRequests();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update request status.');
    } finally {
      setUpdating(false);
    }
  };

  const openDetails = (req) => {
    setSelectedRequest(req);
    setReviewNotes('');
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="animate-spin text-teal-400" size={32} />
        <p className="text-sm text-slate-400">Loading requests pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Organ Request Approvals</h1>
          <p className="text-slate-400 text-sm">Review clinical reasons and approve matching requests.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
          <button
            onClick={() => setFilterPending(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterPending ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setFilterPending(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              !filterPending ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Requests
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-teal-500/10 border border-teal-500/20 rounded-lg text-sm text-teal-400 flex items-center gap-3">
          <CheckCircle size={18} className="flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 flex items-center gap-3">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Card title="Requests Queue" subtitle="Authorized hospital organ requests requiring clearance">
        {requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider text-left">
                  <th className="pb-3 pt-2">ID</th>
                  <th className="pb-3 pt-2">Patient Code</th>
                  <th className="pb-3 pt-2">Organ Type</th>
                  <th className="pb-3 pt-2">Hospital</th>
                  <th className="pb-3 pt-2">Urgency</th>
                  <th className="pb-3 pt-2">Status</th>
                  <th className="pb-3 pt-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-200">
                {requests.map((req) => (
                  <tr key={req.requestId} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 font-mono text-slate-500 text-xs">#{req.requestId}</td>
                    <td className="py-3.5 font-semibold">{req.patientName} ({req.patientAge}y)</td>
                    <td className="py-3.5">{req.organType?.name} ({req.patientBloodType})</td>
                    <td className="py-3.5 font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Hospital size={13} className="text-slate-500" />
                        {req.hospitalName}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <Badge variant={req.urgencyLevel === 'CRITICAL' ? 'danger' : req.urgencyLevel === 'HIGH' ? 'danger' : 'info'}>
                        {req.urgencyLevel}
                      </Badge>
                    </td>
                    <td className="py-3.5">
                      <Badge>{req.status}</Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => openDetails(req)}
                          className="hover:bg-slate-800 p-1.5 rounded-lg"
                        >
                          <Eye size={15} />
                        </Button>
                        {req.status === 'PENDING' && (
                          <>
                            <Button 
                              variant="outline"
                              onClick={() => { setSelectedRequest(req); handleUpdateStatus(req.requestId, 'APPROVED'); }}
                              className="text-[10px] py-1 px-2.5 text-teal-400 border-teal-500/25 hover:bg-teal-500/10 font-bold"
                            >
                              Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No transplant requests are waiting in this category.
          </div>
        )}
      </Card>

      {/* Details Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Review Organ Request (ID: #${selectedRequest?.requestId})`}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <div>
              {selectedRequest && selectedRequest.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button 
                    variant="primary" 
                    onClick={() => handleUpdateStatus(selectedRequest.requestId, 'APPROVED')}
                    loading={updating}
                  >
                    <Check size={16} className="mr-1" />
                    Approve Case
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleUpdateStatus(selectedRequest.requestId, 'REJECTED')}
                    loading={updating}
                  >
                    <X size={16} className="mr-1" />
                    Reject Case
                  </Button>
                </div>
              )}
            </div>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedRequest && (
          <div className="space-y-6 text-sm text-slate-300">
            
            {/* Grid attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Patient Code</span>
                <span className="font-semibold text-slate-200">{selectedRequest.patientName} ({selectedRequest.patientAge}y)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Organ Requested</span>
                <span className="font-bold text-slate-200">{selectedRequest.organType?.name} ({selectedRequest.patientBloodType})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Urgency Status</span>
                <Badge variant={selectedRequest.urgencyLevel === 'CRITICAL' ? 'danger' : 'info'}>{selectedRequest.urgencyLevel}</Badge>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Priority Score</span>
                <span className="font-bold text-teal-400 text-base">{selectedRequest.priority || 0}</span>
              </div>
            </div>

            {/* Hospital information */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
              <Hospital className="text-teal-400 mt-0.5" />
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Requester Hospital Details</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 block">{selectedRequest.hospitalName}</span>
                <span className="text-xs text-slate-400 block mt-0.5">Location: {selectedRequest.hospitalLocation}</span>
              </div>
            </div>

            {/* Medical reason */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle size={14} className="text-teal-400" /> Clinical Justification
              </h4>
              <p className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs leading-normal">
                {selectedRequest.medicalReason}
              </p>
            </div>

            {/* Additional notes */}
            {selectedRequest.additionalNotes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional notes</h4>
                <p className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                  {selectedRequest.additionalNotes}
                </p>
              </div>
            )}

            <div className="h-px bg-slate-800"></div>

            {/* Review comments */}
            {selectedRequest.status === 'PENDING' && (
              <div className="space-y-2">
                <Input
                  label="Review Evaluation / Rejection Rationale"
                  type="textarea"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Input evaluation notes or the reason for rejection (required if rejecting)..."
                  rows={2}
                />
              </div>
            )}

          </div>
        )}
      </Modal>

    </div>
  );
};

export default AdminRequests;
