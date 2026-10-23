<div align="center">

# SevaSignal
### ✨ Public Services Made Easier

**Empowering citizens with clear, accessible, and actionable public-service guidance.**

[![Project](https://img.shields.io/badge/Project-Civic%20Tech-2563EB?style=for-the-badge)](#-about-sevasignal)
[![Languages](https://img.shields.io/badge/Languages-English%20%7C%20Kannada%20%7C%20Hindi-16A34A?style=for-the-badge)](#-key-features)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-7C3AED?style=for-the-badge)](#-technology-stack)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-0EA5E9?style=for-the-badge)](#-technology-stack)

</div>

---

## 🌟 About SevaSignal

**SevaSignal** is a multilingual civic-guidance platform designed to help Indian citizens—especially in Karnataka—understand public-service processes more easily.

Public-service procedures can involve multiple websites, eligibility conditions, and documents. SevaSignal makes this information easier to navigate by organizing guidance into clear, structured, step-by-step **🧭 Next-Step Cards** and pointing users toward relevant government services.

> ⚠️ **Project Disclaimer**
>
> SevaSignal is an independent student project. It is **not an official government portal** and is not affiliated with, endorsed by, or authorized by any government ministry or department. It provides informational guidance; users complete official applications and authentication through the relevant government portals.

## 💡 Key Features

| Feature | Description |
|---|---|
| 🪜 **Step-by-step guidance** | Breaks public-service processes into clear, actionable next steps. |
| 🌐 **Multilingual interface** | Provides interface strings in English, Kannada, and Hindi. |
| 🗂️ **Eight service categories** | Organizes common public-service topics in one place. |
| 💬 **Conversation-aware assistance** | Supports follow-up questions using conversational context. |
| 📚 **Grounded information** | Uses a local knowledge base and fallback assistant, with optional Gemini AI integration. |
| 🔗 **Official-service navigation** | Helps users find relevant portals for completing official actions. |
| 🔐 **Privacy-conscious design** | Designed not to request Aadhaar numbers, OTPs, biometric credentials, or banking passwords. |

## 🏛️ Explore the 8 Service Categories

### 🎓 1. Education & Scholarships
- SSP Post-Matric Scholarship — Karnataka
- National Scholarship Portal (NSP)
- Vidyasiri (BCWD)

### 📄 2. Certificates & Documents
- Karnataka Nadakacheri services, including caste, income, and residence certificates
- Seva Sindhu
- e-JanMa

### 🚌 3. Transport & Travel
- KSRTC and BMTC student-concession bus passes — fresh applications and renewals
- Parivahan Sarathi — learner's licences (LLR) and driving licences (DL)

### 📣 4. Grievances & Complaints
- Central Public Grievance Redress and Monitoring System (CPGRAMS)
- Karnataka e-Janaspandana and CM Helpline 1902

### 🤝 5. Pensions & Welfare Benefits
- Sandhya Suraksha Yojana
- Old Age Pension (IGNOAP/OAP)
- Widow Pension (Manasvini)
- Disability Pension (DSSP)

### 🍚 6. Ration Cards & Food Services
- Karnataka Ahara services
- BPL/APL applications
- Adding a newborn family member
- e-KYC guidance

### 🌾 7. Agriculture & Farmer Schemes
- PM-KISAN Samman Nidhi
- Karnataka FRUITS (Farmer Registration and Unified Beneficiary Information System / FID)
- Raitha Vidyanidhi

### 💡 8. Utilities & Local Services
- BESCOM and other ESCOM services
- Gruha Jyothi zero-bill scheme information
- Electricity-bill complaints (1912)
- BWSSB water services

> 📌 **Please note:** Eligibility rules, required documents, deadlines, procedures, and portal availability may change. Always confirm current requirements with the relevant official service provider.

## 🧰 Technology Stack

| Layer | Technologies |
|:---:|---|
| 🎨 **Frontend** | React · Vite · JavaScript · CSS |
| ⚙️ **Backend** | Python · FastAPI |
| ✅ **Data Validation** | Pydantic |
| 🤖 **AI Assistance** | Optional Gemini integration · Local fallback assistant |
| 🗃️ **Knowledge Base** | JSON service records |
| 🗣️ **Languages** | English · ಕನ್ನಡ (Kannada) · हिन्दी (Hindi) |

## 🗂️ Project Structure

```text
SevaSignal/
├── backend/
│   ├── app/
│   │   ├── ai/                 # Gemini AI and local fallback assistant
│   │   ├── models/             # Request and response schemas
│   │   ├── retrieval/          # Knowledge retrieval and conversation context
│   │   ├── routes/             # Chat, guidance, services, and categories APIs
│   │   ├── config.py           # Application configuration
│   │   └── main.py             # FastAPI application entry point
│   ├── data/                   # JSON service knowledge base
│   ├── test_suite.py           # Automated test suite
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable interface components
│   │   ├── locales/            # English, Kannada, and Hindi strings
│   │   ├── services/           # API client and local knowledge fallback
│   │   ├── App.jsx              # Application shell and view routing
│   │   └── App.css              # Styles and design system
│   ├── index.html
│   ├── package.json
│   └── vercel.json
├── render.yaml
└── README.md
```

## 🚀 Run SevaSignal Locally

### 📋 Prerequisites

Make sure you have installed:

- 🐍 **Python 3.10 or newer**
- 🟢 **Node.js and npm**

### ⚙️ 1. Start the Backend

From the project root, open a terminal and run:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows PowerShell**
```powershell
.\venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
source venv/bin/activate
```

Install the dependencies and start the API:

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

✅ Backend: `http://localhost:8000`  
📘 Interactive API documentation: `http://localhost:8000/docs`

### 🎨 2. Start the Frontend

Open a **second terminal** from the project root:

```bash
cd frontend
npm install
npm run dev
```

🌐 Open the local URL printed by Vite, usually `http://localhost:5173`.

> 🔧 If the frontend uses a separately running backend, configure its API base URL according to the settings in the frontend API client.

## 🧪 Automated Tests

The backend test suite is located at `backend/test_suite.py`. Run it from the backend directory with the required dependencies installed:

```bash
cd backend
python test_suite.py
```

### 💬 Example Questions

- 🎓 How do I apply for a fresh SSP scholarship?
- 📑 What documents are required for my scholarship?
- 🔄 How do I renew my scholarship?
- ⏳ Why is my SSP scholarship payment delayed?
- 🚌 How do I renew my KSRTC student bus pass?
- 📄 How do I apply for an income certificate?
- 💡 Who is eligible for the Gruha Jyothi scheme?
- 📣 How can I complain about an electricity bill?
- 🤝 How can I track my pension payment?
- 🍚 How do I update my ration card?
- 🏛️ How can I file a public-service grievance?

## 🔒 Security & Privacy

- 🛡️ SevaSignal is an informational guidance platform, not a government authority or application-submission service.
- 🚫 Do not enter Aadhaar numbers, OTPs, biometric credentials, banking passwords, or other highly sensitive information into the assistant.
- 🔑 Keep API keys and secrets out of source control. Use environment variables or an appropriate local environment file.
- 🔗 Complete authentication and official submissions only on the relevant official government portal.
- 🔍 Verify that a website is an official government domain before sharing personal information.
- 📌 Public-service information can change; confirm important details with the official service provider.

---

<div align="center">

### 💙 Built to make public services easier to understand and navigate.

