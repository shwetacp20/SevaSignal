from pathlib import Path

readme = r"""# SevaSignal — Public Services Made Easier

**Developed by Binary Bloom** · Empowering citizens with clear, actionable, and grounded public-service guidance.

SevaSignal is an empathetic, multilingual civic-guidance platform designed for Indian citizens, especially in Karnataka. It helps people navigate complex public-service processes across eight categories by presenting clear, structured, step-by-step **Next-Step Cards** grounded in government-service information.

> **Project disclaimer:** SevaSignal is an independent student project created for educational and technology-festival purposes. It is not an official government portal and is not affiliated with, endorsed by, or authorized by any government ministry or department. It provides guidance and links to official services; users complete applications and authentication on the relevant official portals.

## Contents

- [Features](#features)
- [Eight Service Categories](#the-eight-service-categories)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-automated-tests)
- [Deployment](#deployment)
- [Security and Privacy](#security-and-privacy)
- [Team](#team)

## Features

- **Step-by-step guidance:** Breaks public-service processes into actionable next steps.
- **Multilingual interface:** Includes English, Kannada, and Hindi interface strings.
- **Eight service categories:** Covers common citizen-service needs, from scholarships to utilities.
- **Conversation-aware assistance:** Supports follow-up questions using the conversation and retrieval engine.
- **Grounded responses:** Uses a local knowledge base and fallback assistant; Gemini AI can be configured as an optional capability.
- **Official-service navigation:** Directs users to relevant government portals to complete official actions.
- **Privacy-conscious design:** Does not ask users to provide Aadhaar numbers, OTPs, biometric credentials, or banking passwords.

## The Eight Service Categories

1. **Education and Scholarships**
   - Karnataka SSP Post-Matric Scholarship
   - National Scholarship Portal (NSP)
   - Vidyasiri (BCWD)

2. **Certificates and Documents**
   - Karnataka Nadakacheri: caste, income, residence, and related certificates
   - Seva Sindhu
   - e-JanMa

3. **Transport and Travel**
   - KSRTC and BMTC student-concession bus passes, including fresh applications and renewals
   - Parivahan Sarathi: learner's licence (LLR) and driving licence (DL)

4. **Grievances and Complaints**
   - Central CPGRAMS: [pgportal.gov.in](https://pgportal.gov.in/)
   - Karnataka e-Janaspandana / CM Helpline 1902

5. **Pensions and Welfare Benefits**
   - Sandhya Suraksha Yojana
   - Old Age Pension (IGNOAP/OAP)
   - Widow Pension (Manasvini)
   - Disability Pension (DSSP)

6. **Ration Cards and Food Services**
   - Karnataka Ahara: [ahara.kar.nic.in](https://ahara.kar.nic.in/)
   - BPL/APL applications
   - Adding a newborn family member
   - e-KYC guidance

7. **Agriculture and Farmer Schemes**
   - PM-KISAN Samman Nidhi
   - Karnataka FRUITS (Farmer Registration and Unified Beneficiary Information System / FID)
   - Raitha Vidyanidhi

8. **Utilities and Local Services**
   - BESCOM / other ESCOM services
   - Gruha Jyothi zero-bill scheme information
   - Electricity-bill complaints (1912)
   - BWSSB water services

> Service rules, eligibility, deadlines, required documents, and portal availability can change. Users should verify current details on the linked official government portal before acting.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI |
| API schemas | Pydantic |
| AI assistant | Optional Gemini integration and grounded local fallback |
| Knowledge base | JSON service records |
| Frontend hosting | Vercel |
| Backend hosting | Render |

The frontend dependencies and exact framework versions are defined in `frontend/package.json`. The backend dependencies are defined in `backend/requirements.txt`.

## Project Structure

```text
sevasignal/
├── backend/
│   ├── app/
│   │   ├── ai/                 # Gemini AI and local fallback assistant
│   │   ├── models/             # Pydantic request/response schemas
│   │   ├── retrieval/          # Knowledge retrieval and conversation context
│   │   ├── routes/             # Chat, guidance, services, categories APIs
│   │   ├── config.py           # Application configuration
│   │   └── main.py             # FastAPI application and CORS
│   ├── data/                   # Government-service knowledge base (JSON)
│   ├── test_suite.py           # Automated test suite
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── locales/            # English, Kannada, Hindi strings
│   │   ├── services/           # API client and local knowledge fallback
│   │   ├── App.jsx              # Application shell and view routing
│   │   └── App.css              # CSS design system
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vercel.json              # Vercel / SPA configuration
├── render.yaml                  # Render deployment blueprint, if configured
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10 or newer
- Node.js and npm
- Git (for cloning and pushing the repository)

### 1. Get the project

If you have access to the repository:

```bash
git clone https://github.com/shwetacp20/SevaSignal.git
cd SevaSignal
```

### 2. Set up the backend

Open a terminal in the project root, then run:

**Windows PowerShell**

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If PowerShell blocks activation, you can run the backend using the virtual-environment interpreter directly:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Configure any required environment variables using the deployment dashboard or a local `.env` file if the project configuration supports it. `GEMINI_API_KEY` is optional according to the project design; without it, the local grounded fallback is intended to respond.

Start the API from the `backend` directory:

```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API should be available at:

- API base: `http://localhost:8000`
- Interactive API docs: `http://localhost:8000/docs`

### 3. Set up the frontend

Open a **second terminal** in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local Vite URL printed in the terminal, usually `http://localhost:5173`.

If the frontend needs to call a separately hosted backend, configure `VITE_API_BASE` with the correct backend API base URL. For local development, use the API URL/path expected by the frontend's API client. For deployment, set it in Vercel's project environment variables and redeploy after changing it.

## Running Automated Tests

From the project root:

```bash
cd backend
python test_suite.py
```

The test suite is intended to cover service questions, follow-up conversation sequences, action plans, service categories, and multilingual responses. Run it in the configured Python environment with the backend dependencies installed.

### Example test questions

- How do I apply for a fresh SSP scholarship?
- Is there any qualification for an SSP scholarship?
- What documents are required for my scholarship?
- How do I renew my scholarship?
- Why is my SSP scholarship payment delayed?
- My scholarship application was rejected. What should I do?
- How do I renew my KSRTC student bus pass?
- How do I download my digitally signed caste certificate?
- How do I apply for an income certificate?
- Who is eligible for the Gruha Jyothi zero-bill scheme?
- How do I apply for a farmer scheme?
- How can I complain about an electricity bill?
- How can I track my pension payment?
- How do I update my ration card?
- How can I file a public-service grievance?

## Deployment

Deploy the frontend and backend separately. The frontend must be configured with the URL of the deployed backend if it relies on remote API calls.

### Frontend — Vercel

1. Push the project to GitHub and import the repository in [Vercel](https://vercel.com/).
2. Configure the project:

   | Setting | Value |
   |---|---|
   | Framework Preset | Vite |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

3. Add the environment variable below if the frontend uses the remote API:

   ```text
   VITE_API_BASE=https://YOUR-RENDER-SERVICE.onrender.com/api
   ```

   Replace the example hostname and API path with the actual deployed backend URL and the prefix expected by the frontend API client. Do not paste secret API keys into frontend variables.

4. Deploy. Vercel should build the frontend from the `frontend` directory. After updating environment variables, trigger a new deployment.

### Backend — Render

1. Create a **Web Service** in [Render](https://render.com/) and connect the GitHub repository.
2. Configure the service:

   | Setting | Value |
   |---|---|
   | Root Directory | `backend` |
   | Runtime | Python |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

3. Add backend environment variables in the Render dashboard as needed:

   ```text
   GEMINI_MODEL=gemini-2.5-flash
   GEMINI_API_KEY=your-key-if-using-Gemini
   ```

   `GEMINI_API_KEY` is optional only if the configured local fallback can handle the required requests. Never commit API keys or secrets to GitHub.

4. After deployment, open the backend's `/docs` URL to check that the API starts. Configure the Vercel `VITE_API_BASE` value to match the deployed backend URL and the API prefix used by the app.

5. If the frontend cannot reach the backend, check the backend logs, CORS configuration, API base URL, and whether the route prefix matches the frontend's requests.

> **Deployment note:** Exact environment-variable names, API prefixes, and supported deployment settings depend on the repository configuration. Check `frontend/src/services/`, `backend/app/config.py`, `backend/app/main.py`, `frontend/vercel.json`, and `render.yaml` if present before changing them.

## Security and Privacy

- SevaSignal is a guidance and navigation tool, not a government authority or an application-submission service.
- Do not enter Aadhaar numbers, OTPs, biometric credentials, banking passwords, or other highly sensitive information into the assistant.
- Complete authentication, payments, and official submissions only on the relevant official government portal.
- Verify that a website is an official government domain before sharing information.
- Keep API keys and other secrets in local environment files or hosting-provider environment settings. Do not commit them to the repository.
- Guidance is informational and may not reflect the latest policy changes. Confirm important requirements with the official service provider.



Made with the goal of making public-service information clearer and easier to navigate.
"""

path = Path("/mnt/data/README.md")
path.write_text(readme, encoding="utf-8")
print(f"Created: {path}")
