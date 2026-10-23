import React from "react";
import ServiceCard from "./ServiceCard";

export default function SecondServiceSection({ categories, onSelectCategory }) {
  // Second section displays categories 5, 6, 7, 8 without the removed heading/underline
  const secondaryCategories = categories.slice(4, 8);

  if (secondaryCategories.length === 0) return null;

  return (
    <section className="second-service-section" id="more-services" aria-label="Additional Public Services">
      <div className="section-container">
        <div className="service-cards-row">
          {secondaryCategories.map((cat, idx) => (
            <ServiceCard 
              key={cat.id} 
              category={cat} 
              index={idx + 4}
              onClick={onSelectCategory} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
