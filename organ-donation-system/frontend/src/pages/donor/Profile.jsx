import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '../../services/donorService';
import { adminService } from '../../services/adminService';
import { ChevronLeft, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const DonorProfile = () => {
  const navigate = useNavigate();
  const [organTypes, setOrganTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingDonorId, setExistingDonorId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodType: 'A+',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    medicalHistory: '',
    emergencyContact: '',
    selectedOrgans: [] // Array of organTypeId integers
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

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // 1. Load organ types
        let organs = [];
        try {
          organs = await adminService.getOrganTypes();
        } catch (e) {
          console.error("Failed to load organ types from database. Seeding fallback organs locally.");
        }
        
        if (!organs || organs.length === 0) {
          // Fallback static list
          organs = [
            { organTypeId: 1, name: 'Kidney', description: 'Renal transplantation' },
            { organTypeId: 2, name: 'Liver', description: 'Hepatic transplantation' },
            { organTypeId: 3, name: 'Heart', description: 'Cardiac transplantation' },
            { organTypeId: 4, name: 'Lungs', description: 'Pulmonary transplantation' },
            { organTypeId: 5, name: 'Pancreas', description: 'Pancreatic transplantation' },
            { organTypeId: 6, name: 'Corneas', description: 'Corneal transplantation' }
          ];
        }
        setOrganTypes(organs);

        // 2. Check if donor profile already exists to pre-populate fields (edit mode)
        try {
          const profile = await donorService.getMyProfile();
          if (profile) {
            setIsEditMode(true);
            setExistingDonorId(profile.donorId);
            setFormData({
              fullName: profile.fullName || '',
              dateOfBirth: profile.dateOfBirth || '',
              gender: profile.gender || 'MALE',
              bloodType: profile.bloodType || 'A+',
              phone: profile.phone || '',
              address: profile.address || '',
              city: profile.city || '',
              state: profile.state || '',
              country: profile.country || '',
              postalCode: profile.postalCode || '',
              medicalHistory: profile.medicalHistory || '',
              emergencyContact: profile.emergencyContact || '',
              selectedOrgans: profile.donorOrgans ? profile.donorOrgans.map(o => o.organType?.organTypeId) : []
            });
          }
        } catch (e) {
          // Profile doesn't exist yet, stay in create mode
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleOrganToggle = (id) => {
    const selected = [...formData.selectedOrgans];
    const index = selected.indexOf(id);
    if (index === -1) {
      selected.push(id);
    } else {
      selected.splice(index, 1);
    }
    setFormData({ ...formData, selectedOrgans: selected });
    if (errors.selectedOrgans) {
      setErrors({ ...errors, selectedOrgans: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (formData.phone && !/^[+]?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format. Must be 10-15 digits.';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (formData.selectedOrgans.length === 0) {
      newErrors.selectedOrgans = 'Please select at least one organ to pledge';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top to see error summary if needed
      window.scrollTo(0, 0);
      return;
    }

    setSubmitting(true);
    setErrors({});

    const payload = {
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      bloodType: formData.bloodType,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postalCode: formData.postalCode,
      medicalHistory: formData.medicalHistory,
      emergencyContact: formData.emergencyContact,
      organTypeIds: formData.selectedOrgans
    };

    try {
      // Backend createDonorProfile maps to POST /donors, which handles updates/creates depending on user context.
      await donorService.createProfile(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/donor/dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrors({
        submit: err.response?.data?.message || 'Failed to submit profile details. Try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <RefreshCw className="animate-spin text-rose-500" size={32} />
        <p className="text-sm text-slate-600">Loading form attributes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 text-left max-w-3xl mx-auto">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/donor/dashboard')}
          className="text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditMode ? 'Modify Donor Profile' : 'Configure Donor Profile'}
        </h1>
        <p className="text-slate-600 text-sm">
          Please input accurate medical attributes. Anonymized data will be used to coordinate compatibility matches.
        </p>
      </div>

      {errors.submit && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 flex items-center gap-3">
          <AlertTriangle size={18} className="flex-shrink-0 text-rose-600" />
          <span>{errors.submit}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 flex items-center gap-3">
          <CheckCircle size={18} className="flex-shrink-0 text-emerald-600" />
          <span>Profile saved successfully! Redirecting back to dashboard...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal Details */}
        <Card title="Personal Specifications" className="border border-rose-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="John Doe"
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              required
            />
            <Input
              label="Gender"
              type="select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={genderOptions}
              required
            />
            <Input
              label="Blood Type"
              type="select"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              options={bloodTypeOptions}
              required
            />
          </div>
        </Card>

        {/* Contact Specs */}
        <Card title="Contact Specifications" className="border border-rose-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+919876543210"
              required
            />
            <Input
              label="Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              placeholder="Apartment, Street Name"
              required
            />
            <Input
              label="City"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              placeholder="Mumbai"
              required
            />
            <Input
              label="State / Province"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
              placeholder="Maharashtra"
              required
            />
            <Input
              label="Country"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
              placeholder="India"
              required
            />
            <Input
              label="Postal Code"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              error={errors.postalCode}
              placeholder="400001"
              required
            />
          </div>
        </Card>

        {/* Medical and Emergency Contacts */}
        <Card title="Medical Info & Emergency Contacts" className="border border-rose-100 bg-white shadow-sm">
          <div className="space-y-4">
            <Input
              label="Medical History Summary"
              type="textarea"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Detail any history of major illnesses, operations, allergies, or chronic conditions."
              rows={4}
            />
            <Input
              label="Emergency Contacts Details"
              type="textarea"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Name, relationship, contact number"
              rows={2.5}
            />
          </div>
        </Card>

        {/* Organ Pledges Checklist */}
        <Card 
          title="Organ Pledges Selection" 
          subtitle="Check the organs you legally consent to pledge" 
          className="border border-rose-100 bg-white shadow-sm"
        >
          <div className="space-y-4">
            {errors.selectedOrgans && (
              <p className="text-sm font-semibold text-rose-600">{errors.selectedOrgans}</p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {organTypes.map((organ) => {
                const isSelected = formData.selectedOrgans.includes(organ.organTypeId);
                return (
                  <button
                    key={organ.organTypeId}
                    type="button"
                    onClick={() => handleOrganToggle(organ.organTypeId)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all duration-200 focus:outline-none ${
                      isSelected
                        ? 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-500 text-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-rose-200 hover:text-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500/50"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold block text-slate-900">{organ.name}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{organ.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Form Submission */}
        <div className="flex items-center justify-end gap-4">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/donor/dashboard')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={submitting}
            className="px-6 py-2.5 font-bold"
          >
            Save Profile Details
          </Button>
        </div>

      </form>
    </div>
  );
};

export default DonorProfile;
