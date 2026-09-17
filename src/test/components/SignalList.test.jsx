import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignalList from '../../components/SignalList'

const mockSignals = [
    { type: 'urgency_language', label: 'Urgency language detected', weight: 20 },
    { type: 'brand_impersonation', label: 'SA brand or government entity mentioned', weight: 25 },
]

describe('SignalList', () => {
    it('renders all signals passed to it', () => {
        render(<SignalList signals={mockSignals} />)
        expect(screen.getByText('Urgency language detected')).toBeInTheDocument()
        expect(screen.getByText('SA brand or government entity mentioned')).toBeInTheDocument()
    })

    it('renders correct number of signal items', () => {
        render(<SignalList signals={mockSignals} />)
        const items = screen.getAllByRole('listitem')
        expect(items).toHaveLength(2)
    })

    it('renders empty list when no signals passed', () => {
        render(<SignalList signals={[]} />)
        const items = screen.queryAllByRole('listitem')
        expect(items).toHaveLength(0)
    })

    it('displays point weights for each signal', () => {
        render(<SignalList signals={mockSignals} />)
        expect(screen.getByText('+20pts')).toBeInTheDocument()
        expect(screen.getByText('+25pts')).toBeInTheDocument()
    })
})