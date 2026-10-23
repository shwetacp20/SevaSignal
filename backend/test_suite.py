# -*- coding: utf-8 -*-
"""
Automated Comprehensive Test Suite for SevaSignal Backend.
Tests all 15 required questions, follow-up sequences A/B/C,
all 8 categories, action-plan guidance generation, and multilingual responses.
"""
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    print("[PASS] Health Check Passed")

def test_categories():
    res = client.get("/api/categories?lang=en")
    assert res.status_code == 200
    cats = res.json()
    assert len(cats) == 8, f"Expected 8 categories, got {len(cats)}"
    cat_ids = [c["id"] for c in cats]
    expected = [
        "education_scholarships",
        "certificates_documents",
        "transport_travel",
        "grievances_complaints",
        "pensions_welfare",
        "ration_food",
        "agriculture_farmer",
        "utilities_local"
    ]
    assert cat_ids == expected, f"Categories order mismatch: {cat_ids}"
    print(f"✓ All 8 Categories Verified in correct order: {cat_ids}")

def test_services():
    res = client.get("/api/services?lang=en")
    assert res.status_code == 200
    services = res.json()
    assert len(services) >= 8, f"Expected at least 8 services, got {len(services)}"
    print(f"✓ Total verified services loaded: {len(services)}")

def test_search():
    queries = [
        ("SSP", "ssp_postmatric_karnataka"),
        ("Bus Pass", "ksrtc_student_bus_pass"),
        ("Caste certificate", "nadakacheri_caste_income"),
        ("Gruha Jyothi", "bescom_gruha_jyothi"),
        ("Pension", "karnataka_social_security_pensions"),
        ("Ration", "ahara_ration_card"),
        ("Farmer", "pm_kisan_agriculture"),
        ("Grievance", "cpgrams_grievances"),
    ]
    for q, expected_id in queries:
        res = client.get(f"/api/search?q={q}&lang=en")
        assert res.status_code == 200
        results = res.json().get("results", [])
        assert len(results) > 0, f"No search results for query: {q}"
        assert results[0]["id"] == expected_id, f"Search {q}: expected {expected_id}, got {results[0]['id']}"
    print("✓ Search functionality verified across key services")

def test_fifteen_questions():
    questions = [
        ("How do I apply for a fresh SSP scholarship?", "ssp_postmatric_karnataka", "ssp.postmatric.karnataka.gov.in"),
        ("Is there any qualification for SSP scholarship?", "ssp_postmatric_karnataka", "ssp.postmatric.karnataka.gov.in"),
        ("What documents are required for my scholarship?", "ssp_postmatric_karnataka", "ssp.postmatric.karnataka.gov.in"),
        ("How do I renew my scholarship?", "ssp_postmatric_karnataka", "ssp.postmatric.karnataka.gov.in"),
        ("Why is my SSP scholarship payment delayed?", "ssp_postmatric_karnataka", "dbt.karnataka.gov.in"),
        ("My scholarship application was rejected. What should I do?", "ssp_postmatric_karnataka", "ssp.postmatric.karnataka.gov.in"),
        ("How do I renew my KSRTC student bus pass?", "ksrtc_student_bus_pass", "sevasindhu.karnataka.gov.in"),
        ("How do I download my digitally signed caste certificate?", "nadakacheri_caste_income", "nadakacheri.karnataka.gov.in"),
        ("How do I apply for an income certificate?", "nadakacheri_caste_income", "nadakacheri.karnataka.gov.in"),
        ("Who is eligible for Gruha Jyothi zero-bill?", "bescom_gruha_jyothi", "sevasindhu.karnataka.gov.in"),
        ("How do I apply for a farmer scheme?", "pm_kisan_agriculture", "pmkisan.gov.in"),
        ("How can I complain about an electricity bill?", "bescom_gruha_jyothi", "bescom.karnataka.gov.in"),
        ("How can I track my pension payment?", "karnataka_social_security_pensions", "dssp.karnataka.gov.in"),
        ("How do I update my ration card?", "ahara_ration_card", "ahara.kar.nic.in"),
        ("How can I file a public-service grievance?", "cpgrams_grievances", "pgportal.gov.in"),
    ]

    print("\n--- Testing 15 Required Independent Questions ---")
    for idx, (q, expected_service_id, expected_url_domain) in enumerate(questions, 1):
        res = client.post("/api/chat", json={"question": q, "lang": "en"})
        assert res.status_code == 200, f"Q{idx} failed with {res.status_code}"
        data = res.json()
        ans = data["answer"]
        sources = data["sources"]
        
        # Verify it NEVER returned the generic Seva Sindhu boilerplate for unrelated services
        if "Seva Sindhu" not in expected_service_id and expected_service_id != "sevasindhu_certificates":
            assert "For official Karnataka citizen applications, please access the unified Seva Sindhu portal" not in ans, \
                f"Q{idx} returned generic Seva Sindhu fallback!"

        # Verify domain is present in answer or sources
        all_text = ans + " " + " ".join([s.get("url", "") for s in sources])
        assert expected_url_domain in all_text, f"Q{idx} ('{q}'): expected domain '{expected_url_domain}' not in output!"

        print(f"[{idx}/15] PASSED: {q[:45]}... -> Service: {data.get('identified_service')}")

