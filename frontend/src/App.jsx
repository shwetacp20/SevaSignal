import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import MainServicePanel from "./components/MainServicePanel";
import SecondServiceSection from "./components/SecondServiceSection";
import ServiceModal from "./components/ServiceModal";
import ScholarshipWizard from "./components/ScholarshipWizard";
import NextStepCard from "./components/NextStepCard";
import SearchOverlay from "./components/SearchOverlay";
import ChatAssistant from "./components/ChatAssistant";
import InfoModal from "./components/InfoModal";
import Footer from "./components/Footer";

import enLocale from "./locales/en.json";
import knLocale from "./locales/kn.json";
import hiLocale from "./locales/hi.json";

import { fetchCategories, fetchGuidance, getOfflineCategories } from "./services/api";
import { Sparkles, ArrowUp } from "lucide-react";
import "./App.css";

const LOCALES = {
  en: enLocale,
  kn: knLocale,
  hi: hiLocale
};

export default function App() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("sevasignal_lang") || "en";
  });

  // Synchronous initialization with 0ms delay
  const [categories, setCategories] = useState(() => {
    const initialLang = localStorage.getItem("sevasignal_lang") || "en";
    return getOfflineCategories(initialLang);
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeGuidanceCard, setActiveGuidanceCard] = useState(null);
  const [isScholarshipWizardOpen, setIsScholarshipWizardOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState("");
  const [infoModalType, setInfoModalType] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const t = LOCALES[lang] || LOCALES.en;

  // Persist language and set document lang attribute
  useEffect(() => {
    localStorage.setItem("sevasignal_lang", lang);
    document.documentElement.lang = lang;
    document.title = `${t.brand.name} — ${t.brand.tagline}`;
  }, [lang, t]);

  // Load categories
  useEffect(() => {
    async function loadData() {
      const cats = await fetchCategories(lang);
      setCategories(cats);
    }
    loadData();
  }, [lang]);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
  };

  const handleScrollToServices = () => {
    const el = document.getElementById("service-panel");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategory = (cat) => {
    if (typeof cat === "string") {
      const found = categories.find(c => c.id === cat || c.slug === cat);
      if (found) setSelectedCategory(found);
    } else {
      setSelectedCategory(cat);
    }
  };

  const handleAskAiFromCard = (cardData) => {
    setChatInitialQuery(`Tell me more about ${cardData.service_name} for the issue: "${cardData.user_problem}"`);
    setIsChatOpen(true);
  };

  const handleAskAiGeneral = (query) => {
    setChatInitialQuery(query);
    setIsChatOpen(true);
  };

  const handleSelectGuidance = (cardData) => {
    setSelectedCategory(null);
    setActiveGuidanceCard(cardData);
  };

  const handleWizardGeneratedCard = async ({ serviceId, problemId, problemQuery }) => {
    const card = await fetchGuidance(serviceId, problemId, problemQuery, lang);
    setActiveGuidanceCard(card);
  };

  return (
    <div className={`sevasignal-app lang-${lang}`}>
      {/* 1. Header (White, ~85px) */}
      <Header
        currentLang={lang}
        onLanguageChange={handleLanguageChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAbout={() => setInfoModalType("about")}
        onOpenHelp={() => setInfoModalType("help")}
        onResetHome={() => {
          setSelectedCategory(null);
          setActiveGuidanceCard(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        t={t}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
      />

      {/* 2. Main Navigation Bar (Dark Navy, ~53px) */}
      <Navigation
        t={t}
        onSelectCategory={handleSelectCategory}
        onOpenScholarshipWizard={() => setIsScholarshipWizardOpen(true)}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
      />

      <main className="main-content">
        {/* 3. Hero Section (Mint-green with citizen framing illustrations) */}
        <Hero
          t={t}
          onFindServiceClick={handleScrollToServices}
        />

        {/* 4. Overlapping Main Service Panel (First 4 cards) */}
        <MainServicePanel
          categories={categories}
          onSelectCategory={handleSelectCategory}
          t={t}
        />

        {/* 5. Second Service Section (Remaining 4 cards) */}
        <SecondServiceSection
          categories={categories}
          onSelectCategory={handleSelectCategory}
          t={t}
        />
      </main>

      {/* 6. Polished Footer */}
      <Footer
        t={t}
        onOpenModal={(type) => setInfoModalType(type)}
      />

      {/* Floating Action: AI Assistant Launcher */}
      <div className="floating-assistant-wrap">
        <button
          type="button"
          className="btn-floating-ai"
          onClick={() => {
            setChatInitialQuery("");
            setIsChatOpen(!isChatOpen);
          }}
          aria-label={t.chat.title}
          title={t.chat.title}
        >
          <Sparkles size={20} className="sparkle-ai-icon" />
          <span className="floating-ai-label">{t.chat.title.split(" ")[0]} AI</span>
        </button>
      </div>

      {/* Modals & Overlays */}
      {selectedCategory && (
        <ServiceModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onSelectGuidance={handleSelectGuidance}
          onOpenWizard={() => setIsScholarshipWizardOpen(true)}
          t={t}
          lang={lang}
        />
      )}

      {isScholarshipWizardOpen && (
        <ScholarshipWizard
          t={t}
          lang={lang}
          onClose={() => setIsScholarshipWizardOpen(false)}
          onGenerateCard={handleWizardGeneratedCard}
        />
      )}

      {activeGuidanceCard && (
        <NextStepCard
          cardData={activeGuidanceCard}
          onClose={() => setActiveGuidanceCard(null)}
          onAskAi={handleAskAiFromCard}
          t={t}
        />
      )}

      {isSearchOpen && (
        <SearchOverlay
          onClose={() => setIsSearchOpen(false)}
          onSelectService={(s) => {
            fetchGuidance(s.id, null, null, lang).then(card => setActiveGuidanceCard(card));
          }}
          onAskAi={handleAskAiGeneral}
          t={t}
          lang={lang}
        />
      )}

      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialQuery={chatInitialQuery}
        onOpenGuidanceCard={(card) => setActiveGuidanceCard(card)}
        t={t}
        lang={lang}
      />

      {infoModalType && (
        <InfoModal
          type={infoModalType}
          onClose={() => setInfoModalType(null)}
          t={t}
        />
      )}
    </div>
  );
}
