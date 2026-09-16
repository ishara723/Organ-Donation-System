import React, { useState } from 'react';
import Card from '../components/common/Card';
import { HelpCircle, ShieldAlert, Award, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/common/Button';

const Awareness = () => {
  const [openFaq, setOpenFaq] = useState(null);
  
  // Eligibility checklist state
  const [checklist, setChecklist] = useState({
    age: false,
    disease: false,
    consent: false,
    health: false
  });
  
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const checkEligibility = () => {
    if (checklist.age && !checklist.disease && checklist.consent && checklist.health) {
      setEligibilityResult('eligible');
    } else {
      setEligibilityResult('ineligible');
    }
  };

  const faqs = [
    {
      q: 'Who can register as an organ donor?',
      a: 'Almost anyone, regardless of age or medical history, can sign up. At the time of death, qualified physicians will evaluate whether specific organs are viable for transplantation based on medical criteria.'
    },
    {
      q: 'Does registered consent apply to everything?',
      a: 'No. On your LifeLink profile, you select exactly which organs you consent to pledge (e.g. Kidney, Liver, Cornea). You can revoke or edit these preferences at any time.'
    },
    {
      q: 'Will doctor care change if they know I am a donor?',
      a: 'Absolutely not. The primary duty of medical personnel treating you is to save your life. The transplant coordination team is completely separate and only evaluates donor status after death has been pronounced.'
    },
    {
      q: 'Are there any costs associated with donating organs?',
      a: 'No. There are no costs or financial burdens placed on the donor’s family for any aspect of organ or tissue recovery.'
    }
  ];

  const myths = [
    { m: 'Myth: "I am too old to register as an organ donor."', f: 'Fact: There is no strict age cutoff for organ donation. Organs have been successfully recovered from donors in their 80s and 90s. Viability is determined strictly by physiological criteria at the time of death.' },
    { m: 'Myth: "My religion forbids organ donation."', f: 'Fact: Most major world religions support organ donation as a final act of charity, compassion, and saving human lives.' },
    { m: 'Myth: "Rich and famous people get prioritized on transplant lists."', f: 'Fact: The matching algorithm (and LifeLink’s compatibility sorting) evaluates compatibility solely on medical factors such as blood type match, organ size, geographical proximity, and urgency level.' }
  ];

  return (
    <div className="space-y-12 py-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Education & FAQs</h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm">
          Get answers to common questions and test your general eligibility.
        </p>
      </div>

      {/* Accordion FAQ section */}
      <section className="space-y-4 text-left">
        <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-slate-800 hover:text-rose-600 font-semibold text-sm sm:text-base focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle size={18} className="text-rose-500 flex-shrink-0" />
                  {faq.q}
                </span>
                {openFaq === idx ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
              </button>
              
              {openFaq === idx && (
                <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Myth vs Fact */}
      <section className="space-y-6 text-left">
        <h3 className="text-xl font-bold text-slate-900">Myths vs. Facts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myths.map((myth, idx) => (
            <Card key={idx} className="border border-rose-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Common Myth</span>
                <h4 className="text-sm font-bold text-slate-900">{myth.m}</h4>
                <div className="h-px bg-rose-100 my-2"></div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block">Medical Fact</span>
                <p className="text-xs text-slate-600 leading-relaxed">{myth.f}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Interactive Eligibility Checklist */}
      <section className="space-y-6 text-left">
        <h3 className="text-xl font-bold text-slate-900">Interactive Eligibility Checklist</h3>
        <Card className="border border-rose-100 bg-white shadow-sm">
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-normal">
              Answer these questions to perform a preliminary evaluation of your donor eligibility. Note: Final medical evaluations are always done on-site by clinical staff.
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-rose-50/30 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.age}
                  onChange={(e) => setChecklist({ ...checklist, age: e.target.checked })}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500/50 h-4.5 w-4.5"
                />
                <span className="text-xs text-slate-700">I am at least 18 years old (or have parental/guardian consent if younger).</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-rose-50/30 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.disease}
                  onChange={(e) => setChecklist({ ...checklist, disease: e.target.checked })}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500/50 h-4.5 w-4.5"
                />
                <span className="text-xs text-slate-700">I currently carry active communicable diseases (e.g., active HIV, active systemic infections).</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-rose-50/30 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.consent}
                  onChange={(e) => setChecklist({ ...checklist, consent: e.target.checked })}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500/50 h-4.5 w-4.5"
                />
                <span className="text-xs text-slate-700">I am willing to explicitly pledge specific organs and verify my profile settings.</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-rose-50/30 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.health}
                  onChange={(e) => setChecklist({ ...checklist, health: e.target.checked })}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500/50 h-4.5 w-4.5"
                />
                <span className="text-xs text-slate-700">I understand that final organ medical viability is assessed by clinical boards at time of care.</span>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
              <Button onClick={checkEligibility} variant="outline">
                Evaluate Eligibility
              </Button>

              {eligibilityResult && (
                <div className={`px-4 py-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  eligibilityResult === 'eligible'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {eligibilityResult === 'eligible' ? (
                    <>
                      <Award size={16} className="text-emerald-600" />
                      <span>Result: You meet standard registry requirements. Please click Register to sign up.</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={16} className="text-rose-600" />
                      <span>Result: Please check the requirements. Organ donations might have medical restrictions.</span>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </Card>
      </section>

    </div>
  );
};

export default Awareness;
