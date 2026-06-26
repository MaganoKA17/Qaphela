# Qaphela

An AI-powered scam message analyzer build especially for South African users.
Qaphela hels everyday people identify fraudulent WhatsApp and SMS messages before they cause harm, in plain language, with no technical knowledge required.

# Problem

South Africa has one of the highesat rates of digital fraud in the world. WhatsApp is used by over 90% of South Africans with smartphones, amking it the most effective scam distribution channel in th country.

Fraudsters impersonate trused institutions, such as SASSA, fnb, Capitec, ABSA, SARS, Takealot, to steal money, credentials, and personal information.

Most victim, especially the elderly and low-income users, cannot tell a real message from a fake one. Existing tools like spam filters are desighned for volume-based noise, not intent-based fraud. There is not accessible , locally aware tool buuilt around SOuth Africa's specific scam landscape.

Qaphela fills the gap.

# What It Does

A user recieves a suspicious message and isn't sure if its legitimate. They paste it into Qaphela. Within seconds, the app:

- Extracts threat signals: urgency language, brand impersination, requests for personal information, unrealistic prize offers.

- Checks any URLs against VirusTotal's threat intelligence database (70+ security vendors)
- Calculates a risk score from weighted signals (0-100)
- Generates a plain langauge explaination via AI, telling the user what was found and what to do next.
- Logs the message anonymously to a community scam feed, building a live database of SA-specific scam patterns

# Features

- Scam Analyzer 
- Risk Scoring Engine
- URL Reputation Check
- AI Explanation Layer
- Community Scam Feed
- SA-Specific Signal Detection

# Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React(Vite) + Tailwind CSS |
| Backend | Supabase Edge Functions (Deno) |
| Database | Supabase (PostgreSQL + RLS) |
| AI | Groq AI |
| Threat Intelligence | VirusTotal API |
| Routing | React Router DOM |

# Project Structure

# Risk Scoring Model
Qaphela uses a weighted signal system to calculate a risk score between 0 and 100:

| Signal | Weight | 
|---|---|
| Urgency Language | +20 |
| SA brand / government impersonation | +25 |
| Request for personal or financial information | +30 |
| Unrealistic reward or prize offer | +20 |
| URL flagged as malicious by VirusTotal | +40 |
| URL present but not flagged | +5 |

Scores are capped at 100 and categorised as:

- Low(0-39): Unlikely to be a scam
- Medium(40-69): Proceed with caution
- High(70-100): Likely a scam, do not engage

