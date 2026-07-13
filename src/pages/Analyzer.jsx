import { useState } from 'react'
import { supabase } from '../lib/supabase'
import RiskBadge from '../components/RiskBadge'
import SignalList from '../components/SignalList'

export default function Analyzer() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scored, setScored] = useState(false)

  async function analyze() {
    if (!message.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setScored(false)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-message', {
        body: { message }
      })
      if (fnError) throw fnError

      const { error: insertError } = await supabase.from('scam_reports').insert({
        message_text: message,
        risk_score: data.score,
        risk_level: data.riskLevel,
        signals: data.signals,
        ai_explanation: data.explanation
      })
      if (insertError) console.error('Insert error:', insertError)

      setResult(data)
      setTimeout(() => setScored(true), 100)
    } catch (err) {
      setError('Analysis failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = result
    ? result.riskLevel === 'high' ? 'var(--red)'
    : result.riskLevel === 'medium' ? 'var(--amber)'
    : 'var(--green)'
    : 'var(--text-muted)'

  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--accent)', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '1rem',
          padding: '4px 10px', background: 'var(--accent-dim)',
          borderRadius: '4px', border: '1px solid var(--accent)30',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
          Threat Analysis
        </div>
        <h1 style={{
          fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem',
          letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2,
        }}>
          Scam Message Analyzer
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Paste a suspicious WhatsApp or SMS message. Qaphela will check it for known South African scam patterns and threat signals.
        </p>
      </div>

      {/* Input area */}
      <div style={{
        border: `1px solid ${loading ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
        marginBottom: '1rem',
      }}>
        <div style={{
          padding: '8px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-card)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            MESSAGE INPUT
          </span>
          {message.length > 0 && (
            <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-subtle)', marginLeft: 'auto' }}>
              {message.length} chars
            </span>
          )}
        </div>
        <textarea
          style={{
            width: '100%',
            minHeight: '160px',
            background: 'var(--bg-card)',
            border: 'none',
            outline: 'none',
            padding: '1rem',
            fontSize: '14px',
            color: 'var(--text-primary)',
            fontFamily: 'Inter, sans-serif',
            resize: 'vertical',
            lineHeight: 1.6,
          }}
          placeholder="Paste your suspicious message here..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </div>

      {/* Analyze button */}
      <button
        onClick={analyze}
        disabled={loading || !message.trim()}
        style={{
          width: '100%',
          padding: '14px',
          background: loading || !message.trim() ? 'var(--bg-elevated)' : 'var(--accent)',
          color: loading || !message.trim() ? 'var(--text-muted)' : 'var(--bg-base)',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.01em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {loading ? (
          <>
            <span style={{
              width: '14px', height: '14px',
              border: '2px solid var(--text-muted)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite',
            }} />
            Analyzing message...
          </>
        ) : 'Analyze Message'}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '12px 16px',
          background: 'var(--red-dim)',
          border: '1px solid var(--red)30',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'var(--red)',
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="scan-in">

          {/* Score card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Risk Assessment
              </span>
              <RiskBadge level={result.riskLevel} />
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '1.25rem' }}>
                <span style={{
                  fontSize: '4rem', fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace',
                  color: scoreColor,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                }}>
                  {result.score}
                </span>
                <span style={{ fontSize: '1.5rem', color: 'var(--text-subtle)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>
                  /100
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: '4px', background: 'var(--bg-base)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  className="progress-fill"
                  style={{
                    height: '100%',
                    width: scored ? `${result.score}%` : '0%',
                    background: scoreColor,
                    borderRadius: '2px',
                    boxShadow: `0 0 12px ${scoreColor}80`,
                    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--green)' }}>LOW</span>
                <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--amber)' }}>MEDIUM</span>
                <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--red)' }}>HIGH</span>
              </div>
            </div>
          </div>

          {/* AI explanation */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                AI Analysis
              </span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.75, margin: 0 }}>
                {result.explanation}
              </p>
            </div>
          </div>

          {/* Signals */}
          {result.signals.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Signals Detected
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)' }}>
                  {result.signals.length} found
                </span>
              </div>
              <div style={{ padding: '1rem' }}>
                <SignalList signals={result.signals} />
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}