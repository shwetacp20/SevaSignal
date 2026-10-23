const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export async function fetchCategories(lang = "en") {
  try {
    const res = await fetch(`${API_BASE}/categories?lang=${lang}`);
    if (!res.ok) throw new Error("Backend error");
    return await res.json();
  } catch (err) {
    console.warn("Using offline categories fallback:", err);
    return getOfflineCategories(lang);
  }
}

export async function fetchServices(categoryId = null, lang = "en") {
  try {
    const url = categoryId
      ? `${API_BASE}/services?category_id=${categoryId}&lang=${lang}`
      : `${API_BASE}/services?lang=${lang}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Backend error");
    return await res.json();
  } catch (err) {
    console.warn("Using offline services fallback:", err);
    return getOfflineServices(categoryId, lang);
  }
}

export async function fetchServiceDetail(serviceId, lang = "en") {
  try {
    const res = await fetch(`${API_BASE}/services/${serviceId}?lang=${lang}`);
    if (!res.ok) throw new Error("Backend error");
    return await res.json();
  } catch (err) {
    console.warn("Using offline service detail fallback:", err);
    const services = getOfflineServices(null, lang);
    return services.find(s => s.id === serviceId) || null;
  }
}

export async function searchServices(query, lang = "en") {
  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&lang=${lang}`);
    if (!res.ok) throw new Error("Backend error");
    return await res.json();
  } catch (err) {
    console.warn("Using offline search fallback:", err);
    const q = query.toLowerCase().trim();
    const all = getOfflineServices(null, lang);
    const matched = all.filter(s => 
      (s.localized_name && s.localized_name.toLowerCase().includes(q)) ||
      (s.localized_summary && s.localized_summary.toLowerCase().includes(q))
    );
    return { query, language: lang, count: matched.length, results: matched };
  }
}

