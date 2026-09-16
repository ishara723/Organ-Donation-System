import React from 'react';
import Card from '../components/common/Card';
import { ShieldCheck, Heart, ClipboardCheck, Clock } from 'lucide-react';

const About = () => {
  const organsList = [
    { name: 'Kidney', desc: 'The most common transplant. Restores normal metabolic functions and frees patients from dialysis.' },
    { name: 'Liver', desc: 'Transplanted for acute failure or cirrhosis. The liver has the unique ability to regenerate.' },
    { name: 'Heart', desc: 'Saves patients suffering from end-stage heart failure or severe congenital defects.' },
    { name: 'Lungs', desc: 'For patients with cystic fibrosis, COPD, or pulmonary hypertension. Can be single or double.' },
    { name: 'Pancreas', desc: 'Often transplanted alongside a kidney for patients with severe Type 1 diabetes.' },
    { name: 'Corneas', desc: 'Restores sight to patients suffering from corneal blindness or severe eye injury.' }
  ];

  return (
    <div className="space-y-12 py-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">About Organ Donation</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm">
          Understanding the massive social and medical impact of donor registrations.
        </p>
      </div>

      {/* Main Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-left">
          <h2 className="text-xl font-bold text-rose-600">Why register as a donor?</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            One single organ donor can save up to eight lives and improve the quality of life for dozens more through tissue and cornea donations. Despite advanced medical technologies, thousands of patients remain on active waiting lists for years, and many lose their lives due to a critical shortage of compatible donor organs.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            LifeLink simplifies this registry process by capturing consent explicitly, logging structured medical details, and allowing clinics to search and filter compatible donors instantly based on blood types and medical constraints.
          </p>
        </div>
        
        <div className="space-y-4">
          <Card className="text-left bg-gradient-to-br from-white to-rose-50/40">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-rose-50 text-rose-600 p-2 rounded-xl border border-rose-100"><Clock size={16} /></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Time-Critical Pipeline</h4>
                  <p className="text-xs text-slate-500">Organs have a limited viability window (e.g., heart is 4-6 hours, kidneys are 24-36 hours) making fast coordination essential.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-rose-50 text-rose-600 p-2 rounded-xl border border-rose-100"><ShieldCheck size={16} /></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">GDPR & HIPAA Compliance</h4>
                  <p className="text-xs text-slate-500">Medical profiles are locked behind secure JWT auth, ensuring donor anonymity until a match is approved.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-rose-50 text-rose-600 p-2 rounded-xl border border-rose-100"><ClipboardCheck size={16} /></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Explicit Consent Tracking</h4>
                  <p className="text-xs text-slate-500">Donors can update or revoke their consent status at any time, giving them complete sovereignty over their data.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Transplantable Organs List */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 text-left">Transplantable Organs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organsList.map((organ) => (
            <Card key={organ.name} className="text-left h-full" hoverable>
              <div className="flex items-center gap-2 mb-2 text-rose-500">
                <Heart size={16} className="fill-current" />
                <h4 className="font-bold text-slate-800">{organ.name}</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{organ.desc}</p>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
