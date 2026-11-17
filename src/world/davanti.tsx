import type { ReactNode } from 'react'
import { roomBounds, type RoomId } from '../data/house'
import { useNav } from '../ui/store'
import { camDir, azimuth } from './camera'

// Quando si guarda una stanza, l'arredo delle stanze che stanno davanti (verso la camera) si nasconde.
// Sala e cucina sono un unico ambiente aperto: restano sempre visibili insieme.
const aperti = new Set(['sala|cucina', 'cucina|sala'])

export function davanti(id: RoomId, stanza: RoomId | null, rot: number) {
  if (!stanza || stanza === id || aperti.has(id + '|' + stanza)) return false
  const d = camDir(azimuth(rot))
  const a = roomBounds(id), b = roomBounds(stanza)
  return (a.cx - b.cx) * d.x + (a.cz - b.cz) * d.z > 0.8
}

export default function InStanza({ id, children }: { id: RoomId; children: ReactNode }) {
  const stanza = useNav((s) => s.stanza)
  const rot = useNav((s) => s.rotazione)
  return davanti(id, stanza, rot) ? null : <>{children}</>
}
