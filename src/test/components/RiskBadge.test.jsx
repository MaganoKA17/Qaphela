import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RiskBadge from '../../components/RiskBadge'

describe('RiskBadge', () => {
    it('renders High Risk label for high level', () => {
        render(<RiskBadge level="high" />)
        expect(screen.getByText(/high risk/i)).toBeInTheDocument()
    })

    it('renders Medium Risk label for medium level', () => {
        render(<RiskBadge level="medium" />)
        expect(screen.getByText(/medium risk/i)).toBeInTheDocument()
    })

    it('renders Low Risk label for low level', () => {
        render(<RiskBadge level="low" />)
        expect(screen.getByText(/low risk/i)).toBeInTheDocument()
    })
})