from pathlib import Path

readme = r"""# SevaSignal — Public Services Made Easier

**Developed by Binary Bloom**

SevaSignal is a multilingual civic-guidance platform designed to help Indian citizens, especially in Karnataka, understand public-service processes more easily. It organizes information into clear, actionable **Next-Step Cards** and guides users toward relevant government services.

SevaSignal is an independent student project. It is not an official government portal and is not affiliated with, endorsed by, or authorized by any government ministry or department.

## Overview

Public-service procedures can be difficult to navigate because information is spread across different portals and may involve multiple steps, eligibility conditions, and documents. SevaSignal aims to make this information easier to understand by presenting structured guidance in a user-friendly format.

The platform combines a React-based interface with a FastAPI backend, a service knowledge base, conversation-aware retrieval, and an optional Gemini AI integration with a local fallback assistant.

## Key Features

- **Step-by-step guidance:** Presents processes as clear, actionable next steps.
- **Multilingual support:** Interface strings for English, Kannada, and Hindi.
- **Eight service categories:** Groups common public-service topics in one place.
- **Conversation-aware assistance:** Supports follow-up questions using conversational context.
- **Grounded information:** Uses a local knowledge base and fallback assistant, with optional Gemini AI integration.
- **Government-portal navigation:** Helps users locate official services for completing applications and other actions.
- **Privacy-conscious interaction:** Designed not to request Aadhaar numbers, OTPs, biometric credentials, or banking passwords.

## Service Categories

### 1. Education and Scholarships
- SSP Post-Matric Scholarship (Karnataka)
- National Scholarship Portal (NSP)
- Vidyasiri (BCWD)

### 2. Certificates and Documents
- Karnataka Nadakacheri services, including caste, income, and residence certificates
- Seva Sindhu
- e-JanMa

### 3. Transport and Travel
- KSRTC and BMTC student-concession bus passes, including fresh applications and renewals
- Parivahan Sarathi services for learner's licences (LLR) and driving licences (DL)

### 4. Grievances and Complaints
- Central Public Grievance Redress and Monitoring System (CPGRAMS)
- Karnataka e-Janaspandana and CM Helpline 1902

### 5. Pensions and Welfare Benefits
- Sandhya Suraksha Yojana
- Old Age Pension (IGNOAP/OAP)
- Widow Pension (Manasvini)
- Disability Pension (DSSP)

### 6. Ration Cards and Food Services
- Karnataka Ahara services
- BPL/APL applications
- Adding a newborn family member
- e-KYC guidance

### 7. Agriculture and Farmer Schemes
- PM-KISAN Samman Nidhi
- Karnataka FRUITS (Farmer Registration and Unified Beneficiary Information System / FID)
- Raitha Vidyanidhi

### 8. Utilities and Local Services
- BESCOM and other ESCOM services
- Gruha Jyothi zero-bill scheme information
- Electricity-bill complaints (1912)
- BWSSB water services

> **Note:** Eligibility, documents, deadlines, procedures, and portal availability may change. Users should confirm current requirements with the relevant official service provider.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI |
| Data validation | Pydantic |
| AI assistance | Optional Gemini integration and local fallback assistant |
| Knowledge base | JSON service records |
| Languages | English, Kannada, Hindi |

## Project Structure

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

## Local Development

### Prerequisites

- Python 3.10 or newer
- Node.js and npm

### Backend

From the project root, run:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

Install dependencies and start the API:

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend should be available at `http://localhost:8000`. Interactive API documentation is available at `http://localhost:8000/docs`.

### Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

Configure the frontend's API base URL according to the API client settings when using a separately running backend.

## Automated Tests

The backend test suite is located at `backend/test_suite.py`. Run it from the backend directory in an environment where the project dependencies are installed:

```bash
cd backend
python test_suite.py
```

Example questions covered by the test suite include:

- How do I apply for a fresh SSP scholarship?
- What documents are required for my scholarship?
- How do I renew my scholarship?
- Why is my SSP scholarship payment delayed?
- How do I renew my KSRTC student bus pass?
- How do I apply for an income certificate?
- Who is eligible for the Gruha Jyothi scheme?
- How can I complain about an electricity bill?
- How can I track my pension payment?
- How do I update my ration card?
- How can I file a public-service grievance?

## Security and Privacy

- SevaSignal is an informational guidance platform, not a government authority or an application-submission service.
- Do not enter Aadhaar numbers, OTPs, biometric credentials, banking passwords, or other highly sensitive information into the assistant.
- Complete authentication and official submissions only on the relevant official government portal.
- Verify that a website is an official government domain before sharing personal information.
- Keep API keys and other secrets out of source control. Use environment variables or an appropriate local environment file.
- Public-service information can change; confirm important details with the official service provider.


*Designed to make public-service information clearer, more accessible, and easier to act on.*
"""

path = Path("/mnt/data/README.md")
path.write_text(readme, encoding="utf-8")
print(f"Created professional README without deployment instructions: {path}")
