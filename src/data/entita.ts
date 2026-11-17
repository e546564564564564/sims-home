import type { RoomId } from './house'
import type { ObjId } from './objects'
import type { Ogni } from './tempo'

// Modello a entità: ogni oggetto della casa ha la stessa struttura.
export type Livello = 'pieno' | 'meta' | 'quasi' | 'finito'
export const livelli: Livello[] = ['pieno', 'meta', 'quasi', 'finito']
export const nomeLivello: Record<Livello, string> = { pieno: 'Pieno', meta: 'A metà', quasi: 'Quasi finito', finito: 'Finito' }

export type Prodotto = {
  id: string
  nome: string
  livello: Livello
  gruppo?: string // es. "Frigo" / "Congelatore"
  inLista?: boolean
  scade?: string // AAAA-MM-GG
}

// Attività: senza "ogni" = una volta sola. tipo: dal giorno in cui la faccio, oppure a data fissa.
export type Attivita = { id: string; nome: string; ogni?: Ogni; tipo: 'completamento' | 'data'; prossima: string; ultima?: number }
export type Scadenza = { id: string; nome: string; data: string }
export type Evento = { quando: number; testo: string }

export type Entita = {
  id: ObjId
  stanza: RoomId
  tipo: string
  stato: string
  inventario?: Prodotto[]
  attivita?: Attivita[]
  scadenze?: Scadenza[]
  storico: Evento[]
  impostazioni?: Record<string, string> // es. l'indirizzo del calendario Google
}
