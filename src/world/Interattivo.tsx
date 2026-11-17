import { useEffect, useRef, type ReactNode } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Vector3, type Mesh, type MeshBasicMaterial } from 'three'
import { objects, type ObjId } from '../data/objects'
import { useNav } from '../ui/store'
import { objectCenters } from './camera'
import { theme } from '../theme'
import { muroAlto } from './walls'
import { camDir, azimuth } from './camera'

type Bounds = [number, number, number, number, number, number] // x0,y0,z0,x1,y1,z1

// Oggetto toccabile: area di tocco più grande della geometria + alone caldo quando è selezionato.
// parete: se l'oggetto è appeso a un muro, si nasconde quando quel muro è abbassato.
export default function Interattivo({ id, b, children, parete }: { id: ObjId; b: Bounds; children: ReactNode; parete?: { x: number; z: number; asseX: boolean } }) {
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
  })

  const tap = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 10) return
    e.stopPropagation()
    apri(id, objects[id].stanza)
  }

  if (!visibile) return null
  return (
    <group>
      {children}
      <mesh position={c} onClick={tap}>
        <boxGeometry args={[x1 - x0 + pad, y1 - y0 + pad, z1 - z0 + pad]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {selezionato && (
        <mesh ref={alone} position={c}>
          <boxGeometry args={[x1 - x0 + 0.08, y1 - y0 + 0.08, z1 - z0 + 0.08]} />
          <meshBasicMaterial color={theme.alone} transparent opacity={0.42} depthWrite={false} depthTest={false} />
        </mesh>
      )}
    </group>
  )
}
