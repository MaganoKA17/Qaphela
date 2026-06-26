export default function About() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">About Qaphela</h1>
        <p className="text-yellow-400 text-sm">qaphela · isiZulu · "beware"</p>
      </div>

      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <p>
          Qaphela is an AI-powered scam message analyzer built specifically for South African users.
          Millions of South Africans receive fraudulent WhatsApp messages and SMSes every day —
          impersonating banks, SASSA, SARS, and other trusted institutions.
        </p>
        <p>
          Qaphela analyzes suspicious messages for known scam signals, checks any links against
          real threat intelligence databases, and explains the findings in plain language —
          so anyone can protect themselves, regardless of technical knowledge.
        </p>
        <p>
          Every analyzed message is anonymously logged to build a growing community feed of
          SA-specific scam patterns, helping more people recognize threats before they fall victim.
        </p>
        <div className="border-t border-gray-800 pt-6">
          <p className="text-gray-500">Built by Kgosi · WeThinkCode_ · 2026</p>
        </div>
      </div>
    </main>
  )
}