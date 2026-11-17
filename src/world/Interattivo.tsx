import { useEffect, useRef, type ReactNode } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Vector3, type Mesh, type MeshBasicMaterial } from 'three'
import { objects, type ObjId } from '../data/objects'
import { useNav } from '../ui/store'
import { objectCenters } from './camera'
import { theme } from '../theme'
import { muroAlto } from './walls'
import { LOW } from '../data/house'
import { camDir, azimuth } from './camera'
import { useCasa, daFare } from '../data/casa'

type Bounds = [number, number, number, number, number, number] // x0,y0,z0,x1,y1,z1

// Oggetto toccabile: area di tocco più grande della geometria + alone caldo quando è selezionato.
// parete: se l'oggetto è appeso a un muro, si nasconde quando quel muro è abbassato.
// Segnale gentile: un post-it sopra l'oggetto quando c'è un'attività da fare (tranne chi ha un segnale suo).
const segnaleProprio = new Set<ObjId>(['lavatrice'])

// taglia: invece di sparire col muro basso, il mobile alto si abbassa come il muro.
export default function Interattivo({ id, b, children, parete, taglia }: { id: ObjId; b: Bounds; children: ReactNode; parete?: { x: number; z: number; asseX: boolean }; taglia?: boolean }) {
  const postit = useCasa((s) => !segnaleProprio.has(id) && daFare(s.entita[id]).length > 0)
  const foglio = useRef<Mesh>(null)
  const stanza = useNav((s) => s.stanza)
  const rot = useNav((s) => s.rotazione)
  const visibile = !parete || muroAlto(parete.x, parete.z, parete.asseX, camDir(azimuth(rot)), stanza)
  const apri = useNav((s) => s.apri)
  const selezionato = useNav((s) => s.oggetto === id)
  const alone = useRef<Mesh>(null)
  const [x0, y0, z0, x1, y1, z1] = b
  const c = new Vector3((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
  const pad = 0.18

  useEffect(() => {
    objectCenters.set(id, c)
  })

  useFrame(({ clock }) => {
    if (alone.current) (alone.current.material as MeshBasicMaterial).opacity = 0.42 + Math.sin(clock.elapsedTime * 3) * 0.12
    if (foglio.current) foglio.current.position.y = y1 + 0.22 + Math.sin(clock.elapsedTime * 1.6) * 0.03
  })

  const tap = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 10) return
    e.stopPropagation()
    apri(id, objects[id].stanza)
  }

  if (!visibile && !taglia) return null
  return (
    <group scale={[1, visibile ? 1 : LOW / y1, 1]}>
      {children}
      <mesh position={c} onClick={tap}>
        <boxGeometry args={[x1 - x0 + pad, y1 - y0 + pad, z1 - z0 + pad]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {postit && (
        <mesh ref={foglio} position={[c.x, y1 + 0.22, c.z]} rotation={[-0.5, 0.6, 0.12]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.01]} />
          <meshStandardMaterial color={theme.postit} roughness={0.9} />
        </mesh>
      )}
      {selezionato && (
        <mesh ref={alone} position={c}>
          <boxGeometry args={[x1 - x0 + 0.08, y1 - y0 + 0.08, z1 - z0 + 0.08]} />
          <meshBasicMaterial color={theme.alone} transparent opacity={0.42} depthWrite={false} depthTest={false} />
        </mesh>
      )}
    </group>
  )
}
