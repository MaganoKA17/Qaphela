import { describe, it, expect } from 'vitest'
import { extractSignals, getRiskLevel } from '../../lib/scoringEngine.test.js'

describe('getRiskLevel', () => {
    it('returns low for score below 40', () => {
        expect(getRiskLevel(0)).toBe('low')
        expect(getRiskLevel(20)).toBe('low')
        expect(getRiskLevel(39)).toBe('low')
    })

    it('returns medium for score between 40 and 69', () => {
        expect(getRiskLevel(40)).toBe('medium')
        expect(getRiskLevel(55)).toBe('medium')
        expect(getRiskLevel(69)).toBe('medium')
    })

    it('returns high for score 70 and above', () => {
        expect(getRiskLevel(70)).toBe('high')
        expect(getRiskLevel(85)).toBe('high')
        expect(getRiskLevel(100)).toBe('high')
    })
})

describe('extractSignals — urgency language', () => {
    it('detects URGENT keyword', () => {
        const { signals, score } = extractSignals('URGENT: your account will be closed')
        expect(signals.some(s => s.type === 'urgency_language')).toBe(true)
        expect(score).toBeGreaterThanOrEqual(20)
    })

    it('detects 24 hours pattern', () => {
        const { signals } = extractSignals('You must act within 24 hours')
        expect(signals.some(s => s.type === 'urgency_language')).toBe(true)
    })

    it('detects will be cancelled pattern', () => {
        const { signals } = extractSignals('Your grant will be cancelled if you do not respond')
        expect(signals.some(s => s.type === 'urgency_language')).toBe(true)
    })

    it('detects put on hold pattern', () => {
        const { signals } = extractSignals('Your payment has been put on hold')
        expect(signals.some(s => s.type === 'urgency_language')).toBe(true)
    })
})

describe('extractSignals — brand impersonation', () => {
    it('detects SASSA mention', () => {
        const { signals } = extractSignals('Your SASSA grant has been approved')
        expect(signals.some(s => s.type === 'brand_impersonation')).toBe(true)
    })

    it('detects Capitec mention', () => {
        const { signals } = extractSignals('Your Capitec account has been suspended')
        expect(signals.some(s => s.type === 'brand_impersonation')).toBe(true)
    })

    it('detects FNB mention', () => {
        const { signals } = extractSignals('FNB: please verify your account details')
        expect(signals.some(s => s.type === 'brand_impersonation')).toBe(true)
    })

    it('detects Vodacom mention', () => {
        const { signals } = extractSignals('Congratulations Vodacom customer')
        expect(signals.some(s => s.type === 'brand_impersonation')).toBe(true)
    })
})

describe('extractSignals — personal info requests', () => {
    it('detects click here pattern', () => {
        const { signals } = extractSignals('Click here to verify your account')
        expect(signals.some(s => s.type === 'personal_info_request')).toBe(true)
    })

    it('detects OTP request', () => {
        const { signals } = extractSignals('Please enter your OTP to continue')
        expect(signals.some(s => s.type === 'personal_info_request')).toBe(true)
    })

    it('detects update info pattern', () => {
        const { signals } = extractSignals('Please update your information immediately')
        expect(signals.some(s => s.type === 'personal_info_request')).toBe(true)
    })

    it('detects PIN request', () => {
        const { signals } = extractSignals('Enter your PIN to confirm your identity')
        expect(signals.some(s => s.type === 'personal_info_request')).toBe(true)
    })
})

describe('extractSignals — prize and reward patterns', () => {
    it('detects winner pattern', () => {
        const { signals } = extractSignals('You are a winner! Claim your prize now')
        expect(signals.some(s => s.type === 'too_good_to_be_true')).toBe(true)
    })

    it('detects selected pattern', () => {
        const { signals } = extractSignals('You have been selected for a special offer')
        expect(signals.some(s => s.type === 'too_good_to_be_true')).toBe(true)
    })

    it('detects voucher pattern', () => {
        const { signals } = extractSignals('Claim your R500 Takealot voucher today')
        expect(signals.some(s => s.type === 'too_good_to_be_true')).toBe(true)
    })
})

describe('extractSignals — full message scenarios', () => {
    it('correctly scores a high risk SASSA scam message', () => {
        const message = 'URGENT: Dear SASSA beneficiary, your R350 grant payment has been put on hold. Update your information within 24 hours or your grant will be cancelled. Click here to verify.'
        const { score, riskLevel, signals } = extractSignals(message)
        expect(score).toBeGreaterThanOrEqual(70)
        expect(riskLevel).toBe('high')
        expect(signals.length).toBeGreaterThanOrEqual(3)
    })

    it('correctly scores a medium risk prize message', () => {
        const message = 'Congratulations! You have been selected as a Vodacom loyalty winner. Reply YES to claim your prize.'
        const { score, riskLevel } = extractSignals(message)
        expect(score).toBeGreaterThanOrEqual(40)
        expect(score).toBeLessThan(70)
        expect(riskLevel).toBe('medium')
    })

    it('correctly scores a low risk legitimate message', () => {
        const message = 'Hey! Just a reminder that your Woolworths rewards points are expiring at the end of the month.'
        const { score, riskLevel } = extractSignals(message)
        expect(score).toBe(0)
        expect(riskLevel).toBe('low')
    })

    it('caps score at 100', () => {
        const message = 'URGENT: SASSA grant cancelled. Click here to enter your PIN and OTP. You have been selected as a winner. Act now within 24 hours.'
        const { score } = extractSignals(message)
        expect(score).toBeLessThanOrEqual(100)
    })

    it('returns empty signals for a clean message', () => {
        const message = 'See you at the braai on Saturday!'
        const { signals, score } = extractSignals(message)
        expect(signals).toHaveLength(0)
        expect(score).toBe(0)
    })
})