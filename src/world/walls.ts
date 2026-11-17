import { walls, rooms, roomAt, H, LOW, type Opening, type RoomId } from '../data/house'

// Impostazione isolata della modalità muri: decide quali tratti restano alti.
// Regola attuale: muri davanti abbassati, alti solo quelli sul fondo.
// - Vista d'insieme: alti i muri esterni sul fondo che non danno su portico o giardino.
// - Stanza scelta: alti i muri sul fondo di quella stanza.
export type WallMode = 'fondo'

const esterni = new Set(rooms.filter((r) => r.esterno).map((r) => r.id))
const interno = (r: RoomId | null) => r !== null && !esterni.has(r)

export type Piece = {
  x: number; z: number; len: number; asseX: boolean
  y0: number; y1: number
  kind: 'muro' | 'vetro' | 'soglia'
  latoA: RoomId | null // stanza sul lato +normale
  latoB: RoomId | null // stanza sul lato -normale
}

const STEP = 0.6

// Decide se il tratto di muro in (x,z) resta alto. Usata anche per nascondere gli oggetti appesi ai muri bassi.
export function muroAlto(x: number, z: number, asseX: boolean, cam: { x: number; z: number }, stanza: RoomId | null): boolean {
  const n = asseX ? { x: 0, z: 1 } : { x: 1, z: 0 }
  const latoA = roomAt(x + n.x * 0.25, z + n.z * 0.25)
  const latoB = roomAt(x - n.x * 0.25, z - n.z * 0.25)
  const segno = n.x * cam.x + n.z * cam.z >= 0 ? 1 : -1 // quale lato guarda la camera
  const versoCam = segno > 0 ? latoA : latoB
  const lontano = segno > 0 ? latoB : latoA
  if (stanza === null) return interno(versoCam) && !interno(lontano) && !esterni.has(lontano as RoomId)
  return versoCam === stanza
}
const DOOR_H = 2.15

export function buildPieces(cam: { x: number; z: number }, stanza: RoomId | null): Piece[] {
  const out: Piece[] = []
  for (const w of walls) {
    const asseX = w.z1 === w.z2
    const a = asseX ? Math.min(w.x1, w.x2) : Math.min(w.z1, w.z2)
    const b = asseX ? Math.max(w.x1, w.x2) : Math.max(w.z1, w.z2)
    const fix = asseX ? w.z1 : w.x1
    const n = asseX ? { x: 0, z: 1 } : { x: 1, z: 0 }
    const ops = [...(w.openings ?? [])].sort((p, q) => p.from - q.from)
    // intervalli: solidi e aperture
    const intervals: { from: number; to: number; op?: Opening }[] = []
    let cur = a
    for (const o of ops) {
      if (o.from > cur) intervals.push({ from: cur, to: o.from })
      intervals.push({ from: o.from, to: o.to, op: o })
      cur = o.to
    }
    if (cur < b) intervals.push({ from: cur, to: b })
    for (const iv of intervals) {
      let s = iv.from
      while (s < iv.to - 1e-6) {
        const e = Math.min(iv.to, s + STEP)
        const m = (s + e) / 2
        const mx = asseX ? m : fix, mz = asseX ? fix : m
        const latoA = roomAt(mx + n.x * 0.25, mz + n.z * 0.25)
        const latoB = roomAt(mx - n.x * 0.25, mz - n.z * 0.25)
        const alto = muroAlto(mx, mz, asseX, cam, stanza)
        const base = { x: mx, z: mz, len: e - s, asseX, latoA, latoB }
        const top = alto ? H : LOW
        const op = iv.op
        if (!op) out.push({ ...base, y0: 0, y1: top, kind: 'muro' })
        else if (op.kind === 'porta' || op.kind === 'ingresso') {
          if (alto) out.push({ ...base, y0: DOOR_H, y1: H, kind: 'muro' })
          if (op.kind === 'ingresso') out.push({ ...base, y0: 0, y1: 0.04, kind: 'soglia' })
        } else {
          const sill = op.kind === 'finestra' ? 1.0 : 0
          const head = 2.25
          if (alto) {
            if (sill > 0) out.push({ ...base, y0: 0, y1: sill, kind: 'muro' })
            out.push({ ...base, y0: sill, y1: head, kind: 'vetro' })
            out.push({ ...base, y0: head, y1: H, kind: 'muro' })
          } else {
            if (sill > 0) out.push({ ...base, y0: 0, y1: LOW, kind: 'muro' })
            else out.push({ ...base, y0: 0, y1: LOW, kind: 'vetro' })
          }
        }
        s = e
      }
    }
  }
  return out
}
