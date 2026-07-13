import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Analyzer' },
    { to: '/feed', label: 'Scam Feed' },
    { to: '/about', label: 'About' },
  ]

  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      background: 'rgba(10,10,15,0.92)',
      backdropFilter: 'blur(12px)',
      zIndex: 50,
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px',
          background: 'var(--accent)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0A0A0F' }}>Q</span>
        </div>
        <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Qaphela
        </span>
        <span style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.05em',
          marginLeft: '-4px',
        }}>
          · beware
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: pathname === link.to ? 500 : 400,
              color: pathname === link.to ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 0.15s ease',
              letterSpacing: '0.01em',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}