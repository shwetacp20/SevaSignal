# SevaSignal — Public Services Made Easier

> Developed by **Binary Bloom** · Empowering citizens with clear, actionable, and grounded public service guidance.

SevaSignal is an empathetic, multilingual civic guidance platform designed for Indian citizens, especially in Karnataka. It translates complex bureaucratic processes across eight public service categories into clear, structured, step-by-step **Next-Step Cards** grounded in verified government portals.

---

## 🛠️ Architecture & Technology Stack

```
sevasignal/
├── backend/                  # FastAPI (Python 3.10+) Backend
│   ├── app/
│   │   ├── ai/               # Gemini AI & Grounded Local Fallback Assistant
│   │   ├── models/           # Pydantic Request & Response Schemas
│   │   ├── retrieval/        # Conversation-Aware Knowledge & Retrieval Engine
│   │   ├── routes/           # API Endpoints (/chat, /guidance, /services, /categories)
│   │   ├── config.py         # Application Settings & Environment Config
│   │   └── main.py           # FastAPI Application Entrypoint & CORS
│   ├── data/                 # Verified Government Knowledge Base (JSON)
│   ├── test_suite.py         # Automated End-to-End Test Suite
│   └── requirements.txt      # Python Dependencies
├── frontend/                 # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/       # UI Components (Header, Hero, Service Cards, ChatAssistant, NextStepCard)
│   │   ├── locales/          # Multilingual Strings (English, Kannada, Hindi)
│   │   ├── services/         # API Layer with Resilient Offline Knowledge Mirror
│   │   ├── App.jsx           # Application Shell & View Routing
│   │   └── App.css           # Vanilla CSS Design System
│   ├── index.html            # Semantic HTML Entry
│   ├── package.json          # Node Dependencies & Build Scripts
│   └── vercel.json           # Vercel Deployment Configuration
├── render.yaml               # Render Cloud Deployment Blueprint
└── README.md                 # Complete Project & Deployment Guide
```

---

## 📋 The Eight Service Categories

All eight public service categories are fully supported with verified government records:

1. **Education & Scholarships**: SSP Post-Matric Karnataka, National Scholarship Portal (NSP), Vidyasiri (BCWD)
2. **Certificates & Documents**: Karnataka Nadakacheri (Caste, Income, Residence, Living), Seva Sindhu, e-JanMa
3. **Transport & Travel**: KSRTC / BMTC Student Concession Bus Passes (Fresh & Renewal), Parivahan Sarathi (LLR & DL)
4. **Grievances & Complaints**: Central CPGRAMS (pgportal.gov.in) and Karnataka e-Janaspandana / CM Helpline 1902
5. **Pensions & Welfare Benefits**: Sandhya Suraksha Yojana, Old Age Pension (IGNOAP/OAP), Widow Pension (Manasvini), Disability Pension (DSSP)
6. **Ration Cards & Food Services**: Karnataka Ahara (ahara.kar.nic.in), BPL/APL applications, newborn member addition, e-KYC
7. **Agriculture & Farmer Schemes**: PM-KISAN Samman Nidhi, Karnataka FRUITS (FID), Raitha Vidyanidhi
8. **Utilities & Local Services**: BESCOM/ESCOMs 200-unit Gruha Jyothi Zero-Bill Scheme, Electricity Bill complaints (1912), BWSSB water services

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env
# Optional: Set GEMINI_API_KEY for generative Gemini AI (if omitted, grounded local engine responds automatically)

# Run backend development server on port 8000
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend API will be running at `http://localhost:8000` with Swagger documentation at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend

# Install npm dependencies
npm install

# Run frontend development server (Vite on port 5173)
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Running Automated Tests

A comprehensive end-to-end test suite validates all 15 required questions, follow-up conversation sequences, action plans, all eight categories, and multilingual responses:

```bash
cd backend
python test_suite.py
```

### Verified Test Questions:
- How do I apply for a fresh SSP scholarship?
- Is there any qualification for SSP scholarship?
- What documents are required for my scholarship?
- How do I renew my scholarship?
- Why is my SSP scholarship payment delayed?
- My scholarship application was rejected. What should I do?
- How do I renew my KSRTC student bus pass?
- How do I download my digitally signed caste certificate?
- How do I apply for an income certificate?
- Who is eligible for Gruha Jyothi zero-bill?
- How do I apply for a farmer scheme?
- How can I complain about an electricity bill?
- How can I track my pension payment?
- How do I update my ration card?
- How can I file a public-service grievance?

---

## 🌐 Deployment Guide

### Frontend Deployment (Vercel)
1. Push codebase to your GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your repository and configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable**: `VITE_API_BASE=https://<your-render-backend-url>/api`
4. Click **Deploy**. Vercel will utilize `vercel.json` for seamless client-side SPA routing.

### Backend Deployment (Render)
1. Log in to [Render](https://render.com/) and click **New Web Service**.
2. Select your repository:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `GEMINI_MODEL`: `gemini-2.5-flash`
     - `GEMINI_API_KEY`: `<Your-Google-Gemini-API-Key>` (Optional; local engine operates fully without it)
3. Render automatically sets the `$PORT` environment variable and launches the service.

---

## 🔒 Security & Privacy Notice
- SevaSignal is strictly a preparational and navigational platform.
- **Zero Sensitive Data Collection**: SevaSignal never requests, stores, or transmits Aadhaar numbers, OTPs, biometric credentials, or banking passwords.
- All actual submissions and authentications occur solely on official government portals (e.g. `ssp.postmatric.karnataka.gov.in`, `sevasindhu.karnataka.gov.in`, `nadakacheri.karnataka.gov.in`, `pgportal.gov.in`).
