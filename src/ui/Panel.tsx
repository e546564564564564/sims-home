import { useState } from 'react'
import { useNav } from './store'
import { objects, type ObjId } from '../data/objects'
import { useCasa, vociInLista, daFare } from '../data/casa'
import BloccoAttivita from './Attivita'
import Calendario from './Calendario'
import { livelli, nomeLivello, type Livello, type Prodotto } from '../data/entita'

const pieni: Record<Livello, number> = { pieno: 4, meta: 2, quasi: 1, finito: 0 }
const dopo: Record<Livello, Livello> = { pieno: 'meta', meta: 'quasi', quasi: 'finito', finito: 'pieno' }

// Testo gentile per la scadenza di un alimento.
function scadenza(data: string) {
  const oggi = new Date(new Date().toDateString()).getTime()
  const g = Math.round((new Date(data + 'T00:00').getTime() - oggi) / 864e5)
  const testo = g < 0 ? 'scaduto' : g === 0 ? 'scade oggi' : g === 1 ? 'scade domani' : g <= 7 ? `scade fra ${g} giorni` : `scade il ${data.split('-').reverse().slice(0, 2).join('/')}`
  return { testo, vicina: g <= 2 }
}

function Riga({ e, p }: { e: ObjId; p: Prodotto }) {
  const [aperta, setAperta] = useState(false)
  const { livello, lista, scadenza: impostaScadenza } = useCasa.getState()
  const s = p.scade ? scadenza(p.scade) : null
  return (
    <div className={'riga' + (aperta ? ' aperta' : '')}>
      <button className="nome" onClick={() => setAperta(!aperta)}>
        <strong>{p.nome}</strong>
        {s && <span className={'scade' + (s.vicina ? ' vicina' : '')}>{s.testo}</span>}
        <span className="tacche">{[0, 1, 2, 3].map((i) => <i key={i} className={i < pieni[p.livello] ? 'piena' : ''} />)}</span>
      </button>
      <button className={'livello ' + p.livello} onClick={() => livello(e, p.id, dopo[p.livello])}>{nomeLivello[p.livello]}</button>
      <button className={'lista' + (p.inLista ? ' in' : '')} onClick={() => lista(e, p.id)}>{p.inLista ? '✓ In lista' : '+ Lista'}</button>
      {aperta && (
        <div className="dettaglio">
          <div className="scelta">
            {livelli.map((l) => (
              <button key={l} className={l === p.livello ? 'su' : ''} onClick={() => livello(e, p.id, l)}>{nomeLivello[l]}</button>
            ))}
          </div>
          <label className="data">
            Scade il
            <input type="date" value={p.scade ?? ''} onChange={(ev) => impostaScadenza(e, p.id, ev.target.value || undefined)} />
            {p.scade && <button onClick={() => impostaScadenza(e, p.id)}>Togli</button>}
          </label>
        </div>
      )}
    </div>
  )
}

function Inventario({ e, prodotti }: { e: ObjId; prodotti: Prodotto[] }) {
  const gruppi = [...new Set(prodotti.map((p) => p.gruppo ?? ''))]
  return (
    <div className="righe">
      {gruppi.map((g) => (
        <div className="righe" key={g}>
          {g && <h3>{g}</h3>}
          {prodotti.filter((p) => (p.gruppo ?? '') === g).map((p) => <Riga key={p.id} e={e} p={p} />)}
        </div>
      ))}
    </div>
  )
}

function ListaSpesa() {
  const entita = useCasa((s) => s.entita)
  const { comprato, aggiungiVoce } = useCasa.getState()
  const [testo, setTesto] = useState('')
  const voci = vociInLista(entita)
  const aggiungi = () => {
    aggiungiVoce(testo)
    setTesto('')
  }
  return (
    <div className="righe">
      {voci.length === 0 && <p className="nota">La lista è vuota. Dal frigo o dalla dispensa tocca “+ Lista”, oppure scrivi qui sotto.</p>}
      {voci.map(({ e, p }) => (
        <div className="riga voce" key={e + p.id}>
          <div>
            <strong>{p.nome}</strong>
            {e !== 'lista' && <div className="sotto">{p.gruppo ?? objects[e].nome}</div>}
          </div>
          <button className="comprato" onClick={() => comprato(e, p.id)}>Comprato</button>
        </div>
      ))}
      <form className="aggiungi" onSubmit={(ev) => { ev.preventDefault(); aggiungi() }}>
        <input value={testo} onChange={(ev) => setTesto(ev.target.value)} placeholder="Aggiungi altro…" enterKeyHint="done" />
        <button type="submit" disabled={!testo.trim()}>Aggiungi</button>
      </form>
    </div>
  )
}

// Pannello contestuale a destra: mostra l'entità dell'oggetto toccato.
export default function Panel() {
  const id = useNav((s) => s.oggetto)
  const chiudi = useNav((s) => s.chiudi)
  const ent = useCasa((s) => (id ? s.entita[id] : undefined))
  const [tutto, setTutto] = useState(false)
  if (!id) return null
  const o = objects[id]
  const inv = ent?.inventario
  const finendo = inv?.some((p) => (p.livello === 'finito' || p.livello === 'quasi') && !p.inLista)
  const conAttivita = id !== 'lista' && id !== 'calendario'
  const daFareOra = daFare(ent).length > 0
  const storico = (conAttivita && ent?.storico.slice(0, tutto ? 50 : 3)) || []
  return (
    <aside className="pannello">
      <header>
        <div>
          <h2>{o.nome}</h2>
          <p className="sotto">{o.sotto}</p>
        </div>
        <button className="chiudi" onClick={chiudi} aria-label="Chiudi">×</button>
      </header>
      {conAttivita && <span className={'chip' + (finendo || daFareOra ? ' caldo' : '')}>● {daFareOra ? "C'è qualcosa da fare" : finendo ? 'Qualcosa sta finendo' : 'Tutto a posto'}</span>}
      {id === 'lista' ? (
        <ListaSpesa />
      ) : inv ? (
        <Inventario e={id} prodotti={inv} />
      ) : id === 'calendario' ? (
        <Calendario />
      ) : null}
      {conAttivita && <BloccoAttivita e={id} />}
      {storico.length > 0 && (
        <div className="storico">
          <h3>Storico</h3>
          {storico.map((s, i) => (
            <p key={i}>{s.testo} <span>· {new Date(s.quando).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span></p>
          ))}
          {ent!.storico.length > 3 && <button className="togli" onClick={() => setTutto(!tutto)}>{tutto ? 'Mostra meno' : 'Mostra tutto lo storico'}</button>}
        </div>
      )}
    </aside>
  )
}
