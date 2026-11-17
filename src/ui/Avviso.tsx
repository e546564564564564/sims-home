import { useEffect } from 'react'
import { useCasa } from '../data/casa'

// Conferma breve di ogni azione, con "Annulla" per qualche secondo. Niente finestre di conferma.
export default function Avviso() {
  const avviso = useCasa((s) => s.avviso)
  const prima = useCasa((s) => s.prima)
  const { annulla, chiudiAvviso } = useCasa.getState()
  useEffect(() => {
    if (!avviso) return
    const t = setTimeout(chiudiAvviso, 5000)
    return () => clearTimeout(t)
  }, [avviso, chiudiAvviso])
  if (!avviso) return null
  return (
    <div className="avviso" key={avviso.n}>
      <span>{avviso.testo}</span>
      {prima && <button onClick={annulla}>Annulla</button>}
    </div>
  )
}
