import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { adminService } from '../../services/adminService';
import { 
  Plus, 
  FileText, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const HospitalRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [requests, setRequests] = useState([]);
  const [organTypes, setOrganTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientBloodType: 'A+',
    organTypeId: '',
    urgencyLevel: 'MEDIUM',
    hospitalName: '',
    hospitalLocation: '',
    medicalReason: '',
    additionalNotes: ''
  });

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const urgencyOptions = [
    { value: 'LOW', label: 'Low (Routine)' },
    { value: 'MEDIUM', label: 'Medium (Semi-Urgent)' },
    { value: 'HIGH', label: 'High (Urgent)' },
    { value: 'CRITICAL', label: 'Critical (Life-Threatening)' }
  ];

  const loadInitialData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const reqList = await requestService.getMyRequests();
      setRequests(reqList || []);

      let organs = [];
      try {
        organs = await adminService.getOrganTypes();
      } catch (e) {
        console.error("Unseeded database. Creating default organ options.");
      }

      if (!organs || organs.length === 0) {
        organs = [
          { organTypeId: 1, name: 'Kidney' },
          { organTypeId: 2, name: 'Liver' },
          { organTypeId: 3, name: 'Heart' },
          { organTypeId: 4, name: 'Lungs' },
          { organTypeId: 5, name: 'Pancreas' },
          { organTypeId: 6, name: 'Corneas' }
        ];
      }
      setOrganTypes(organs);
      
      // Auto-select first organ if empty
      if (organs.length > 0) {
        setFormData(prev => ({ ...prev, organTypeId: organs[0].organTypeId }));
      }

    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load organ requests list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Check URL query parameters for ?create=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true') {
      setIsModalOpen(true);
      // Clean query parameter
      navigate('/hospital/requests', { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleOpenModal = () => {
    setFormData({
      patientName: '',
      patientAge: '',
      patientBloodType: 'A+',
      organTypeId: organTypes[0]?.organTypeId || '',
      urgencyLevel: 'MEDIUM',
      hospitalName: '',
      hospitalLocation: '',
      medicalReason: '',
      additionalNotes: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.patientName) newErrors.patientName = 'Patient initials or anonymized name is required';
    if (!formData.patientAge) newErrors.patientAge = 'Patient age is required';
    if (formData.patientAge && (formData.patientAge < 0 || formData.patientAge > 130)) {
      newErrors.patientAge = 'Please input a valid age';
    }
    if (!formData.hospitalName) newErrors.hospitalName = 'Hospital name is required';
    if (!formData.hospitalLocation) newErrors.hospitalLocation = 'Hospital location is required';
    if (!formData.medicalReason) newErrors.medicalReason = 'Medical description is required';
    if (formData.medicalReason && formData.medicalReason.length < 10) {
      newErrors.medicalReason = 'Reason must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    
    const payload = {
      ...formData,
      organTypeId: parseInt(formData.organTypeId, 10),
      patientAge: parseInt(formData.patientAge, 10)
    };

    try {
      await requestService.createRequest(payload);
      setSuccessMsg('Organ request logged successfully!');
      setIsModalOpen(false);
      loadInitialData();
      
      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrors({
        submit: err.response?.data?.message || 'Failed to submit organ request. Try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this organ request?')) return;
    try {
      await requestService.cancelRequest(id);
      setSuccessMsg('Request cancelled successfully');
      loadInitialData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to cancel the request.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="animate-spin text-teal-400" size={32} />
        <p className="text-sm text-slate-400">Loading requests queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Patient Organ Requests</h1>
          <p className="text-slate-400 text-sm">Add and monitor transplant matching queues.</p>
        </div>
        
        <Button variant="primary" onClick={handleOpenModal} className="text-xs font-bold flex items-center gap-1.5 self-start">
          <Plus size={16} />
          Register Patient Request
        </Button>
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

      {/* Requests table card */}
      <Card title="Transplant Waiting List" subtitle="Logged cases under synchronization">
        {requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider text-left">
                  <th className="pb-3 pt-2">Patient Code</th>
                  <th className="pb-3 pt-2">Organ Type</th>
                  <th className="pb-3 pt-2">Blood Type</th>
                  <th className="pb-3 pt-2">Urgency Level</th>
                  <th className="pb-3 pt-2">Priority Score</th>
                  <th className="pb-3 pt-2">Status</th>
                  <th className="pb-3 pt-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-200">
                {requests.map((req) => (
                  <tr key={req.requestId} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3.5 font-semibold">{req.patientName} ({req.patientAge}y)</td>
                    <td className="py-3.5">{req.organType?.name}</td>
                    <td className="py-3.5">
                      <Badge variant="secondary">{req.patientBloodType}</Badge>
                    </td>
                    <td className="py-3.5">
                      <Badge variant={req.urgencyLevel === 'CRITICAL' ? 'danger' : req.urgencyLevel === 'HIGH' ? 'danger' : 'info'}>
                        {req.urgencyLevel}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-bold text-teal-400">{req.priority || 0}</td>
                    <td className="py-3.5">
                      <Badge>{req.status}</Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'APPROVED' && (
                          <Button 
                            variant="outline" 
                            onClick={() => navigate(`/hospital/search?requestId=${req.requestId}&bloodType=${req.patientBloodType}&organTypeId=${req.organType?.organTypeId}`)}
                            className="text-[10px] py-1 px-2.5"
                          >
                            Find Matches
                          </Button>
                        )}
                        {['PENDING', 'UNDER_REVIEW', 'APPROVED'].includes(req.status) && (
                          <Button
                            variant="ghost"
                            onClick={() => handleCancelRequest(req.requestId)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded-lg"
                            title="Cancel Request"
                          >
                            <Trash2 size={15} />
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
            No patient requests are currently logged.
          </div>
        )}
      </Card>

      {/* Modal form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Organ Transplant Request"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>
              Submit Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {errors.submit && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Patient Initials / Anonymized Code"
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              error={errors.patientName}
              placeholder="e.g. Patient P.K."
              required
            />
            
            <Input
              label="Patient Age"
              type="number"
              name="patientAge"
              value={formData.patientAge}
              onChange={handleChange}
              error={errors.patientAge}
              placeholder="45"
              required
            />

            <Input
              label="Patient Blood Type"
              type="select"
              name="patientBloodType"
              value={formData.patientBloodType}
              onChange={handleChange}
              options={bloodTypeOptions}
              required
            />

            <Input
              label="Requested Organ Type"
              type="select"
              name="organTypeId"
              value={formData.organTypeId}
              onChange={handleChange}
              options={organTypes.map(o => ({ value: o.organTypeId, label: o.name }))}
              required
            />

            <Input
              label="Urgency Level"
              type="select"
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              options={urgencyOptions}
              required
            />

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Hospital Name"
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                error={errors.hospitalName}
                placeholder="e.g. City General Hospital"
                required
              />
              <Input
                label="Hospital Location / Ward Details"
                type="text"
                name="hospitalLocation"
                value={formData.hospitalLocation}
                onChange={handleChange}
                error={errors.hospitalLocation}
                placeholder="e.g. Block C, Mumbai"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Medical Diagnosis / Rationale"
                type="textarea"
                name="medicalReason"
                value={formData.medicalReason}
                onChange={handleChange}
                error={errors.medicalReason}
                placeholder="Briefly state clinical reasoning (e.g. End stage kidney disease, GFR < 15)."
                rows={3}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Additional Comments (Optional)"
                type="textarea"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Transportation details, HLA specifications, HLA match constraints..."
                rows={2}
              />
            </div>

          </div>
        </form>
      </Modal>

    </div>
  );
};

export default HospitalRequests;