def test_followup_sequences():
    print("\n--- Testing Follow-Up Sequences (Conversation Memory) ---")
    
    # Sequence A: SSP apply -> qualification -> documents
    print("\nSequence A:")
    hist_a = []
    
    # 1. How do I apply for an SSP scholarship?
    q1 = "How do I apply for an SSP scholarship?"
    r1 = client.post("/api/chat", json={"question": q1, "lang": "en", "conversation_history": hist_a}).json()
    assert "SSP" in r1["answer"] or "Karnataka State Scholarship" in (r1["identified_service"] or "")
    hist_a.append({"role": "user", "content": q1})
    hist_a.append({"role": "assistant", "content": r1["answer"]})
    print(f"  Step 1: '{q1}' -> {r1.get('identified_service')}")

    # 2. Is there any qualification?
    q2 = "Is there any qualification?"
    r2 = client.post("/api/chat", json={"question": q2, "lang": "en", "conversation_history": hist_a}).json()
    assert "Karnataka State Scholarship" in (r2["identified_service"] or "") or "SSP" in r2["answer"]
    assert "income" in r2["answer"].lower() or "post-matric" in r2["answer"].lower() or "eligibility" in r2["answer"].lower()
    hist_a.append({"role": "user", "content": q2})
    hist_a.append({"role": "assistant", "content": r2["answer"]})
    print(f"  Step 2: '{q2}' -> Kept SSP Context: {r2.get('identified_service')}")

    # 3. What documents do I need?
    q3 = "What documents do I need?"
    r3 = client.post("/api/chat", json={"question": q3, "lang": "en", "conversation_history": hist_a}).json()
    assert "Karnataka State Scholarship" in (r3["identified_service"] or "") or "SSP" in r3["answer"]
    assert "aadhaar" in r3["answer"].lower() or "sslc" in r3["answer"].lower() or "rd" in r3["answer"].lower()
    print(f"  Step 3: '{q3}' -> Kept SSP Context: {r3.get('identified_service')}")

    # Sequence B: Delayed payment -> check it -> where can I complain
    print("\nSequence B:")
    hist_b = []
    
    # 1. My SSP payment is delayed.
    q1_b = "My SSP payment is delayed."
    r1_b = client.post("/api/chat", json={"question": q1_b, "lang": "en", "conversation_history": hist_b}).json()
    assert "dbt.karnataka.gov.in" in r1_b["answer"] or "npci" in r1_b["answer"].lower() or "ssp" in r1_b["answer"].lower()
    hist_b.append({"role": "user", "content": q1_b})
    hist_b.append({"role": "assistant", "content": r1_b["answer"]})
    print(f"  Step 1: '{q1_b}' -> {r1_b.get('identified_service')}")

    # 2. How can I check it?
    q2_b = "How can I check it?"
    r2_b = client.post("/api/chat", json={"question": q2_b, "lang": "en", "conversation_history": hist_b}).json()
    assert "dbt" in r2_b["answer"].lower() or "ssp" in r2_b["answer"].lower() or "status" in r2_b["answer"].lower()
    hist_b.append({"role": "user", "content": q2_b})
    hist_b.append({"role": "assistant", "content": r2_b["answer"]})
    print(f"  Step 2: '{q2_b}' -> Kept Payment Context: {r2_b.get('identified_service')}")

    # 3. Where can I complain?
    q3_b = "Where can I complain?"
    r3_b = client.post("/api/chat", json={"question": q3_b, "lang": "en", "conversation_history": hist_b}).json()
    assert "1902" in r3_b["answer"] or "080-35254757" in r3_b["answer"] or "helpline" in r3_b["answer"].lower()
    print(f"  Step 3: '{q3_b}' -> Provided escalation helpline: {r3_b.get('identified_service')}")

    # Sequence C: KSRTC bus pass renewal -> which documents do I need
    print("\nSequence C:")
    hist_c = []
    
    # 1. How do I renew my KSRTC student bus pass?
    q1_c = "How do I renew my KSRTC student bus pass?"
    r1_c = client.post("/api/chat", json={"question": q1_c, "lang": "en", "conversation_history": hist_c}).json()
    assert "bus pass" in r1_c["answer"].lower() or "ksrtc" in r1_c["answer"].lower()
    hist_c.append({"role": "user", "content": q1_c})
    hist_c.append({"role": "assistant", "content": r1_c["answer"]})
    print(f"  Step 1: '{q1_c}' -> {r1_c.get('identified_service')}")

    # 2. Which documents do I need?
    q2_c = "Which documents do I need?"
    r2_c = client.post("/api/chat", json={"question": q2_c, "lang": "en", "conversation_history": hist_c}).json()
    assert "bus pass" in (r2_c["identified_service"] or "").lower() or "ksrtc" in r2_c["answer"].lower() or "college" in r2_c["answer"].lower()
    print(f"  Step 2: '{q2_c}' -> Kept KSRTC Bus Pass Context: {r2_c.get('identified_service')}")

