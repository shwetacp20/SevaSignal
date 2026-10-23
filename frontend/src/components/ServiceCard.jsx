import React from "react";
import { ArrowRight, Shield, ShoppingBag, Sprout, Zap, HeartHandshake, Wheat, Home, PhoneCall } from "lucide-react";
import cardScholarshipsImg from "../assets/card_scholarships.png";
import cardCertificatesImg from "../assets/card_certificates.png";
import cardTransportImg from "../assets/card_transport.png";
import cardGrievancesImg from "../assets/card_grievances.png";

export default function ServiceCard({ category, onClick, index }) {
  const getIllustration = () => {
    switch (category.id) {
      case "education_scholarships":
        return <img src={cardScholarshipsImg} alt={category.localized_short_title} className="card-illustration-img" />;
      case "certificates_documents":
        return <img src={cardCertificatesImg} alt={category.localized_short_title} className="card-illustration-img" />;
      case "transport_travel":
        return <img src={cardTransportImg} alt={category.localized_short_title} className="card-illustration-img" />;
      case "grievances_complaints":
        return <img src={cardGrievancesImg} alt={category.localized_short_title} className="card-illustration-img" />;
      case "pensions_welfare":
        return (
          <div className="card-svg-fallback bg-rose-tint">
            <div className="svg-decor-halo"></div>
            <HeartHandshake size={54} color="#E11D48" strokeWidth={1.7} />
          </div>
        );
      case "ration_food":
        return (
          <div className="card-svg-fallback bg-amber-tint">
            <div className="svg-decor-halo"></div>
            <ShoppingBag size={54} color="#D97706" strokeWidth={1.7} />
          </div>
        );
      case "agriculture_farmer":
        return (
          <div className="card-svg-fallback bg-emerald-tint">
            <div className="svg-decor-halo"></div>
            <Sprout size={54} color="#059669" strokeWidth={1.7} />
          </div>
        );
      case "utilities_local":
        return (
          <div className="card-svg-fallback bg-teal-tint">
            <div className="svg-decor-halo"></div>
            <Zap size={54} color="#0D9488" strokeWidth={1.7} />
          </div>
        );
      default:
        return null;
    }
  };

  const getArrowBtnClass = () => {
    switch (category.id) {
      case "education_scholarships": return "arrow-btn-blue";
      case "certificates_documents": return "arrow-btn-green";
      case "transport_travel": return "arrow-btn-orange";
      case "grievances_complaints": return "arrow-btn-purple";
      case "pensions_welfare": return "arrow-btn-rose";
      case "ration_food": return "arrow-btn-amber";
      case "agriculture_farmer": return "arrow-btn-emerald";
      case "utilities_local": return "arrow-btn-teal";
      default: return "arrow-btn-blue";
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`service-card card-theme-${category.color_theme}`}
      style={{ backgroundColor: category.bg_color }}
      onClick={() => onClick(category)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(category);
        }
      }}
      aria-label={`Select ${category.localized_title}`}
    >
      <div className="card-top-art">
        {getIllustration()}
      </div>

      <div className="card-body">
        <h3 className="card-title">
          {category.localized_short_title || category.localized_title}
        </h3>
        <p className="card-description">
          {category.localized_description}
        </p>
      </div>

      <div className="card-footer-action">
        <div className={`card-arrow-circle ${getArrowBtnClass()}`}>
          <ArrowRight size={18} strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}
