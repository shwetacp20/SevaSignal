import React from "react";
import Logo from "./Logo";
import { AlertCircle, ExternalLink, Heart } from "lucide-react";

export default function Footer({ t, onOpenModal }) {
  return (
    <footer className="site-footer">
      <div className="footer-top-container">
        {/* Brand & Mission */}
        <div className="footer-col brand-col">
          <Logo size="default" />
          <p className="footer-brand-desc">
            {t.footer.desc}
          </p>
          <div className="footer-disclaimer-badge">
            <AlertCircle size={15} />
            <span>{t.panel.disclaimer}</span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="footer-col links-col">
          <h4 className="footer-col-title">{t.footer.links}</h4>
          <ul className="footer-nav-list">
            <li>
              <button type="button" className="footer-link-btn" onClick={() => onOpenModal("about")}>
                {t.footer.about}
              </button>
            </li>
            <li>
              <button type="button" className="footer-link-btn" onClick={() => onOpenModal("help")}>
                {t.footer.faqs}
              </button>
            </li>
            <li>
              <button type="button" className="footer-link-btn" onClick={() => onOpenModal("privacy")}>
                {t.footer.privacy}
              </button>
            </li>
            <li>
              <button type="button" className="footer-link-btn" onClick={() => onOpenModal("terms")}>
                {t.footer.terms}
              </button>
            </li>
            <li>
              <button type="button" className="footer-link-btn" onClick={() => onOpenModal("contact")}>
                {t.footer.contact}
              </button>
            </li>
          </ul>
        </div>

        {/* Official State Catalog Starting Points */}
        <div className="footer-col portals-col">
          <h4 className="footer-col-title">Official Government Starting Portals</h4>
          <ul className="official-portals-list">
            <li>
              <a href="https://sevasindhu.karnataka.gov.in/" target="_blank" rel="noreferrer">
                <span>Karnataka Seva Sindhu</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://scholarships.gov.in/" target="_blank" rel="noreferrer">
                <span>National Scholarship Portal</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://ssp.postmatric.karnataka.gov.in/" target="_blank" rel="noreferrer">
                <span>Karnataka SSP Post-Matric</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://pgportal.gov.in/" target="_blank" rel="noreferrer">
                <span>Central CPGRAMS Grievances</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://parivahan.gov.in/" target="_blank" rel="noreferrer">
                <span>Parivahan Sewa (Transport)</span>
                <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Prominent Disclaimer Notice Box */}
      <div className="footer-bottom-bar">
        <div className="disclaimer-academic-callout">
          <strong>{t.footer.disclaimerTitle}:</strong> {t.footer.disclaimerText}
        </div>
        <div className="copyright-row">
          <span>© 2026 SevaSignal · {t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
