import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import RiskBadge from '../components/RiskBadge'

export default function Feed() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      const { data } = await supabase
        .from('scam_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      setReports(data || [])
      setLoading(false)
    }
    fetchReports()
  }, [])

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Scam Feed</h1>
        <p className="text-gray-400">Recently analyzed messages from the community.</p>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}

      <div className="space-y-4">
        {reports.map(report => (
          <div key={report.id} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <RiskBadge level={report.risk_level} />
              <span className="text-gray-600 text-xs">
                {new Date(report.created_at).toLocaleDateString('en-ZA')}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{report.message_text}</p>
            <p className="text-gray-300 text-sm">{report.ai_explanation}</p>
          </div>
        ))}
      </div>
    </main>
  )
}