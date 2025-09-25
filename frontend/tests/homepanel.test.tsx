import { render, screen } from '@testing-library/react'
import { HomePanel } from '../components/HomePanel'
import React from 'react'

function noop() {}

describe('HomePanel', () => {
  it('renders six large bilingual buttons for categories', () => {
    render(<HomePanel onNavigate={noop} />)

    // Greek labels
    const greekLabels = [
      'ΚΟΙΝΑ ΕΙΣΕΡΧΟΜΕΝΑ',
      'ΚΟΙΝΑ ΕΞΕΡΧΟΜΕΝΑ',
      'ΣΗΜΑΤΑ ΕΙΣΕΡΧΟΜΕΝΑ',
      'ΣΗΜΑΤΑ ΕΞΕΡΧΟΜΕΝΑ',
      'ΑΠΟΡΡΗΤΑ ΕΙΣΕΡΧΟΜΕΝΑ',
      'ΑΠΟΡΡΗΤΑ ΕΞΕΡΧΟΜΕΝΑ',
    ]

    for (const label of greekLabels) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }

    // English subtitles
    const english = [
      'Common Incoming',
      'Common Outgoing',
      'Signals Incoming',
      'Signals Outgoing',
      'Confidential Incoming',
      'Confidential Outgoing',
    ]
    for (const label of english) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })
})
