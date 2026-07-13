export default function RiskBadge({ level }) {
  const config = {
    high: { label: 'High Risk', color: 'var(--red)', bg: 'var(--red-dim)', dot: 'var(--red)' },
    medium: { label: 'Medium Risk', color: 'var(--amber)', bg: 'var(--amber-dim)', dot: 'var(--amber)' },
    low: { label: 'Low Risk', color: 'var(--green)', bg: 'var(--green-dim)', dot: 'var(--green)' },
  }
  const c = config[level] || config.low

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '999px',
      background: c.bg,
      border: `1px solid ${c.color}30`,
      fontSize: '11px',
      fontWeight: 500,
      color: c.color,
      fontFamily: 'JetBrains Mono, monospace',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}>
      <span style={{
        width: '5px', height: '5px',
        borderRadius: '50%',
        background: c.dot,
        boxShadow: `0 0 6px ${c.dot}`,
      }} />
      {c.label}
    </span>
  )
}