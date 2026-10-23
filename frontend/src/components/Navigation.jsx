import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, GraduationCap, FileText, Bus, AlertCircle, Shield, ShoppingBag, Sprout, Zap } from "lucide-react";

export default function Navigation({ 
  t, 
  onSelectCategory, 
  onOpenScholarshipWizard,
  isMobileNavOpen, 
  setIsMobileNavOpen 
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target)) {
        setIsMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (catId, isWizard = false) => {
    if (isWizard) {
      onOpenScholarshipWizard();
    } else {
      onSelectCategory(catId);
    }
    setIsMoreOpen(false);
    setIsMobileNavOpen(false);
  };

  return (
    <nav className="main-nav-bar" aria-label="Main service navigation">
      <div className={`nav-inner ${isMobileNavOpen ? "mobile-open" : ""}`}>
        <ul className="nav-list">
          {/* 1. Education & Scholarships */}
          <li className="nav-item">
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => handleNavClick("education_scholarships", true)}
            >
              {t.nav.scholarships}
            </button>
          </li>

          {/* 2. Certificates */}
          <li className="nav-item">
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => handleNavClick("certificates_documents")}
            >
              {t.nav.certificates}
            </button>
          </li>

          {/* 3. Transport */}
          <li className="nav-item">
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => handleNavClick("transport_travel")}
            >
              {t.nav.transport}
            </button>
          </li>

          {/* 4. Grievances */}
          <li className="nav-item">
            <button
              type="button"
              className="nav-link-btn"
              onClick={() => handleNavClick("grievances_complaints")}
            >
              {t.nav.grievances}
            </button>
          </li>

          {/* 5. More Services Dropdown */}
          <li className="nav-item dropdown-item" ref={moreDropdownRef}>
            <button
              type="button"
              className="nav-link-btn dropdown-trigger"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              aria-expanded={isMoreOpen}
            >
              <span>{t.nav.moreServices}</span>
              <ChevronDown size={15} className={`chevron ${isMoreOpen ? "rotated" : ""}`} />
            </button>

            {isMoreOpen && (
              <div className="more-services-menu">
                <button
                  type="button"
                  className="dropdown-link"
                  onClick={() => handleNavClick("pensions_welfare")}
                >
                  <Shield size={16} className="item-icon" />
                  <span>{t.nav.pensions}</span>
                </button>

                <button
                  type="button"
                  className="dropdown-link"
                  onClick={() => handleNavClick("ration_food")}
                >
                  <ShoppingBag size={16} className="item-icon" />
                  <span>{t.nav.ration}</span>
                </button>

                <button
                  type="button"
                  className="dropdown-link"
                  onClick={() => handleNavClick("agriculture_farmer")}
                >
                  <Sprout size={16} className="item-icon" />
                  <span>{t.nav.agriculture}</span>
                </button>

                <button
                  type="button"
                  className="dropdown-link"
                  onClick={() => handleNavClick("utilities_local")}
                >
                  <Zap size={16} className="item-icon" />
                  <span>{t.nav.utilities}</span>
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
