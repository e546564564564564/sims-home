import { useRef, useState } from 'react'
import { ascolta } from '../integrations/speech'
import { eseguiComando } from '../integrations/comandi'
import { useCasa } from '../data/casa'
import { objects } from '../data/objects'
import { useNav } from './store'

// Microfono: tocca e parla. Il comando viene eseguito subito; il fumetto conferma con "Annulla".
export default function MicButton() {
  const [ascolto, setAscolto] = useState(false)
  const [fumetto, setFumetto] = useState<string | null>(null)
  const [annullabile, setAnnullabile] = useState(false)
  const timer = useRef(0)

  function mostra(testo: string | null, puoiAnnullare = false) {
    window.clearTimeout(timer.current)
    setFumetto(testo)
    setAnnullabile(puoiAnnullare)
    if (testo) timer.current = window.setTimeout(() => { setFumetto(null); if (puoiAnnullare) useCasa.getState().chiudiAvviso() }, 6000)
  }

  async function tocca() {
    if (ascolto) return
    setAscolto(true)
    mostra('Ti ascolto…')
    const esito = await ascolta()
    setAscolto(false)
    if (!('testo' in esito)) return mostra(esito.errore)
    const r = eseguiComando(esito.testo)
    mostra(r.messaggio, r.capito)
    if (r.oggetto) useNav.getState().apri(r.oggetto, objects[r.oggetto].stanza) // la casa mostra il risultato
  }

  function annulla() {
    useCasa.getState().annulla()
    mostra('Annullato.')
  }

  return (
    <div className="mic">
      {fumetto && (
        <div className="fumetto">
          {fumetto}
          {annullabile && <button onClick={annulla}>Annulla</button>}
        </div>
      )}
      <button className={ascolto ? 'mic-btn attivo' : 'mic-btn'} onClick={tocca} aria-label="Parla">
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
          <path d="M6 11a6 6 0 0 0 12 0M12 17v4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
