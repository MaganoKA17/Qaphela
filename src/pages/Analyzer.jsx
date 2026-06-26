import { useState } from "react"
import {supabase } from "../lib/supabase"
import RiskBadge from "../components/RiskBadge"
import SignalList from "../components/SignalList"

export default function Analyzer(){
    const [message, setMessage] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    async function analyze() {
        if (!message.trim()) return
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const { data, error: fnError} = await supabase.functions.invoke("analyze-message",{
                body: { message }
            })
            if (fnError) throw fnError

            await supabase.from('scam_reports').insert({
                message_text: message,
                risk_score: data.score,
                risk_level: data.riskLevel,
                signals: data.signals,
                ai_explanation: data.explanation
            })
            setResult(data)
        } catch(err){
            setError("Something went wrong. Please try again.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

     return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Scam Analyzer</h1>
        <p className="text-gray-400">
          Paste a suspicious WhatsApp message or SMS below and Qaphela will analyze it for scam signals.
        </p>
      </div>

      <div className="mb-4">
        <textarea
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-yellow-400 transition-colors"
          rows={6}
          placeholder="Paste your suspicious message here..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
      </div>

      <button
        onClick={analyze}
        disabled={loading || !message.trim()}
        className="w-full bg-yellow-400 text-gray-950 font-semibold py-3 rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Analyzing...' : 'Analyze Message'}
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Risk Score</h2>
              <RiskBadge level={result.riskLevel} />
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-5xl font-bold">{result.score}</span>
              <span className="text-gray-500 mb-1">/100</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  result.riskLevel === 'high' ? 'bg-red-500' :
                  result.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-500'
                }`}
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-3">What this means</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{result.explanation}</p>
          </div>

          {result.signals.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-3">Signals detected</h2>
              <SignalList signals={result.signals} />
            </div>
          )}
        </div>
      )}
    </main>
  )
}