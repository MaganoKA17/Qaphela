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
}