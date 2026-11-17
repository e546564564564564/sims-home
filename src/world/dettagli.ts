import type { StanzaPulizia } from '../data/objects'

// Dettagli dello stato vivo (docs/scheda-contenuti.md, sezione C). Si cambiano qui senza toccare la logica.
// grado 1 = vissuta, grado 2 = da sistemare (si aggiungono a quelli del grado 1). Mai sporco.
// box: estremi [x0,y0,z0,x1,y1,z1]; cil: centro, raggio, altezza. rot = rotazione sull'asse verticale.
export type Dettaglio = { grado: 1 | 2; colore: string; box?: number[]; cil?: [number, number, number, number, number]; rot?: number }

export const dettagli: Record<StanzaPulizia, Dettaglio[]> = {
  sala: [
    { grado: 1, colore: '#8FA7B8', box: [2.45, 0.36, 1.35, 2.85, 0.43, 1.95], rot: 0.25 }, // plaid spiegazzato sul divano
    { grado: 1, colore: '#F4F1EA', cil: [1.3, 0.43, 2.0, 0.045, 0.1] }, // tazza sul pouf
    { grado: 2, colore: '#6E7076', box: [1.9, 0, 0.7, 2.3, 0.12, 1.05], rot: 0.5 }, // cuscino a terra
    { grado: 2, colore: '#7B5A44', box: [4.2, 0, 0.25, 4.32, 0.08, 0.52], rot: 0.3 }, // scarpe vicino all'ingresso
    { grado: 2, colore: '#7B5A44', box: [4.4, 0, 0.3, 4.52, 0.08, 0.57], rot: -0.2 },
  ],
  cucina: [
    { grado: 1, colore: '#F4F1EA', cil: [6.45, 0.97, 4.2, 0.045, 0.1] }, // due tazze sul piano
    { grado: 1, colore: '#E9C46A', cil: [6.62, 0.97, 4.25, 0.045, 0.1] },
    { grado: 2, colore: '#FFFFFF', cil: [5.05, 0.95, 4.18, 0.13, 0.06] }, // piatti nel lavello
    { grado: 2, colore: '#9DA3A8', cil: [5.75, 1.0, 4.18, 0.12, 0.14] }, // pentola sul piano cottura
  ],
  bagno: [
    { grado: 1, colore: '#E8D3B0', box: [4.42, 0.4, 6.0, 4.47, 0.6, 6.4], rot: 0.35 }, // asciugamano storto sul bordo vasca
    { grado: 2, colore: '#F2F0EA', box: [4.42, 0.5, 6.6, 4.72, 0.62, 7.2], rot: -0.15 }, // accappatoio sul bordo vasca
    { grado: 2, colore: '#8FB8C9', cil: [3.35, 0.95, 7.05, 0.03, 0.14] }, // flaconi sul lavabo
    { grado: 2, colore: '#E07A5F', cil: [3.42, 0.94, 7.12, 0.028, 0.12] },
  ],
  camera: [
    { grado: 1, colore: '#B9BBC0', box: [1.2, 0.6, 6.9, 1.9, 0.66, 7.5], rot: 0.3 }, // letto un po' sfatto
    { grado: 2, colore: '#6D9DC5', box: [1.4, 0.6, 6.0, 1.85, 0.64, 6.35], rot: -0.4 }, // vestiti sul letto
    { grado: 2, colore: '#C9A0DC', box: [1.95, 0.6, 6.3, 2.3, 0.63, 6.6], rot: 0.2 },
  ],
  studio: [
    { grado: 1, colore: '#FFFFFF', box: [8.15, 0.75, 7.0, 8.4, 0.757, 7.3], rot: 0.2 }, // fogli sulla scrivania
    { grado: 1, colore: '#FFFFFF', box: [8.2, 0.757, 7.05, 8.45, 0.764, 7.33], rot: -0.15 },
    { grado: 2, colore: '#5B6B5E', box: [7.46, 0.55, 6.6, 7.58, 0.98, 7.15] }, // giacca sulla sedia
  ],
  ripostiglio: [
    { grado: 1, colore: '#C8A27A', cil: [9.75, 0.2, 7.3, 0.22, 0.4] }, // cesto dei panni pieno
    { grado: 1, colore: '#C9A0DC', cil: [9.75, 0.42, 7.3, 0.2, 0.06] },
    { grado: 2, colore: '#C9A97E', box: [9.4, 0, 5.0, 9.8, 0.3, 5.35], rot: 0.2 }, // scatole sul pavimento
    { grado: 2, colore: '#BF9E72', box: [9.45, 0.3, 5.05, 9.75, 0.5, 5.3], rot: -0.1 },
  ],
  corridoio: [
    { grado: 2, colore: '#7B5A44', box: [5.4, 0, 4.58, 5.66, 0.08, 4.7] }, // scarpe lungo il muro
    { grado: 2, colore: '#4A4B4E', box: [5.8, 0, 4.58, 6.06, 0.08, 4.7] },
  ],
}
