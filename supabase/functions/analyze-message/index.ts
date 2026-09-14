import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log("Step 1: Message received")

    const signals = []
    let score = 0

    const urgencyPatterns = [
      /urgent/i, /immediately/i, /account.*suspend/i,
      /verify.*now/i, /24 hours/i, /act now/i, /expires/i,
      /will be cancelled/i, /will be suspended/i, /put on hold/i,
      /account.*hold/i, /payment.*hold/i, /grant.*hold/i,
      /within.*hours/i, /within.*days/i, /deadline/i
    ]

    if (urgencyPatterns.some(p => p.test(message))) {
      signals.push({ type: "urgency_language", label: "Urgency language detected", weight: 20 })
      score += 20
    }

    const brandPatterns = [
      /sassa/i, /fnb/i, /absa/i, /capitec/i, /nedbank/i,
      /standard bank/i, /vodacom/i, /mtn/i, /takealot/i,
      /sars/i, /home affairs/i, /uif/i
    ]
    if (brandPatterns.some(p => p.test(message))) {
      signals.push({ type: "brand_impersonation", label: "SA brand or government entity mentioned", weight: 25 })
      score += 25
    }

    const personalInfoPatterns = [
      /id number/i, /password/i, /pin/i, /otp/i,
      /bank.*detail/i, /account.*number/i, /verify.*identity/i,
      /update.*info/i, /update.*detail/i, /confirm.*detail/i,
      /personal.*detail/i, /verify.*account/i, /click.*verify/i,
      /click.*here/i, /tap.*here/i, /follow.*link/i
    ]

    if (personalInfoPatterns.some(p => p.test(message))) {
      signals.push({ type: "personal_info_request", label: "Requests personal or financial information", weight: 30 })
      score += 30
    }

    const prizePatterns = [
      /you.*won/i, /winner/i, /prize/i, /voucher/i,
      /free.*money/i, /grant.*approved/i, /selected/i
    ]
    if (prizePatterns.some(p => p.test(message))) {
      signals.push({ type: "too_good_to_be_true", label: "Unrealistic reward or prize offer", weight: 20 })
      score += 20
    }

    console.log("Step 2: Signals extracted, score:", score)
    score = Math.min(score, 100)
    const riskLevel = score >= 70 ? "high" : score >= 40 ? "medium" : "low"

    console.log("Step 3: Calling Groq")
    const groqKey = Deno.env.get("GROQ_API_KEY")
    const prompt = `You are a cybersecurity assistant that has already analyzed a suspicious message. Do not ask for the message — the analysis is already complete. Write your response based only on the findings below.

Analysis findings:
- Risk score: ${score}/100
- Risk level: ${riskLevel}
- Signals detected: ${signals.map(s => s.label).join(", ") || "no suspicious signals found"}

Based on these findings, write exactly 3 sentences in plain language for a non-technical South African user:
1. State clearly whether this message is likely a scam or safe, based on the risk level
2. Mention the specific red flags found, or confirm why it appears safe
3. Tell them exactly what to do next

Do not ask for more information. Do not say "it looks like". Write your response now.`

    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }]
      })
    })

    console.log("Step 4: Groq status:", aiRes.status)
    const aiData = await aiRes.json()
    console.log("Groq response:", JSON.stringify(aiData))

    if (!aiData.choices || aiData.choices.length === 0) {
      throw new Error(`Groq error: ${JSON.stringify(aiData)}`)
    }

    const explanation = aiData.choices[0].message.content
    console.log("Step 5: Done")

    return new Response(JSON.stringify({
      score,
      riskLevel,
      signals,
      explanation
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })

  } catch (err) {
    console.error("Error:", err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})