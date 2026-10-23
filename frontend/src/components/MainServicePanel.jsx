import React from "react";
import ServiceCard from "./ServiceCard";

export default function MainServicePanel({ categories, onSelectCategory, t }) {
  // First row is strictly the first 4 categories
  const primaryCategories = categories.slice(0, 4);

  return (
    <section className="service-panel-wrapper" id="service-panel" aria-label="Primary Services">
      <div className="main-service-panel">
        <div className="panel-header">
          <h2 className="panel-title">
            {t.panel.startWithService}
          </h2>
          <div className="title-orange-bar"></div>
        </div>

        <div className="service-cards-row">
          {primaryCategories.map((cat, idx) => (
            <ServiceCard 
              key={cat.id} 
              category={cat} 
              index={idx}
              onClick={onSelectCategory} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
