import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import RiskBadge from '../components/RiskBadge'

export default function Feed() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function fetchReports() {
      const query = supabase
        .from('scam_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (filter !== 'all') {
        query.eq('risk_level', filter)
      }

      const { data } = await query
      setReports(data || [])
      setLoading(false)
    }
    fetchReports()
  }, [filter])

  const counts = {
    all: reports.length,
    high: reports.filter(r => r.risk_level === 'high').length,
    medium: reports.filter(r => r.risk_level === 'medium').length,
    low: reports.filter(r => r.risk_level === 'low').length,
  }

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'high', label: 'High', color: 'var(--red)' },
    { key: 'medium', label: 'Medium', color: 'var(--amber)' },
    { key: 'low', label: 'Low', color: 'var(--green)' },
  ]

  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
          color: 'var(--accent)', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '1rem',
          padding: '4px 10px', background: 'var(--accent-dim)',
          borderRadius: '4px', border: '1px solid var(--accent)30',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
          Live Feed
        </div>
        <h1 style={{
          fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem',
          letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2,
        }}>
          Community Scam Feed
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Anonymously reported scam messages from across South Africa. Use these to recognize threats before they reach you.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border)', paddingBottom: '1rem',
      }}>
        {filterOptions.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              border: `1px solid ${filter === f.key ? (f.color || 'var(--accent)') : 'var(--border)'}`,
              background: filter === f.key ? (f.color ? `${f.color}15` : 'var(--accent-dim)') : 'transparent',
              color: filter === f.key ? (f.color || 'var(--accent)') : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace' }}>
          Loading reports...
        </div>
      )}

      {/* Empty */}
      {!loading && reports.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem 0',
          border: '1px dashed var(--border)', borderRadius: '12px',
        }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No reports yet. Be the first to analyze a message.</p>
        </div>
      )}

      {/* Reports */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {reports.map((report, i) => (
          <div
            key={report.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--bg-elevated)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            {/* Card header */}
            <div style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--bg-base)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RiskBadge level={report.risk_level} />
                <span style={{
                  fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
                  color: 'var(--text-subtle)',
                }}>
                  Score: {report.risk_score}/100
                </span>
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-subtle)' }}>
                {new Date(report.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Card body */}
            <div style={{ padding: '1rem 1.25rem' }}>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                margin: '0 0 10px',
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontFamily: 'JetBrains Mono, monospace',
                background: 'var(--bg-base)',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
              }}>
                {report.message_text}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6 }}>
                {report.ai_explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}