import type { RoomId } from './house'

// Oggetti interattivi (Fase 0: solo nome, stanza e descrizione; i dati veri arrivano dal Blocco 3).
export type ObjId =
  | 'tv' | 'alexa' | 'bar' | 'termostato' | 'citofono' | 'allarme' | 'calendario'
  | 'frigo' | 'dispensa' | 'forno' | 'lavastoviglie' | 'bidoni'

export type Obj = { id: ObjId; nome: string; stanza: RoomId; sotto: string; anteprima?: { nome: string; livello: Livello }[] }
export type Livello = 'Pieno' | 'A metà' | 'Quasi finito' | 'Finito'

export const objects: Record<ObjId, Obj> = {
  tv: { id: 'tv', nome: 'TV', stanza: 'sala', sotto: 'Sala · dietro c\'è la caldaia' },
  alexa: { id: 'alexa', nome: 'Alexa', stanza: 'sala', sotto: 'Sala' },
  bar: {
    id: 'bar', nome: 'Angolo bar', stanza: 'sala', sotto: 'Sala',
    anteprima: [{ nome: 'Gin', livello: 'A metà' }, { nome: 'Vino rosso', livello: 'Pieno' }, { nome: 'Acqua tonica', livello: 'Quasi finito' }],
  },
  termostato: { id: 'termostato', nome: 'Termostato', stanza: 'sala', sotto: 'Sala · riscaldamento e caldaia' },
  citofono: { id: 'citofono', nome: 'Citofono', stanza: 'sala', sotto: 'Sala · ingresso' },
  allarme: { id: 'allarme', nome: 'Allarme', stanza: 'sala', sotto: 'Sala · ingresso' },
  calendario: { id: 'calendario', nome: 'Calendario', stanza: 'sala', sotto: 'Sala · calendario Google condiviso' },
  frigo: {
    id: 'frigo', nome: 'Frigorifero', stanza: 'cucina', sotto: 'Cucina · con congelatore',
    anteprima: [{ nome: 'Latte', livello: 'Pieno' }, { nome: 'Uova', livello: 'A metà' }, { nome: 'Burro', livello: 'Quasi finito' }, { nome: 'Yogurt', livello: 'Finito' }],
  },
  dispensa: {
    id: 'dispensa', nome: 'Dispensa', stanza: 'cucina', sotto: 'Cucina · pensili',
    anteprima: [{ nome: 'Pasta', livello: 'Pieno' }, { nome: 'Caffè', livello: 'A metà' }, { nome: 'Olio', livello: 'Quasi finito' }],
  },
  forno: { id: 'forno', nome: 'Forno e piano cottura', stanza: 'cucina', sotto: 'Cucina' },
  lavastoviglie: { id: 'lavastoviglie', nome: 'Lavastoviglie', stanza: 'cucina', sotto: 'Cucina · sotto il lavello' },
  bidoni: { id: 'bidoni', nome: 'Raccolta differenziata', stanza: 'cucina', sotto: 'Cucina · sotto il lavello' },
}
