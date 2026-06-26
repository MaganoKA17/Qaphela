export default function RiskBadge({ level }) {
  const styles = {
    high: 'bg-red-900/40 text-red-400 border-red-700',
    medium: 'bg-yellow-900/40 text-yellow-400 border-yellow-700',
    low: 'bg-green-900/40 text-green-400 border-green-700',
  }
  const labels = { high: '🔴 High Risk', medium: '🟡 Medium Risk', low: '🟢 Low Risk' }

  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${styles[level]}`}>
      {labels[level]}
    </span>
  )
}