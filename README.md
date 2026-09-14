# Qaphela 
> *qaphela · isiZulu · "beware"*

An AI-powered scam message analyzer built specifically for South African users. Qaphela helps everyday people identify fraudulent WhatsApp and SMS messages before they cause harm — in plain language, with no technical knowledge required.

---

## The Problem

South Africa has one of the highest rates of digital fraud in the world. WhatsApp is used by over 90% of South Africans with smartphones, making it the most effective scam distribution channel in the country. Fraudsters impersonate trusted institutions — SASSA, FNB, Capitec, ABSA, SARS, Takealot — to steal money, credentials, and personal information.

Most victims, especially elderly and low-income users, cannot tell a real message from a fake one. Existing tools like spam filters are designed for volume-based noise, not intent-based fraud. There is no accessible, locally-aware tool built around South Africa's specific scam landscape.

Qaphela fills that gap.

---

## What It Does

A user receives a suspicious message and isn't sure if it's legitimate. They paste it into Qaphela. Within seconds the app:

- **Extracts threat signals** — urgency language, brand impersonation, requests for personal information, unrealistic prize offers
- **Checks any URLs** against VirusTotal's threat intelligence database (70+ security vendors)
- **Calculates a risk score** from weighted signals (0–100)
- **Generates a plain-language explanation** via AI, telling the user what was found and what to do next
- **Logs the result anonymously** to a community scam feed — never the message content itself

---

## Features

- **Scam Analyzer** — paste any suspicious message and get an instant risk assessment
- **Risk Scoring Engine** — deterministic signal extraction with weighted scoring
- **URL Reputation Check** — real threat intelligence via VirusTotal API (70+ security vendors) with 5s timeout guard
- **AI Explanation Layer** — Groq (GPT-OSS-20B) translates findings into plain language for non-technical users
- **Community Scam Feed** — anonymously logged results with risk level filter tabs
- **SA-Specific Signal Detection** — patterns tuned to local brands, government entities, and known fraud templates
- **Light & Dark Mode** — auto-detects OS preference with manual override, persisted to localStorage
- **Privacy-by-Design** — message content is never stored; only analytical metadata is retained
- **POPIA Compliant** — data minimisation principles applied throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Supabase Edge Functions (Deno) |
| Database | Supabase (PostgreSQL + RLS) |
| AI | Groq API (GPT-OSS-20B) |
| Threat Intelligence | VirusTotal API |
| Routing | React Router DOM |

---

## Project Structure

```
qaphela/
├── supabase/
│   └── functions/
│       └── analyze-message/
│           └── index.ts        # Scoring engine + VirusTotal + Groq AI
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Sticky nav with theme toggle
│   │   ├── RiskBadge.jsx       # Risk level indicator
│   │   └── SignalList.jsx      # Detected signals with weights
│   ├── context/
│   │   └── ThemeContext.jsx    # Light/dark mode context
│   ├── pages/
│   │   ├── Analyzer.jsx        # Main analysis page
│   │   ├── Feed.jsx            # Community scam feed with filters
│   │   └── About.jsx           # About + privacy section
│   ├── lib/
│   │   └── supabase.js         # Supabase client
│   └── main.jsx
├── .env                        # Local secrets (never committed)
├── README.md
└── package.json
```

---

## Risk Scoring Model

Qaphela uses a weighted signal system to calculate a risk score between 0 and 100:

| Signal | Weight |
|---|---|
| Urgency language | +20 |
| SA brand / government impersonation | +25 |
| Request for personal or financial info | +30 |
| Unrealistic reward or prize offer | +20 |
| URL flagged as malicious by VirusTotal | +40 |
| URL present but not flagged | +5 |

Scores are capped at 100 and categorised as:
- **Low** (0–39) — unlikely to be a scam
- **Medium** (40–69) — proceed with caution
- **High** (70–100) — likely a scam, do not engage

---

## Cybersecurity Concepts Demonstrated

- **Indicator of Compromise (IoC) lookup** via VirusTotal API
- **Phishing signal detection** — urgency, impersonation, lookalike domains
- **Social engineering taxonomy** — authority, urgency, fear, scarcity, reciprocity
- **Risk scoring model** — weighted, deterministic signal aggregation
- **Community threat intelligence feed** — anonymized, crowd-sourced scam database
- **Privacy-by-design** — no message content stored, RLS enforced on all database tables
- **POPIA compliance** — data minimisation principles applied throughout

---

## Privacy & Data Handling

Qaphela is built with privacy-by-design principles in line with South Africa's POPIA Act:

- **Message content is never stored** — analyzed and immediately discarded
- **No user identification** — no account, login, or personal information required
- **Anonymised results only** — only risk scores, signal types, and AI explanations are retained
- **RLS enforced** — all database tables protected with Row Level Security

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Groq API key
- VirusTotal API key (free tier)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/qaphela.git
cd qaphela

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Groq and VirusTotal keys are set as Supabase Edge Function secrets and never exposed to the frontend.

### Database Setup

Run the following in your Supabase SQL Editor:

```sql
CREATE TABLE scam_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  signals JSONB NOT NULL,
  ai_explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public inserts" ON scam_reports
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public reads" ON scam_reports
FOR SELECT TO anon USING (true);
```

### Deploy Edge Function

```bash
npx supabase link
npx supabase secrets set GROQ_API_KEY=your_key
npx supabase secrets set VIRUSTOTAL_API_KEY=your_key
npx supabase functions deploy analyze-message
```

### Run Locally

```bash
npm run dev
```

---

## Disclaimer

Qaphela is a portfolio project built for educational purposes. It is not a substitute for professional cybersecurity advice. If you believe you have been a victim of fraud, contact your bank immediately and report to the South African Police Service (SAPS) or the South African Banking Risk Information Centre (SABRIC).

---

## Author

**Kgosi-E-tsile Magano** 

---

*Qaphela — because awareness is the first line of defence.*