def test_action_plans():
    print("\n--- Testing 'Get Complete Action Plan' for Different Services ---")
    services_to_test = [
        ("ssp_postmatric_karnataka", "ssp_apply_fresh", "Karnataka State Scholarship Portal (SSP) - Post-Matric"),
        ("ssp_postmatric_karnataka", "ssp_payment_delayed", "Karnataka State Scholarship Portal (SSP) - Post-Matric"),
        ("ksrtc_student_bus_pass", "ksrtc_bus_pass_renewal", "KSRTC / BMTC Student Concession Bus Pass"),
        ("nadakacheri_caste_income", "nadakacheri_caste_download", "Karnataka Nadakacheri - Caste & Income Certificates"),
        ("bescom_gruha_jyothi", "gruha_jyothi_eligibility", "BESCOM & Gruha Jyothi Free Electricity Scheme"),
        ("ahara_ration_card", "ahara_update_ration_card", "Karnataka Ahara - Ration Card Services (BPL/APL)"),
        ("pm_kisan_agriculture", "pmkisan_apply_scheme", "PM-KISAN Samman Nidhi & Karnataka FRUITS"),
        ("karnataka_social_security_pensions", "pension_payment_track", "Karnataka Social Security Pensions"),
    ]

    for s_id, prob_id, expected_name_part in services_to_test:
        res = client.post("/api/guidance", json={"service_id": s_id, "problem_id": prob_id, "lang": "en"})
        assert res.status_code == 200, f"Guidance failed for {s_id}"
        card = res.json()
        assert expected_name_part in card["service_name"], f"Expected {expected_name_part}, got {card['service_name']}"
        assert len(card["checklist"]) > 0, f"Checklist empty for {s_id}"
        assert len(card["required_documents"]) > 0, f"Documents empty for {s_id}"
        assert card["portal_url"] != "", f"Portal URL missing for {s_id}"
        print(f"✓ Action Plan Verified: {card['service_name']} | Problem: {card['user_problem'][:35]}...")

def test_multilingual():
    print("\n--- Testing Multilingual Translations (Kannada & Hindi) ---")
    # Test Kannada
    res_kn = client.post("/api/chat", json={"question": "KSRTC ವಿದ್ಯಾರ್ಥಿ ಬಸ್ ಪಾಸ್ ನವೀಕರಿಸುವುದು ಹೇಗೆ?", "lang": "kn"}).json()
    assert "KSRTC" in res_kn["answer"] or "ಬಸ್ ಪಾಸ್" in res_kn["answer"]
    assert res_kn["language"] == "kn"
    print("✓ Kannada Chat Response Verified")

    # Test Hindi
    res_hi = client.post("/api/chat", json={"question": "गृह ज्योति योजना के लिए कौन पात्र है?", "lang": "hi"}).json()
    assert "गृह ज्योति" in res_hi["answer"] or "200 यूनिट" in res_hi["answer"] or "बिजली" in res_hi["answer"]
    assert res_hi["language"] == "hi"
    print("✓ Hindi Chat Response Verified")

