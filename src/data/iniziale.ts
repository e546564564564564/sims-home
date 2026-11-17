import { objects, type ObjId, type StanzaPulizia } from './objects'
import { aggiungi, oggi } from './tempo'
import type { Entita, Prodotto } from './entita'

// Contenuti con cui l'app nasce (docs/scheda-contenuti.md). Tutti i prodotti al livello "pieno".
const p = (nomi: string[], gruppo?: string): Prodotto[] =>
  nomi.map((nome) => ({ id: nome.toLowerCase().replace(/\s+/g, '-'), nome, livello: 'pieno', ...(gruppo ? { gruppo } : {}) }))

const inventari: Partial<Record<ObjId, Prodotto[]>> = {
  frigo: [
    ...p(['Latte', 'Uova', 'Burro', 'Yogurt', 'Formaggio', 'Affettati', 'Verdura', 'Frutta'], 'Frigo'),
    ...p(['Verdure surgelate', 'Carne', 'Pesce', 'Gelato'], 'Congelatore'),
  ],
  dispensa: p(['Pasta', 'Riso', 'Farina', 'Zucchero', 'Caffè', 'Tè', 'Olio', 'Aceto', 'Sale', 'Passata', 'Legumi', 'Biscotti']),
  lavastoviglie: p(['Pastiglie', 'Sale', 'Brillantante']),
  lista: [], // voci aggiunte a mano alla lista della spesa
  mobileBagno: p(['Detersivo lavatrice', 'Ammorbidente', 'Carta igienica', 'Sapone mani', 'Bagnoschiuma', 'Shampoo', 'Dentifricio']),
  armadioPulizie: p(['Detersivo pavimenti', 'Sgrassatore', 'Anticalcare', 'Candeggina', 'Spugne', 'Panni', 'Sacchi spazzatura']),
}

// Unica attività predefinita: la pulizia delle stanze (giorni). Pavimenti già fatti dal robot.
const pulizia: Record<StanzaPulizia, number> = { bagno: 7, cucina: 7, sala: 7, camera: 14, studio: 14, corridoio: 14, ripostiglio: 30 }

function puliziaIniziale(r: StanzaPulizia) {
  const ogni = { n: pulizia[r], u: 'g' as const }
  return { id: 'pulizia', nome: 'Pulizia', tipo: 'completamento' as const, ogni, prossima: aggiungi(oggi(), ogni) }
}

export function entitaIniziali(): Entita[] {
  return Object.values(objects).map((o) => ({
    id: o.id,
    stanza: o.stanza,
    tipo: o.id,
    stato: 'ok',
    ...(inventari[o.id] ? { inventario: inventari[o.id] } : {}),
    ...(o.id.startsWith('pulizia-') ? { attivita: [puliziaIniziale(o.id.slice(8) as StanzaPulizia)] } : {}),
    storico: [],
  }))
}
