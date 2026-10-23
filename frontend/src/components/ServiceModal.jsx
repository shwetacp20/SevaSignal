import React, { useState, useEffect } from "react";
import { X, ArrowRight, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { fetchServices, fetchGuidance, getOfflineServices } from "../services/api";

export default function ServiceModal({ category, onClose, onSelectGuidance, onOpenWizard, t, lang }) {
  // Synchronous initialization for 0ms instant display upon card click
  const initialList = getOfflineServices(category.id, lang);
  const [services, setServices] = useState(initialList);
  const [loading, setLoading] = useState(initialList.length === 0);
  const [selectedService, setSelectedService] = useState(initialList[0] || null);

  useEffect(() => {
    const cached = getOfflineServices(category.id, lang);
    if (cached.length > 0) {
      setServices(cached);
      setSelectedService(cached[0]);
      setLoading(false);
    }
    // Asynchronously refresh in the background without blocking the UI
    let isMounted = true;
    fetchServices(category.id, lang).then(fresh => {
      if (isMounted && fresh && fresh.length > 0) {
        setServices(fresh);
      }
    }).catch(err => {
      console.warn("Background service refresh warning:", err);
    });
    return () => { isMounted = false; };
  }, [category.id, lang]);

  const handleProblemClick = async (service, problem) => {
    const card = await fetchGuidance(service.id, problem.problem_id, null, lang);
    onSelectGuidance(card);
  };

  const handleGeneralGuidance = async (service) => {
    const card = await fetchGuidance(service.id, null, null, lang);
    onSelectGuidance(card);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-window service-modal-window" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <span className="category-pill" style={{ backgroundColor: category.bg_color, color: category.accent_color }}>
              {category.localized_short_title || category.localized_title}
            </span>
            <h2 className="modal-title">{category.localized_title}</h2>
            <p className="modal-subtitle">{category.localized_description}</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="service-modal-body">
          {category.id === "education_scholarships" && (
            <div className="special-wizard-banner">
              <div className="banner-text">
                <strong>{t.scholarshipWizard.title}</strong>
                <p>{t.scholarshipWizard.subtitle}</p>
              </div>
              <button 
                type="button" 
                className="btn-wizard-launch"
                onClick={() => {
                  onClose();
                  onOpenWizard();
                }}
              >
                Launch Scholarship Finder →
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-spinner-box">
              <div className="spinner"></div>
              <span>Loading verified service records...</span>
            </div>
          ) : services.length === 0 ? (
            <div className="empty-state-box">
              <p>No specific service records mapped yet for this category.</p>
            </div>
          ) : (
            <div className="services-interactive-view">
              {services.map(s => (
                <div key={s.id} className="service-entry-card">
                  <div className="service-entry-header">
                    <div>
                      <h3 className="service-name-text">{s.localized_name || s.name?.en}</h3>
                      <span className="service-provider-text">{s.localized_provider || s.provider?.en}</span>
                    </div>
                    <div className="service-verified-tag">
                      <ShieldCheck size={14} />
                      <span>{t.panel.verified}</span>
                    </div>
                  </div>

                  <p className="service-summary-text">{s.localized_summary || s.summary?.en}</p>

                  {/* Common blockers / problems */}
                  {s.common_problems && s.common_problems.length > 0 && (
                    <div className="problems-section">
                      <h4 className="problems-header-text">Choose your specific situation:</h4>
                      <div className="problem-buttons-list">
                        {s.common_problems.map(prob => {
                          const title = prob.problem_title?.[lang] || prob.problem_title?.en || "Guidance";
                          return (
                            <button
                              key={prob.problem_id}
                              type="button"
                              className="problem-action-pill"
                              onClick={() => handleProblemClick(s, prob)}
                            >
                              <span>{title}</span>
                              <ArrowRight size={14} className="pill-arrow" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="service-entry-footer">
                    <button
                      type="button"
                      className="btn-general-guide"
                      onClick={() => handleGeneralGuidance(s)}
                    >
                      <span>Get Complete Action Plan</span>
                      <ArrowRight size={14} />
                    </button>

                    <a
                      href={s.portal_url}
                      target="_blank"
                      rel="noreferrer"
                      className="portal-link-btn"
                    >
                      <span>Direct Official Portal</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
