export const urgencyPatterns = [
    /urgent/i, /immediately/i, /account.*suspend/i,
    /verify.*now/i, /24 hours/i, /act now/i, /expires/i,
    /will be cancelled/i, /will be suspended/i, /put on hold/i,
    /account.*hold/i, /payment.*hold/i, /grant.*hold/i,
    /within.*hours/i, /within.*days/i, /deadline/i
]

export const brandPatterns = [
    /sassa/i, /fnb/i, /absa/i, /capitec/i, /nedbank/i,
    /standard bank/i, /vodacom/i, /mtn/i, /takealot/i,
    /sars/i, /home affairs/i, /uif/i
]

export const personalInfoPatterns = [
    /id number/i, /password/i, /pin/i, /otp/i,
    /bank.*detail/i, /account.*number/i, /verify.*identity/i,
    /update.*info/i, /update.*detail/i, /confirm.*detail/i,
    /personal.*detail/i, /verify.*account/i, /click.*verify/i,
    /click.*here/i, /tap.*here/i, /follow.*link/i
]

export const prizePatterns = [
    /you.*won/i, /winner/i, /prize/i, /voucher/i,
    /free.*money/i, /grant.*approved/i, /selected/i
]

export function extractSignals(message) {
    const signals = []
    let score = 0

    if (urgencyPatterns.some(p => p.test(message))) {
        signals.push({ type: 'urgency_language', label: 'Urgency language detected', weight: 20 })
        score += 20
    }

    if (brandPatterns.some(p => p.test(message))) {
        signals.push({ type: 'brand_impersonation', label: 'SA brand or government entity mentioned', weight: 25 })
        score += 25
    }

    if (personalInfoPatterns.some(p => p.test(message))) {
        signals.push({ type: 'personal_info_request', label: 'Requests personal or financial information', weight: 30 })
        score += 30
    }

    if (prizePatterns.some(p => p.test(message))) {
        signals.push({ type: 'too_good_to_be_true', label: 'Unrealistic reward or prize offer', weight: 20 })
        score += 20
    }

    score = Math.min(score, 100)

    const riskLevel = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'

    return { signals, score, riskLevel }
}

export function getRiskLevel(score) {
    return score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'
}