import { useState } from 'react'
import { useCasa } from '../data/casa'
import type { ObjId } from '../data/objects'
import type { Attivita } from '../data/entita'
import { aggiungi, giorniA, oggi, quando, testoOgni, type Ogni } from '../data/tempo'

// Blocco "Attività" del pannello: nessuna attività predefinita, si creano qui.

function Riga({ e, a }: { e: ObjId; a: Attivita }) {
  const [aperta, setAperta] = useState(false)
  const { fatto, eliminaAttivita } = useCasa.getState()
  const vicina = giorniA(a.prossima) <= 0
  return (
    <div className={'riga voce' + (aperta ? ' aperta' : '')}>
      <button className="nome" onClick={() => setAperta(!aperta)}>
        <strong>{a.nome}</strong>
        <span className={'scade' + (vicina ? ' vicina' : '')}>{quando(a.prossima)}{a.ogni ? ` · ${testoOgni(a.ogni)}` : ' · una volta'}</span>
      </button>
      <button className="comprato" onClick={() => fatto(e, a.id)}>Fatto</button>
      {aperta && (
        <div className="dettaglio">
          <p className="sotto">
            {a.ogni ? (a.tipo === 'completamento' ? 'Si conta dal giorno in cui la fai.' : 'A data fissa.') : 'Una volta sola.'}
            {a.ultima ? ` Ultima volta il ${new Date(a.ultima).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}.` : ''}
          </p>
          <button className="togli" onClick={() => eliminaAttivita(e, a.id)}>Togli questa attività</button>
        </div>
      )}
    </div>
  )
}

function Nuova({ e, chiudi }: { e: ObjId; chiudi: () => void }) {
  const [nome, setNome] = useState('')
  const [ripeti, setRipeti] = useState(true)
  const [ogni, setOgni] = useState<Ogni>({ n: 1, u: 's' })
  const [tipo, setTipo] = useState<Attivita['tipo']>('completamento')
  const [data, setData] = useState<string | null>(null) // null = calcolata
  const prossima = data ?? (ripeti && tipo === 'completamento' ? aggiungi(oggi(), ogni) : oggi())
  const salva = () => {
    if (!nome.trim()) return
    useCasa.getState().nuovaAttivita(e, { nome: nome.trim(), tipo, prossima, ...(ripeti ? { ogni } : {}) })
    chiudi()
  }
  return (
    <form className="nuova" onSubmit={(ev) => { ev.preventDefault(); salva() }}>
      <input value={nome} onChange={(ev) => setNome(ev.target.value)} placeholder="Cosa c'è da fare? es. Pulire il filtro" autoFocus enterKeyHint="done" />
      <div className="scelta due">
        <button type="button" className={!ripeti ? 'su' : ''} onClick={() => setRipeti(false)}>Una volta</button>
        <button type="button" className={ripeti ? 'su' : ''} onClick={() => setRipeti(true)}>Si ripete</button>
      </div>
      {ripeti && (
        <>
          <label className="data">
            Ogni
            <input type="number" min={1} max={99} value={ogni.n} onChange={(ev) => setOgni({ ...ogni, n: Math.max(1, +ev.target.value || 1) })} />
            <select value={ogni.u} onChange={(ev) => setOgni({ ...ogni, u: ev.target.value as Ogni['u'] })}>
              <option value="g">giorni</option>
              <option value="s">settimane</option>
              <option value="m">mesi</option>
            </select>
          </label>
          <div className="scelta due">
            <button type="button" className={tipo === 'completamento' ? 'su' : ''} onClick={() => setTipo('completamento')}>Da quando la faccio</button>
            <button type="button" className={tipo === 'data' ? 'su' : ''} onClick={() => setTipo('data')}>A data fissa</button>
          </div>
        </>
      )}
      <label className="data">
        {ripeti ? 'Prossima volta' : 'Entro il'}
        <input type="date" value={prossima} onChange={(ev) => setData(ev.target.value || null)} />
      </label>
      <div className="azioni">
        <button type="button" onClick={chiudi}>Lascia stare</button>
        <button type="submit" className="comprato" disabled={!nome.trim()}>Aggiungi</button>
      </div>
    </form>
  )
}

export default function BloccoAttivita({ e }: { e: ObjId }) {
  const attivita = useCasa((s) => s.entita[e]?.attivita) ?? []
  const [nuova, setNuova] = useState(false)
  const ordinate = [...attivita].sort((a, b) => a.prossima.localeCompare(b.prossima))
  return (
    <div className="righe">
      <h3>Attività</h3>
      {ordinate.map((a) => <Riga key={a.id} e={e} a={a} />)}
      {nuova ? <Nuova e={e} chiudi={() => setNuova(false)} /> : <button className="piu" onClick={() => setNuova(true)}>+ Attività</button>}
    </div>
  )
}
