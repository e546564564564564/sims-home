import { useNav } from './store'
import { objects, type Livello } from '../data/objects'

const pill: Record<Livello, { bg: string; fg: string; pieni: number }> = {
  Pieno: { bg: '#E3F1E8', fg: '#4F8A66', pieni: 4 },
  'A metà': { bg: '#EEF0F2', fg: '#6B7480', pieni: 2 },
  'Quasi finito': { bg: '#FFF1D9', fg: '#A9762B', pieni: 1 },
  Finito: { bg: '#F3EBE2', fg: '#9A8A7E', pieni: 0 },
}

// Pannello contestuale a destra (Fase 0: contenuti d'anteprima, i dati veri arrivano col Blocco 3).
export default function Panel() {
  const id = useNav((s) => s.oggetto)
  const chiudi = useNav((s) => s.chiudi)
  if (!id) return null
  const o = objects[id]
  return (
    <aside className="pannello">
      <header>
        <div>
          <h2>{o.nome}</h2>
          <p className="sotto">{o.sotto}</p>
        </div>
        <button className="chiudi" onClick={chiudi} aria-label="Chiudi">×</button>
      </header>
      <span className="chip">● Tutto a posto</span>
      {o.anteprima ? (
        <div className="righe">
          {o.anteprima.map((r) => (
            <div className="riga" key={r.nome}>
              <div>
                <strong>{r.nome}</strong>
                <div className="tacche">
                  {[0, 1, 2, 3].map((i) => <i key={i} className={i < pill[r.livello].pieni ? 'piena' : ''} />)}
                </div>
              </div>
              <span className="livello" style={{ background: pill[r.livello].bg, color: pill[r.livello].fg }}>{r.livello}</span>
              <button className="lista" disabled>+ Lista</button>
            </div>
          ))}
        </div>
      ) : id === 'calendario' ? (
        <p className="nota">Qui comparirà il calendario Google condiviso della casa.</p>
      ) : (
        <p className="nota">Qui arriveranno attività, scorte e storico di questo oggetto.</p>
      )}
      <p className="piede">Anteprima: i dati veri arrivano nel prossimo passo.</p>
    </aside>
  )
}
