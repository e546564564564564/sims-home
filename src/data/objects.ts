import type { RoomId } from './house'

// Catalogo degli oggetti interattivi (nome e posto). I dati di ciascuno sono nell'entità con lo stesso id (casa.ts).
export type ObjId =
  | 'tv' | 'alexa' | 'bar' | 'termostato' | 'citofono' | 'allarme' | 'calendario'
  | 'frigo' | 'dispensa' | 'forno' | 'lavastoviglie' | 'bidoni' | 'lista'

// fronte: verso dove guarda l'apertura (x, z); la camera ruota per vederla quando l'oggetto si apre.
export type Obj = { id: ObjId; nome: string; stanza: RoomId; sotto: string; fronte?: [number, number] }

export const objects: Record<ObjId, Obj> = {
  tv: { id: 'tv', nome: 'TV', stanza: 'sala', sotto: 'Sala · dietro c\'è la caldaia' },
  alexa: { id: 'alexa', nome: 'Alexa', stanza: 'sala', sotto: 'Sala' },
  bar: { id: 'bar', nome: 'Angolo bar', stanza: 'sala', sotto: 'Sala', },
  termostato: { id: 'termostato', nome: 'Termostato', stanza: 'sala', sotto: 'Sala · riscaldamento e caldaia' },
  citofono: { id: 'citofono', nome: 'Citofono', stanza: 'sala', sotto: 'Sala · ingresso' },
  allarme: { id: 'allarme', nome: 'Allarme', stanza: 'sala', sotto: 'Sala · ingresso' },
  calendario: { id: 'calendario', nome: 'Calendario', stanza: 'sala', sotto: 'Sala · calendario Google condiviso' },
  frigo: { id: 'frigo', nome: 'Frigorifero', stanza: 'cucina', sotto: 'Cucina · con congelatore', fronte: [-1, 0] },
  dispensa: { id: 'dispensa', nome: 'Dispensa', stanza: 'cucina', sotto: 'Cucina · pensili', fronte: [0, -1] },
  forno: { id: 'forno', nome: 'Forno e piano cottura', stanza: 'cucina', sotto: 'Cucina' },
  lavastoviglie: { id: 'lavastoviglie', nome: 'Lavastoviglie', stanza: 'cucina', sotto: 'Cucina · sotto il lavello' },
  bidoni: { id: 'bidoni', nome: 'Raccolta differenziata', stanza: 'cucina', sotto: 'Cucina · sotto il lavello' },
  lista: { id: 'lista', nome: 'Lista della spesa', stanza: 'cucina', sotto: 'Cucina · blocchetto sul frigo', fronte: [0, -1] },
}
