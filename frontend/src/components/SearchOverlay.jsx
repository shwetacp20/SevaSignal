import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { searchServices } from "../services/api";

export default function SearchOverlay({ onClose, onSelectService, onAskAi, t, lang }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchServices(query, lang);
      setResults(res.results || []);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, lang]);

  const quickQueries = [
    { label: "SSP Scholarship", q: "SSP" },
    { label: "Caste Certificate", q: "Caste Certificate" },
    { label: "Student Bus Pass", q: "Bus Pass" },
    { label: "Gruha Jyothi", q: "Gruha Jyothi" },
    { label: "ಪಡಿತರ ಚೀಟಿ (Ration Card)", q: "ಪಡಿತರ" }
  ];

  return (
    <div className="search-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-window" onClick={e => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-bar-header">
          <Search size={22} className="search-icon-inside" />
          <input
            ref={inputRef}
            type="text"
            className="search-input-field"
            placeholder={t.search.placeholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button 
              type="button" 
              className="search-clear-btn"
              onClick={() => setQuery("")}
            >
              <X size={18} />
            </button>
          )}
          <button type="button" className="search-exit-btn" onClick={onClose}>
            {t.modals.close}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="quick-suggestions-box">
            <span className="quick-label">{t.search.quickFilter}</span>
            <div className="quick-pills-row">
              {quickQueries.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="quick-search-pill"
                  onClick={() => setQuery(item.q)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Area */}
        <div className="search-results-list">
          {loading && (
            <div className="search-status-text">
              <span>Searching verified public services database...</span>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="search-no-results">
              <p>{t.search.noResults}</p>
              <button
                type="button"
                className="btn-ask-ai-search"
                onClick={() => {
                  onClose();
                  onAskAi(query);
                }}
              >
                <Sparkles size={16} />
                <span>{t.search.askAi} ("{query}")</span>
              </button>
            </div>
          )}

          {!loading && results.map(s => (
            <div 
              key={s.id} 
              className="search-result-row"
              onClick={() => {
                onSelectService(s);
                onClose();
              }}
            >
              <div className="result-text-area">
                <div className="result-title-row">
                  <h4>{s.localized_name || s.name?.en}</h4>
                  <span className="result-badge">
                    <ShieldCheck size={13} />
                    <span>{t.panel.verified}</span>
                  </span>
                </div>
                <p className="result-summary">{s.localized_summary || s.summary?.en}</p>
                <span className="result-provider">{s.localized_provider || s.provider?.en}</span>
              </div>
              <div className="result-arrow-btn">
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>

        <div className="search-footer-hint">
          <span>{t.search.pressEsc}</span>
        </div>
      </div>
    </div>
  );
}
