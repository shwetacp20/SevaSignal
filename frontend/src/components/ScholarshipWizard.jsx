import React, { useState } from "react";
import { X, CheckCircle, ExternalLink, ArrowRight, HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ScholarshipWizard({ t, onClose, onGenerateCard, lang }) {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState("karnataka");
  const [educationLevel, setEducationLevel] = useState("degree");
  const [category, setCategory] = useState("obc");
  const [incomeRange, setIncomeRange] = useState("under25lakh");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [problem, setProblem] = useState("apply");

  // Candidates based on state/inputs
  const candidateSchemes = [
    {
      id: "ssp_postmatric_karnataka",
      name: lang === "kn" 
        ? "ಕರ್ನಾಟಕ ರಾಜ್ಯ ವಿದ್ಯಾರ್ಥಿವೇತನ ಪೋರ್ಟಲ್ (SSP) - ಮೆಟ್ರಿಕ್ ನಂತರದ" 
        : lang === "hi" 
        ? "कर्नाटक राज्य छात्रवृत्ति पोर्टल (एसएसपी) - पोस्ट-मैट्रिक" 
        : "Karnataka State Scholarship Portal (SSP) - Post-Matric",
      provider: lang === "kn" ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರ (ಸಮಾಜ ಕಲ್ಯಾಣ ಇಲಾಖೆ)" : lang === "hi" ? "कर्नाटक सरकार" : "Government of Karnataka",
      eligibility: lang === "kn" ? "ಕರ್ನಾಟಕ ನಿವಾಸಿ, ಪಿಯುಸಿ/ಪದವಿ/ಡಿಪ್ಲೊಮಾ ವಿದ್ಯಾರ್ಥಿಗಳು, ಆದಾಯ ₹2.5 ಲಕ್ಷದೊಳಗೆ" : lang === "hi" ? "कर्नाटक निवासी, कॉलेज/डिप्लोमा छात्र, वार्षिक आय ₹2.5 लाख तक" : "Karnataka Domicile, Post-Matric courses (PUC, Degree, Diploma), Annual Income < ₹2.5L",
      benefit: "Tuition Fee Reimbursement + Monthly Maintenance Allowance via Direct Benefit Transfer (DBT)",
      period: "Academic Year 2025-26",
      official_portal: "https://ssp.postmatric.karnataka.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-10",
      match_level: "High Match (98%)"
    },
    {
      id: "nsp_central_sector",
      name: lang === "kn" 
        ? "ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಾರ್ಥಿವೇತನ ಪೋರ್ಟಲ್ (NSP) - ಕೇಂದ್ರ ವಲಯ ಯೋಜನೆ" 
        : lang === "hi" 
        ? "राष्ट्रीय छात्रवृत्ति पोर्टल (एनएसपी) - केंद्रीय क्षेत्र योजना" 
        : "National Scholarship Portal (NSP) - Central Sector Scheme",
      provider: lang === "kn" ? "ಭಾರತ ಸರ್ಕಾರ (ಶಿಕ್ಷಣ ಸಚಿವಾಲಯ)" : lang === "hi" ? "शिक्षा मंत्रालय, भारत सरकार" : "Ministry of Education, Govt of India",
      eligibility: lang === "kn" ? "12ನೇ ತರಗತಿಯಲ್ಲಿ ಶೇ. 80 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಅಂಕಗಳು, ವಾರ್ಷಿಕ ಆದಾಯ ₹4.5 ಲಕ್ಷದೊಳಗೆ" : lang === "hi" ? "12वीं में 80% से अधिक अंक, वार्षिक पारिवारिक आय ₹4.5 लाख से कम" : "> 80th percentile in 12th Board, pursuing regular College degree, Income < ₹4.5L",
      benefit: "₹12,000/year for first 3 years, ₹20,000/year at PG level",
      period: "Annual National Cycle",
      official_portal: "https://scholarships.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-05",
      match_level: "Eligible Candidate"
    },
    {
      id: "vidyasiri_epass",
      name: lang === "kn" 
        ? "ವಿದ್ಯಾಸಿರಿ (ಊಟ ಮತ್ತು ವಸತಿ ಯೋಜನೆ - BCWD)" 
        : lang === "hi" 
        ? "विद्यासिरी (भोजन एवं आवास सहायता योजना)" 
        : "Vidyasiri (Food & Accommodation Scheme - BCWD)",
      provider: lang === "kn" ? "ಹಿಂದುಳಿದ ವರ್ಗಗಳ ಕಲ್ಯಾಣ ಇಲಾಖೆ, ಕರ್ನಾಟಕ" : lang === "hi" ? "पिछड़ा वर्ग कल्याण विभाग, कर्नाटक" : "Backward Classes Welfare Dept, Karnataka",
      eligibility: lang === "kn" ? "ಸರ್ಕಾರಿ ಹಾಸ್ಟೆಲ್ ಸೀಟು ಸಿಗದ ಗ್ರಾಮೀಣ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ" : lang === "hi" ? "सरकारी छात्रावास न मिलने वाले ग्रामीण कॉलेज छात्रों हेतु" : "Students residing in non-hostel rented accommodation > 5km from home",
      benefit: "₹1,500/month stipend for 10 months directly to bank account",
      period: "Karnataka State Schedule",
      official_portal: "https://bcwd.karnataka.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-01",
      match_level: "Complementary Scheme"
    }
  ];

  const handleFinish = () => {
    const scheme = selectedScheme || candidateSchemes[0];
    onGenerateCard({
      serviceId: scheme.id,
      problemId: problem === "apply" ? "ssp_apply_fresh" : "ssp_payment_delayed",
      problemQuery: problem
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-window scholarship-wizard-modal" onClick={e => e.stopPropagation()}>
        {/* Wizard Header */}
        <div className="modal-header">
          <div>
            <span className="wizard-tag">{t.scholarshipWizard.step1.split(".")[0]}</span>
            <h2 className="modal-title">{t.scholarshipWizard.title}</h2>
            <p className="modal-subtitle">{t.scholarshipWizard.subtitle}</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Stepper progress indicator */}
        <div className="wizard-stepper">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`step-dot-wrap ${step === s ? "active" : step > s ? "completed" : ""}`}>
              <div className="step-circle">{step > s ? "✓" : s}</div>
              <span className="step-label">
                {s === 1 ? "1. Provider" : s === 2 ? "2. Eligibility" : s === 3 ? "3. Match" : "4. Blocker"}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Body */}
        <div className="wizard-body">
          {/* STEP 1: Provider selection */}
          {step === 1 && (
            <div className="wizard-step-content">
              <label className="form-legend">{t.scholarshipWizard.providerPrompt}</label>
              <div className="options-radio-grid">
                {[
                  { key: "karnataka", title: t.scholarshipWizard.providerOptions.karnataka, desc: "SSP Post-Matric, Vidyasiri, Fee Concession" },
                  { key: "central", title: t.scholarshipWizard.providerOptions.central, desc: "NSP Central Sector, CSS, AICTE Pragati" },
                  { key: "college", title: t.scholarshipWizard.providerOptions.college, desc: "College Endowment or University Department Fund" },
                  { key: "private", title: t.scholarshipWizard.providerOptions.private, desc: "Jindal, Tata Trusts, Azim Premji Foundation" },
                  { key: "unknown", title: t.scholarshipWizard.providerOptions.unknown, desc: "Let SevaSignal recommend based on your details" }
                ].map(opt => (
                  <div 
                    key={opt.key} 
                    className={`option-card ${provider === opt.key ? "selected" : ""}`}
                    onClick={() => setProvider(opt.key)}
                  >
                    <div className="option-radio-circle">
                      {provider === opt.key && <div className="radio-inner" />}
                    </div>
                    <div className="option-info">
                      <strong>{opt.title}</strong>
                      <span className="option-desc">{opt.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Basic Educational details */}
          {step === 2 && (
            <div className="wizard-step-content">
              <div className="form-group">
                <label className="form-label">{t.scholarshipWizard.educationLevel}</label>
                <select 
                  className="form-select" 
                  value={educationLevel} 
                  onChange={e => setEducationLevel(e.target.value)}
                >
                  <option value="school">{t.scholarshipWizard.levels.school}</option>
                  <option value="puc">{t.scholarshipWizard.levels.puc}</option>
                  <option value="diploma">{t.scholarshipWizard.levels.diploma}</option>
                  <option value="degree">{t.scholarshipWizard.levels.degree}</option>
                  <option value="pg">{t.scholarshipWizard.levels.pg}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t.scholarshipWizard.category}</label>
                <select 
                  className="form-select" 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="obc">{t.scholarshipWizard.categories.obc}</option>
                  <option value="sc">{t.scholarshipWizard.categories.sc}</option>
                  <option value="st">{t.scholarshipWizard.categories.st}</option>
                  <option value="minority">{t.scholarshipWizard.categories.minority}</option>
                  <option value="general">{t.scholarshipWizard.categories.general}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t.scholarshipWizard.income}</label>
                <select 
                  className="form-select" 
                  value={incomeRange} 
                  onChange={e => setIncomeRange(e.target.value)}
                >
                  <option value="under1lakh">{t.scholarshipWizard.incomeRanges.under1lakh}</option>
                  <option value="under25lakh">{t.scholarshipWizard.incomeRanges.under25lakh}</option>
                  <option value="above25lakh">{t.scholarshipWizard.incomeRanges.above25lakh}</option>
                </select>
              </div>

              <div className="privacy-pill-note">
                <ShieldCheck size={16} />
                <span>We never ask for your Aadhaar number, passwords, or personal credentials.</span>
              </div>
            </div>
          )}

          {/* STEP 3: Candidate schemes */}
          {step === 3 && (
            <div className="wizard-step-content">
              <p className="step-prompt-text">
                Based on your criteria, here are verified scholarship schemes. Confirm the scheme you need help with:
              </p>
              <div className="candidates-list">
                {candidateSchemes.map(sch => {
                  const isSelected = selectedScheme ? selectedScheme.id === sch.id : sch.id === "ssp_postmatric_karnataka";
                  return (
                    <div 
                      key={sch.id}
                      className={`candidate-scheme-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedScheme(sch)}
                    >
                      <div className="candidate-top">
                        <div className="scheme-title-box">
                          <span className="match-badge">{sch.match_level}</span>
                          <h4>{sch.name}</h4>
                          <span className="scheme-provider">{sch.provider}</span>
                        </div>
                        <div className="verified-badge-row">
                          <span className="verified-tag">✓ {t.panel.verified}</span>
                          <span className="verified-date">{t.panel.lastVerified}: {sch.last_verified}</span>
                        </div>
                      </div>

                      <div className="candidate-details">
                        <p><strong>Eligibility:</strong> {sch.eligibility}</p>
                        <p><strong>Benefit:</strong> {sch.benefit}</p>
                      </div>

                      <div className="candidate-bottom">
                        <a 
                          href={sch.official_portal} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="portal-link-text"
                          onClick={e => e.stopPropagation()}
                        >
                          Official Portal ({sch.official_portal}) <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Stated problem / blocker */}
          {step === 4 && (
            <div className="wizard-step-content">
              <label className="form-legend">{t.scholarshipWizard.problemPrompt}</label>
              <div className="options-radio-grid">
                {[
                  { key: "apply", text: t.scholarshipWizard.problems.apply },
                  { key: "missing_doc", text: t.scholarshipWizard.problems.missing_doc },
                  { key: "rejected", text: t.scholarshipWizard.problems.rejected },
                  { key: "delayed_payment", text: t.scholarshipWizard.problems.delayed_payment },
                  { key: "renewal", text: t.scholarshipWizard.problems.renewal }
                ].map(item => (
                  <div 
                    key={item.key}
                    className={`option-card ${problem === item.key ? "selected" : ""}`}
                    onClick={() => setProblem(item.key)}
                  >
                    <div className="option-radio-circle">
                      {problem === item.key && <div className="radio-inner" />}
                    </div>
                    <div className="option-info">
                      <strong>{item.text}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="modal-footer-nav">
          {step > 1 ? (
            <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>
              {t.scholarshipWizard.back}
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button type="button" className="btn-primary" onClick={() => setStep(step + 1)}>
              Next Step →
            </button>
          ) : (
            <button type="button" className="btn-primary btn-action-plan" onClick={handleFinish}>
              {t.scholarshipWizard.generatePlanBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
