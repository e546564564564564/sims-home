import { useState } from 'react'
import { useCasa } from '../data/casa'
import { rifiuti } from '../data/objects'
import { iso } from '../data/tempo'

// Giorni della raccolta differenziata: ogni giorno diventa un'attività "a data fissa" sui bidoni.
const giorni = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

function prossimo(g: number) {
  const d = new Date()
  const oggi = (d.getDay() + 6) % 7 // 0 = lunedì
  d.setDate(d.getDate() + ((g - oggi + 7) % 7))
  return iso(d)
}

export default function Raccolta() {
  const [aperta, setAperta] = useState(false)
  const [tipo, setTipo] = useState('Umido')
  const [giorno, setGiorno] = useState(0)
  const [ogni, setOgni] = useState(1)
  if (!aperta) return <button className="piu" onClick={() => setAperta(true)}>+ Giorno di raccolta</button>
  const salva = () => {
    useCasa.getState().nuovaAttivita('bidoni', { nome: `Esporre: ${tipo}`, tipo: 'data', ogni: { n: ogni, u: 's' }, prossima: prossimo(giorno) })
    setAperta(false)
  }
  return (
    <div className="nuova">
      <div className="chips">
        {Object.entries(rifiuti).map(([t, c]) => (
          <button key={t} className={t === tipo ? 'su' : ''} onClick={() => setTipo(t)}><i style={{ background: c }} />{t}</button>
        ))}
      </div>
      <div className="scelta sette">
        {giorni.map((g, i) => <button key={g} className={i === giorno ? 'su' : ''} onClick={() => setGiorno(i)}>{g}</button>)}
      </div>
      <div className="scelta due">
        <button className={ogni === 1 ? 'su' : ''} onClick={() => setOgni(1)}>Ogni settimana</button>
        <button className={ogni === 2 ? 'su' : ''} onClick={() => setOgni(2)}>Ogni 2 settimane</button>
      </div>
      <p className="sotto">La sera prima il bidone compare fuori dalla porta d'ingresso.</p>
      <div className="azioni">
        <button onClick={() => setAperta(false)}>Lascia stare</button>
        <button className="comprato" onClick={salva}>Aggiungi</button>
      </div>
    </div>
  )
}