export async function fetchGuidance(serviceId, problemId = null, problemQuery = null, lang = "en") {
  try {
    const res = await fetch(`${API_BASE}/guidance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        problem_id: problemId,
        problem_query: problemQuery,
        lang: lang
      })
    });
    if (!res.ok) throw new Error("Backend error");
    return await res.json();
  } catch (err) {
    console.warn("Using offline guidance fallback:", err);
    return getOfflineGuidance(serviceId, problemId, problemQuery, lang);
  }
}

export async function sendChatMessage(question, lang = "en", categoryId = null, serviceId = null, history = []) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        lang,
        category_id: categoryId,
        service_id: serviceId,
        conversation_history: history
      })
    });
    if (!res.ok) throw new Error("Backend error");
    return await res.json();
  } catch (err) {
    console.warn("Using offline chat fallback:", err);
    return getOfflineChatResponse(question, lang, serviceId, history);
  }
}

// --------------------------------------------------------------------------
// Categories dataset covering all 8 categories in 3 languages
// --------------------------------------------------------------------------
export function getOfflineCategories(lang) {
  const titles = {
    education_scholarships: { en: "Education & Scholarships", kn: "ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ", hi: "शिक्षा और छात्रवृत्तियाँ" },
    certificates_documents: { en: "Certificates & Documents", kn: "ಪ್ರಮಾಣಪತ್ರಗಳು ಮತ್ತು ದಾಖಲೆಗಳು", hi: "प्रमाणपत्र और दस्तावेज़" },
    transport_travel: { en: "Transport & Travel", kn: "ಸಾರಿಗೆ ಮತ್ತು ಪ್ರಯಾಣ", hi: "परिवहन और यात्रा" },
    grievances_complaints: { en: "Grievances & Complaints", kn: "ದೂರುಗಳು ಮತ್ತು ಅಹವಾಲುಗಳು", hi: "शिकायतें और जन-शिकायत निवारण" },
    pensions_welfare: { en: "Pensions & Welfare Benefits", kn: "ಪಿಂಚಣಿ ಮತ್ತು ಕಲ್ಯಾಣ", hi: "पेंशन और कल्याण" },
    ration_food: { en: "Ration Cards & Food Services", kn: "ಪಡಿತರ ಚೀಟಿ", hi: "राशन कार्ड" },
    agriculture_farmer: { en: "Agriculture & Farmer Schemes", kn: "ಕೃಷಿ ಮತ್ತು ರೈತ ಯೋಜನೆಗಳು", hi: "कृषि और किसान योजनाएं" },
    utilities_local: { en: "Utilities & Local Services", kn: "ಸ್ಥಳೀಯ ಸೇವೆಗಳು", hi: "उपयोगिताएं और स्थानीय सेवाएं" }
  };

  const shortTitles = {
    education_scholarships: { en: "Scholarships", kn: "ವಿದ್ಯಾರ್ಥಿವೇತನ", hi: "छात्रवृत्तियाँ" },
    certificates_documents: { en: "Certificates", kn: "ಪ್ರಮಾಣಪತ್ರಗಳು", hi: "प्रमाणपत्र" },
    transport_travel: { en: "Transport", kn: "ಸಾರಿಗೆ", hi: "परिवहन" },
    grievances_complaints: { en: "Grievances", kn: "ದೂರುಗಳು", hi: "शिकायतें" },
    pensions_welfare: { en: "Pensions & Welfare", kn: "ಪಿಂಚಣಿ ಮತ್ತು ಕಲ್ಯಾಣ", hi: "पेंशन और कल्याण" },
    ration_food: { en: "Ration Cards", kn: "ಪಡಿತರ ಚೀಟಿ", hi: "राशन कार्ड" },
    agriculture_farmer: { en: "Farmer Schemes", kn: "ರೈತ ಯೋಜನೆಗಳು", hi: "किसान योजनाएं" },
    utilities_local: { en: "Utilities & Local", kn: "ಸ್ಥಳೀಯ ಸೇವೆಗಳು", hi: "उपयोगिताएं" }
  };

  const descs = {
    education_scholarships: { en: "Find and apply for scholarships suited to your education.", kn: "ನಿಮ್ಮ ಶಿಕ್ಷಣಕ್ಕೆ ಸೂಕ್ತವಾದ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.", hi: "अपनी शिक्षा के अनुकूल उपयुक्त छात्रवृत्तियाँ खोजें और आवेदन करें।" },
    certificates_documents: { en: "Get guidance on birth, income, residence and other certificates.", kn: "ಜನನ, ಆದಾಯ, ವಾಸಸ್ಥಳ ಮತ್ತು ಇತರ ಪ್ರಮಾಣಪತ್ರಗಳ ಕುರಿತು ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.", hi: "जन्म, आय, निवास और अन्य प्रमाणपत्रों पर मार्गदर्शन प्राप्त करें।" },
    transport_travel: { en: "Access student bus passes, driving licence guidance and vehicle services.", kn: "ವಿದ್ಯಾರ್ಥಿ ಬಸ್ ಪಾಸ್, ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ವಾಹನ ಸೇವೆಗಳನ್ನು ಪ್ರವೇಶಿಸಿ.", hi: "छात्र बस पास, ड्राइविंग लाइसेंस मार्गदर्शन और वाहन सेवाओं तक पहुँचें।" },
    grievances_complaints: { en: "Find the correct complaint channel and understand escalation steps.", kn: "ಸರಿಯಾದ ದೂರು ವಿಭಾಗವನ್ನು ಹುಡುಕಿ ಮತ್ತು ಮುಂದಿನ ಹಂತಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", hi: "उचित शिकायत निवारण चैनल खोजें और क्रमिक कार्रवाई के चरण समझें।" },
    pensions_welfare: { en: "Understand public pension schemes, benefit eligibility and renewal procedures.", kn: "ಸಾರ್ವಜನಿಕ ಪಿಂಚಣಿ ಯೋಜನೆಗಳು, ಅರ್ಹತೆ ಮತ್ತು ನವೀಕರಣ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", hi: "सरकारी पेंशन योजनाओं, पात्रता मानदंडों और नवीनीकरण प्रक्रियाओं को समझें।" },
    ration_food: { en: "Find guidance on ration cards, family-member updates and corrections.", kn: "ಪಡಿತರ ಚೀಟಿ ಅರ್ಜಿ, ಕುಟುಂಬ ಸದಸ್ಯರ ಸೇರ್ಪಡೆ ಮತ್ತು ತಿದ್ದುಪಡಿಗಳ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.", hi: "राशन कार्ड, परिवार के सदस्यों को जोड़ने और संशोधन के बारे में मार्गदर्शन प्राप्त करें।" },
    agriculture_farmer: { en: "Explore farmer schemes, application steps and agricultural support services.", kn: "ರೈತ ಯೋಜನೆಗಳು, ಅರ್ಜಿ ಹಂತಗಳು ಮತ್ತು ಕೃಷಿ ಬೆಂಬಲ ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.", hi: "किसान योजनाओं, आवेदन के चरणों और कृषि सहायता सेवाओं की जानकारी लें।" },
    utilities_local: { en: "Find help with electricity, water bills and local service requests.", kn: "ವಿದ್ಯುತ್, ನೀರಿನ ಬಿಲ್ ಸಮಸ್ಯೆಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಸೇವಾ ಮನವಿಗಳಿಗೆ ನೆರವು ಪಡೆಯಿರಿ.", hi: "बिजली, पानी के बिल और स्थानीय नागरिक समस्याओं के समाधान में सहायता पाएं।" }
  };

  const items = [
    { id: "education_scholarships", slug: "scholarships", order: 1, color_theme: "blue", bg_color: "#EAF2FF", accent_color: "#2563EB", image_key: "card_scholarships.png" },
    { id: "certificates_documents", slug: "certificates", order: 2, color_theme: "green", bg_color: "#EAF7EF", accent_color: "#059669", image_key: "card_certificates.png" },
    { id: "transport_travel", slug: "transport", order: 3, color_theme: "orange", bg_color: "#FFF5E4", accent_color: "#D97706", image_key: "card_transport.png" },
    { id: "grievances_complaints", slug: "grievances", order: 4, color_theme: "purple", bg_color: "#EEF0FC", accent_color: "#4F46E5", image_key: "card_grievances.png" },
    { id: "pensions_welfare", slug: "pensions", order: 5, color_theme: "rose", bg_color: "#FFF1F2", accent_color: "#E11D48", image_key: "card_pensions" },
    { id: "ration_food", slug: "ration", order: 6, color_theme: "amber", bg_color: "#FEF3C7", accent_color: "#B45309", image_key: "card_ration" },
    { id: "agriculture_farmer", slug: "agriculture", order: 7, color_theme: "emerald", bg_color: "#ECFDF5", accent_color: "#047857", image_key: "card_agriculture" },
    { id: "utilities_local", slug: "utilities", order: 8, color_theme: "teal", bg_color: "#F0FDFA", accent_color: "#0F766E", image_key: "card_utilities" }
  ];

  return items.map(c => ({
    ...c,
    localized_title: titles[c.id]?.[lang] || titles[c.id]?.en || "",
    localized_short_title: shortTitles[c.id]?.[lang] || shortTitles[c.id]?.en || "",
    localized_description: descs[c.id]?.[lang] || descs[c.id]?.en || ""
  }));
}

// --------------------------------------------------------------------------
// Comprehensive Services Dataset covering all 8 categories
// --------------------------------------------------------------------------
export function getOfflineServices(categoryId, lang) {
  const isKn = lang === "kn";
  const isHi = lang === "hi";

  const allServices = [
    // 1. Education & Scholarships
    {
      id: "ssp_postmatric_karnataka",
      category_id: "education_scholarships",
      localized_name: isKn ? "ಕರ್ನಾಟಕ ರಾಜ್ಯ ವಿದ್ಯಾರ್ಥಿವೇತನ ಪೋರ್ಟಲ್ (SSP) - ಮೆಟ್ರಿಕ್ ನಂತರದ" : isHi ? "कर्नाटक राज्य छात्रवृत्ति पोर्टल (एसएसपी) - पोस्ट-मैट्रिक" : "Karnataka State Scholarship Portal (SSP) - Post-Matric",
      localized_provider: isKn ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರ (ಸಮಾಜ ಕಲ್ಯಾಣ, ಹಿಂದುಳಿದ ವರ್ಗ, ಬುಡಕಟ್ಟು ಕಲ್ಯಾಣ)" : isHi ? "कर्नाटक सरकार (समाज कल्याण विभाग)" : "Government of Karnataka",
      portal_url: "https://ssp.postmatric.karnataka.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-15",
      localized_summary: isKn ? "ಪಿಯುಸಿ, ಪದವಿ, ಡಿಪ್ಲೊಮಾ, ಪಿಜಿ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಶುಲ್ಕ ಮರುಪಾವತಿ ಮತ್ತು ನಿರ್ವಹಣಾ ಭತ್ಯೆ ಒದಗಿಸುವ ಏಕೀಕೃತ ಪೋರ್ಟಲ್." : isHi ? "पोस्ट-मैट्रिक पाठ्यक्रमों (पीयूसी, डिप्लोमा, डिग्री) में अध्ययनरत छात्रों के लिए एकीकृत छात्रवृत्ति पोर्टल।" : "Unified scholarship portal for Karnataka students in post-matric courses (PUC, Diploma, Degree, PG).",
      common_problems: [
        {
          problem_id: "ssp_apply_fresh",
          problem_title: { en: "Apply fresh for SSP scholarship", kn: "ಹೊಸ SSP ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ", hi: "नई एसएसपी छात्रवृत्ति के लिए आवेदन" },
          recommended_action: { en: "Create an SSP Student Account, complete Aadhaar e-KYC, and link your Nadakacheri RD number before submitting.", kn: "ಆಧಾರ್ ಇ-ಕೆವೈಸಿ ಮೂಲಕ SSP ಖಾತೆ ರಚಿಸಿ, SSLC ನೋಂದಣಿ ಸಂಖ್ಯೆ ಮತ್ತು ನಡಕಚೇರಿ RD ಸಂಖ್ಯೆ ಲಿಂಕ್ ಮಾಡಿ.", hi: "एसएसपी छात्र खाता बनाएं, आधार ई-केवाईसी पूरा करें और नाडाकचेरी आरडी नंबर जोड़ें।" },
          checklist: {
            en: ["Visit https://ssp.postmatric.karnataka.gov.in/ and click 'Create Account'", "Authenticate with Student Aadhaar and mobile OTP", "Enter SSLC Reg No to fetch student credentials", "Enter valid Caste & Income RD numbers (Nadakacheri)", "Enter College Admission details and upload documents for college e-Attestation", "Submit and print the acknowledgement receipt for your college"],
            kn: ["https://ssp.postmatric.karnataka.gov.in/ ಗೆ ಭೇಟಿ ನೀಡಿ 'ಖಾತೆ ರಚಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿ", "ವಿದ್ಯಾರ್ಥಿ ಆಧಾರ್ ಮತ್ತು ಮೊಬೈಲ್ OTP ಮೂಲಕ ಪರಿಶೀಲಿಸಿ", "SSLC ನೋಂದಣಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ ವಿವರಗಳನ್ನು ಪಡೆಯಿರಿ", "ಚಾಲ್ತಿಯಲ್ಲಿರುವ ಜಾತಿ ಮತ್ತು ಆದಾಯ RD ಸಂಖ್ಯೆ ನಮೂದಿಸಿ", "ಕಾಲೇಜು ಪ್ರವೇಶ ವಿವರ ನಮೂದಿಸಿ ಇ-ದೃಢೀಕರಣ ಮಾಡಿಸಿ", "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಸ್ವೀಕೃತಿ ರಶೀದಿಯನ್ನು ಕಾಲೇಜಿಗೆ ನೀಡಿ"],
            hi: ["पोर्टल https://ssp.postmatric.karnataka.gov.in/ पर जाएं और 'खाता बनाएं' चुनें", "छात्र आधार एवं ओटीपी द्वारा प्रमाणीकरण पूरा करें", "10वीं का रोल नंबर दर्ज कर विवरण प्राप्त करें", "वैध जाति व आय आरडी संख्या दर्ज करें", "कॉलेज प्रवेश विवरण भरें और ई-अटेस्टेशन करवाएं", "आवेदन जमा कर कॉलेज में पावती रसीद जमा करें"]
          },
          escalation_route: { en: "SSP Helpline: 080-35254757 / Social Welfare: 1902", kn: "ಸಹಾಯವಾಣಿ: 080-35254757 / ಸಮಾಜ ಕಲ್ಯಾಣ: 1902", hi: "हेल्पलाइन: 080-35254757 / समाज कल्याण: 1902" }
        },
        {
          problem_id: "ssp_payment_delayed",
          problem_title: { en: "Why is my SSP scholarship payment delayed?", kn: "ನನ್ನ SSP ವಿದ್ಯಾರ್ಥಿವೇತನ ಹಣ ಏಕೆ ತಡವಾಗಿದೆ?", hi: "मेरी एसएसपी छात्रवृत्ति का भुगतान क्यों विलंबित है?" },
          recommended_action: { en: "Check your payment disbursement status on DBT Karnataka (dbt.karnataka.gov.in) and ensure your bank account has active Aadhaar NPCI seeding.", kn: "ಕರ್ನಾಟಕ DBT ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪಾವತಿ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಆಧಾರ್-NPCI ಮ್ಯಾಪಿಂಗ್ ಸಕ್ರಿಯವಾಗಿದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.", hi: "डीबीटी कर्नाटक पोर्टल पर भुगतान की स्थिति जांचें और सुनिश्चित करें कि बैंक खाता आधार-एनपीसीआई से जुड़ा है।" },
          checklist: {
            en: ["Login to Karnataka DBT Portal at https://dbt.karnataka.gov.in/ using your Aadhaar number", "Check 'Payment Status' tab to view transaction status and failure remarks", "Verify if the status shows 'Aadhaar not mapped to NPCI'", "If NPCI unmapped: Visit your bank branch in person and submit 'Aadhaar DBT Seeding Mandate'", "Once updated, department will automatically re-push disbursement in the next DBT billing cycle"],
            kn: ["https://dbt.karnataka.gov.in/ ಗೆ ನಿಮ್ಮ ಆಧಾರ್ ನಂಬರ್ ಬಳಸಿ ಲಾಗಿನ್ ಆಗಿ", "'ಪಾವತಿ ಸ್ಥಿತಿ' (Payment Status) ಟ್ಯಾಬ್ ಪರಿಶೀಲಿಸಿ", "ಸ್ಥಿತಿಯಲ್ಲಿ 'Aadhaar not mapped to NPCI' ಎಂದು ತೋರಿಸುತ್ತಿದೆಯೇ ನೋಡಿ", "NPCI ಲಿಂಕ್ ಆಗದಿದ್ದರೆ: ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ 'Aadhaar DBT Seeding' ಫಾರ್ಮ್ ಸಲ್ಲಿಸಿ", "ಬ್ಯಾಂಕ್ ಅಪ್‌ಡೇಟ್ ಆದ ನಂತರ ಮುಂದಿನ DBT ಸೈಕಲ್‌ನಲ್ಲಿ ಹಣ ಜಮೆಯಾಗುತ್ತದೆ"],
            hi: ["https://dbt.karnataka.gov.in/ पर अपने आधार से लॉगिन करें", "'भुगतान स्थिति' जांचें और विफलता का कारण देखें", "यदि 'Aadhaar not mapped to NPCI' दिखे, तो बैंक शाखा जाएं", "बैंक में 'आधार डीबीटी सीडिंग मैंडेट' फॉर्म जमा करें", "सीडिंग के बाद अगले चक्र में राशि सीधे खाते में आ जाएगी"]
          },
          escalation_route: { en: "Karnataka DBT Helpline: 080-22340199 / Social Welfare: 1902", kn: "ಕರ್ನಾಟಕ DBT ಸಹಾಯವಾಣಿ: 080-22340199 / ಸಮಾಜ ಕಲ್ಯಾಣ: 1902", hi: "डीबीटी हेल्पलाइन: 080-22340199 / समाज कल्याण: 1902" }
        }
      ],
      required_documents: {
        en: ["Student Aadhaar Card & linked mobile", "10th / SSLC Marks Card Reg No", "Nadakacheri Caste & Income Certificate RD Number", "College Admission Fee Receipt", "Active Bank Account seeded with NPCI / Aadhaar"],
        kn: ["ವಿದ್ಯಾರ್ಥಿಯ ಆಧಾರ್ ಕಾರ್ಡ್ ಮತ್ತು ಮೊಬೈಲ್", "SSLC ಅಂಕಪಟ್ಟಿ ನೋಂದಣಿ ಸಂಖ್ಯೆ", "ನಡಕಚೇರಿ ಜಾತಿ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರದ RD ಸಂಖ್ಯೆ", "ಕಾಲೇಜು ಪ್ರವೇಶ ಶುಲ್ಕ ರಶೀದಿ", "ಆಧಾರ್ ಲಿಂಕ್ ಆದ ಬ್ಯಾಂಕ್ ಖಾತೆ"],
        hi: ["छात्र आधार कार्ड व मोबाइल नंबर", "10वीं/एसएसएलसी रोल नंबर", "वैध नाडाकचेरी जाति व आय आरडी संख्या", "कॉलेज फीस रसीद", "एनपीसीआई से जुड़ा बैंक खाता"]
      }
    },

    // 2. Certificates & Documents
    {
      id: "nadakacheri_caste_income",
      category_id: "certificates_documents",
      localized_name: isKn ? "ಕರ್ನಾಟಕ ನಾಡಕಚೇರಿ - ಜಾತಿ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ" : isHi ? "कर्नाटक नाडाकचेरी - जाति एवं आय प्रमाणपत्र" : "Karnataka Nadakacheri - Caste & Income Certificates",
      localized_provider: isKn ? "ಕಂದಾಯ ಇಲಾಖೆ, ಅಟಲ್ ಜೀ ಜನಸ್ನೇಹಿ ಕೇಂದ್ರ (AJSK)" : isHi ? "राजस्व विभाग, अटलजी जनस्नेही केंद्र" : "Revenue Department, Karnataka",
      portal_url: "https://nadakacheri.karnataka.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-15",
      localized_summary: isKn ? "15-ಅಂಕಿಯ RD ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಡಿಜಿಟಲ್ ಸಹಿ ಹೊಂದಿರುವ ಜಾತಿ, ಆದಾಯ ಮತ್ತು ವಾಸಸ್ಥಳ ಪ್ರಮಾಣಪತ್ರ ವಿತರಣೆ." : isHi ? "15-अंकीय आरडी नंबर के साथ डिजिटल हस्ताक्षरित जाति, आय एवं निवास प्रमाणपत्र।" : "Official portal for digitally signed Caste, Income, and Residence certificates with 15-digit RD Numbers.",
      common_problems: [
        {
          problem_id: "nadakacheri_caste_download",
          problem_title: { en: "How to download digitally signed Caste certificate?", kn: "ಡಿಜಿಟಲ್ ಸಹಿ ಹೊಂದಿರುವ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡುವುದು ಹೇಗೆ?", hi: "डिजिटल हस्ताक्षरित जाति प्रमाणपत्र कैसे डाउनलोड करें?" },
          recommended_action: { en: "Visit nadakacheri.karnataka.gov.in, select 'Print Certificate' under Online Application, enter your 15-digit RD Number, and download the legally valid PDF.", kn: "nadakacheri.karnataka.gov.in ನಲ್ಲಿ 'ಪ್ರಿಂಟ್ ಸರ್ಟಿಫಿಕೇಟ್' ಆಯ್ಕೆಮಾಡಿ 15-ಅಂಕಿಯ RD ಸಂಖ್ಯೆ ನಮೂದಿಸಿ ಮತ್ತು PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.", hi: "nadakacheri.karnataka.gov.in पर जाएं, 'प्रिंट सर्टिफिकेट' में 15 अंकों का आरडी नंबर दर्ज करें और पीडीएफ डाउनलोड करें।" },
          checklist: {
            en: ["Open official portal: https://nadakacheri.karnataka.gov.in/", "Click on 'Online Application' menu and select 'Print Certificate'", "Select 'Caste Certificate' or 'Income Certificate'", "Enter your 15-digit Application / RD Reference Number (e.g., RD0038...)", "Click 'Search' and download the digitally signed PDF with barcode"],
            kn: ["ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ: https://nadakacheri.karnataka.gov.in/", "'ಆನ್‌ಲೈನ್ ಅರ್ಜಿ' ಮೆನು ಕ್ಲಿಕ್ ಮಾಡಿ 'ಪ್ರಿಂಟ್ ಸರ್ಟಿಫಿಕೇಟ್' ಆಯ್ಕೆಮಾಡಿ", "ಸೇವೆಯ ವಿಧವನ್ನು ಆರಿಸಿ (ಜಾತಿ ಅಥವಾ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ)", "ನಿಮ್ಮ 15-ಅಂಕಿಯ RD ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ", "ಹುಡುಕಿ ಕ್ಲಿಕ್ ಮಾಡಿ ಡಿಜಿಟಲ್ ಸಹಿ ಮಾಡಿದ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"],
            hi: ["आधिकारिक पोर्टल खोलें: https://nadakacheri.karnataka.gov.in/", "'ऑनलाइन एप्लीकेशन' में जाकर 'प्रिंट सर्टिफिकेट' चुनें", "सेवा प्रकार (जाति या आय) चुनें", "अपनी 15 अंकों की आरडी (RD) संख्या दर्ज करें", "खोजें और डिजिटल हस्ताक्षरित पीडीएफ डाउनलोड करें"]
          },
          escalation_route: { en: "Nadakacheri Helpline: 080-22340639 / Sakala Helpdesk: 080-44554455", kn: "ನಾಡಕಚೇರಿ ಸಹಾಯವಾಣಿ: 080-22340639 / ಸಕಾಲ: 080-44554455", hi: "नाडाकचेरी हेल्पलाइन: 080-22340639 / सकाला: 080-44554455" }
        },
        {
          problem_id: "nadakacheri_income_apply",
          problem_title: { en: "How do I apply for an income certificate?", kn: "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", hi: "आय प्रमाणपत्र के लिए आवेदन कैसे करें?" },
          recommended_action: { en: "Apply online at Nadakacheri or visit a Grama One centre with Aadhaar, salary slip/self-declaration, and ration card; issued within 21 days under Sakala.", kn: "ಆಧಾರ್, ವೇತನ ಚೀಟಿ/ಸ್ವಯಂ ಘೋಷಣೆ ಮತ್ತು ಪಡಿತರ ಚೀಟಿಯೊಂದಿಗೆ ನಾಡಕಚೇರಿ ಅಥವಾ ಗ್ರಾಮ ಒನ್ ಕೇಂದ್ರದಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ; 21 ದಿನಗಳಲ್ಲಿ ಲಭ್ಯವಾಗುತ್ತದೆ.", hi: "आधार, वेतन पर्ची और राशन कार्ड के साथ नाडाकचेरी अथवा ग्राम वन केंद्र पर आवेदन करें; 21 दिनों में जारी होगा।" },
          checklist: {
            en: ["Visit https://nadakacheri.karnataka.gov.in/ and log in with mobile OTP", "Select 'New Request' -> 'Income Certificate'", "Enter family occupation and annual income details", "Upload Aadhaar card and address proof", "Pay ₹40 online fee and keep acknowledgment receipt", "Village Accountant & RI verify on field -> Tahsildar digitally signs"],
            kn: ["https://nadakacheri.karnataka.gov.in/ ಗೆ ಭೇಟಿ ನೀಡಿ ಲಾಗಿನ್ ಆಗಿ", "'ಹೊಸ ಕೋರಿಕೆ' -> 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ' ಆಯ್ಕೆಮಾಡಿ", "ಕುಟುಂಬದ ಉದ್ಯೋಗ ಮತ್ತು ವಾರ್ಷಿಕ ಆದಾಯ ನಮೂದಿಸಿ", "ಆಧಾರ್ ಮತ್ತು ವಿಳಾಸ ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", "₹40 ಶುಲ್ಕ ಪಾವತಿಸಿ ಸ್ವೀಕೃತಿ ರಶೀದಿ ಪಡೆಯಿರಿ", "ಅಧಿಕಾರಿಗಳ ಸ್ಥಳ ಪರಿಶೀಲನೆಯ ನಂತರ ತಹಶೀಲ್ದಾರ್ ಡಿಜಿಟಲ್ ಸಹಿ ನೀಡುತ್ತಾರೆ"],
            hi: ["https://nadakacheri.karnataka.gov.in/ पर मोबाइल से लॉगिन करें", "'नया अनुरोध' -> 'आय प्रमाणपत्र' चुनें", "पारिवारिक व्यवसाय एवं आय विवरण भरें", "आधार और निवास प्रमाण पत्र अपलोड करें", "₹40 का शुल्क भरें और पावती रसीद सुरक्षित रखें"]
          },
          escalation_route: { en: "Taluk Tahsildar Office / Sakala: 080-44554455", kn: "ತಾಲೂಕು ತಹಶೀಲ್ದಾರ್ ಕಚೇರಿ / ಸಕಾಲ: 080-44554455", hi: "तहसीलदार कार्यालय / सकाला: 080-44554455" }
        }
      ],
      required_documents: {
        en: ["Aadhaar Card of Applicant and Parent", "Previous Caste Certificate / TC with caste mentioned", "Income Proof (Salary Slip, RTC, or Self-Declaration)", "Ration Card or Residential Proof"],
        kn: ["ಅರ್ಜಿದಾರ ಮತ್ತು ಪೋಷಕರ ಆಧಾರ್ ಕಾರ್ಡ್", "ಹಳೆಯ ಜಾತಿ ದಾಖಲೆ / ವರ್ಗಾವಣೆ ಪತ್ರ (TC)", "ಆದಾಯದ ಪುರಾವೆ (ವೇತನ ಚೀಟಿ ಅಥವಾ ಪಹಣಿ)", "ಪಡಿತರ ಚೀಟಿ ಅಥವಾ ವಿಳಾಸ ದಾಖಲೆ"],
        hi: ["आवेदक एवं माता-पिता का आधार कार्ड", "पुराना जाति प्रमाणपत्र अथवा टीसी", "आय प्रमाण (वेतन पर्ची या खतौनी)", "राशन कार्ड या निवास प्रमाण"]
      }
    },

    // 3. Transport & Travel
    {
      id: "ksrtc_student_bus_pass",
      category_id: "transport_travel",
      localized_name: isKn ? "KSRTC / BMTC ವಿದ್ಯಾರ್ಥಿ ರಿಯಾಯಿತಿ ಬಸ್ ಪಾಸ್" : isHi ? "केएसआरटीसी / बीएमटीसी छात्र रियायती बस पास" : "KSRTC / BMTC Student Concession Bus Pass",
      localized_provider: isKn ? "ಕರ್ನಾಟಕ ರಾಜ್ಯ ರಸ್ತೆ ಸಾರಿಗೆ ನಿಗಮ" : isHi ? "कर्नाटक राज्य सड़क परिवहन निगम" : "KSRTC / BMTC Transport Corporation",
      portal_url: "https://sevasindhu.karnataka.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-15",
      localized_summary: isKn ? "ಶಾಲಾ-ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ರಿಯಾಯಿತಿ ದರದ ವಾರ್ಷಿಕ ಬಸ್ ಪಾಸ್ ಸೌಲಭ್ಯ." : isHi ? "छात्रों के लिए वार्षिक रियायती बस पास सेवा।" : "Subsidized annual commuter bus pass for Karnataka school and college students.",
      common_problems: [
        {
          problem_id: "ksrtc_bus_pass_renewal",
          problem_title: { en: "How do I renew my KSRTC student bus pass?", kn: "KSRTC ವಿದ್ಯಾರ್ಥಿ ಬಸ್ ಪಾಸ್ ನವೀಕರಿಸುವುದು ಹೇಗೆ?", hi: "केएसआरटीसी छात्र बस पास का नवीनीकरण कैसे करें?" },
          recommended_action: { en: "Apply for renewal on the Seva Sindhu Student Pass portal, enter previous year pass number, upload current admission fee receipt, and collect your pass at the bus depot.", kn: "ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಹಳೆಯ ಪಾಸ್ ನಂಬರ್ ನಮೂದಿಸಿ, ಹೊಸ ವರ್ಷದ ಕಾಲೇಜು ರಶೀದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಡಿಪೋದಲ್ಲಿ ಪಾಸ್ ಪಡೆಯಿರಿ.", hi: "सेवा सिंधु पोर्टल पर पुराने पास का नंबर दर्ज करें, नए सत्र की फीस रसीद अपलोड करें और डिपो से नया पास प्राप्त करें।" },
          checklist: {
            en: ["Go to Seva Sindhu Portal (https://sevasindhu.karnataka.gov.in/) and search for 'Student Bus Pass'", "Select 'KSRTC Student Concession Pass - Renewal'", "Enter your Previous Year Pass Number or Student SATS ID", "Upload current academic year College Admission Fee Receipt and photo", "Verify Origin and Destination bus stops", "Submit application and note down the Reference Number", "Collect the smart card at your local KSRTC bus depot after approval"],
            kn: ["ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ 'ವಿದ್ಯಾರ್ಥಿ ಬಸ್ ಪಾಸ್' ಆಯ್ಕೆಮಾಡಿ", "'KSRTC ವಿದ್ಯಾರ್ಥಿ ರಿಯಾಯಿತಿ ಪಾಸ್ - ನವೀಕರಣ' ಕ್ಲಿಕ್ ಮಾಡಿ", "ಹಿಂದಿನ ವರ್ಷದ ಪಾಸ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ ವಿವರಗಳನ್ನು ಪಡೆಯಿರಿ", "ಪ್ರಸಕ್ತ ವರ್ಷದ ಕಾಲೇಜು ಶುಲ್ಕ ರಶೀದಿ ಮತ್ತು ಭಾವಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", "ಪ್ರಯಾಣದ ಬಸ್ ನಿಲ್ದಾಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ", "ಅನುಮೋದನೆಯ ನಂತರ KSRTC ಬಸ್ ಡಿಪೋ ಕೌಂಟರ್‌ನಲ್ಲಿ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಪಾಸ್ ಪಡೆಯಿರಿ"],
            hi: ["सेवा सिंधु (https://sevasindhu.karnataka.gov.in/) पर 'Student Bus Pass' खोजें", "'केएसआरटीसी छात्र बस पास - नवीनीकरण' चुनें", "पुराना पास नंबर दर्ज कर विवरण प्राप्त करें", "नवीनतम कॉलेज फीस रसीद और फोटो अपलोड करें", "आरंभिक और गंतव्य बस स्टॉप सत्यापित कर सबमिट करें", "स्वीकृति मिलने पर बस डिपो से नया पास प्राप्त करें"]
          },
          escalation_route: { en: "KSRTC Call Centre: 080-26252625 / Seva Sindhu: 1902", kn: "KSRTC ಕಾಲ್ ಸೆಂಟರ್: 080-26252625 / ಸೇವಾ ಸಿಂಧು: 1902", hi: "केएसआरटीसी कॉल सेंटर: 080-26252625 / सेवा सिंधु: 1902" }
        }
      ],
      required_documents: {
        en: ["Student Aadhaar Card", "Current Academic Year College Admission Fee Receipt", "College Bonafide / Principal Seal", "Passport size photograph", "Previous Year Bus Pass Number (for renewal)"],
        kn: ["ವಿದ್ಯಾರ್ಥಿಯ ಆಧಾರ್ ಕಾರ್ಡ್", "ಪ್ರಸಕ್ತ ಶೈಕ್ಷಣಿಕ ವರ್ಷದ ಕಾಲೇಜು ಶುಲ್ಕ ರಶೀದಿ", "ಕಾಲೇಜು ಬೋನಾಫೈಡ್ / ಪ್ರಾಂಶುಪಾಲರ ಸೀಲ್", "ಪಾಸ್‌ಪೋರ್ಟ್ ಅಳತೆಯ ಭಾವಚಿತ್ರ", "ಹಿಂದಿನ ವರ್ಷದ ಬಸ್ ಪಾಸ್ ಸಂಖ್ಯೆ"],
        hi: ["छात्र आधार कार्ड", "वर्तमान सत्र की कॉलेज फीस रसीद", "कॉलेज बोनाफाइड प्रमाणपत्र", "पासपोर्ट साइज रंगीन फोटो", "पिछले वर्ष का बस पास नंबर"]
      }
    },

    // 4. Grievances & Complaints
    {
      id: "cpgrams_grievances",
      category_id: "grievances_complaints",
      localized_name: isKn ? "CPGRAMS - ಸಾರ್ವಜನಿಕ ಕುಂದುಕೊರತೆ ದೂರು ಪೋರ್ಟಲ್" : isHi ? "सीपीजीआरएएमएस - केंद्रीय जनशिकायत निवारण पोर्टल" : "CPGRAMS - Centralized Public Grievance Portal",
      localized_provider: isKn ? "ಆಡಳಿತ ಸುಧಾರಣೆ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಕುಂದುಕೊರತೆಗಳ ಇಲಾಖೆ (DARPG)" : isHi ? "प्रशासनिक सुधार और लोक शिकायत विभाग" : "DARPG, Government of India",
      portal_url: "https://pgportal.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-15",
      localized_summary: isKn ? "ಕೇಂದ್ರ ಸರ್ಕಾರಿ ಇಲಾಖೆಗಳು, ಬ್ಯಾಂಕುಗಳು, ರೈಲ್ವೆ ಮತ್ತು ಅಂಚೆ ಸೇವೆಗಳ ವಿರುದ್ಧ 24x7 ದೂರು ಸಲ್ಲಿಸುವ ಪೋರ್ಟಲ್." : isHi ? "केंद्रीय मंत्रालयों, बैंकों, रेलवे, डाक सेवाओं के विरुद्ध ऑनलाइन शिकायत निवारण पोर्टल।" : "Central 24/7 public grievance portal for lodging and tracking complaints against ministries, banks, and railways.",
      common_problems: [
        {
          problem_id: "cpgrams_file_grievance",
          problem_title: { en: "How can I file a public-service grievance?", kn: "CPGRAMS ನಲ್ಲಿ ಸಾರ್ವಜನಿಕ ದೂರು ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", hi: "सीपीजीआरएएमएस पर सरकारी शिकायत कैसे दर्ज करें?" },
          recommended_action: { en: "Register on pgportal.gov.in, select the responsible Central Ministry/Department, clearly state your issue with evidence, and monitor time-bound resolution.", kn: "pgportal.gov.in ನಲ್ಲಿ ನೋಂದಾಯಿಸಿ, ಸಂಬಂಧಿತ ಇಲಾಖೆಯನ್ನು ಆರಿಸಿ, ಸಾಕ್ಷ್ಯಾಧಾರಗಳೊಂದಿಗೆ ದೂರು ದಾಖಲಿಸಿ ಪರಿಹಾರ ಪಡೆಯಿರಿ.", hi: "pgportal.gov.in पर पंजीकरण करें, संबंधित मंत्रालय चुनें, प्रमाण सहित अपनी शिकायत दर्ज करें।" },
          checklist: {
            en: ["Visit https://pgportal.gov.in/ and log in with mobile/email", "Click 'Lodge Public Grievance'", "Select the relevant Ministry / Department (Banking, Railways, Posts, etc.)", "Enter concise issue description with previous application/ticket numbers", "Attach supporting PDF documents (up to 4MB)", "Submit and track resolution with unique Registration Number on SMS"],
            kn: ["https://pgportal.gov.in/ ಗೆ ಭೇಟಿ ನೀಡಿ ಲಾಗಿನ್ ಆಗಿ", "'Lodge Public Grievance' ಆಯ್ಕೆಮಾಡಿ", "ಸಂಬಂಧಿತ ಸಚಿವಾಲಯ ಅಥವಾ ಇಲಾಖೆಯನ್ನು ಆರಿಸಿ", "ದೂರಿನ ವಿವರ ಮತ್ತು ಹಿಂದಿನ ಅರ್ಜಿ ಸಂಖ್ಯೆಗಳನ್ನು ನಮೂದಿಸಿ", "ದಾಖಲೆಗಳ PDF ಲಗತ್ತಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ", "SMS ಮೂಲಕ ಬರುವ ದೂರು ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ"],
            hi: ["https://pgportal.gov.in/ पर लॉगिन करें", "'लॉज पब्लिक ग्रीवेंस' पर क्लिक करें", "संबंधित मंत्रालय चुनें (बैंकिंग, रेलवे आदि)", "समस्या का विवरण दर्ज करें और साक्ष्य पीडीएफ अपलोड करें", "सबमिट कर एसएमएस पर प्राप्त शिकायत संख्या से स्थिति जांचें"]
          },
          escalation_route: { en: "DARPG Grievance Cell: 011-23741006 / National Consumer Helpline: 1915", kn: "DARPG ಸಹಾಯವಾಣಿ: 011-23741006 / ರಾಷ್ಟ್ರೀಯ ಗ್ರಾಹಕ ಸಹಾಯವಾಣಿ: 1915", hi: "डीएआरपीजी हेल्पलाइन: 011-23741006 / उपभोक्ता हेल्पलाइन: 1915" }
        }
      ],
      required_documents: {
        en: ["Mobile number and Email for OTP", "Details of complaint (transaction IDs, reference letters)", "Supporting PDF documents / photos"],
        kn: ["ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಇಮೇಲ್", "ದೂರಿನ ವಿವರಗಳು (ಹಿಂದಿನ ರಶೀದಿ, ಪತ್ರ)", "ಪೂರಕ ದಾಖಲೆಗಳ PDF"],
        hi: ["मोबाइल नंबर व ईमेल", "शिकायत का पूर्ण विवरण", "संबंधित साक्ष्य दस्तावेज"]
      }
    },

    // 5. Pensions & Welfare Benefits
    {
      id: "karnataka_social_security_pensions",
      category_id: "pensions_welfare",
      localized_name: isKn ? "ಕರ್ನಾಟಕ ಸಾಮಾಜಿಕ ಭದ್ರತಾ ಪಿಂಚಣಿಗಳು (ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ ಮತ್ತು ವೃದ್ಧಾಪ್ಯ ವೇತನ)" : isHi ? "कर्नाटक सामाजिक सुरक्षा पेंशन (संध्या सुरक्षा एवं वृद्धावस्था)" : "Karnataka Social Security Pensions (Sandhya Suraksha & Old Age)",
      localized_provider: isKn ? "ಸಾಮಾಜಿಕ ಭದ್ರತೆ ಮತ್ತು ಪಿಂಚಣಿಗಳ ನಿರ್ದೇಶನಾಲಯ (DSSP), ಕಂದಾಯ ಇಲಾಖೆ" : isHi ? "सामाजिक सुरक्षा एवं पेंशन निदेशालय, राजस्व विभाग" : "Directorate of Social Security and Pensions (DSSP), Karnataka",
      portal_url: "https://dssp.karnataka.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-15",
      localized_summary: isKn ? "ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ (65+ ವಯಸ್ಸಿನವರಿಗೆ ₹1,200/ತಿಂಗಳು), ವೃದ್ಧಾಪ್ಯ ವೇತನ ಮತ್ತು ವಿಧವಾ ವೇತನವನ್ನು ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೀಡುವ ಯೋಜನೆ." : isHi ? "संध्या सुरक्षा योजना (65+ वर्ष हेतु ₹1,200/माह) एवं वृद्धावस्था पेंशन सीधे खाते में देने की योजना।" : "Monthly financial assistance schemes including Sandhya Suraksha (₹1,200/mo for 65+) and Old Age Pension via Aadhaar DBT.",
      common_problems: [
        {
          problem_id: "pension_payment_track",
          problem_title: { en: "How can I track my pension payment?", kn: "ನನ್ನ ಪಿಂಚಣಿ ಪಾವತಿ ಮತ್ತು ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುವುದು ಹೇಗೆ?", hi: "मेरी पेंशन के भुगतान और स्थिति की जांच कैसे करें?" },
          recommended_action: { en: "Track your monthly pension disbursement on dssp.karnataka.gov.in or Karnataka DBT App using your Aadhaar number or Pension Account Number.", kn: "dssp.karnataka.gov.in ಅಥವಾ ಕರ್ನಾಟಕ DBT ಆ್ಯಪ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಆಧಾರ್ ಸಂಖ್ಯೆ ಬಳಸಿ ಮಾಸಿಕ ಜಮೆ ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ.", hi: "dssp.karnataka.gov.in पर अथवा कर्नाटक डीबीटी ऐप में आधार नंबर दर्ज करके मासिक भुगतान की स्थिति जांचें।" },
          checklist: {
            en: ["Visit official DSSP portal: https://dssp.karnataka.gov.in/ or https://dbt.karnataka.gov.in/", "Click 'Pension Status / Beneficiary Search'", "Enter your 12-digit Aadhaar Number or Taluk Pension Reference", "View monthly credit date, transaction batch ID, and linked bank account", "If stopped, verify whether Annual Life Certificate (Jeevan Pramaan) or NPCI bank seeding is active"],
            kn: ["https://dssp.karnataka.gov.in/ ಅಥವಾ https://dbt.karnataka.gov.in/ ಗೆ ಭೇಟಿ ನೀಡಿ", "'ಫಲಾನುಭವಿಗಳ ಸ್ಥಿತಿ' ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ", "ನಿಮ್ಮ 12-ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ", "ಪ್ರತಿ ತಿಂಗಳ ಪಾವತಿ ದಿನಾಂಕ ಮತ್ತು ಜಮೆಯಾದ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ನೋಡಿ", "ಹಣ ಬರುವುದು ನಿಂತಿದ್ದರೆ ವಾರ್ಷಿಕ ಜೀವನ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಬ್ಯಾಂಕ್ NPCI ಮ್ಯಾಪಿಂಗ್ ಪರಿಶೀಲಿಸಿ"],
            hi: ["https://dssp.karnataka.gov.in/ अथवा https://dbt.karnataka.gov.in/ पर जाएं", "'लाभार्थी स्थिति' पर क्लिक करें", "अपना 12 अंकों का आधार नंबर दर्ज करें", "मासिक भुगतान एवं क्रेडिट की स्थिति देखें", "भुगतान रुका हो तो वार्षिक जीवन प्रमाण पत्र एवं एनपीसीआई सीडिंग की जांच करें"]
          },
          escalation_route: { en: "DSSP Pension Helpdesk: 080-22340676 / Revenue Toll-Free: 1902", kn: "ಪಿಂಚಣಿ ಸಹಾಯವಾಣಿ: 080-22340676 / ಕಂದಾಯ ಇಲಾಖೆ: 1902", hi: "पेंशन हेल्पलाइन: 080-22340676 / राजस्व विभाग: 1902" }
        }
      ],
      required_documents: {
        en: ["Aadhaar Card of applicant", "Age Proof (Voter ID or Medical Officer Age Certificate)", "Income Certificate from Nadakacheri (< ₹32,000/yr)", "BPL Ration Card", "Bank Account passbook seeded with Aadhaar NPCI"],
        kn: ["ಅರ್ಜಿದಾರರ ಆಧಾರ್ ಕಾರ್ಡ್", "ವಯಸ್ಸಿನ ದೃಢೀಕರಣ (ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ)", "ನಡಕಚೇರಿ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ (ವಾರ್ಷಿಕ ₹32,000 ಒಳಗೆ)", "ಬಿಪಿಎಲ್ ಪಡಿತರ ಚೀಟಿ", "ಆಧಾರ್ ಲಿಂಕ್ ಆದ ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್"],
        hi: ["आवेदक का आधार कार्ड", "आयु प्रमाण (वोटर आईडी)", "नाडाकचेरी आय प्रमाणपत्र (< ₹32,000/वर्ष)", "बीपीएल राशन कार्ड", "एनपीसीआई से जुड़ा बैंक खाता"]
      }
    },

    // 6. Ration Cards & Food Services
    {
      id: "ahara_ration_card",
      category_id: "ration_food",
      localized_name: isKn ? "ಕರ್ನಾಟಕ ಆಹಾರ - ಪಡಿತರ ಚೀಟಿ ಸೇವೆಗಳು (BPL/APL)" : isHi ? "कर्नाटक राशन कार्ड सेवाएं (बीपीएल/एपीएल)" : "Karnataka Ahara - Ration Card Services (BPL/APL)",
      localized_provider: isKn ? "ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ" : isHi ? "खाद्य एवं नागरिक आपूर्ति विभाग" : "Food, Civil Supplies Dept, Karnataka",
      portal_url: "https://ahara.kar.nic.in/",
      verification_status: "verified",
      last_verified: "2026-03-15",
      localized_summary: isKn ? "ಹೊಸ ಪಡಿತರ ಚೀಟಿ, ಸದಸ್ಯರ ಸೇರ್ಪಡೆ, ಬಯೋಮೆಟ್ರಿಕ್ ಇ-ಕೆವೈಸಿ ಮತ್ತು ತಿದ್ದುಪಡಿ ಸೇವೆಗಳು." : isHi ? "राशन कार्ड आवेदन, सदस्यों को जोड़ने, बायोमेट्रिक ई-केवाईसी और संशोधन की सेवाएं।" : "Official portal for ration cards, newborn member additions, biometric e-KYC, and entitlements.",
      common_problems: [
        {
          problem_id: "ahara_update_ration_card",
          problem_title: { en: "How do I update my ration card (add member / correction)?", kn: "ನನ್ನ ಪಡಿತರ ಚೀಟಿಯನ್ನು ಅಪ್‌ಡೇಟ್ ಮಾಡುವುದು (ಸದಸ್ಯರ ಸೇರ್ಪಡೆ / ತಿದ್ದುಪಡಿ) ಹೇಗೆ?", hi: "राशन कार्ड में संशोधन अथवा नए सदस्य का नाम कैसे जोड़ें?" },
          recommended_action: { en: "Visit ahara.kar.nic.in under e-Services or visit a Grama One centre with member Aadhaar and birth certificate to submit amendment.", kn: "ahara.kar.nic.in ನಲ್ಲಿ ಅಥವಾ ಗ್ರಾಮ ಒನ್ ಕೇಂದ್ರದಲ್ಲಿ ಸದಸ್ಯರ ಆಧಾರ್ ಮತ್ತು ಜನನ ಪ್ರಮಾಣಪತ್ರದೊಂದಿಗೆ ಸೇರ್ಪಡೆ/ತಿದ್ದುಪಡಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.", hi: "सदस्य के आधार और जन्म प्रमाणपत्र के साथ ahara.kar.nic.in पोर्टल अथवा ग्राम वन केंद्र जाकर नाम जोड़ें।" },
          checklist: {
            en: ["Go to official Food Dept portal: https://ahara.kar.nic.in/ and select 'e-Services'", "Click 'e-Ration Card' -> 'Amendment Request'", "Select 'Addition of Member' or 'Name Correction'", "Authenticate Head of Family via Aadhaar OTP", "Enter child's Aadhaar and e-JanMa Birth Certificate number", "Pay ₹50 fee and receive acknowledgment for Food Inspector verification"],
            kn: ["https://ahara.kar.nic.in/ ಗೆ ಭೇಟಿ ನೀಡಿ 'ಇ-ಸೇವೆಗಳು' ಆಯ್ಕೆಮಾಡಿ", "'ಇ-ಪಡಿತರ ಚೀಟಿ' -> 'ತಿದ್ದುಪಡಿಗೆ ವಿನಂತಿ' ಕ್ಲಿಕ್ ಮಾಡಿ", "ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರ ಆಧಾರ್ ಒಟಿಪಿ ದೃಢೀಕರಿಸಿ", "ಮಗುವಿನ ಆಧಾರ್ ಮತ್ತು ಇ-ಜನ್ಮ ಜನನ ಪ್ರಮಾಣಪತ್ರ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ", "₹50 ಶುಲ್ಕ ಪಾವತಿಸಿ ಸ್ವೀಕೃತಿ ರಶೀದಿ ಪಡೆಯಿರಿ"],
            hi: ["https://ahara.kar.nic.in/ पर जाएं और 'ई-सर्विसेज' चुनें", "'ई-राशन कार्ड' -> 'संशोधन अनुरोध' पर क्लिक करें", "मुखिया के आधार ओटीपी से सत्यापन करें", "बच्चे का आधार व जन्म प्रमाणपत्र संख्या दर्ज करें", "पावती प्राप्त करें; 15 दिनों में कार्ड अपडेट हो जाएगा"]
          },
          escalation_route: { en: "Food & Civil Supplies Toll-Free: 1967 / 1800-425-9339", kn: "ಆಹಾರ ಇಲಾಖೆ ಸಹಾಯವಾಣಿ: 1967 / 1800-425-9339", hi: "खाद्य आपूर्ति हेल्पलाइन: 1967 / 1800-425-9339" }
        }
      ],
      required_documents: {
        en: ["Aadhaar cards of all family members", "Birth Certificate of child (for addition)", "Marriage Certificate (for spouse addition)", "Electricity bill / RR Number for address proof"],
        kn: ["ಕುಟುಂಬದ ಎಲ್ಲಾ ಸದಸ್ಯರ ಆಧಾರ್ ಕಾರ್ಡ್‌ಗಳು", "ಮಗುವಿನ ಜನನ ಪ್ರಮಾಣಪತ್ರ", "ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ", "ವಿದ್ಯುತ್ ಬಿಲ್ / RR ಸಂಖ್ಯೆ"],
        hi: ["परिवार के सभी सदस्यों का आधार कार्ड", "बच्चे का जन्म प्रमाणपत्र", "विवाह प्रमाणपत्र", "बिजली का बिल / पता प्रमाण"]
      }
    },

    // 7. Agriculture & Farmer Schemes
    {
      id: "pm_kisan_agriculture",
      category_id: "agriculture_farmer",
      localized_name: isKn ? "PM-KISAN ಸಮ್ಮಾನ್ ನಿಧಿ ಮತ್ತು ಕರ್ನಾಟಕ FRUITS" : isHi ? "पीएम-किसान सम्मान निधि एवं कर्नाटक फ्रूट्स" : "PM-KISAN Samman Nidhi & Karnataka FRUITS",
      localized_provider: isKn ? "ಕೃಷಿ ಮತ್ತು ರೈತರ ಕಲ್ಯಾಣ ಇಲಾಖೆ" : isHi ? "कृषि एवं किसान कल्याण विभाग" : "Department of Agriculture, Govt of India & Karnataka",
      portal_url: "https://pmkisan.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-15",
      localized_summary: isKn ? "ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವಾರ್ಷಿಕ ₹6,000 ಆದಾಯ ಬೆಂಬಲ ಮತ್ತು ಕರ್ನಾಟಕ FRUITS FID ಕೃಷಿ ಸೌಲಭ್ಯಗಳು." : isHi ? "किसान परिवारों को वार्षिक ₹6,000 की वित्तीय सहायता और कर्नाटक फ्रूट्स (FID) सेवाएं।" : "Direct income support of ₹6,000/year to landholding farmer families and Karnataka FRUITS FID benefits.",
      common_problems: [
        {
          problem_id: "pmkisan_apply_scheme",
          problem_title: { en: "How do I apply for a farmer scheme (PM-KISAN / Raitha Vidyanidhi)?", kn: "ರೈತ ಯೋಜನೆಗೆ (PM-KISAN / ರೈತ ವಿದ್ಯಾನಿಧಿ) ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", hi: "किसान योजना (पीएम-किसान / किसान छात्रवृत्ति) के लिए आवेदन कैसे करें?" },
          recommended_action: { en: "Register on pmkisan.gov.in with Aadhaar and RTC land records, and obtain a Karnataka Farmer ID (FID) on fruits.karnataka.gov.in at Raitha Samparka Kendra.", kn: "pmkisan.gov.in ನಲ್ಲಿ ಆಧಾರ್ ಮತ್ತು ಪಹಣಿಯೊಂದಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಮತ್ತು ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರದಲ್ಲಿ FRUITS FID ನೋಂದಣಿ ಮಾಡಿಸಿ.", hi: "pmkisan.gov.in पर आधार व खतौनी से पंजीकरण करें और रायता संपर्क केंद्र से फ्रूट्स (FID) आईडी बनवाएं।" },
          checklist: {
            en: ["Open official PM-KISAN portal: https://pmkisan.gov.in/", "Click 'New Farmer Registration' (Rural or Urban)", "Enter Aadhaar Number and select 'Karnataka'", "Enter survey number, sub-division, and khata number from your RTC/Pahani", "Submit online and visit your nearest Raitha Samparka Kendra to generate your FRUITS FID", "FRUITS FID auto-qualifies your college children for Raitha Vidyanidhi scholarship on SSP"],
            kn: ["https://pmkisan.gov.in/ ತೆರೆಯಿರಿ", "'New Farmer Registration' ಕ್ಲಿಕ್ ಮಾಡಿ", "ಆಧಾರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ ಮತ್ತು ರಾಜ್ಯ 'ಕರ್ನಾಟಕ' ಆಯ್ಕೆಮಾಡಿ", "ಪಹಣಿ/RTC ಯಲ್ಲಿರುವ ಸರ್ವೆ ನಂಬರ್ ಮತ್ತು ಖಾತಾ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ", "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರದಲ್ಲಿ ನಿಮ್ಮ FRUITS FID ಪಡೆಯಿರಿ", "FRUITS FID ಮೂಲಕ ಮಕ್ಕಳಿಗೆ SSP ಯಲ್ಲಿ 'ರೈತ ವಿದ್ಯಾನಿಧಿ' ವಿದ್ಯಾರ್ಥಿವೇತನ ಲಭಿಸುತ್ತದೆ"],
            hi: ["आधिकारिक पोर्टल https://pmkisan.gov.in/ खोलें", "'न्यू फार्मर रजिस्ट्रेशन' पर क्लिक करें", "आधार नंबर दर्ज कर 'कर्नाटक' चुनें", "अपनी खतौनी/आरटीसी से सर्वे नंबर एवं खाता संख्या भरें", "रायता संपर्क केंद्र जाकर फ्रूट्स (FID) आईडी बनवाएं", "फ्रूट्स आईडी होने पर बच्चों को 'रायता विद्यानिधि' छात्रवृत्ति स्वतः मिलेगी"]
          },
          escalation_route: { en: "PM-KISAN Helpline: 155261 / 011-24300606. Kisan Call Centre: 1800-180-1551", kn: "PM-KISAN ಸಹಾಯವಾಣಿ: 155261 / 011-24300606. ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್: 1800-180-1551", hi: "पीएम-किसान हेल्पलाइन: 155261 / 011-24300606. किसान कॉल सेंटर: 1800-180-1551" }
        }
      ],
      required_documents: {
        en: ["Aadhaar Card of farmer and spouse", "Land Record document (Karnataka RTC / Pahani)", "Bank Account seeded with Aadhaar NPCI", "Karnataka FRUITS Farmer ID (FID)"],
        kn: ["ರೈತ ಮತ್ತು ಪತ್ನಿಯ ಆಧಾರ್ ಕಾರ್ಡ್", "ಜಮೀನಿನ ಪಹಣಿ / RTC ದಾಖಲೆ", "ಆಧಾರ್ ಲಿಂಕ್ ಆದ ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್", "ಕರ್ನಾಟಕ FRUITS ರೈತ ಐಡಿ (FID)"],
        hi: ["किसान और जीवनसाथी का आधार कार्ड", "जमीन के दस्तावेज (खतौनी/आरटीसी)", "आधार से जुड़ा बैंक खाता", "कर्नाटक फ्रूट्स फार्मर आईडी (FID)"]
      }
    },

    // 8. Utilities & Local Services
    {
      id: "bescom_gruha_jyothi",
      category_id: "utilities_local",
      localized_name: isKn ? "ಬೆಸ್ಕಾಂ ಮತ್ತು ಗೃಹಜ್ಯೋತಿ ಉಚಿತ ವಿದ್ಯುತ್ ಯೋಜನೆ" : isHi ? "बेस्कॉम एवं गृह ज्योति मुफ्त बिजली योजना" : "BESCOM & Gruha Jyothi Free Electricity Scheme",
      localized_provider: isKn ? "ಇಂಧನ ಇಲಾಖೆ (ಬೆಸ್ಕಾಂ, ಹೆಸ್ಕಾಂ, ಜೆಸ್ಕಾಂ, ಮೆಸ್ಕಾಂ, ಸಿಇಎಸ್‌ಸಿ)" : isHi ? "ऊर्जा विभाग (बेस्कॉम, हेसकॉम, डिस्कॉम)" : "Energy Department (BESCOM, HESCOM, MESCOM), Karnataka",
      portal_url: "https://sevasindhu.karnataka.gov.in/",
      verification_status: "verified",
      last_verified: "2026-03-15",
      localized_summary: isKn ? "ಗೃಹಬಳಕೆದಾರರಿಗೆ 12 ತಿಂಗಳ ಸರಾಸರಿ + 10% ಆಧಾರದಲ್ಲಿ 200 ಯೂನಿಟ್‌ಗಳವರೆಗೆ ಉಚಿತ ವಿದ್ಯುತ್ ಯೋಜನೆ." : isHi ? "घरेलू उपभोक्ताओं के लिए 200 यूनिट तक मुफ्त बिजली (12 महीने का औसत + 10% बफर)।" : "Up to 200 units of free domestic electricity for residential consumers (12-month average + 10% buffer).",
      common_problems: [
        {
          problem_id: "gruha_jyothi_eligibility",
          problem_title: { en: "Who is eligible for Gruha Jyothi zero-bill?", kn: "ಗೃಹಜ್ಯೋತಿ ಶೂನ್ಯ ಬಿಲ್ ಪಡೆಯಲು ಯಾರು ಅರ್ಹರು?", hi: "गृह ज्योति शून्य बिजली बिल पाने के लिए कौन पात्र है?" },
          recommended_action: { en: "Residential consumers (both owners and tenants) whose monthly consumption is within 200 units and within their 12-month average plus 10% buffer are eligible for zero bills.", kn: "ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ಗೃಹಬಳಕೆದಾರರು (ಮನೆ ಮಾಲೀಕರು ಮತ್ತು ಬಾಡಿಗೆದಾರರು) ತಮ್ಮ 12 ತಿಂಗಳ ಸರಾಸರಿ + 10% ಮತ್ತು 200 ಯೂನಿಟ್‌ಗಳೊಳಗೆ ವಿದ್ಯುತ್ ಬಳಸಿದರೆ ಶೂನ್ಯ ಬಿಲ್ ಪಡೆಯಲು ಅರ್ಹರು.", hi: "सभी घरेलू उपभोक्ता (मालिक एवं किराएदार) जिनका मासिक उपभोग 200 यूनिट और 12 महीने के औसत + 10% तक सीमित है, वे शून्य बिल के पात्र हैं।" },
          checklist: {
            en: ["Must be a domestic residential connection (not commercial)", "Monthly consumption must be less than 200 units", "Entitlement is calculated as your past 12-month average usage + 10% buffer", "If usage is <= entitlement units: Net electricity charge is ZERO (Nil bill)", "If usage is between entitlement and 200 units: You pay only for difference units", "If usage exceeds 200 units: You must pay full bill without subsidy", "Link your Consumer Account ID and Aadhaar on Seva Sindhu to register"],
            kn: ["ಮೀಟರ್ ಗೃಹಬಳಕೆ (Domestic) ಆಗಿರಬೇಕು (ವಾಣಿಜ್ಯ ಬಳಕೆಯಲ್ಲ)", "ಮಾಸಿಕ ಬಳಕೆ 200 ಯೂನಿಟ್‌ಗಳಿಗಿಂತ ಕಡಿಮೆಯಿರಬೇಕು", "ಅರ್ಹತೆ: ಹಿಂದಿನ 12 ತಿಂಗಳ ಸರಾಸರಿ ಬಳಕೆ + 10% ಬಫರ್", "ಬಳಕೆ ಅರ್ಹತಾ ಮಿತಿಯೊಳಗಿದ್ದರೆ: ಬಿಲ್ ಸಂಪೂರ್ಣ ಶೂನ್ಯ (Zero Bill)", "ಬಳಕೆ 200 ಯೂನಿಟ್‌ಗಳನ್ನು ಮೀರಿದರೆ: ಆ ತಿಂಗಳ ಪೂರ್ಣ ಬಿಲ್ ಪಾವತಿಸಬೇಕು", "ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅಕೌಂಟ್ ಐಡಿ ಮತ್ತು ಆಧಾರ್ ಲಿಂಕ್ ಮಾಡಿ ನೋಂದಾಯಿಸಿ"],
            hi: ["कनेक्शन केवल घरेलू होना चाहिए (दुकान/कमर्शियल नहीं)", "मासिक बिजली खपत 200 यूनिट से कम होनी चाहिए", "पात्रता: पिछले 12 माह का औसत उपभोग + 10% बफर", "यदि उपभोग अनुमन्य सीमा तक है: बिल शून्य (Zero Bill) आएगा", "यदि उपभोग 200 यूनिट से अधिक है: पूरा बिल भरना होगा", "सेवा सिंधु पोर्टल पर बिजली खाता और आधार लिंक करें"]
          },
          escalation_route: { en: "BESCOM / ESCOM 24x7 Helpline: 1912 / WhatsApp: 9449844640", kn: "ಬೆಸ್ಕಾಂ 24x7 ಸಹಾಯವಾಣಿ: 1912 / ವಾಟ್ಸಾಪ್: 9449844640", hi: "बेस्कॉम 24x7 हेल्पलाइन: 1912 / व्हाट्सएप: 9449844640" }
        },
        {
          problem_id: "electricity_bill_complaint",
          problem_title: { en: "How can I complain about an electricity bill?", kn: "ವಿದ್ಯುತ್ ಬಿಲ್ ಸಮಸ್ಯೆ ಅಥವಾ ಹೆಚ್ಚುವರಿ ಬಿಲ್ ಬಗ್ಗೆ ದೂರು ನೀಡುವುದು ಹೇಗೆ?", hi: "बिजली बिल की समस्या या अधिक बिल की शिकायत कैसे करें?" },
          recommended_action: { en: "Call the 24x7 electricity helpline 1912 with your 10-digit Account ID, or lodge a billing complaint on the BESCOM portal (bescom.karnataka.gov.in).", kn: "24x7 ಸಹಾಯವಾಣಿ 1912 ಗೆ ಕರೆ ಮಾಡಿ ನಿಮ್ಮ 10-ಅಂಕಿಯ ಅಕೌಂಟ್ ಐಡಿ ನೀಡಿ ಬಿಲ್ ದೋಷದ ದೂರು ದಾಖಲಿಸಿ, ಅಥವಾ bescom.karnataka.gov.in ನಲ್ಲಿ ದೂರು ನೀಡಿ.", hi: "24x7 बिजली हेल्पलाइन 1912 पर कॉल करके अपनी 10 अंकों की खाता संख्या बताएं और शिकायत दर्ज कराएं अथवा bescom.karnataka.gov.in पर जाएं।" },
          checklist: {
            en: ["Dial toll-free 1912 from your phone (24x7 across Karnataka)", "Keep your 10-digit Account ID ready (from your electricity bill)", "State the issue: inflated bill, wrong meter reading, or missing Gruha Jyothi subsidy", "Note the Grievance Docket Number sent via SMS", "A junior engineer / meter reader will inspect within 7 working days and issue a revised bill if meter is faulty"],
            kn: ["1912 ಗೆ ಕರೆ ಮಾಡಿ (ಕರ್ನಾಟಕದಾದ್ಯಂತ 24x7 ಉಚಿತ ಲಭ್ಯ)", "ಬಿಲ್‌ನಲ್ಲಿರುವ 10-ಅಂಕಿಯ ಅಕೌಂಟ್ ಐಡಿ ಸಿದ್ಧವಾಗಿರಲಿ", "ಸಮಸ್ಯೆ ತಿಳಿಸಿ: ಅತಿಯಾದ ಬಿಲ್ ಮೊತ್ತ, ಮೀಟರ್ ದೋಷ ಅಥವಾ ಸಬ್ಸಿಡಿ ಬಾರದಿರುವುದು", "SMS ಮೂಲಕ ಬರುವ ದೂರು ಸಂಖ್ಯೆಯನ್ನು ಬರೆದಿಟ್ಟುಕೊಳ್ಳಿ", "7 ದಿನಗಳಲ್ಲಿ ಇಂಜಿನಿಯರ್ ಪರಿಶೀಲಿಸಿ ಪರಿಷ್ಕೃತ ಬಿಲ್ ನೀಡುತ್ತಾರೆ"],
            hi: ["टोल-फ्री 1912 डायल करें (24x7 उपलब्ध)", "अपने बिल से 10 अंकों का अकाउंट आईडी तैयार रखें", "समस्या बताएं: अत्यधिक बिल, गलत मीटर रीडिंग या सब्सिडी न मिलना", "शिकायत संख्या नोट करें; 7 दिनों में जांच उपरांत संशोधित बिल मिलेगा"]
          },
          escalation_route: { en: "BESCOM Customer Care: 1912 / Consumer Forum at Division Office", kn: "ಬೆಸ್ಕಾಂ ಗ್ರಾಹಕ ಸೇವೆ: 1912 / ಗ್ರಾಹಕ ವೇದಿಕೆ (CGRF)", hi: "बेस्कॉम कस्टमर केयर: 1912 / उपभोक्ता फोरम" }
        }
      ],
      required_documents: {
        en: ["Aadhaar Card of applicant (owner or tenant)", "Electricity Consumer Account ID / Connection Number", "Rental Agreement / Lease Deed (for tenants)"],
        kn: ["ಅರ್ಜಿದಾರರ (ಮಾಲೀಕ ಅಥವಾ ಬಾಡಿಗೆದಾರ) ಆಧಾರ್ ಕಾರ್ಡ್", "ವಿದ್ಯುತ್ ಅಕೌಂಟ್ ಐಡಿ / ಕನೆಕ್ಷನ್ ಸಂಖ್ಯೆ", "ಬಾಡಿಗೆ ಒಪ್ಪಂದ ಪತ್ರ (ಬಾಡಿಗೆದಾರರಿಗೆ)"],
        hi: ["आवेदक (मालिक या किराएदार) का आधार कार्ड", "बिजली उपभोक्ता खाता संख्या", "किराया अनुबंध (किराएदारों हेतु)"]
      }
    }
  ];

  return categoryId ? allServices.filter(s => s.category_id === categoryId) : allServices;
}

// --------------------------------------------------------------------------
// Offline Guidance generation for ANY service ID or query
// --------------------------------------------------------------------------
function getOfflineGuidance(serviceId, problemId, problemQuery, lang) {
  const isKn = lang === "kn";
  const isHi = lang === "hi";

  const services = getOfflineServices(null, lang);
  let service = services.find(s => s.id === serviceId);

  // If service not matched by ID, detect from query
  if (!service && problemQuery) {
    const qLower = problemQuery.toLowerCase();
    if (qLower.includes("bus pass") || qLower.includes("ksrtc") || qLower.includes("ಬಸ್ ಪಾಸ್") || qLower.includes("बस पास")) {
      service = services.find(s => s.id === "ksrtc_student_bus_pass");
    } else if (qLower.includes("caste") || qLower.includes("income") || qLower.includes("certificate") || qLower.includes("ಜಾತಿ") || qLower.includes("ಆದಾಯ") || qLower.includes("जाति")) {
      service = services.find(s => s.id === "nadakacheri_caste_income");
    } else if (qLower.includes("gruha") || qLower.includes("jyothi") || qLower.includes("electric") || qLower.includes("bescom") || qLower.includes("ಗೃಹಜ್ಯೋತಿ") || qLower.includes("ವಿದ್ಯುತ್") || qLower.includes("बिजली")) {
      service = services.find(s => s.id === "bescom_gruha_jyothi");
    } else if (qLower.includes("pension") || qLower.includes("sandhya") || qLower.includes("old age") || qLower.includes("ಪಿಂಚಣಿ") || qLower.includes("पेंशन")) {
      service = services.find(s => s.id === "karnataka_social_security_pensions");
    } else if (qLower.includes("ration") || qLower.includes("ahara") || qLower.includes("bpl") || qLower.includes("ಪಡಿತರ") || qLower.includes("राशन")) {
      service = services.find(s => s.id === "ahara_ration_card");
    } else if (qLower.includes("farmer") || qLower.includes("pm-kisan") || qLower.includes("kisan") || qLower.includes("agriculture") || qLower.includes("ರೈತ") || qLower.includes("किसान")) {
      service = services.find(s => s.id === "pm_kisan_agriculture");
    } else if (qLower.includes("grievance") || qLower.includes("complaint") || qLower.includes("cpgrams") || qLower.includes("ದೂರು") || qLower.includes("शिकायत")) {
      service = services.find(s => s.id === "cpgrams_grievances");
    }
  }

  // If still not matched, do not fabricate an action plan
  if (!service) {
    return null;
  }

  // Match problem
  let problem = null;
  if (problemId && service.common_problems) {
    problem = service.common_problems.find(p => p.problem_id === problemId);
  }
  if (!problem && problemQuery && service.common_problems) {
    const q = problemQuery.toLowerCase();
    problem = service.common_problems.find(p => {
      const t = (p.problem_title?.[lang] || p.problem_title?.en || "").toLowerCase();
      return q.includes("delay") && p.problem_id.includes("delayed") ||
             q.includes("renew") && p.problem_id.includes("renew") ||
             q.includes("apply") && p.problem_id.includes("apply") ||
             q.includes("eligib") && p.problem_id.includes("eligib");
    });
  }
  if (!problem && service.common_problems && service.common_problems.length > 0) {
    problem = service.common_problems[0];
  }

  const categoryTitles = {
    education_scholarships: isKn ? "ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ" : isHi ? "शिक्षा और छात्रवृत्तियाँ" : "Education & Scholarships",
    certificates_documents: isKn ? "ಪ್ರಮಾಣಪತ್ರಗಳು ಮತ್ತು ದಾಖಲೆಗಳು" : isHi ? "प्रमाणपत्र और दस्तावेज़" : "Certificates & Documents",
    transport_travel: isKn ? "ಸಾರಿಗೆ ಮತ್ತು ಪ್ರಯಾಣ" : isHi ? "परिवहन और यात्रा" : "Transport & Travel",
    grievances_complaints: isKn ? "ದೂರುಗಳು ಮತ್ತು ಅಹವಾಲುಗಳು" : isHi ? "शिकायतें और जन-शिकायत निवारಣ" : "Grievances & Complaints",
    pensions_welfare: isKn ? "ಪಿಂಚಣಿ ಮತ್ತು ಕಲ್ಯಾಣ" : isHi ? "पेंशन और कल्याण" : "Pensions & Welfare Benefits",
    ration_food: isKn ? "ಪಡಿತರ ಚೀಟಿ" : isHi ? "राशन कार्ड" : "Ration Cards & Food Services",
    agriculture_farmer: isKn ? "ಕೃಷಿ ಮತ್ತು ರೈತ ಯೋಜನೆಗಳು" : isHi ? "कृषि और किसान योजनाएं" : "Agriculture & Farmer Schemes",
    utilities_local: isKn ? "ಸ್ಥಳೀಯ ಸೇವೆಗಳು" : isHi ? "उपयोगिताएं और स्थानीय सेवाएं" : "Utilities & Local Services"
  };

  const userProblem = problem ? (problem.problem_title?.[lang] || problem.problem_title?.en) : (problemQuery || service.localized_name);
  const recAction = problem ? (problem.recommended_action?.[lang] || problem.recommended_action?.en) : service.localized_summary;
  const checklist = problem ? (problem.checklist?.[lang] || problem.checklist?.en || []) : (service.required_documents?.[lang] || service.required_documents?.en || []);
  const escalation = problem ? (problem.escalation_route?.[lang] || problem.escalation_route?.en) : `Official Portal: ${service.portal_url}`;
  const docs = service.required_documents?.[lang] || service.required_documents?.en || [];

  return {
    service_id: service.id,
    service_name: service.localized_name,
    category_title: categoryTitles[service.category_id] || "Public Services",
    portal_url: service.portal_url,
    verification_status: service.verification_status,
    last_verified: service.last_verified,
    user_problem: userProblem,
    explanation: service.localized_summary,
    recommended_action: recAction,
    checklist: checklist,
    required_documents: docs,
    escalation_route: escalation,
    disclaimer: isKn 
      ? "ಸೇವಾಸಂಜ್ಞೆ (SevaSignal) ಒಂದು ಸ್ವತಂತ್ರ ನಾಗರಿಕ ಮಾರ್ಗದರ್ಶನ ವೇದಿಕೆಯಾಗಿದ್ದು, ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್ ಅಲ್ಲ. ಕೊನೆಯ ದಿನಾಂಕಗಳನ್ನು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ."
      : isHi
      ? "सेवा-सिग्नल (SevaSignal) एक स्वतंत्र नागरिक मार्गदर्शन मंच है, आधिकारिक सरकारी पोर्टल नहीं। अंतिम समय-सीमा की पुष्टि आधिकारिक पोर्टल पर करें।"
      : "SevaSignal is an independent guidance platform and not an official government portal. Verify details on the official portal before taking legal or financial action.",
    language: lang
  };
}

// --------------------------------------------------------------------------
// Intelligent Offline Chatbot Fallback: NEVER repeats generic Seva Sindhu!
// Accurately recognizes services, situations, follow-ups, and languages.
// --------------------------------------------------------------------------
function getOfflineChatResponse(question, lang = "en", serviceId = null, history = []) {
  const isKn = lang === "kn";
  const isHi = lang === "hi";

  // 0. Check for empty or whitespace
  if (!question || !question.trim()) {
    const text = isKn
      ? "ನೀವು ಏನು ಕೇಳುತ್ತಿದ್ದೀರಿ ಎಂದು ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೆಲವು ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ ತಿಳಿಸಿ."
      : isHi
      ? "मुझे समझ नहीं आया कि आप क्या पूछ रहे हैं। क्या आप कृपया कुछ शब्दों में अपना प्रश्न स्पष्ट कर सकते हैं?"
      : "I'm not sure what you're asking. Could you please explain your question in a few words?";
    return {
      answer: text,
      language: lang,
      identified_service: null,
      sources: [],
      verification_status: "unverified",
      last_verified: null,
      suggested_steps: [],
      is_fallback: true
    };
  }

  const raw = question.trim();
  const clean = raw.replace(/[\s\?\!\.\,\;\:\-\_\@\#\$\%\^\&\*\(\)\[\]\{\}\<\>\/\\\|\`\~\'\"+=]+/g, "");
  
  // Punctuation-only
  if (clean.length === 0) {
    const text = isKn
      ? "ನೀವು ಏನು ಕೇಳುತ್ತಿದ್ದೀರಿ ಎಂದು ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೆಲವು ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ ತಿಳಿಸಿ."
      : isHi
      ? "मुझे समझ नहीं आया कि आप क्या पूछ रहे हैं। क्या आप कृपया कुछ शब्दों में अपना प्रश्न स्पष्ट कर सकते हैं?"
      : "I'm not sure what you're asking. Could you please explain your question in a few words?";
    return {
      answer: text,
      language: lang,
      identified_service: null,
      sources: [],
      verification_status: "unverified",
      last_verified: null,
      suggested_steps: [],
      is_fallback: true
    };
  }

  const q = raw.toLowerCase();

  // Keyboard mash (e.g. asdfghjkl123)
  if (/asdfghjkl|qwerty|zxcvbn|[a-z0-9]*asdfghjkl/.test(q)) {
    const text = isKn
      ? "ನಿಮ್ಮ ಸಂದೇಶದಲ್ಲಿ ಯಾದೃಚ್ಛಿಕ (random) ಅಕ್ಷರಗಳಿರುವಂತೆ ತೋರುತ್ತಿದೆ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ನಮೂದಿಸಿ."
      : isHi
      ? "ऐसा प्रतीत होता है कि आपके संदेश में यादृच्छिक (random) अक्षर हैं। कृपया अपना प्रश्न दोबारा दर्ज करें ताकि मैं आपकी सहायता कर सकूँ।"
      : "It looks like your message may contain random text. Please enter your question again so I can help you.";
    return {
      answer: text,
      language: lang,
      identified_service: null,
      sources: [],
      verification_status: "unverified",
      last_verified: null,
      suggested_steps: [],
      is_fallback: true
    };
  }

  // Greetings
  const words = q.split(/\s+/).map(w => w.replace(/[?!.,]/g, ""));
  const greetingWords = new Set(["hi", "hello", "hey", "namaste", "namaskara", "greetings", "ಹಲೋ", "ನಮಸ್ಕಾರ", "ಹಾಯ್", "नमस्ते", "प्रणाम", "हेलो"]);
  const civicKeywords = ["scholarship", "certificate", "bus", "bill", "ration", "pension", "farmer", "ವಿದ್ಯಾರ್ಥಿವೇತನ", "ಪ್ರಮಾಣಪತ್ರ", "ಬಸ್", "ಬಿಲ್", "ಪಡಿತರ", "ಪಿಂಚಣಿ", "ರೈತ", "छात्रवृत्ति", "प्रमाणपत्र", "बिजली", "राशन", "पेंशन", "किसान"];
  if (words.length <= 3 && words.some(w => greetingWords.has(w)) && !civicKeywords.some(k => q.includes(k))) {
    const text = isKn
      ? "ನಮಸ್ಕಾರ! ಸೇವಾಸಂಜ್ಞೆಗೆ (SevaSignal) ಸುಸ್ವಾಗತ. ಇಂದು ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು, ವಿದ್ಯಾರ್ಥಿವೇತನ ಅಥವಾ ಪ್ರಮಾಣಪತ್ರಗಳ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?"
      : isHi
      ? "नमस्ते! सेवा-सिग्नल में आपका स्वागत है। आज मैं छात्रवृत्ति, प्रमाणपत्र या अन्य सार्वजनिक सेवाओं में आपकी क्या सहायता कर सकता हूँ?"
      : "Hello! Welcome to SevaSignal. How can I help you with public services today?";
    return {
      answer: text,
      language: lang,
      identified_service: null,
      sources: [],
      verification_status: "unverified",
      last_verified: null,
      suggested_steps: [],
      is_fallback: true
    };
  }

  // Casual how are you
  if (["how are you", "how r u", "how do you do", "hegidira", "hegiddeera", "kaise ho", "aap kaise hain", "ಹೇಗಿದ್ದೀರಾ", "ನೀವು ಹೇಗಿದ್ದೀರಿ", "आप कैसे हैं"].some(p => q.includes(p))) {
    const text = isKn
      ? "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು! ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು, ಪ್ರಮಾಣಪತ್ರಗಳು, ಪಿಂಚಣಿ ಮತ್ತು ವಿದ್ಯುತ್ ಸೇವೆಗಳಂತಹ ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳಲ್ಲಿ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ನಾನಿದ್ದೇನೆ. ಇಂದು ನಿಮಗೆ ಯಾವ ಮಾಹಿತಿ ಬೇಕು?"
      : isHi
      ? "मैं ठीक हूँ, धन्यवाद! मैं छात्रवृत्ति, प्रमाणपत्र, पेंशन और उपयोगिता जैसी सार्वजनिक सेवाओं में आपका मार्गदर्शन करने के लिए यहाँ हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?"
      : "I am doing well, thank you! I am here to help you navigate public services like scholarships, certificates, pensions, and utilities. What can I assist you with today?";
    return {
      answer: text,
      language: lang,
      identified_service: null,
      sources: [],
      verification_status: "unverified",
      last_verified: null,
      suggested_steps: [],
      is_fallback: true
    };
  }

  // Out of scope
  const outWords = ["weather", "temperature", "rain today", "cricket", "ipl", "football", "recipe", "tell me a joke", "sing a song", "movie", "cinema", "president of", "मौसम", "हवामान", "ಹವಾಮಾನ"];
  if (outWords.some(ow => q.includes(ow))) {
    const text = isKn
      ? "ಸೇವಾಸಂಜ್ಞೆ (SevaSignal) ಕೇವಲ ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು, ವಿದ್ಯಾರ್ಥಿವೇತನ, ಪ್ರಮಾಣಪತ್ರ, ಪಡಿತರ ಚೀಟಿ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾರ್ಗದರ್ಶನಕ್ಕೆ ಸೀಮಿತವಾಗಿದೆ. ಹವಾಮಾನ ಅಥವಾ ಇತರ ಸಾಮಾನ್ಯ ವಿಷಯಗಳ ಮಾಹಿತಿ ಇಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ."
      : isHi
      ? "सेवा-सिग्नल विशेष रूप से सार्वजनिक सेवाओं, छात्रवृत्ति, प्रमाणपत्र, राशन कार्ड और सरकारी योजनाओं के मार्गदर्शन के लिए है। मौसम या मनोरंजन जैसे विषयों की जानकारी यहाँ उपलब्ध नहीं है। कृपया नागरिक सेवाओं से संबंधित प्रश्न पूछें।"
      : "SevaSignal specializes exclusively in public-service and citizen guidance (such as scholarships, certificates, transport, ration cards, and welfare schemes). I cannot provide general information such as weather forecasts or entertainment. Please ask a question related to civic services.";
    return {
      answer: text,
      language: lang,
      identified_service: null,
      sources: [],
      verification_status: "unverified",
      last_verified: null,
      suggested_steps: [],
      is_fallback: true
    };
  }

  // Consonant mashing / gibberish (e.g. jjhhhghjhkj)
  const knownAcronyms = new Set(["ksrtc", "bmtc", "cpgrams", "pmkisan", "bescom", "hescom", "gescom", "mescom", "sakala", "sevasindhu"]);
  for (const word of words) {
    const wClean = word.replace(/[^a-zA-Z]/g, "");
    if (wClean.length >= 6 && !knownAcronyms.has(wClean)) {
      const vowels = (wClean.match(/[aeiouy]/g) || []).length;
      const consonants = wClean.length - vowels;
      if (vowels === 0 || (consonants / Math.max(1, vowels) > 5) || /[bcdfghjklmnpqrstvwxz]{5,}/.test(wClean)) {
        const text = isKn
          ? "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನನಗೆ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ವಿದ್ಯಾರ್ಥಿವೇತನ, ಪ್ರಮಾಣಪತ್ರ, ಪಿಂಚಣಿ ಅಥವಾ ವಿದ್ಯುತ್ ಸೇವೆಗಳಂತಹ ಯಾವ ಸಾರ್ವಜನಿಕ ಸೇವೆಯ ಮಾಹಿತಿ ನಿಮಗೆ ಬೇಕು ಎಂದು ದಯವಿಟ್ಟು ತಿಳಿಸಿ."
          : isHi
          ? "मैं आपका संदेश समझ नहीं पाया। कृपया मुझे बताएं कि आपको किस सार्वजनिक सेवा (जैसे छात्रवृत्ति, प्रमाणपत्र, पेंशन या बिजली सेवा) में सहायता चाहिए।"
          : "I couldn't understand your message. Please tell me which public service you need help with, such as scholarships, certificates, pensions, or electricity services.";
        return {
          answer: text,
          language: lang,
          identified_service: null,
          sources: [],
          verification_status: "unverified",
          last_verified: null,
          suggested_steps: [],
          is_fallback: true
        };
      }
    }
  }

  // 1. Topic & Service Identification
  let targetServiceId = serviceId;

  if (!targetServiceId) {
    if (q.includes("bus pass") || q.includes("ksrtc") || q.includes("bmtc") || q.includes("ಬಸ್ ಪಾಸ್") || q.includes("बस पास")) {
      targetServiceId = "ksrtc_student_bus_pass";
    } else if (q.includes("caste") || q.includes("income cert") || q.includes("nadakacheri") || q.includes("rd number") || q.includes("ಜಾತಿ") || q.includes("ಆದಾಯ") || q.includes("ನಾಡಕಚೇರಿ") || q.includes("जाति") || q.includes("आय प्रमाण")) {
      targetServiceId = "nadakacheri_caste_income";
    } else if (q.includes("driving") || q.includes("learner") || q.includes("llr") || q.includes("sarathi") || q.includes("parivahan") || q.includes("ಲರ್ನರ್ಸ್") || q.includes("ಲೈಸೆನ್ಸ್") || q.includes("ड्राइविंग")) {
      targetServiceId = "parivahan_driving_licence";
    } else if (q.includes("gruha") || q.includes("jyothi") || q.includes("zero bill") || q.includes("zero-bill") || q.includes("electricity") || q.includes("bescom") || q.includes("ಗೃಹಜ್ಯೋತಿ") || q.includes("ವಿದ್ಯುತ್") || q.includes("ಶೂನ್ಯ ಬಿಲ್") || q.includes("गृह ज्योति") || q.includes("बिजली")) {
      targetServiceId = "bescom_gruha_jyothi";
    } else if (q.includes("pension") || q.includes("sandhya") || q.includes("old age") || q.includes("widow") || q.includes("ಪಿಂಚಣಿ") || q.includes("ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ") || q.includes("ಪेंशन")) {
      targetServiceId = "karnataka_social_security_pensions";
    } else if (q.includes("ration") || q.includes("ahara") || q.includes("bpl") || q.includes("ಪಡಿತರ") || q.includes("ರೇಷನ್") || q.includes("राशन")) {
      targetServiceId = "ahara_ration_card";
    } else if (q.includes("farmer") || q.includes("pm-kisan") || q.includes("kisan") || q.includes("fruits") || q.includes("fid") || q.includes("agriculture") || q.includes("ರೈತ") || q.includes("ಕೃಷಿ") || q.includes("किसान")) {
      targetServiceId = "pm_kisan_agriculture";
    } else if (q.includes("grievance") || q.includes("complaint") || q.includes("cpgrams") || q.includes("ಜನಸ್ಪಂದನ") || q.includes("ದೂರು") || q.includes("शिकायत")) {
      targetServiceId = "cpgrams_grievances";
    } else if (q.includes("ssp") || q.includes("scholarship") || q.includes("ವಿದ್ಯಾರ್ಥಿವೇತನ") || q.includes("छात्रवृत्ति")) {
      targetServiceId = "ssp_postmatric_karnataka";
    }
  }

  // 2. Follow-up context resolution: If current question has no keywords, check history
  if (!targetServiceId && history && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const prev = history[i].content?.toLowerCase() || "";
      if (prev.includes("ssp") || prev.includes("scholarship") || prev.includes("ವಿದ್ಯಾರ್ಥಿವೇತನ") || prev.includes("छात्रवृत्ति")) {
        targetServiceId = "ssp_postmatric_karnataka"; break;
      } else if (prev.includes("bus pass") || prev.includes("ksrtc") || prev.includes("ಬಸ್ ಪಾಸ್") || prev.includes("बस पास")) {
        targetServiceId = "ksrtc_student_bus_pass"; break;
      } else if (prev.includes("caste") || prev.includes("income") || prev.includes("nadakacheri") || prev.includes("ಜಾತಿ") || prev.includes("जाति")) {
        targetServiceId = "nadakacheri_caste_income"; break;
      } else if (prev.includes("gruha") || prev.includes("electricity") || prev.includes("bescom") || prev.includes("ಗೃಹಜ್ಯೋತಿ") || prev.includes("बिजली")) {
        targetServiceId = "bescom_gruha_jyothi"; break;
      } else if (prev.includes("pension") || prev.includes("sandhya") || prev.includes("ಪಿಂಚಣಿ") || prev.includes("पेंशन")) {
        targetServiceId = "karnataka_social_security_pensions"; break;
      } else if (prev.includes("ration") || prev.includes("ahara") || prev.includes("ಪಡಿತರ") || prev.includes("राशन")) {
        targetServiceId = "ahara_ration_card"; break;
      } else if (prev.includes("farmer") || prev.includes("kisan") || prev.includes("ರೈತ") || prev.includes("किसान")) {
        targetServiceId = "pm_kisan_agriculture"; break;
      }
    }
  }

  // If no service could be detected at all
  if (!targetServiceId) {
    const noMatchText = isKn
      ? "ನಾವು ಪರಿಶೀಲಿಸಿದ ಸೇವಾಸಂಜ್ಞೆ (SevaSignal) ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಹುಡುಕಿದ್ದೇವೆ, ಆದರೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ನಿಖರವಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಮಾಹಿತಿ ಕಂಡುಬಂದಿಲ್ಲ. ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳ ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಕರ್ನಾಟಕ ಸೇವಾ ಸಿಂಧು (https://sevasindhu.karnataka.gov.in/) ಅಥವಾ ಸಹಾಯವಾಣಿ 1902 ಅನ್ನು ಸಂಪರ್ಕಿಸಿ."
      : isHi
      ? "हमने सत्यापित सेवा-सिग्नल डेटाबेस में खोज की, लेकिन आपके प्रश्न से संबंधित सटीक सरकारी योजना उपलब्ध नहीं है। सामान्य नागरिक सेवाओं की जानकारी के लिए कृपया कर्नाटक सेवा सिंधु (https://sevasindhu.karnataka.gov.in/) अथवा हेल्पलाइन 1902 पर संपर्क करें।"
      : "We searched the verified SevaSignal knowledge base, but could not identify a specific government scheme matching your question. For general Karnataka public services, you can explore Seva Sindhu (https://sevasindhu.karnataka.gov.in/) or call toll-free 1902.";

    return {
      answer: noMatchText,
      language: lang,
      identified_service: null,
      sources: [{ title: "Karnataka Seva Sindhu", url: "https://sevasindhu.karnataka.gov.in/", department: "DPAR", verification_status: "verified", last_verified: "2026-03-15" }],
      verification_status: "unverified",
      last_verified: null,
      suggested_steps: [],
      is_fallback: true
    };
  }

  const services = getOfflineServices(null, lang);
  const service = services.find(s => s.id === targetServiceId) || services[0];
  const sName = service.localized_name;
  const portal = service.portal_url;

  // 3. User Intent Detection
  const isQualification = q.includes("qualification") || q.includes("eligible") || q.includes("eligibility") || q.includes("who is eligible") || q.includes("criteria") || q.includes("ಅರ್ಹತೆ") || q.includes("ಮಾನದಂಡ") || q.includes("ಯಾರು ಅರ್ಹರು") || q.includes("पात्रता") || q.includes("योग्यता") || q.includes("कौन पात्र");
  const isDocuments = q.includes("document") || q.includes("what documents") || q.includes("which documents") || q.includes("proof") || q.includes("ದಾಖಲೆ") || q.includes("ದಾಖಲೆಗಳು") || q.includes("ದಸ್ತಾವೇಜು") || q.includes("दस्तावेज") || q.includes("कागजात");
  const isDelayedPayment = q.includes("delayed") || q.includes("not credited") || q.includes("pending payment") || q.includes("ಹಣ ಬಂದಿಲ್ಲ") || q.includes("ತಡವಾಗಿದೆ") || q.includes("विलंबित") || q.includes("पैसा नहीं आया") || q.includes("रुका");
  const isRenewal = q.includes("renew") || q.includes("renewal") || q.includes("ನವೀಕರಣ") || q.includes("ನವೀಕರಿಸುವುದು") || q.includes("नवीनीकरण");
  const isDownload = q.includes("download") || q.includes("print") || q.includes("ಡೌನ್‌ಲೋಡ್") || q.includes("ಪ್ರಿಂಟ್") || q.includes("डाउनलोड");
  const isComplaint = q.includes("complain") || q.includes("complaint") || q.includes("where can i complain") || q.includes("ದೂರು") || q.includes("ಸಹಾಯವಾಣಿ") || q.includes("शिकायत");

  let answer = "";
  let steps = [];

  if (isQualification) {
    if (service.id === "bescom_gruha_jyothi") {
      answer = isKn
        ? `**ಗೃಹಜ್ಯೋತಿ ಶೂನ್ಯ ಬಿಲ್ ಅರ್ಹತಾ ಮಾನದಂಡಗಳು:**\n\n1. ಗೃಹಬಳಕೆ (Domestic) ಮೀಟರ್ ಹೊಂದಿರುವ ಮನೆ ಮಾಲೀಕರು ಮತ್ತು ಬಾಡಿಗೆದಾರರು ಇಬ್ಬರೂ ಅರ್ಹರು.\n2. ಮಾಸಿಕ ಬಳಕೆ 200 ಯೂನಿಟ್‌ಗಳೊಳಗೆ ಇರಬೇಕು.\n3. ನಿಮ್ಮ ಹಿಂದಿನ 12 ತಿಂಗಳ ಸರಾಸರಿ ಬಳಕೆಗೆ 10% ಬಫರ್ ಸೇರಿಸಿ ಅರ್ಹತಾ ಮಿತಿಯನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ.\n4. ಬಳಕೆ ಅರ್ಹತಾ ಮಿತಿಯೊಳಗಿದ್ದರೆ ಬಿಲ್ ಮೊತ್ತ ಶೂನ್ಯ (Zero Bill) ಆಗಿರುತ್ತದೆ.\n\n**ಅಧಿಕೃತ ಪೋರ್ಟಲ್:** ${portal}`
        : isHi
        ? `**गृह ज्योति शून्य बिजली बिल पात्रता शर्तें:**\n\n1. घरेलू मीटर धारक मकान मालिक और किराएदार दोनों पात्र हैं।\n2. मासिक उपभोग 200 यूनिट से कम होना चाहिए।\n3. पिछले 12 महीनों के औसत उपभोग पर 10% अतिरिक्त यूनिट्स की छूट मिलती है।\n4. यदि बिजली खपत इस सीमा के भीतर है, तो बिल पूरी तरह शून्य (Zero Bill) आएगा।\n\n**आधिकारिक पोर्टल:** ${portal}`
        : `**Gruha Jyothi Zero-Bill Eligibility Criteria:**\n\n1. Both homeowners and tenants with domestic residential meters are eligible.\n2. Monthly consumption must remain strictly under 200 units.\n3. Entitlement is calculated as your past 12-month average consumption plus a 10% buffer.\n4. If your monthly usage is within this entitlement, you receive a ZERO bill (Nil charges).\n\n**Official Portal:** ${portal}`;
      steps = ["Verify domestic meter status", "Keep usage under calculated entitlement", "Register Aadhaar & Account ID on Seva Sindhu"];
    } else {
      const elig = service.eligibility?.[lang] || service.eligibility?.en || [
        "Karnataka Domicile / Resident",
        "Enrolled in recognized course or eligible category",
        "Family income within prescribed limits",
        "Aadhaar-seeded bank account"
      ];
      answer = isKn
        ? `**${sName} — ಅರ್ಹತಾ ಮಾನದಂಡಗಳು:**\n\n${elig.map((e, idx) => `${idx + 1}. ${e}`).join("\n")}\n\n**ಅಧಿಕೃತ ಪೋರ್ಟಲ್:** ${portal}`
        : isHi
        ? `**${sName} — पात्रता एवं योग्यता:**\n\n${elig.map((e, idx) => `${idx + 1}. ${e}`).join("\n")}\n\n**आधिकारिक पोर्टल:** ${portal}`
        : `**${sName} — Eligibility & Qualification Criteria:**\n\n${elig.map((e, idx) => `${idx + 1}. ${e}`).join("\n")}\n\n**Official Portal:** ${portal}`;
      steps = elig;
    }
  } else if (isDocuments) {
    const docs = service.required_documents?.[lang] || service.required_documents?.en || [];
    answer = isKn
      ? `**${sName} — ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು:**\n\n${docs.map((d, idx) => `${idx + 1}. ${d}`).join("\n")}\n\n**ಅಧಿಕೃತ ಪೋರ್ಟಲ್:** ${portal}`
      : isHi
      ? `**${sName} — आवश्यक दस्तावेज:**\n\n${docs.map((d, idx) => `${idx + 1}. ${d}`).join("\n")}\n\n**आधिकारिक पोर्टल:** ${portal}`
      : `**${sName} — Required Documents Checklist:**\n\n${docs.map((d, idx) => `${idx + 1}. ${d}`).join("\n")}\n\n**Official Portal:** ${portal}`;
    steps = docs;
  } else if (isDelayedPayment) {
    if (service.id === "ssp_postmatric_karnataka") {
      answer = isKn
        ? `**SSP ವಿದ್ಯಾರ್ಥಿವೇತನ ಹಣ ತಡವಾಗಿರಲು ಕಾರಣ ಮತ್ತು ಪರಿಹಾರ:**\n\n1. ಕರ್ನಾಟಕ DBT ಪೋರ್ಟಲ್‌ಗೆ (https://dbt.karnataka.gov.in/) ಆಧಾರ್ ಬಳಸಿ ಲಾಗಿನ್ ಆಗಿ ಪಾವತಿ ಸ್ಥಿತಿ ನೋಡಿ.\n2. 'Aadhaar not mapped to NPCI' ಎಂದು ತೋರಿಸುತ್ತಿದ್ದರೆ, ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ 'Aadhaar DBT Seeding Mandate' ಫಾರ್ಮ್ ಸಲ್ಲಿಸಿ.\n3. ಬ್ಯಾಂಕ್ ಅಪ್‌ಡೇಟ್ ಆದ ನಂತರ ಮುಂದಿನ DBT ಪಾವತಿ ಸೈಕಲ್‌ನಲ್ಲಿ ಹಣ ಜಮೆಯಾಗುತ್ತದೆ.\n\n**ಸಹಾಯವಾಣಿ:** 080-35254757 / 1902`
        : isHi
        ? `**एसएसपी छात्रवृत्ति भुगतान विलंब समाधान:**\n\n1. कर्नाटक डीबीटी पोर्टल (https://dbt.karnataka.gov.in/) पर आधार से लॉगिन कर भुगतान स्थिति जांचें।\n2. यदि स्थिति 'Aadhaar not mapped to NPCI' है, तो अपनी बैंक शाखा जाकर 'आधार डीबीटी सीडिंग' फॉर्म जमा करें।\n3. बैंक द्वारा सक्रिय करने के बाद अगले चक्र में राशि सीधे खाते में आ जाएगी।\n\n**हेल्पलाइन:** 080-35254757 / 1902`
        : `**SSP Scholarship Delayed Payment Troubleshooting:**\n\n1. Log in to Karnataka DBT Portal (https://dbt.karnataka.gov.in/) using your Aadhaar number to view transaction remarks.\n2. If status indicates 'Aadhaar not mapped to NPCI', visit your bank branch and submit the Aadhaar DBT Seeding Mandate form.\n3. Once seeded, the Social Welfare department will automatically re-push disbursement in the next DBT billing cycle.\n\n**Helpline:** 080-35254757 / Social Welfare: 1902`;
      steps = ["Check DBT status on dbt.karnataka.gov.in", "Visit bank for NPCI Aadhaar seeding", "Confirm status shows Active on UIDAI bank checker"];
    } else {
      answer = isKn
        ? `**${sName} — ಪಾವತಿ ವಿಳಂಬ ಪರಿಶೀಲನೆ:**\n\nಕರ್ನಾಟಕ DBT ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಆಧಾರ್ ಬಳಸಿ ಲಾಗಿನ್ ಆಗಿ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ NPCI ಮ್ಯಾಪಿಂಗ್ ಸಕ್ರಿಯವಾಗಿದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.\n\n**ಸಹಾಯವಾಣಿ:** 1902`
        : isHi
        ? `**${sName} — भुगतान विलंब जांच:**\n\nकर्नाटक डीबीटी पोर्टल पर आधार से लॉगिन कर जांचें और बैंक में आधार-एनपीसीआई सीडिंग सुनिश्चित करें।\n\n**हेल्पलाइन:** 1902`
        : `**${sName} — Payment Delay Troubleshooting:**\n\nCheck transaction status on the Karnataka DBT portal and ensure your bank account has active Aadhaar NPCI seeding.\n\n**Helpline:** 1902`;
      steps = ["Check DBT portal status", "Verify bank account NPCI mapping"];
    }
  } else if (isDownload && service.id === "nadakacheri_caste_income") {
    answer = isKn
      ? `**ಡಿಜಿಟಲ್ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡುವ ವಿಧಾನ:**\n\n1. ಅಧಿಕೃತ ನಾಡಕಚೇರಿ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ: https://nadakacheri.karnataka.gov.in/\n2. 'ಆನ್‌ಲೈನ್ ಅರ್ಜಿ' ಮೆನು ಕ್ಲಿಕ್ ಮಾಡಿ 'ಪ್ರಿಂಟ್ ಸರ್ಟಿಫಿಕೇಟ್' ಆಯ್ಕೆಮಾಡಿ.\n3. ನಿಮ್ಮ 15-ಅಂಕಿಯ RD ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (ಉದಾ: RD0038...).\n4. 'Search' ಕ್ಲಿಕ್ ಮಾಡಿ ಬಾರ್‌ಕೋಡ್ ಮತ್ತು ಡಿಜಿಟಲ್ ಸಹಿ ಇರುವ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.\n\n**ನಾಡಕಚೇರಿ ಸಹಾಯವಾಣಿ:** 080-22340639`
      : isHi
      ? `**डिजिटल जाति प्रमाणपत्र डाउनलोड करने की प्रक्रिया:**\n\n1. आधिकारिक नाडाकचेरी पोर्टल खोलें: https://nadakacheri.karnataka.gov.in/\n2. 'ऑनलाइन एप्लीकेशन' में जाकर 'प्रिंट सर्टिफिकेट' पर क्लिक करें।\n3. अपना 15 अंकों का आरडी (RD) नंबर दर्ज करें (जैसे RD0038...)।\n4. 'सर्च' करें और बारकोड युक्त डिजिटल पीडीएफ डाउनलोड करें।\n\n**हेल्पलाइन:** 080-22340639`
      : `**How to Download Digitally Signed Caste Certificate:**\n\n1. Visit the official Nadakacheri portal: https://nadakacheri.karnataka.gov.in/\n2. Click on 'Online Application' and choose 'Print Certificate'.\n3. Enter your 15-digit RD Number (e.g., RD0038...).\n4. Click 'Search' and download the digitally signed PDF featuring official barcode and Sakala seal.\n\n**Nadakacheri Helpline:** 080-22340639`;
    steps = ["Open nadakacheri.karnataka.gov.in", "Click Print Certificate", "Enter 15-digit RD number", "Download signed PDF"];
  } else if (isRenewal && service.id === "ksrtc_student_bus_pass") {
    answer = isKn
      ? `**KSRTC ವಿದ್ಯಾರ್ಥಿ ಬಸ್ ಪಾಸ್ ನವೀಕರಣ ವಿಧಾನ:**\n\n1. ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್‌ನಲ್ಲಿ (https://sevasindhu.karnataka.gov.in/) ವಿದ್ಯಾರ್ಥಿ ಬಸ್ ಪಾಸ್ ನವೀಕರಣ ಆಯ್ಕೆಮಾಡಿ.\n2. ಹಿಂದಿನ ವರ್ಷದ ಬಸ್ ಪಾಸ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ ವಿವರಗಳನ್ನು ಪಡೆಯಿರಿ.\n3. ಪ್ರಸಕ್ತ ಶೈಕ್ಷಣಿಕ ವರ್ಷದ ಕಾಲೇಜು ಶುಲ್ಕ ರಶೀದಿ ಮತ್ತು ಭಾವಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.\n4. ಅರ್ಜಿ ಸಲ್ಲಿಸಿ, ಅನುಮೋದನೆಯ ನಂತರ KSRTC ಬಸ್ ಡಿಪೋ ಕೌಂಟರ್‌ನಲ್ಲಿ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ಪಾಸ್ ಪಡೆಯಿರಿ.\n\n**KSRTC ಸಹಾಯವಾಣಿ:** 080-26252625`
      : isHi
      ? `**केएसआरटीसी छात्र बस पास नवीनीकरण प्रक्रिया:**\n\n1. सेवा सिंधु पोर्टल (https://sevasindhu.karnataka.gov.in/) पर छात्र बस पास नवीनीकरण चुनें।\n2. पिछले वर्ष का पास नंबर दर्ज कर विवरण प्राप्त करें।\n3. नए सत्र की कॉलेज फीस रसीद और फोटो अपलोड करें।\n4. आवेदन सबमिट करें और स्वीकृति उपरांत बस डिपो से नया पास प्राप्त करें।\n\n**केएसआरटीसी हेल्पलाइन:** 080-26252625`
      : `**KSRTC Student Bus Pass Renewal Procedure:**\n\n1. Visit Seva Sindhu (https://sevasindhu.karnataka.gov.in/) and select 'Student Bus Pass - Renewal'.\n2. Enter your previous year pass number or SATS ID to populate student data.\n3. Upload your current academic year admission fee receipt and photograph.\n4. Submit online and collect your updated smart pass at the designated KSRTC bus depot.\n\n**KSRTC Helpline:** 080-26252625`;
    steps = ["Open Seva Sindhu bus pass portal", "Enter previous pass number", "Upload new fee receipt", "Collect pass at depot"];
  } else if (isComplaint && service.id === "bescom_gruha_jyothi") {
    answer = isKn
      ? `**ವಿದ್ಯುತ್ ಬಿಲ್ ದೋಷ ಅಥವಾ ಹೆಚ್ಚುವರಿ ಬಿಲ್ ಬಗ್ಗೆ ದೂರು ನೀಡುವ ವಿಧಾನ:**\n\n1. ದಿನದ 24 ಗಂಟೆಯೂ ಲಭ್ಯವಿರುವ ಬೆಸ್ಕಾಂ ಸಹಾಯವಾಣಿ 1912 ಗೆ ಕರೆ ಮಾಡಿ.\n2. ನಿಮ್ಮ 10-ಅಂಕಿಯ ಅಕೌಂಟ್ ಐಡಿ ತಿಳಿಸಿ ದೂರು ದಾಖಲಿಸಿ.\n3. SMS ಮೂಲಕ ಬರುವ ದೂರು ಸಂಖ್ಯೆ (Docket No) ಪಡೆಯಿರಿ; 7 ದಿನಗಳಲ್ಲಿ ಅಧಿಕಾರಿ ಪರಿಶೀಲನೆ ನಡೆಸುತ್ತಾರೆ.\n\n**ಅಧಿಕೃತ ಪೋರ್ಟಲ್:** https://bescom.karnataka.gov.in/`
      : isHi
      ? `**बिजली बिल या मीटर की शिकायत दर्ज कराने की प्रक्रिया:**\n\n1. 24x7 बिजली हेल्पलाइन 1912 पर कॉल करें।\n2. अपना 10 अंकों का अकाउंट आईडी बताएं और समस्या दर्ज कराएं।\n3. एसएमएस पर प्राप्त शिकायत डॉकेट नंबर नोट करें; 7 दिनों में समाधान होगा।\n\n**आधिकारिक पोर्टल:** https://bescom.karnataka.gov.in/`
      : `**How to Lodge an Electricity Bill Complaint:**\n\n1. Dial toll-free 1912 (24x7 helpline across Karnataka).\n2. Provide your 10-digit Account ID printed on your electricity bill.\n3. State the grievance (inflated bill, wrong meter reading, or missing Gruha Jyothi subsidy).\n4. Track the complaint using the SMS Docket Number until resolved by the subdivision engineer.\n\n**Portal:** https://bescom.karnataka.gov.in/`;
    steps = ["Call 1912 helpline", "Provide 10-digit Account ID", "Note Docket Number", "Track resolution within 7 days"];
  } else {
    // Default to the first problem of the identified service
    const prob = service.common_problems?.[0];
    const probTitle = prob ? (prob.problem_title?.[lang] || prob.problem_title?.en) : service.localized_name;
    const action = prob ? (prob.recommended_action?.[lang] || prob.recommended_action?.en) : service.localized_summary;
    const stepList = prob ? (prob.checklist?.[lang] || prob.checklist?.en || []) : (service.required_documents?.[lang] || []);
    const esc = prob ? (prob.escalation_route?.[lang] || prob.escalation_route?.en) : `Helpline: 1902`;

    answer = isKn
      ? `**${sName}**\n**ವಿಷಯ:** ${probTitle}\n\n**ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ:** ${action}\n\n**ಹಂತಗಳು:**\n${stepList.map((st, i) => `${i + 1}. ${st}`).join("\n")}\n\n**ಅಧಿಕೃತ ಪೋರ್ಟಲ್:** ${portal}\n**ಸಹಾಯವಾಣಿ:** ${esc}`
      : isHi
      ? `**${sName}**\n**विषय:** ${probTitle}\n\n**अनुशंसित कार्रवाई:** ${action}\n\n**चरण:**\n${stepList.map((st, i) => `${i + 1}. ${st}`).join("\n")}\n\n**आधिकारिक पोर्टल:** ${portal}\n**हेल्पलाइन:** ${esc}`
      : `**${sName}**\n**Situation:** ${probTitle}\n\n**Recommended Action:** ${action}\n\n**Step-by-Step Procedure:**\n${stepList.map((st, i) => `${i + 1}. ${st}`).join("\n")}\n\n**Official Portal:** ${portal}\n**Helpline / Escalation:** ${esc}`;
    steps = stepList;
  }

  return {
    answer: answer,
    language: lang,
    identified_service: sName,
    sources: [
      {
        title: sName,
        url: portal,
        department: service.localized_provider || "Government of Karnataka",
        verification_status: service.verification_status,
        last_verified: service.last_verified
      }
    ],
    verification_status: service.verification_status,
    last_verified: service.last_verified,
    suggested_steps: steps,
    is_fallback: true
  };
}
