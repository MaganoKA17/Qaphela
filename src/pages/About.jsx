export default function About() {
  const stack = [
    { label: 'Frontend', value: 'React + Vite + Tailwind CSS' },
    { label: 'Backend', value: 'Supabase Edge Functions (Deno)' },
    { label: 'Database', value: 'Supabase PostgreSQL + RLS' },
    { label: 'AI', value: 'Groq — LLaMA 3.1-8b-instant' },
    { label: 'Threat Intel', value: 'VirusTotal API' },
  ]

  const signals = [
    { icon: '⏱', label: 'Urgency language', desc: 'Artificial time pressure to prevent rational thinking' },
    { icon: '🏦', label: 'Brand impersonation', desc: 'Fake messages from SASSA, Capitec, FNB, ABSA, SARS' },
    { icon: '🔑', label: 'Personal info requests', desc: 'Asks for ID numbers, PINs, OTPs, banking details' },
    { icon: '🎁', label: 'Unrealistic offers', desc: 'Fake prizes, grants, vouchers, and job offers' },
    { icon: '☠', label: 'Malicious URLs', desc: 'Links flagged by 70+ security vendors via VirusTotal' },
  ]

  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--accent)', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '1rem',
          padding: '4px 10px', background: 'var(--accent-dim)',
          borderRadius: '4px', border: '1px solid var(--accent)30',
        }}>
          About
        </div>
        <h1 style={{
          fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem',
          letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2,
        }}>
          Qaphela
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--accent)', margin: '0 0 1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
          qaphela · isiZulu · "beware"
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.75 }}>
          Qaphela is an AI-powered scam message analyzer built specifically for South African users.
          Millions of South Africans receive fraudulent WhatsApp messages and SMSes every day —
          impersonating banks, SASSA, SARS, and other trusted institutions. Qaphela analyzes
          suspicious messages in seconds and explains what it finds in plain language, so anyone
          can protect themselves regardless of technical knowledge.
        </p>
      </div>

      {/* Signal detection */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--text-muted)', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '1rem',
          paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)',
        }}>
          What Qaphela Detects
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {signals.map((s, i) => (
            <div key={i} style={{
              display: 'flex', gap: '14px', alignItems: 'flex-start',
              padding: '12px 14px',
              background: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 2px' }}>{s.label}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--text-muted)', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '1rem',
          paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)',
        }}>
          Tech Stack
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {stack.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < stack.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.02em' }}>
                {item.label}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div style={{
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: '12px', color: 'var(--text-subtle)', fontFamily: 'JetBrains Mono, monospace' }}>
          Built by Kgosi · WeThinkCode_ · 2026
        </span>
        <span style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
          v1.0.0
        </span>
      </div>
    </main>
  )
}