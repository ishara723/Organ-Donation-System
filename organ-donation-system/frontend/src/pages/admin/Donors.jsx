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
        <RefreshCw className="animate-spin text-rose-500" size={32} />
        <p className="text-sm text-slate-600">Loading donor database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Donor Verifications</h1>
          <p className="text-slate-600 text-sm">Review legal consent and authorize donor accounts.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start">
          <button
            onClick={() => setFilterPending(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              !filterPending ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Donors
          </button>
          <button
            onClick={() => setFilterPending(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterPending ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Verification
          </button>
        </div>
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

      <Card title="Registry Roster" subtitle="Verify and toggle legal consent permissions" className="border border-rose-100 bg-white shadow-sm">
        {donors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider text-left">
                  <th className="pb-3 pt-2">ID</th>
                  <th className="pb-3 pt-2">Full Name</th>
                  <th className="pb-3 pt-2">Blood Type</th>
                  <th className="pb-3 pt-2">Consent Status</th>
                  <th className="pb-3 pt-2">Verification</th>
                  <th className="pb-3 pt-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {donors.map((donor) => (
                  <tr key={donor.donorId} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3.5 font-mono text-slate-400 text-xs">#{donor.donorId}</td>
                    <td className="py-3.5 font-semibold text-slate-900">{donor.fullName}</td>
                    <td className="py-3.5">
                      <Badge variant="secondary">{donor.bloodType}</Badge>
                    </td>
                    <td className="py-3.5">
                      <Badge>{donor.consentStatus}</Badge>
                    </td>
                    <td className="py-3.5">
                      {donor.isVerified ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                          <ShieldCheck size={14} className="text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-700 font-medium">
                          <ShieldAlert size={14} className="text-amber-600" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          onClick={() => openDetails(donor)}
                          className="hover:bg-slate-100 p-1.5 rounded-lg text-slate-600"
                        >
                          <Eye size={15} />
                        </Button>
                        {!donor.isVerified ? (
                          <Button 
                            variant="outline" 
                            onClick={() => handleVerify(donor.donorId, true)}
                            className="text-[10px] py-1 px-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            Verify
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            onClick={() => handleVerify(donor.donorId, false)}
                            className="text-[10px] py-1 px-2 text-slate-500 hover:text-slate-800"
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
                  className="bg-rose-600 hover:bg-rose-700 text-white"
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
          <div className="space-y-6 text-sm text-slate-700">
            
            {/* Grid metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Full Name</span>
                <span className="font-semibold text-slate-900">{selectedDonor.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">DOB (Age)</span>
                <span className="font-semibold text-slate-900">
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
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</h4>
                <div className="space-y-1.5 text-slate-700">
                  <div className="flex items-center gap-2"><Phone size={14} className="text-rose-500" /> {selectedDonor.phone}</div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-rose-500 mt-0.5" />
                    <span>{selectedDonor.address}, {selectedDonor.city}, {selectedDonor.state}, {selectedDonor.country}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Reference</h4>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                  {selectedDonor.emergencyContact || 'No emergency contact registered.'}
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-200"></div>

            {/* Medical notes and organs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList size={14} /> Medical History
                </h4>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs leading-normal text-slate-700">
                  {selectedDonor.medicalHistory || 'No special medical conditions reported.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={14} className="text-rose-500" /> Pledged Organs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDonor.donorOrgans?.map((o) => (
                    <span key={o.donorOrganId} className="px-3 py-1.5 bg-rose-50/60 border border-rose-100 rounded-lg text-xs font-medium text-slate-800">
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
