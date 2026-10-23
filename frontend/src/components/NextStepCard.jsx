import React, { useState } from "react";
import { 
  CheckSquare, 
  ExternalLink, 
  Copy, 
  Check, 
  Printer, 
  Download,
  MessageSquare, 
  ShieldCheck, 
  AlertCircle,
  X,
  PhoneCall
} from "lucide-react";

export function openPrintableActionPlan(cardData, lang = "en") {
  if (!cardData || !cardData.service_name) {
    alert("No valid action plan content to export.");
    return;
  }

  const printWindow = window.open("", "_blank", "width=850,height=1000");
  if (!printWindow) {
    window.print();
    return;
  }

  const isKn = lang === "kn";
  const isHi = lang === "hi";

  const labels = {
    brand: "SevaSignal — Public Services Made Easier",
    docTitle: isKn ? "ನಾಗರಿಕ ಕ್ರಿಯಾ ಯೋಜನೆ" : isHi ? "नागरिक कार्य योजना" : "Citizen Action Plan & Guidance",
    situation: isKn ? "ನಿಮ್ಮ ಸನ್ನಿವೇಶ:" : isHi ? "आपकी स्थिति:" : "Your Situation / Problem:",
    procedure: isKn ? "ವಿವರಣೆ ಮತ್ತು ಪ್ರಕ್ರಿಯೆ:" : isHi ? "प्रक्रिया और विवरण:" : "Overview & Official Procedure:",
    action: isKn ? "ಶಿಫಾರಸು ಮಾಡಿದ ತಕ್ಷಣದ ಕ್ರಮ:" : isHi ? "अनुशंसित तत्काल कार्रवाई:" : "Recommended Immediate Action:",
    steps: isKn ? "ಹಂತ-ಹಂತದ ಕ್ರಿಯಾ ಯೋಜನೆ:" : isHi ? "चरण-दर-चरण कार्य योजना:" : "Actionable Step-by-Step Checklist:",
    docs: isKn ? "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು:" : isHi ? "आवश्यक दस्तावेज:" : "Required Documents Checklist:",
    escalation: isKn ? "ಅಧಿಕೃತ ಸಹಾಯವಾಣಿ ಮತ್ತು ಸಂಪರ್ಕ:" : isHi ? "आधिकारिक हेल्पलाइन और संपर्क:" : "Official Escalation & Helplines:",
    portal: isKn ? "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್:" : isHi ? "आधिकारिक सरकारी पोर्टल:" : "Verified Official Portal:",
    verifiedOn: isKn ? "ಪರಿಶೀಲಿಸಿದ ದಿನಾಂಕ:" : isHi ? "सत्यापन तिथि:" : "Official Verification Date:",
    disclaimerTitle: isKn ? "ಸ್ವತಂತ್ರ ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆ ಸೂಚನೆ:" : isHi ? "स्वतंत्र छात्र परियोजना सूचना:" : "Independent Project Notice:"
  };

  const stepsHtml = (cardData.checklist || []).map((step, idx) => `
    <div style="display: flex; align-items: flex-start; margin-bottom: 8px; page-break-inside: avoid;">
      <span style="display: inline-block; width: 15px; height: 15px; border: 1.5px solid #142957; border-radius: 3px; margin-right: 10px; margin-top: 2px; flex-shrink: 0;"></span>
      <span style="font-size: 13.5px; color: #1F2937; line-height: 1.45;"><strong>Step ${idx + 1}:</strong> ${step}</span>
    </div>
  `).join("");

  const docsHtml = (cardData.required_documents || []).map(doc => `
    <li style="margin-bottom: 6px; font-size: 13px; color: #374151;">${doc}</li>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="${lang || 'en'}">
<head>
  <meta charset="utf-8">
  <title>${cardData.service_name} — Action Plan</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Noto Sans Kannada", "Noto Sans Devanagari", Arial, sans-serif;
      color: #1F2937;
      background: #FFFFFF;
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #142957;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      color: #142957;
      margin: 0;
      letter-spacing: -0.3px;
    }
    .brand-sub {
      font-size: 11px;
      color: #64748B;
      margin: 2px 0 0 0;
    }
    .badge {
      font-size: 11px;
      font-weight: 600;
      color: #047857;
      background: #ECFDF5;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #A7F3D0;
    }
    .service-banner {
      background: #F8FAFC;
      border-left: 4px solid #142957;
      padding: 12px 16px;
      margin-bottom: 16px;
      border-radius: 0 6px 6px 0;
    }
    .service-name {
      font-size: 20px;
      font-weight: 700;
      color: #142957;
      margin: 0 0 4px 0;
    }
    .category-label {
      font-size: 12px;
      font-weight: 600;
      color: #D97706;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section {
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748B;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .problem-box {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #92400E;
      margin-bottom: 8px;
    }
    .action-box {
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      padding: 12px 14px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #1E40AF;
    }
    .checklist-container {
      background: #FAFAFA;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 12px 14px;
    }
    .docs-list {
      margin: 0;
      padding-left: 18px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .info-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 10px 12px;
      border-radius: 6px;
      font-size: 12px;
    }
    .info-card strong {
      display: block;
      color: #142957;
      margin-bottom: 3px;
    }
    .info-card a {
      color: #2563EB;
      text-decoration: underline;
      word-break: break-all;
    }
    .disclaimer {
      border-top: 1px solid #E2E8F0;
      padding-top: 10px;
      margin-top: 20px;
      font-size: 10.5px;
      color: #64748B;
      line-height: 1.4;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">${labels.brand}</h1>
      <p class="brand-sub">${labels.docTitle} · Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    <div class="badge">
      ${labels.verifiedOn} ${cardData.last_verified || "Verified"}
    </div>
  </div>

  <div class="service-banner">
    <span class="category-label">${cardData.category_title}</span>
    <h2 class="service-name">${cardData.service_name}</h2>
  </div>

  <div class="section">
    <div class="section-title">${labels.situation}</div>
    <div class="problem-box">"${cardData.user_problem}"</div>
    <p style="font-size: 13.5px; color: #374151; margin: 4px 0 0 0;">${cardData.explanation}</p>
  </div>

  <div class="section">
    <div class="section-title">${labels.action}</div>
    <div class="action-box">${cardData.recommended_action}</div>
  </div>

  ${cardData.checklist && cardData.checklist.length > 0 ? `
    <div class="section">
      <div class="section-title">${labels.steps}</div>
      <div class="checklist-container">
        ${stepsHtml}
      </div>
    </div>
  ` : ""}

  ${cardData.required_documents && cardData.required_documents.length > 0 ? `
    <div class="section">
      <div class="section-title">${labels.docs}</div>
      <ul class="docs-list">
        ${docsHtml}
      </ul>
    </div>
  ` : ""}

  <div class="info-grid">
    <div class="info-card">
      <strong>${labels.portal}</strong>
      <a href="${cardData.portal_url}">${cardData.portal_url}</a>
    </div>
    <div class="info-card">
      <strong>${labels.escalation}</strong>
      <span>${cardData.escalation_route || "Toll-Free Helpline: 1902"}</span>
    </div>
  </div>

  <div class="disclaimer">
    <strong>${labels.disclaimerTitle}</strong> ${cardData.disclaimer}
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export default function NextStepCard({ cardData, onClose, onAskAi, t }) {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  if (!cardData) return null;

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopy = () => {
    const textToCopy = `
SEVASIGNAL ACTION PLAN: ${cardData.service_name}
Problem: ${cardData.user_problem}
Recommended Action: ${cardData.recommended_action}

Actionable Steps:
${cardData.checklist?.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Required Documents:
${cardData.required_documents?.map(d => `- ${d}`).join("\n")}

Official Portal: ${cardData.portal_url}
Helpline / Escalation: ${cardData.escalation_route}
Verification Date: ${cardData.last_verified}

Disclaimer: ${cardData.disclaimer}
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    openPrintableActionPlan(cardData, cardData.language || "en");
  };

  const handleDownloadPdf = () => {
    openPrintableActionPlan(cardData, cardData.language || "en");
  };

  return (
    <div className="next-step-overlay" role="dialog" aria-modal="true">
      <div className="next-step-card-container">
        {/* Card Header */}
        <div className="card-top-bar">
          <div className="card-title-group">
            <span className="card-badge-pill">
              <ShieldCheck size={14} />
              <span>{t.nextStepCard.verifiedNotice} {cardData.last_verified}</span>
            </span>
            <h2 className="card-service-title">{cardData.service_name}</h2>
            <span className="card-category-label">{cardData.category_title}</span>
          </div>
          {onClose && (
            <button type="button" className="card-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          )}
        </div>

        {/* User Situation & Explanation */}
        <div className="card-section situation-section">
          <span className="section-label">{t.nextStepCard.problemLabel}</span>
          <p className="user-problem-text">"{cardData.user_problem}"</p>
          <p className="service-explanation">{cardData.explanation}</p>
        </div>

        {/* Immediate Recommended Action */}
        <div className="card-section action-highlight-section">
          <span className="section-label">{t.nextStepCard.actionLabel}</span>
          <p className="action-highlight-text">{cardData.recommended_action}</p>
        </div>

        {/* Step-by-Step Checklist */}
        {cardData.checklist && cardData.checklist.length > 0 && (
          <div className="card-section checklist-section">
            <span className="section-label">{t.nextStepCard.checklistLabel}</span>
            <ul className="action-checklist">
              {cardData.checklist.map((step, idx) => (
                <li 
                  key={idx} 
                  className={`checklist-item ${checkedItems[idx] ? "completed" : ""}`}
                  onClick={() => toggleCheck(idx)}
                >
                  <div className="check-box">
                    {checkedItems[idx] && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                  <span className="step-text">
                    <strong>Step {idx + 1}:</strong> {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Documents */}
        {cardData.required_documents && cardData.required_documents.length > 0 && (
          <div className="card-section docs-section">
            <span className="section-label">{t.nextStepCard.documentsLabel}</span>
            <div className="docs-tags-grid">
              {cardData.required_documents.map((doc, i) => (
                <div key={i} className="doc-pill">
                  <CheckSquare size={13} className="doc-icon" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Helpline and Escalation Route */}
        {cardData.escalation_route && (
          <div className="card-section escalation-section">
            <div className="escalation-inner">
              <PhoneCall size={18} className="escalation-icon" />
              <div>
                <strong>{t.nextStepCard.escalationLabel}</strong>
                <p className="escalation-detail">{cardData.escalation_route}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="card-actions-toolbar">
          <div className="toolbar-left">
            <a 
              href={cardData.portal_url} 
              target="_blank" 
              rel="noreferrer" 
              className="btn-toolbar btn-portal"
            >
              <span>{t.nextStepCard.openPortal}</span>
              <ExternalLink size={15} />
            </a>

            <button type="button" className="btn-toolbar btn-copy" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check size={15} />
                  <span>{t.nextStepCard.copied}</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>{t.nextStepCard.copy}</span>
                </>
              )}
            </button>

            <button type="button" className="btn-toolbar btn-pdf" onClick={handleDownloadPdf}>
              <Download size={15} />
              <span>PDF</span>
            </button>

            <button type="button" className="btn-toolbar btn-print" onClick={handlePrint}>
              <Printer size={15} />
              <span>{t.nextStepCard.print}</span>
            </button>
          </div>

          <div className="toolbar-right">
            <button 
              type="button" 
              className="btn-toolbar btn-ask-ai"
              onClick={() => onAskAi(cardData)}
            >
              <MessageSquare size={15} />
              <span>{t.nextStepCard.askAi}</span>
            </button>
          </div>
        </div>

        {/* Verified Disclaimer Notice */}
        <div className="card-disclaimer-footer">
          <AlertCircle size={14} />
          <span>{cardData.disclaimer}</span>
        </div>
      </div>
    </div>
  );
}
