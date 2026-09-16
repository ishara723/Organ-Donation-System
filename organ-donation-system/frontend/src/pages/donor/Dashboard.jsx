import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donorService } from '../../services/donorService';
import { 
  Heart, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Phone, 
  MapPin, 
  User, 
  ClipboardCheck,
  ChevronRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const DonorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [noProfile, setNoProfile] = useState(false);
  const [updatingConsent, setUpdatingConsent] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setNoProfile(false);
    setErrorMsg('');
    try {
      const data = await donorService.getMyProfile();
      setProfile(data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setNoProfile(true);
      } else {
        setErrorMsg('Failed to load your profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleConsentToggle = async () => {
    if (!profile) return;
    setUpdatingConsent(true);
    // Cycle between APPROVED and REVOKED
    const nextStatus = profile.consentStatus === 'APPROVED' ? 'REVOKED' : 'APPROVED';
    try {
      const res = await donorService.updateConsent(profile.donorId, nextStatus);
      if (res && res.data) {
        setProfile(res.data);
      } else {
        // Fallback: update state locally or refetch
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update consent status. Try again.');
    } finally {
      setUpdatingConsent(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="animate-spin text-rose-500" size={32} />
        <p className="text-sm text-slate-600">Retrieving your donor record...</p>
      </div>
    );
  }

  // CTA to complete profile
  if (noProfile) {
    return (
      <div className="space-y-8 py-6">
        <div className="text-left space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Donor Workspace</h1>
          <p className="text-slate-600 text-sm">Welcome to your organ donation account portal.</p>
        </div>

        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-slate-50 p-8 border border-rose-100 shadow-sm">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
          
          <div className="max-w-xl space-y-4 text-left">
            <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center border border-rose-200">
              <ClipboardCheck size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Complete Your Donor Profile</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To join the active organ compatibility registry and enable hospitals to search your anonymized record, please fill out your medical history, select the organs you consent to pledge, and register emergency contacts.
            </p>
            <div className="pt-2">
              <Link to="/donor/profile">
                <Button variant="primary" className="font-bold flex items-center gap-1.5">
                  Complete Medical Profile
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, {profile.fullName}</h1>
          <p className="text-slate-600 text-sm">Registration ID: #{profile.donorId} &bull; Blood Type: {profile.bloodType}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {profile.isVerified ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              <ShieldCheck size={14} className="text-emerald-600" />
              Verified Profile
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
              <ShieldAlert size={14} className="text-amber-600" />
              Verification Pending
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 flex items-center gap-3">
          <AlertTriangle size={18} className="flex-shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Consent Card */}
        <Card 
          title="Consent Management"
          subtitle="Legal status of your organ pledges"
          className="border border-rose-100 bg-white shadow-sm lg:col-span-2"
        >
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Current Decision</span>
                <div className="flex items-center gap-2">
                  <Badge>{profile.consentStatus}</Badge>
                  <span className="text-xs text-slate-500">
                    Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-normal pt-2">
                  {profile.consentStatus === 'APPROVED' 
                    ? 'Your consent is actively registered. Authorized medical representatives can view your anonymized compatibility details.'
                    : 'Your consent is currently withdrawn. Your organs will not be flagged in compatibility search queries.'
                  }
                </p>
              </div>

              <div className="flex-shrink-0">
                <Button 
                  variant={profile.consentStatus === 'APPROVED' ? 'danger' : 'primary'}
                  onClick={handleConsentToggle}
                  loading={updatingConsent}
                  className="font-bold text-xs"
                >
                  {profile.consentStatus === 'APPROVED' ? 'Withdraw Consent' : 'Grant Consent'}
                </Button>
              </div>
            </div>

            {/* Organ selection chips */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800">Pledged Organs</h4>
              <div className="flex flex-wrap gap-2.5">
                {profile.donorOrgans && profile.donorOrgans.length > 0 ? (
                  profile.donorOrgans.map((doObj) => (
                    <div 
                      key={doObj.donorOrganId} 
                      className="px-3.5 py-2 bg-rose-50/50 border border-rose-100 rounded-lg flex items-center gap-2"
                    >
                      <Heart size={14} className="text-rose-500 fill-rose-500/20" />
                      <span className="text-xs font-semibold text-slate-800">{doObj.organType?.name}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No organs registered. Update your profile configuration.</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Profile details summary card */}
        <Card 
          title="Contact & Support"
          subtitle="Registered verification contacts"
          className="border border-rose-100 bg-white shadow-sm"
        >
          <div className="space-y-4">
            
            {/* Primary contacts */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5 text-slate-700">
                <Phone size={16} className="text-rose-500 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 block">Phone</span>
                  <span>{profile.phone}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-slate-700">
                <MapPin size={16} className="text-rose-500 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 block">Address</span>
                  <span>{profile.address}, {profile.city}, {profile.state}, {profile.country}</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-rose-100 my-4"></div>

            {/* Emergency contacts */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Emergency Contact</span>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-normal">
                {profile.emergencyContact || 'No emergency contact registered.'}
              </div>
            </div>

            <div className="pt-2">
              <Link to="/donor/profile">
                <Button variant="secondary" className="w-full text-xs font-bold">
                  Edit Medical & Contact Info
                </Button>
              </Link>
            </div>

          </div>
        </Card>

      </div>

    </div>
  );
};

export default DonorDashboard;
