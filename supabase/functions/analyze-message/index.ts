import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    // ---- SIGNAL EXTRACTION ----
    const signals = []
    let score = 0

    // Urgency language
    const urgencyPatterns = [
      /urgent/i, /immediately/i, /account.*suspend/i,
      /verify.*now/i, /24 hours/i, /act now/i, /expires/i
    ]
    if (urgencyPatterns.some(p => p.test(message))) {
      signals.push({ type: "urgency_language", label: "Urgency language detected", weight: 20 })
      score += 20
    }

    // SA brand impersonation
    const brandPatterns = [
      /sassa/i, /fnb/i, /absa/i, /capitec/i, /nedbank/i,
      /standard bank/i, /vodacom/i, /mtn/i, /takealot/i,
      /sars/i, /home affairs/i, /uif/i
    ]
    if (brandPatterns.some(p => p.test(message))) {
      signals.push({ type: "brand_impersonation", label: "SA brand or government entity mentioned", weight: 25 })
      score += 25
    }

    // Requests for personal info
    const personalInfoPatterns = [
      /id number/i, /password/i, /pin/i, /otp/i,
      /bank.*detail/i, /account.*number/i, /verify.*identity/i
    ]
    if (personalInfoPatterns.some(p => p.test(message))) {
      signals.push({ type: "personal_info_request", label: "Requests personal or financial information", weight: 30 })
      score += 30
    }

    // Too good to be true
    const prizePatterns = [
      /you.*won/i, /winner/i, /prize/i, /voucher/i,
      /free.*money/i, /grant.*approved/i, /selected/i
    ]
    if (prizePatterns.some(p => p.test(message))) {
      signals.push({ type: "too_good_to_be_true", label: "Unrealistic reward or prize offer", weight: 20 })
      score += 20
    }

    // URL extraction
    const urlMatch = message.match(/https?:\/\/[^\s]+/)
    let urlFlag = null
    if (urlMatch) {
      const url = urlMatch[0]
      const vtKey = Deno.env.get("VIRUSTOTAL_API_KEY")
      const encoded = btoa(url).replace(/=+$/, "")
      const vtRes = await fetch(`https://www.virustotal.com/api/v3/urls/${encoded}`, {
        headers: { "x-apikey": vtKey }
      })
      const vtData = await vtRes.json()
      const malicious = vtData?.data?.attributes?.last_analysis_stats?.malicious ?? 0
      if (malicious > 0) {
        signals.push({ type: "malicious_url", label: `URL flagged by ${malicious} security vendors`, weight: 40 })
        score += 40
        urlFlag = url
      } else {
        signals.push({ type: "url_present", label: "URL present but not flagged", weight: 5 })
        score += 5
      }
    }

    // Cap score at 100
    score = Math.min(score, 100)

    // Risk level
    const riskLevel = score >= 70 ? "high" : score >= 40 ? "medium" : "low"

    // ---- AI EXPLANATION ----
const groqKey = Deno.env.get("GROQ_API_KEY")
const prompt = `You are a cybersecurity assistant helping everyday South Africans identify scam messages.

A message was analyzed and the following was found:
- Risk score: ${score}/100
- Risk level: ${riskLevel}
- Signals detected: ${signals.map(s => s.label).join(", ") || "none"}
${urlFlag ? `- A URL was found and flagged as malicious: ${urlFlag}` : ""}

Write a plain-language explanation (3-4 sentences) for a non-technical South African user. Tell them:
1. Whether this message is likely a scam
2. What specific red flags were found
3. What they should do next

Do not use technical jargon. Be direct and clear.`

const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${groqKey}`
  },
  body: JSON.stringify({
    model: "llama-3.1-8b-instant",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }]
  })
})

const aiData = await aiRes.json()
const explanation = aiData.choices[0].message.content

    return new Response(JSON.stringify({
      score,
      riskLevel,
      signals,
      explanation
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})