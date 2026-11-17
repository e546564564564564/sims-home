// Pianta della casa: UNICO posto con forme e misure.
// Misure reali non disponibili: stimate dalla planimetria (porta interna = 80 cm). Metri.
// Coordinate in pianta: x da parete TV verso la scala, z dal portico verso il giardino.

export const SCALE = 1 // correttore unico quando arriveranno le misure vere
export const H = 2.7 // altezza soffitto
export const T = 0.12 // spessore muri
export const LOW = 0.35 // altezza muri abbassati

export type RoomId =
  | 'sala' | 'cucina' | 'corridoio' | 'camera' | 'bagno' | 'studio' | 'ripostiglio' | 'portico' | 'giardino'

export type Rect = { x: number; z: number; w: number; d: number }

export type Room = { id: RoomId; nome: string; rects: Rect[]; esterno?: boolean; pavimento: 'beige' | 'menta' | 'prato' | 'portico' }

export const rooms: Room[] = [
  { id: 'sala', nome: 'Sala', pavimento: 'beige', rects: [{ x: 0, z: 0, w: 6.4, d: 3.9 }] },
  { id: 'cucina', nome: 'Cucina', pavimento: 'beige', rects: [{ x: 4.6, z: 3.9, w: 3.3, d: 0.6 }, { x: 6.4, z: 2.8, w: 1.5, d: 1.1 }] },
  { id: 'corridoio', nome: 'Corridoio', pavimento: 'beige', rects: [{ x: 3.15, z: 3.9, w: 1.45, d: 1.75 }, { x: 4.6, z: 4.5, w: 4.2, d: 1.15 }] },
  { id: 'camera', nome: 'Camera', pavimento: 'beige', rects: [{ x: 0, z: 3.9, w: 3.15, d: 4.9 }] },
  { id: 'bagno', nome: 'Bagno', pavimento: 'menta', rects: [{ x: 3.15, z: 5.65, w: 2.0, d: 3.15 }] },
  { id: 'studio', nome: 'Studio', pavimento: 'beige', rects: [{ x: 5.15, z: 5.65, w: 3.65, d: 2.25 }, { x: 5.15, z: 7.9, w: 2.95, d: 0.9 }] },
  { id: 'ripostiglio', nome: 'Ripostiglio', pavimento: 'beige', rects: [{ x: 8.8, z: 4.65, w: 1.95, d: 3.15 }] },
  { id: 'portico', nome: 'Portico', pavimento: 'portico', esterno: true, rects: [{ x: -0.2, z: -3.0, w: 6.6, d: 3.0 }] },
  { id: 'giardino', nome: 'Giardino', pavimento: 'prato', esterno: true, rects: [{ x: 0, z: 8.8, w: 10.9, d: 3.5 }, { x: 8.1, z: 7.8, w: 2.8, d: 1.0 }] },
]

export type OpeningKind = 'porta' | 'ingresso' | 'finestra' | 'portafinestra'
export type Opening = { kind: OpeningKind; from: number; to: number }
// Muro da (x1,z1) a (x2,z2), sempre parallelo a un asse. Aperture misurate lungo il muro (coordinate assolute).
export type Wall = { x1: number; z1: number; x2: number; z2: number; openings?: Opening[] }

export const walls: Wall[] = [
  // sala
  { x1: 0, z1: 0, x2: 6.4, z2: 0, openings: [{ kind: 'portafinestra', from: 0.4, to: 3.0 }, { kind: 'ingresso', from: 4.0, to: 5.0 }] },
  { x1: 0, z1: 0, x2: 0, z2: 8.8 },
  { x1: 6.4, z1: 0, x2: 6.4, z2: 2.8 },
  { x1: 0, z1: 3.9, x2: 4.6, z2: 3.9, openings: [{ kind: 'porta', from: 3.55, to: 4.35 }] },
  // cucina
  { x1: 6.4, z1: 2.8, x2: 7.9, z2: 2.8 },
  { x1: 7.9, z1: 2.8, x2: 7.9, z2: 4.5 },
  { x1: 4.6, z1: 4.5, x2: 7.9, z2: 4.5 },
  { x1: 4.6, z1: 3.9, x2: 4.6, z2: 4.5 },
  // corridoio, camera, bagno, studio
  { x1: 3.15, z1: 3.9, x2: 3.15, z2: 8.8, openings: [{ kind: 'porta', from: 4.75, to: 5.55 }] },
  { x1: 3.15, z1: 5.65, x2: 8.8, z2: 5.65, openings: [{ kind: 'porta', from: 3.6, to: 4.4 }, { kind: 'porta', from: 5.9, to: 6.7 }] },
  { x1: 7.9, z1: 4.5, x2: 8.8, z2: 4.5 },
  { x1: 5.15, z1: 5.65, x2: 5.15, z2: 8.8 },
  { x1: 0, z1: 8.8, x2: 8.1, z2: 8.8, openings: [{ kind: 'portafinestra', from: 0.6, to: 1.9 }, { kind: 'finestra', from: 3.75, to: 4.55 }, { kind: 'portafinestra', from: 5.9, to: 7.1 }] },
  { x1: 8.1, z1: 7.9, x2: 8.1, z2: 8.8 },
  { x1: 8.1, z1: 7.9, x2: 8.8, z2: 7.9 },
  { x1: 8.8, z1: 4.5, x2: 8.8, z2: 7.9, openings: [{ kind: 'porta', from: 4.75, to: 5.55 }] },
  // ripostiglio
  { x1: 8.8, z1: 4.65, x2: 10.75, z2: 4.65 },
  { x1: 10.75, z1: 4.65, x2: 10.75, z2: 7.8 },
  { x1: 8.8, z1: 7.8, x2: 10.75, z2: 7.8, openings: [{ kind: 'portafinestra', from: 9.2, to: 10.4 }] },
]

export function roomAt(x: number, z: number): RoomId | null {
  for (const r of rooms) for (const q of r.rects) if (x >= q.x && x <= q.x + q.w && z >= q.z && z <= q.z + q.d) return r.id
  return null
}

export function roomBounds(id: RoomId) {
  const r = rooms.find((q) => q.id === id)!
  const x0 = Math.min(...r.rects.map((q) => q.x)), z0 = Math.min(...r.rects.map((q) => q.z))
  const x1 = Math.max(...r.rects.map((q) => q.x + q.w)), z1 = Math.max(...r.rects.map((q) => q.z + q.d))
  return { cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, w: x1 - x0, d: z1 - z0 }
}

export const houseBounds = { cx: 5.4, cz: 4.4, size: 11.5 }
