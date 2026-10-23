import React from "react";
import heroLeftImg from "../assets/hero_citizens_left.png";
import heroRightImg from "../assets/hero_citizens_right.png";

export default function Hero({ t, onFindServiceClick }) {
  return (
    <section className="hero-section" aria-label="Introduction">
      {/* Background organic hills & decorative leaves */}
      <div className="hero-decor-container">
        {/* Soft background hill 1 */}
        <div className="decor-hill decor-hill-back"></div>
        {/* Soft background hill 2 */}
        <div className="decor-hill decor-hill-front"></div>
        
        {/* Fluffy white cloud puffs */}
        <div className="decor-cloud cloud-left"></div>
        <div className="decor-cloud cloud-center"></div>
        <div className="decor-cloud cloud-right"></div>

        {/* Decorative foliage / leaves along outer borders */}
        <div className="decor-leaf leaf-left-1"></div>
        <div className="decor-leaf leaf-left-2"></div>
        <div className="decor-leaf leaf-right-1"></div>
        <div className="decor-leaf leaf-right-2"></div>
      </div>

      <div className="hero-layout">
        {/* Left Citizens Illustration Group */}
        <div className="hero-illustration-left">
          <img 
            src={heroLeftImg} 
            alt="Indian students, farmer, and elderly citizen seeking public services" 
            className="citizens-img"
          />
        </div>

        {/* Center Content */}
        <div className="hero-center-content">
          <h1 className="hero-heading">
            <span>{t.hero.titleLine1}</span>
            <span className="hero-heading-break">{t.hero.titleLine2}</span>
          </h1>

          <p className="hero-subtitle">
            {t.hero.subtitle}
          </p>

          <button 
            type="button" 
            className="hero-cta-btn"
            onClick={onFindServiceClick}
          >
            {t.hero.cta}
          </button>
        </div>

        {/* Right Citizens Illustration Group */}
        <div className="hero-illustration-right">
          <img 
            src={heroRightImg} 
            alt="Diverse citizens including schoolgirl, wheelchair user, professional, and woman" 
            className="citizens-img"
          />
        </div>
      </div>
    </section>
  );
}
