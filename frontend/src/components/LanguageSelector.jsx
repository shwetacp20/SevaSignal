import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "kn", label: "ಕನ್ನಡ", name: "ಕನ್ನಡ (Kannada)" },
  { code: "hi", label: "हिन्दी", name: "हिन्दी (Hindi)" }
];

export default function LanguageSelector({ currentLang, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="lang-selector-container" ref={containerRef} style={{ position: "relative" }}>
      {/* Pill button matching reference: "EN | ಕನ್ನಡ" */}
      <button
        type="button"
        className="lang-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change Language"
        aria-expanded={isOpen}
      >
        <span className="lang-text-display">
          <strong>{currentObj.label}</strong>
          <span style={{ opacity: 0.5, margin: "0 4px" }}>|</span>
          <span style={{ fontSize: "14px", color: "#475569" }}>
            {currentLang === "en" ? "ಕನ್ನಡ" : currentLang === "kn" ? "हिन्दी" : "EN"}
          </span>
        </span>
        <ChevronDown size={14} className={`chevron-icon ${isOpen ? "rotate" : ""}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              className={`lang-option ${currentLang === lang.code ? "active" : ""}`}
              onClick={() => {
                onChange(lang.code);
                setIsOpen(false);
              }}
            >
              <span className="lang-option-name">{lang.name}</span>
              {currentLang === lang.code && <Check size={16} className="lang-check-icon" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
