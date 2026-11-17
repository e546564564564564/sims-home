import { create } from 'zustand'
import type { ObjId } from './objects'
import { nomeLivello, type Entita, type Livello, type Prodotto } from './entita'
import { entitaIniziali } from './iniziale'
import { leggiTutte, salvaTutte } from './db'

type Mappa = Record<string, Entita>

type Casa = {
  pronta: boolean
  entita: Mappa
  avviso: { testo: string; n: number } | null // messaggio con "Annulla"
  prima: Mappa | null
  carica: () => Promise<void>
  livello: (e: ObjId, p: string, l: Livello) => void
  lista: (e: ObjId, p: string) => void
  comprato: (e: ObjId, p: string) => void
  aggiungiVoce: (nome: string) => void
  scadenza: (e: ObjId, p: string, data?: string) => void
  importa: (lista: Entita[]) => void
  gruppo: (fn: () => void) => void // più azioni annullabili in un colpo solo
  annulla: () => void
  chiudiAvviso: () => void
}

const mappa = (l: Entita[]): Mappa => Object.fromEntries(l.map((e) => [e.id, e]))
const salva = (m: Mappa) => salvaTutte(Object.values(m)).catch(() => {})

export const useCasa = create<Casa>((set, get) => {
  // Applica una modifica, la registra nello storico, salva e offre "Annulla".
  const modifica = (e: ObjId, testo: string, fn: (ent: Entita) => void) => {
    const prima = get().entita
    const dopo = structuredClone(prima)
    const ent = dopo[e]
    if (!ent) return
    fn(ent)
    ent.storico = [{ quando: Date.now(), testo }, ...ent.storico].slice(0, 50)
    set({ entita: dopo, prima, avviso: { testo, n: (get().avviso?.n ?? 0) + 1 } })
    salva(dopo)
  }
  const trova = (ent: Entita, p: string) => ent.inventario?.find((x) => x.id === p) as Prodotto

  return {
    pronta: false,
    entita: {},
    avviso: null,
    prima: null,

    carica: async () => {
      let salvate: Entita[] = []
      try {
        salvate = await leggiTutte()
      } catch {}
      const m = mappa(entitaIniziali())
      for (const e of salvate) m[e.id] = e // i dati salvati vincono; nuove entità restano dal seme
      set({ entita: m, pronta: true })
      if (salvate.length !== Object.keys(m).length) salva(m)
      navigator.storage?.persist?.()
    },

    livello: (e, p, l) =>
      modifica(e, `${trova(get().entita[e], p).nome}: ${nomeLivello[l].toLowerCase()}`, (ent) => {
        trova(ent, p).livello = l
      }),

    lista: (e, p) => {
      const x = trova(get().entita[e], p)
      modifica(e, x.inLista ? `${x.nome} tolto dalla lista` : `${x.nome} → lista della spesa`, (ent) => {
        const y = trova(ent, p)
        y.inLista = !y.inLista
      })
    },

    comprato: (e, p) =>
      modifica(e, `Comprato: ${trova(get().entita[e], p).nome}`, (ent) => {
        if (e === 'lista') {
          ent.inventario = ent.inventario!.filter((x) => x.id !== p)
          return
        }
        const y = trova(ent, p)
        y.inLista = false
        y.livello = 'pieno'
      }),

    aggiungiVoce: (nome) => {
      const n = nome.trim()
      if (!n) return
      modifica('lista', `${n} → lista della spesa`, (ent) => {
        ent.inventario = [...(ent.inventario ?? []), { id: 'v' + Date.now(), nome: n, livello: 'finito', inLista: true }]
      })
    },

    scadenza: (e, p, data) =>
      modifica(e, data ? `${trova(get().entita[e], p).nome}: scade il ${data.split('-').reverse().join('/')}` : `${trova(get().entita[e], p).nome}: niente scadenza`, (ent) => {
        const y = trova(ent, p)
        if (data) y.scade = data
        else delete y.scade
      }),

    importa: (lista) => {
      const prima = get().entita
      const dopo = { ...mappa(entitaIniziali()), ...mappa(lista) }
      set({ entita: dopo, prima, avviso: { testo: 'Backup caricato', n: (get().avviso?.n ?? 0) + 1 } })
      salva(dopo)
    },

    gruppo: (fn) => {
      const prima = get().entita
      fn()
      if (get().entita !== prima) set({ prima, avviso: null })
    },

    annulla: () => {
      const prima = get().prima
      if (!prima) return
      set({ entita: prima, prima: null, avviso: null })
      salva(prima)
    },

    chiudiAvviso: () => set({ avviso: null, prima: null }),
  }
})

// Tutte le voci in lista della spesa, da qualsiasi entità.
export function vociInLista(m: Mappa) {
  return Object.values(m).flatMap((e) => (e.inventario ?? []).filter((p) => p.inLista).map((p) => ({ e: e.id, p })))
}

// accesso per i test automatici
;(window as unknown as { __casa: typeof useCasa }).__casa = useCasa