def test_random_and_gibberish_inputs():
    print("\n--- Testing Random, Meaningless, and Gibberish Input Handling ---")
    
    # 1. jjhhhghjhkj
    r1 = client.post("/api/chat", json={"question": "jjhhhghjhkj", "lang": "en"}).json()
    assert "couldn't understand your message" in r1["answer"].lower() or "public service you need help with" in r1["answer"].lower()
    assert r1.get("identified_service") is None
    assert len(r1.get("sources", [])) == 0
    print("✓ Passed: 'jjhhhghjhkj' -> Returned polite clarification (No government scheme triggered)")

    # 2. asdfghjkl123
    r2 = client.post("/api/chat", json={"question": "asdfghjkl123", "lang": "en"}).json()
    assert "random text" in r2["answer"].lower()
    assert r2.get("identified_service") is None
    print("✓ Passed: 'asdfghjkl123' -> Identified keyboard mash (No government scheme triggered)")

    # 3. ??????
    r3 = client.post("/api/chat", json={"question": "??????", "lang": "en"}).json()
    assert "not sure what you're asking" in r3["answer"].lower()
    assert r3.get("identified_service") is None
    print("✓ Passed: '??????' -> Prompted for question in a few words")

    # 4. Hi
    r4 = client.post("/api/chat", json={"question": "Hi", "lang": "en"}).json()
    assert "hello" in r4["answer"].lower() and "welcome to sevasignal" in r4["answer"].lower()
    assert r4.get("identified_service") is None
    print("✓ Passed: 'Hi' -> Warm greeting without unwanted service plan")

    # 5. How are you?
    r5 = client.post("/api/chat", json={"question": "How are you?", "lang": "en"}).json()
    assert "doing well" in r5["answer"].lower() or "thank you" in r5["answer"].lower()
    assert r5.get("identified_service") is None
    print("✓ Passed: 'How are you?' -> Natural friendly response")

    # 6. What is the weather today?
    r6 = client.post("/api/chat", json={"question": "What is the weather today?", "lang": "en"}).json()
    assert "specializes exclusively in public-service" in r6["answer"].lower() or "civic services" in r6["answer"].lower()
    assert r6.get("identified_service") is None
    # Crucially ensure Gruha Jyothi or electricity is NEVER returned
    assert "gruha jyothi" not in r6["answer"].lower()
    assert "bescom" not in r6["answer"].lower()
    print("✓ Passed: 'What is the weather today?' -> Out-of-scope guidance (Never Gruha Jyothi)")

    # 7. Multilingual random & greeting tests
    r7_kn = client.post("/api/chat", json={"question": "ನಮಸ್ಕಾರ", "lang": "kn"}).json()
    assert "ನಮಸ್ಕಾರ" in r7_kn["answer"]
    assert r7_kn.get("identified_service") is None
    print("✓ Passed: Kannada Greeting 'ನಮಸ್ಕಾರ'")

    r8_hi = client.post("/api/chat", json={"question": "नमस्ते", "lang": "hi"}).json()
    assert "नमस्ते" in r8_hi["answer"]
    assert r8_hi.get("identified_service") is None
    print("✓ Passed: Hindi Greeting 'नमस्ते'")

    r9_kn = client.post("/api/chat", json={"question": "ಇಂದಿನ ಹವಾಮಾನ ಹೇಗಿದೆ?", "lang": "kn"}).json()
    assert "ಹವಾಮಾನ" in r9_kn["answer"] or "ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು" in r9_kn["answer"]
    assert r9_kn.get("identified_service") is None
    print("✓ Passed: Kannada Weather Query (Out-of-scope)")

    r10_hi = client.post("/api/chat", json={"question": "आज का मौसम कैसा है?", "lang": "hi"}).json()
    assert "मौसम" in r10_hi["answer"] or "सार्वजनिक सेवाओं" in r10_hi["answer"]
    assert r10_hi.get("identified_service") is None
    print("✓ Passed: Hindi Weather Query (Out-of-scope)")

def test_guidance_rejection_for_random_text():
    print("\n--- Testing Guidance Rejection for Random Queries ---")
    # Guidance should reject random queries with HTTP 400 instead of creating an SSP action plan
    res1 = client.post("/api/guidance", json={"problem_query": "asdfghjkl123", "lang": "en"})
    assert res1.status_code == 400, f"Expected 400, got {res1.status_code}"
    print("✓ Passed: Rejected action plan for 'asdfghjkl123' (400 Bad Request)")

    res2 = client.post("/api/guidance", json={"problem_query": "What is the weather today?", "lang": "en"})
    assert res2.status_code == 400, f"Expected 400, got {res2.status_code}"
    print("✓ Passed: Rejected action plan for 'What is the weather today?' (400 Bad Request)")

    res3 = client.post("/api/guidance", json={"problem_query": "jjhhhghjhkj", "lang": "en"})
    assert res3.status_code == 400, f"Expected 400, got {res3.status_code}"
    print("✓ Passed: Rejected action plan for 'jjhhhghjhkj' (400 Bad Request)")

if __name__ == "__main__":
    test_health()
    test_categories()
    test_services()
    test_search()
    test_fifteen_questions()
    test_followup_sequences()
    test_action_plans()
    test_multilingual()
    test_random_and_gibberish_inputs()
    test_guidance_rejection_for_random_text()
    print("\n==========================================")
    print("ALL TESTS PASSED WITH 100% SUCCESS RATE!")
    print("==========================================")

