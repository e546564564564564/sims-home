import { create } from 'zustand'
import type { RoomId } from '../data/house'
import { objects, type ObjId } from '../data/objects'
import { azimuth, camDir } from '../world/camera'

// Rotazione più vicina da cui si vede il fronte dell'oggetto (se quella attuale non lo mostra).
function rotPer(o: ObjId, rot: number) {
  const f = objects[o].fronte
  const vede = (r: number) => { const d = camDir(azimuth(r)); return d.x * f![0] + d.z * f![1] }
  if (!f || vede(rot) > 0) return rot
  return [rot + 1, rot - 1, rot + 2].map((r) => (r + 4) % 4).find((r) => vede(r) > 0) ?? rot
}

// Stato della navigazione (non sono dati della casa).
type Nav = {
  stanza: RoomId | null // null = tutta la casa
  oggetto: ObjId | null
  rotazione: number // quarti di giro 0..3
  vaiStanza: (s: RoomId | null) => void
  apri: (o: ObjId, s: RoomId) => void
  chiudi: () => void
  indietro: () => void
  ruota: (dir: 1 | -1) => void
}

export const useNav = create<Nav>((set, get) => ({
  stanza: null,
  oggetto: null,
  rotazione: 0,
  vaiStanza: (s) => set({ stanza: s, oggetto: null }),
  apri: (o, s) => set({ oggetto: o, stanza: s, rotazione: rotPer(o, get().rotazione) }),
  chiudi: () => set({ oggetto: null }),
  indietro: () => (get().oggetto ? set({ oggetto: null }) : set({ stanza: null })),
  ruota: (dir) => set({ rotazione: (get().rotazione + dir + 4) % 4 }),
}))

// accesso per i test automatici
;(window as unknown as { __nav: typeof useNav }).__nav = useNav
