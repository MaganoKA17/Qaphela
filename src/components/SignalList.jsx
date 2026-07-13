const signalIcons = {
  urgency_language: '⏱',
  brand_impersonation: '🏦',
  personal_info_request: '🔑',
  too_good_to_be_true: '🎁',
  malicious_url: '☠',
  url_present: '🔗',
}

export default function SignalList({ signals }) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {signals.map((signal, i) => (
        <li key={i} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '10px 14px',
          background: 'var(--bg-base)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: '14px', marginTop: '1px', flexShrink: 0 }}>
            {signalIcons[signal.type] || '⚠'}
          </span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{signal.label}</span>
            <span style={{
              display: 'inline-block',
              marginLeft: '8px',
              fontSize: '10px',
              fontFamily: 'JetBrains Mono, monospace',
              color: 'var(--accent)',
              background: 'var(--accent-dim)',
              padding: '1px 6px',
              borderRadius: '4px',
            }}>
              +{signal.weight}pts
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}