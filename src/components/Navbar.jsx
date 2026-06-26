import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Analyzer' },
    { to: '/feed', label: 'Scam Feed' },
    { to: '/about', label: 'About' },
  ]

  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 text-xl">⚠</span>
        <span className="font-bold text-lg tracking-tight">Qaphela</span>
        <span className="text-gray-500 text-sm ml-1">· beware</span>
      </div>
      <div className="flex gap-6">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm transition-colors ${
              pathname === link.to
                ? 'text-yellow-400 font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}