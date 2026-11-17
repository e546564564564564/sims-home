import { useState } from 'react'
import { useNav } from './store'
import { rooms } from '../data/house'
import Impostazioni from './Impostazioni'
import { stanzePulizia, type StanzaPulizia } from '../data/objects'

// Scorciatoia in alto a sinistra: salta a una stanza o torna a tutta la casa.
export default function RoomPicker() {
  const stanza = useNav((s) => s.stanza)
  const vai = useNav((s) => s.vaiStanza)
  const [aperto, setAperto] = useState(false)
  const nome = stanza ? rooms.find((r) => r.id === stanza)!.nome : 'Tutta la casa'
  return (
    <div className="picker">
      <div className="picker-riga">
        <button className="picker-btn" onClick={() => setAperto(!aperto)}>
          {nome} <span className="freccia">▾</span>
        </button>
        {stanza && (stanzePulizia as readonly string[]).includes(stanza) && (
          <button className="tondo" onClick={() => useNav.getState().apri(`pulizia-${stanza as StanzaPulizia}`, stanza)} aria-label="Pulizie della stanza">🧹</button>
        )}
        <Impostazioni />
      </div>
      {aperto && (
        <ul className="picker-lista">
          <li><button onClick={() => { vai(null); setAperto(false) }}>Tutta la casa</button></li>
          {rooms.map((r) => (
            <li key={r.id}><button onClick={() => { vai(r.id); setAperto(false) }}>{r.nome}</button></li>
          ))}
        </ul>
      )}
    </div>
  )
}
