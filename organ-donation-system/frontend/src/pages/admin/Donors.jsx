import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { adminService } from '../../services/adminService';
import { 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Check,
  X,
  Phone,
  MapPin,
  ClipboardList
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const AdminDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filterPending, setFilterPending] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const fetchDonors = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      let data = [];
      if (filterPending) {
        data = await adminService.getPendingDonors();
      } else {
        data = await donorService.getAllDonors();
      }
      setDonors(data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to retrieve the donor registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [filterPending]);

  const handleVerify = async (id, status) => {
    setVerifying(true);
    try {
      await donorService.verifyDonor(id, status);
      setSuccessMsg(status ? 'Donor profile verified successfully!' : 'Donor verification retracted.');
      setIsModalOpen(false);
      fetchDonors();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update verification status.');
    } finally {
      setVerifying(false);
    }
  };

  const openDetails = (donor) => {
    setSelectedDonor(donor);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="animate-spin text-teal-400" size={32} />
        <p className="text-sm text-slate-400">Loading donor database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Donor Verifications</h1>
          <p className="text-slate-400 text-sm">Review legal consent and authorize donor accounts.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
          <button
            onClick={() => setFilterPending(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              !filterPending ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Donors
          </button>
          <button
            onClick={() => setFilterPending(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterPending ? 'bg-slate-800 text-slate-100 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending Verification
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

      <Card title="Registry Roster" subtitle="Verify and toggle legal consent permissions">
        {donors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider text-left">
                  <th className="pb-3 pt-2">ID</th>
                  <th className="pb-3 pt-2">Full Name</th>
                  <th className="pb-3 pt-2">Blood Type</th>
                  <th className="pb-3 pt-2">Consent Status</th>
                  <th className="pb-3 pt-2">Verification</th>
                  <th className="pb-3 pt-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-200">
                {donors.map((donor) => (
                  <tr key={donor.donorId} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 font-mono text-slate-500 text-xs">#{donor.donorId}</td>
                    <td className="py-3.5 font-semibold">{donor.fullName}</td>
                    <td className="py-3.5">
                      <Badge variant="secondary">{donor.bloodType}</Badge>
                    </td>
                    <td className="py-3.5">
                      <Badge>{donor.consentStatus}</Badge>
                    </td>
                    <td className="py-3.5">
                      {donor.isVerified ? (
                        <span className="flex items-center gap-1 text-xs text-teal-400 font-medium">
                          <ShieldCheck size={14} /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                          <ShieldAlert size={14} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => openDetails(donor)}
                          className="hover:bg-slate-800 p-1.5 rounded-lg"
                        >
                          <Eye size={15} />
                        </Button>
                        {!donor.isVerified ? (
                          <Button 
                            variant="outline" 
                            onClick={() => handleVerify(donor.donorId, true)}
                            className="text-[10px] py-1 px-2 text-teal-400 border-teal-500/30 hover:bg-teal-500/10"
                          >
                            Verify
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            onClick={() => handleVerify(donor.donorId, false)}
                            className="text-[10px] py-1 px-2 text-slate-400 hover:text-slate-200"
                          >
                            Revoke
                          </Button>
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
            No donors found in this verification state.
          </div>
        )}
      </Card>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Donor Record Details (ID: #${selectedDonor?.donorId})`}
        size="lg"
        footer={
          <div className="flex justify-between w-full">
            <div>
              {selectedDonor && !selectedDonor.isVerified ? (
                <Button 
                  variant="primary" 
                  onClick={() => handleVerify(selectedDonor.donorId, true)}
                  loading={verifying}
                  className="bg-teal-600 hover:bg-teal-500"
                >
                  <Check size={16} className="mr-1" />
                  Approve Verification
                </Button>
              ) : (
                <Button 
                  variant="danger" 
                  onClick={() => handleVerify(selectedDonor?.donorId, false)}
                  loading={verifying}
                >
                  <X size={16} className="mr-1" />
                  Revoke Verification
                </Button>
              )}
            </div>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedDonor && (
          <div className="space-y-6 text-sm text-slate-300">
            
            {/* Grid metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Full Name</span>
                <span className="font-semibold text-slate-200">{selectedDonor.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">DOB (Age)</span>
                <span className="font-semibold text-slate-200">
                  {selectedDonor.dateOfBirth} ({selectedDonor.getAge || new Date().getFullYear() - new Date(selectedDonor.dateOfBirth).getFullYear()}y)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Blood Type</span>
                <Badge variant="secondary">{selectedDonor.bloodType}</Badge>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Consent</span>
                <Badge>{selectedDonor.consentStatus}</Badge>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2"><Phone size={14} className="text-teal-400" /> {selectedDonor.phone}</div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-teal-400 mt-0.5" />
                    <span>{selectedDonor.address}, {selectedDonor.city}, {selectedDonor.state}, {selectedDonor.country}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Reference</h4>
                <p className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                  {selectedDonor.emergencyContact || 'No emergency contact registered.'}
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-800"></div>

            {/* Medical notes and organs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList size={14} /> Medical History
                </h4>
                <p className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs leading-normal">
                  {selectedDonor.medicalHistory || 'No special medical conditions reported.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={14} /> Pledged Organs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDonor.donorOrgans?.map((o) => (
                    <span key={o.donorOrganId} className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200">
                      {o.organType?.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};

export default AdminDonors;
