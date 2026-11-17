import { useState } from 'react'
import { ascolta } from '../integrations/speech'

// Prova del microfono (Blocco 0, passo 4b): mostra il testo riconosciuto in un fumetto.
export default function MicButton() {
  const [ascolto, setAscolto] = useState(false)
  const [fumetto, setFumetto] = useState<string | null>(null)

  async function tocca() {
    if (ascolto) return
    setAscolto(true)
    setFumetto('Ti ascolto…')
    const esito = await ascolta()
    setAscolto(false)
    setFumetto('testo' in esito ? `“${esito.testo}”` : esito.errore)
    window.setTimeout(() => setFumetto(null), 5000)
  }

  return (
    <div className="mic">
      {fumetto && <div className="fumetto">{fumetto}</div>}
      <button className={ascolto ? 'mic-btn attivo' : 'mic-btn'} onClick={tocca} aria-label="Parla">
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
          <path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
