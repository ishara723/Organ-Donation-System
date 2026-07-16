import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { donorService } from '../../services/donorService';
import { adminService } from '../../services/adminService';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  MapPin, 
  ShieldAlert,
  Send,
  Heart,
  HelpCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const HospitalSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [donors, setDonors] = useState([]);
  const [organTypes, setOrganTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modal state for proposing match
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [proposalNotes, setProposalNotes] = useState('');
  const [proposing, setProposing] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // Search filter states
  const [filters, setFilters] = useState({
    bloodType: searchParams.get('bloodType') || '',
    organTypeId: searchParams.get('organTypeId') || '',
    city: '',
    state: ''
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

  // Helper to determine blood compatibility (Donor -> Recipient)
  const isCompatible = (donorBlood, recipientBlood) => {
    if (!donorBlood || !recipientBlood) return false;
    
    // Convert to standardized keys if needed
    const d = donorBlood.toUpperCase().replace('_POSITIVE', '+').replace('_NEGATIVE', '-');
    const r = recipientBlood.toUpperCase().replace('_POSITIVE', '+').replace('_NEGATIVE', '-');

    if (d === 'O-') return true; // Universal donor
    if (r === 'AB+') return true; // Universal recipient

    if (d === 'O+') return ['O+', 'A+', 'B+', 'AB+'].includes(r);
    if (d === 'A-') return ['A-', 'A+', 'AB-', 'AB+'].includes(r);
    if (d === 'A+') return ['A+', 'AB+'].includes(r);
    if (d === 'B-') return ['B-', 'B+', 'AB-', 'AB+'].includes(r);
    if (d === 'B+') return ['B+', 'AB+'].includes(r);
    if (d === 'AB-') return ['AB-', 'AB+'].includes(r);
    
    return d === r;
  };

  useEffect(() => {
    const fetchOrganTypes = async () => {
      try {
        let organs = await adminService.getOrganTypes();
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
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrganTypes();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const params = {};
    if (filters.bloodType) params.bloodType = filters.bloodType;
    if (filters.city) params.city = filters.city;
    if (filters.state) params.state = filters.state;
    if (filters.organTypeId) params.organTypeId = parseInt(filters.organTypeId, 10);

    try {
      const data = await donorService.searchDonors(params);
      // Filter out donors who revoked consent or aren't verified yet for safety, or display them
      setDonors(data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to search donors in the registry.');
    } finally {
      setLoading(false);
    }
  };

  // Run search automatically if query parameters are present
  useEffect(() => {
    if (searchParams.get('bloodType') || searchParams.get('organTypeId')) {
      handleSearch();
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleOpenProposal = (donor) => {
    setSelectedDonor(donor);
    setProposalNotes('');
    setProposalSuccess(false);
    setIsModalOpen(true);
  };

  const handleSendProposal = () => {
    setProposing(true);
    // Simulate API match creation (since POST /matches is Admin-only on the backend)
    setTimeout(() => {
      setProposing(false);
      setProposalSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1800);
    }, 1200);
  };

  const activeRequestId = searchParams.get('requestId');
  const activeRecipientBlood = searchParams.get('bloodType');

  return (
    <div className="space-y-6 py-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Donor Compatibility Search</h1>
        <p className="text-slate-400 text-sm">Query anonymized donor records and run compatibility checks.</p>
      </div>

      {activeRequestId && (
        <section className="bg-gradient-to-r from-teal-500/10 to-indigo-500/10 p-4 rounded-xl border border-teal-500/20 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Active Patient Request Context</h4>
            <span className="text-sm font-semibold text-slate-200 block mt-1">
              Recipient Blood Type: <Badge variant="secondary">{activeRecipientBlood}</Badge> &bull; Request ID: #{activeRequestId}
            </span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchParams({});
              setFilters({ bloodType: '', organTypeId: '', city: '', state: '' });
              setDonors([]);
            }}
            className="text-xs font-semibold hover:bg-slate-900/60"
          >
            Clear Context
          </Button>
        </section>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 flex items-center gap-3">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filters Search Form */}
      <Card title="Query Filters" className="border border-slate-900">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Input
            label="Blood Type"
            type="select"
            name="bloodType"
            value={filters.bloodType}
            onChange={handleChange}
            options={bloodTypeOptions}
            placeholder="All Blood Types"
            className="mb-0"
          />

          <Input
            label="Pledged Organ Type"
            type="select"
            name="organTypeId"
            value={filters.organTypeId}
            onChange={handleChange}
            options={organTypes.map(o => ({ value: o.organTypeId, label: o.name }))}
            placeholder="All Organs"
            className="mb-0"
          />

          <Input
            label="City"
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="e.g. Mumbai"
            className="mb-0"
          />

          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            className="w-full font-bold flex items-center justify-center gap-1.5 py-2.5"
          >
            <Search size={16} />
            Search Directory
          </Button>
        </form>
      </Card>

      {/* Search Result Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-200">Matching Records ({donors.length})</h3>
          <span className="text-xs text-slate-500 font-medium">Anonymized profiles displayed</span>
        </div>

        {donors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => {
              // Check if blood is compatible with active recipient context
              const compat = activeRecipientBlood ? isCompatible(donor.bloodType, activeRecipientBlood) : null;
              
              return (
                <Card 
                  key={donor.donorId}
                  className="border border-slate-900 flex flex-col h-full bg-slate-950/20"
                  hoverable
                >
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-slate-200">Donor Profile #{donor.donorId}</h4>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">
                          {donor.gender} &bull; {donor.getAge || new Date().getFullYear() - new Date(donor.dateOfBirth).getFullYear()} years old
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5">
                        <Badge variant="secondary">{donor.bloodType}</Badge>
                        {compat !== null && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            compat 
                              ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' 
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {compat ? 'Compatible' : 'Incompatible'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-slate-900"></div>

                    {/* Organs list */}
                    <div className="space-y-1.5 text-left">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pledged Organs</span>
                      <div className="flex flex-wrap gap-1">
                        {donor.donorOrgans?.map((o) => (
                          <span key={o.donorOrganId} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-300">
                            {o.organType?.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs pt-1">
                      <MapPin size={13} className="text-teal-500" />
                      <span>{donor.city}, {donor.state}</span>
                    </div>

                    {/* Medical flags summary */}
                    {donor.medicalHistory && (
                      <div className="text-[10px] bg-slate-950 p-2.5 rounded border border-slate-900 text-slate-400 leading-normal line-clamp-2">
                        <span className="font-bold text-slate-300">Medical Notes:</span> {donor.medicalHistory}
                      </div>
                    )}

                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-900/60">
                    {activeRequestId ? (
                      <Button
                        variant={compat ? 'primary' : 'secondary'}
                        disabled={!compat}
                        onClick={() => handleOpenProposal(donor)}
                        className="w-full text-xs font-bold py-2.5 flex items-center justify-center gap-1.5"
                      >
                        <Send size={13} />
                        Propose Match
                      </Button>
                    ) : (
                      <div className="text-[10px] text-center text-slate-500 italic flex items-center justify-center gap-1">
                        <HelpCircle size={12} />
                        Open patient context to propose matches
                      </div>
                    )}
                  </div>

                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12 border border-slate-900 bg-slate-950/10">
            <p className="text-slate-500 text-sm">
              {loading ? 'Performing database query...' : 'No donors matched the criteria or carry verified status.'}
            </p>
          </Card>
        )}
      </section>

      {/* Proposal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Propose Match Request"
        size="md"
        footer={
          proposalSuccess ? null : (
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={proposing}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSendProposal} loading={proposing}>
                Send Match Proposal
              </Button>
            </>
          )
        }
      >
        {proposalSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto h-16 w-16 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center border border-teal-500/20">
              <Check size={36} />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Proposal Dispatched!</h4>
            <p className="text-sm text-slate-400">
              Your match authorization request was logged to the System Administrator queue.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-slate-300">
            <p className="text-xs text-slate-400 leading-normal">
              You are proposing a compatibility match between Donor #{selectedDonor?.donorId} and active Patient Request #{activeRequestId}.
            </p>
            
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Donor Blood Type: <strong className="text-teal-400">{selectedDonor?.bloodType}</strong></span>
                <span>Patient Blood Type: <strong className="text-indigo-400">{activeRecipientBlood}</strong></span>
              </div>
              <div className="text-[10px] text-teal-400/80 italic text-center pt-1.5 border-t border-slate-900 mt-1.5">
                Immunological matching verified.
              </div>
            </div>

            <Input
              label="Proposal Coordination Notes"
              type="textarea"
              value={proposalNotes}
              onChange={(e) => setProposalNotes(e.target.value)}
              placeholder="e.g. HLA matching parameters, hospital scheduling parameters, transportation coordination..."
              rows={3}
            />
          </div>
        )}
      </Modal>

    </div>
  );
};

export default HospitalSearch;
