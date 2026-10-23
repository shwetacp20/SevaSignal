import React from "react";
import { X, HelpCircle, ShieldAlert, FileText, Info, Mail } from "lucide-react";

export default function InfoModal({ type, onClose, t }) {
  if (!type) return null;

  const getContent = () => {
    switch (type) {
      case "about":
        return {
          icon: <Info size={24} color="#142957" />,
          title: t.modals.aboutTitle,
          body: (
            <div className="info-paragraphs">
              <p>{t.modals.aboutP1}</p>
              <p>{t.modals.aboutP2}</p>
              <div className="info-highlight-box">
                <ShieldAlert size={18} />
                <p>{t.modals.aboutP3}</p>
              </div>
            </div>
          )
        };
      case "help":
        return {
          icon: <HelpCircle size={24} color="#142957" />,
          title: t.modals.helpTitle,
          body: (
            <div className="faqs-list">
              <div className="faq-item">
                <h4>{t.modals.faq1Q}</h4>
                <p>{t.modals.faq1A}</p>
              </div>
              <div className="faq-item">
                <h4>{t.modals.faq2Q}</h4>
                <p>{t.modals.faq2A}</p>
              </div>
              <div className="faq-item">
                <h4>{t.modals.faq3Q}</h4>
                <p>{t.modals.faq3A}</p>
              </div>
            </div>
          )
        };
      case "privacy":
        return {
          icon: <FileText size={24} color="#142957" />,
          title: t.modals.privacyTitle,
          body: (
            <div className="info-paragraphs">
              <p>{t.modals.privacyText}</p>
              <ul>
                <li>We do not collect Aadhaar or National ID numbers.</li>
                <li>We do not collect banking passwords, OTPs, or private credentials.</li>
                <li>Language preferences are stored strictly in your local browser storage.</li>
              </ul>
            </div>
          )
        };
      case "terms":
        return {
          icon: <FileText size={24} color="#142957" />,
          title: t.modals.termsTitle,
          body: (
            <div className="info-paragraphs">
              <p>{t.modals.termsText}</p>
              <p>{t.footer.disclaimerText}</p>
            </div>
          )
        };
      case "contact":
        return {
          icon: <Mail size={24} color="#142957" />,
          title: t.footer.contact,
          body: (
            <div className="info-paragraphs">
              <p>SevaSignal is developed by an academic team working on citizen navigation technology.</p>
              <p>For technical feedback, project queries, or research collaboration:</p>
              <div className="contact-card">
                <strong>Project Team:</strong> Team SevaSignal (Academic Demonstration)<br />
                <strong>Email:</strong> contact@sevasignal.local (Demonstration Placeholder)<br />
                <strong>Location:</strong> Bengaluru, Karnataka, India
              </div>
            </div>
          )
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-window info-modal-window" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="info-header-title">
            {content.icon}
            <h2 className="modal-title">{content.title}</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body info-modal-body">
          {content.body}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            {t.modals.close}
          </button>
        </div>
      </div>
    </div>
  );
}
