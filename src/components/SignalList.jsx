export default function SignalList({ signals }) {
  return (
    <ul className="space-y-2">
      {signals.map((signal, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <span className="text-yellow-400 mt-0.5">⚠</span>
          <span className="text-gray-300">{signal.label}</span>
        </li>
      ))}
    </ul>
  )
}