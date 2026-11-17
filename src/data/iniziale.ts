import { objects, type ObjId } from './objects'
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
}

export function entitaIniziali(): Entita[] {
  return Object.values(objects).map((o) => ({
    id: o.id,
    stanza: o.stanza,
    tipo: o.id,
    stato: 'ok',
    ...(inventari[o.id] ? { inventario: inventari[o.id] } : {}),
    storico: [],
  }))
}
