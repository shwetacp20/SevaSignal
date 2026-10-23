import React from "react";
import { Search, Menu, X } from "lucide-react";
import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";

export default function Header({ 
  currentLang, 
  onLanguageChange, 
  onOpenSearch, 
  onOpenAbout, 
  onOpenHelp,
  onResetHome,
  t,
  isMobileNavOpen,
  setIsMobileNavOpen
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Left: Brand Logo & Wordmark */}
        <Logo size="default" onClick={onResetHome} />

        {/* Right Navigation & Tools */}
        <div className="header-right">
          <nav className="header-nav-links" aria-label="Utility navigation">
            <button 
              type="button" 
              className="nav-text-btn"
              onClick={onOpenAbout}
            >
              {t.nav.about}
            </button>
            <button 
              type="button" 
              className="nav-text-btn"
              onClick={onOpenHelp}
            >
              {t.nav.help}
            </button>
          </nav>

          {/* Multilingual Selector: EN | ಕನ್ನಡ */}
          <LanguageSelector 
            currentLang={currentLang} 
            onChange={onLanguageChange} 
          />

          {/* Circular Search Button matching screenshot */}
          <button 
            type="button" 
            className="search-circle-btn"
            onClick={onOpenSearch}
            title={t.nav.search}
            aria-label={t.nav.search}
          >
            <Search size={18} strokeWidth={2.2} />
          </button>

          {/* Mobile hamburger toggle */}
          <button 
            type="button" 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label={isMobileNavOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
