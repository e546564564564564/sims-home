import { useState } from 'react'
import { useCasa } from '../data/casa'

// Calendario di casa: solo il calendario Google condiviso, in embed. L'indirizzo si inserisce una volta qui.

// Accetta l'ID del calendario, il link di incorporamento o il codice <iframe> copiato da Google.
function estraiId(testo: string): string | null {
  const t = testo.trim()
  const src = t.match(/[?&]src=([^&"'\s]+)/)
  const id = decodeURIComponent(src ? src[1] : t)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id) ? id : null
}

function Imposta({ attuale, chiudi }: { attuale?: string; chiudi?: () => void }) {
  const [testo, setTesto] = useState(attuale ?? '')
  const [errore, setErrore] = useState(false)
  const salva = () => {
    const id = estraiId(testo)
    if (!id) return setErrore(true)
    useCasa.getState().imposta('calendario', 'google', id)
    chiudi?.()
  }
  return (
    <form className="nuova" onSubmit={(e) => { e.preventDefault(); salva() }}>
      <p className="nota">Incolla l'ID del calendario Google condiviso (Impostazioni del calendario → Integra calendario → ID calendario). Va bene anche il link o il codice di incorporamento.</p>
      <input value={testo} onChange={(e) => { setTesto(e.target.value); setErrore(false) }} placeholder="…@group.calendar.google.com" />
      {errore && <p className="sotto">Non riconosco un ID di calendario in questo testo.</p>}
      <div className="azioni">
        {chiudi && <button type="button" onClick={chiudi}>Lascia stare</button>}
        <button type="submit" className="comprato" disabled={!testo.trim()}>Salva</button>
      </div>
    </form>
  )
}

export default function Calendario() {
  const id = useCasa((s) => s.entita.calendario?.impostazioni?.google)
  const [modifica, setModifica] = useState(false)
  if (!id || modifica) return <Imposta attuale={id} chiudi={id ? () => setModifica(false) : undefined} />
  const src = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(id)}&ctz=Europe%2FRome&hl=it&mode=AGENDA&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0`
  return (
    <>
      {navigator.onLine ? <iframe className="gcal" src={src} title="Calendario di casa" /> : <p className="nota">Per vedere il calendario serve la connessione.</p>}
      <a className="comprato apri" href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(id)}`} target="_blank" rel="noreferrer">Apri in Google Calendar</a>
      <button className="togli" onClick={() => setModifica(true)}>Cambia calendario</button>
    </>
  )
}
