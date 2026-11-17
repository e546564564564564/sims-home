import type { RoomId } from './house'

// Catalogo degli oggetti interattivi (nome e posto). I dati di ciascuno sono nell'entità con lo stesso id (casa.ts).
// Stanze con la pulizia periodica: ognuna ha un'entità "pulizia-<stanza>" (si apre toccando il pavimento della stanza).
export const stanzePulizia = ['sala', 'cucina', 'bagno', 'camera', 'studio', 'corridoio', 'ripostiglio'] as const
export type StanzaPulizia = (typeof stanzePulizia)[number]

export type ObjId =
  | `pulizia-${StanzaPulizia}`
  | 'tv' | 'alexa' | 'bar' | 'termostato' | 'citofono' | 'allarme' | 'calendario'
  | 'frigo' | 'dispensa' | 'forno' | 'lavastoviglie' | 'bidoni' | 'lista'
  | 'posta' | 'prato' | 'siepe' | 'piante' | 'lavatrice' | 'mobileBagno' | 'letto' | 'armadio' | 'computer' | 'asciugatrice' | 'robot' | 'armadioPulizie'

// fronte: verso dove guarda l'apertura (x, z); la camera ruota per vederla quando l'oggetto si apre.
export type Obj = { id: ObjId; nome: string; stanza: RoomId; sotto: string; fronte?: [number, number] }

const nomiStanze: Record<StanzaPulizia, string> = { sala: 'Sala', cucina: 'Cucina', bagno: 'Bagno', camera: 'Camera', studio: 'Studio', corridoio: 'Corridoio', ripostiglio: 'Ripostiglio' }
const pulizie = Object.fromEntries(
  stanzePulizia.map((r) => [`pulizia-${r}`, { id: `pulizia-${r}`, nome: nomiStanze[r], stanza: r, sotto: 'Pulizia della stanza' }]),
) as Record<`pulizia-${StanzaPulizia}`, Obj>

export const objects: Record<ObjId, Obj> = {
  ...pulizie,
  tv: { id: 'tv', nome: 'TV', stanza: 'sala', sotto: 'Sala · dietro c\'è la caldaia' },
  alexa: { id: 'alexa', nome: 'Alexa', stanza: 'sala', sotto: 'Sala' },
  bar: { id: 'bar', nome: 'Angolo bar', stanza: 'sala', sotto: 'Sala · bottiglie e bevande', fronte: [1, 0] },
  termostato: { id: 'termostato', nome: 'Termostato', stanza: 'sala', sotto: 'Sala · riscaldamento e caldaia' },
  citofono: { id: 'citofono', nome: 'Citofono', stanza: 'sala', sotto: 'Sala · ingresso' },
  allarme: { id: 'allarme', nome: 'Allarme', stanza: 'sala', sotto: 'Sala · ingresso' },
  calendario: { id: 'calendario', nome: 'Calendario', stanza: 'sala', sotto: 'Sala · calendario Google condiviso' },
  frigo: { id: 'frigo', nome: 'Frigorifero', stanza: 'cucina', sotto: 'Cucina · con congelatore', fronte: [-1, 0] },
  dispensa: { id: 'dispensa', nome: 'Dispensa', stanza: 'cucina', sotto: 'Cucina · pensili', fronte: [0, -1] },
  forno: { id: 'forno', nome: 'Forno e piano cottura', stanza: 'cucina', sotto: 'Cucina' },
  lavastoviglie: { id: 'lavastoviglie', nome: 'Lavastoviglie', stanza: 'cucina', sotto: 'Cucina · sotto il lavello' },
  bidoni: { id: 'bidoni', nome: 'Raccolta differenziata', stanza: 'cucina', sotto: 'Cucina · sotto il lavello' },
  prato: { id: 'prato', nome: 'Prato', stanza: 'giardino', sotto: 'Giardino · si apre toccando l\'erba' },
  siepe: { id: 'siepe', nome: 'Siepe', stanza: 'giardino', sotto: 'Giardino' },
  piante: { id: 'piante', nome: 'Aiuola', stanza: 'giardino', sotto: 'Giardino · piante' },
  posta: { id: 'posta', nome: 'Cassetta della posta', stanza: 'portico', sotto: 'Portico · bollette, rinnovi, appuntamenti' },
  lavatrice: { id: 'lavatrice', nome: 'Lavatrice', stanza: 'bagno', sotto: 'Bagno', fronte: [1, 0] },
  mobileBagno: { id: 'mobileBagno', nome: 'Mobile del lavabo', stanza: 'bagno', sotto: 'Bagno · scorte del bagno e del bucato', fronte: [1, 0] },
  letto: { id: 'letto', nome: 'Letto', stanza: 'camera', sotto: 'Camera · lenzuola' },
  armadio: { id: 'armadio', nome: 'Armadio', stanza: 'camera', sotto: 'Camera · biancheria', fronte: [0, 1] },
  computer: { id: 'computer', nome: 'Computer', stanza: 'studio', sotto: 'Studio' },
  asciugatrice: { id: 'asciugatrice', nome: 'Asciugatrice', stanza: 'ripostiglio', sotto: 'Ripostiglio', fronte: [-1, 0] },
  robot: { id: 'robot', nome: 'Robot', stanza: 'ripostiglio', sotto: 'Ripostiglio · base di ricarica sotto la panca' },
  armadioPulizie: { id: 'armadioPulizie', nome: 'Armadio delle pulizie', stanza: 'ripostiglio', sotto: 'Ripostiglio · scorte per pulire', fronte: [-1, 0] },
  lista: { id: 'lista', nome: 'Lista della spesa', stanza: 'cucina', sotto: 'Cucina · blocchetto sul frigo', fronte: [0, -1] },
}

// Nomi suggeriti nel modulo "+ Attività" (non sono attività predefinite: si toccano per riempire il nome).
export const suggerimenti: Partial<Record<ObjId, string[]>> = {
  letto: ['Cambiare le lenzuola', 'Girare il materasso'],
  armadio: ['Cambio di stagione', 'Lavare le coperte'],
  mobileBagno: ['Cambiare gli asciugamani', 'Cambiare i tappetini'],
  lavatrice: ['Pulire il filtro', 'Lavaggio a vuoto', 'Lenzuola e asciugamani'],
  asciugatrice: ['Pulire il filtro', 'Svuotare l\'acqua'],
  robot: ['Pulire le spazzole', 'Svuotare il serbatoio', 'Cambiare il filtro'],
  frigo: ['Pulire il frigo', 'Sbrinare il congelatore'],
  forno: ['Pulire il forno'],
  lavastoviglie: ['Pulire il filtro', 'Lavaggio a vuoto'],
  termostato: ['Manutenzione caldaia'],
  bidoni: ['Lavare i bidoni'],
  prato: ['Tagliare il prato', 'Concimare il prato', 'Pulire il giardino'],
  siepe: ['Potare la siepe'],
  piante: ['Annaffiare le piante', 'Concimare le piante'],
  posta: ['Bolletta luce', 'Bolletta gas', 'Bolletta acqua', 'Rinnovo assicurazione', 'Bollo auto', 'Revisione auto', 'Appuntamento'],
}

// Tipi di rifiuto della raccolta differenziata, con il colore del bidone.
export const rifiuti: Record<string, string> = { Umido: '#8B6B4A', Plastica: '#E9C94A', Carta: '#5B8DC9', Vetro: '#6FA67A', Secco: '#8E9196' }
