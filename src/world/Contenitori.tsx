import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import Box from './Box'
import Interattivo from './Interattivo'
import { theme as t } from '../theme'
import { useNav } from '../ui/store'
import { useCasa, vociInLista } from '../data/casa'
import type { Livello, Prodotto } from '../data/entita'
import type { ObjId } from '../data/objects'

// Frigo, dispensa e blocchetto della lista: mostrano i dati delle entità (la scena non contiene dati).

const quanto: Record<Livello, number> = { pieno: 1, meta: 0.6, quasi: 0.3, finito: 0 }

// Anta che si apre quando l'oggetto è selezionato. Cerniera in (x, z); angolo positivo = verso l'esterno.
function Anta({ x, z, angolo, aperta, children }: { x: number; z: number; angolo: number; aperta: boolean; children: ReactNode }) {
  const g = useRef<Group>(null)
  useFrame((_, dt) => {
    if (!g.current) return
    const obiettivo = aperta ? angolo : 0
    g.current.rotation.y += (obiettivo - g.current.rotation.y) * Math.min(1, dt * 8)
  })
  return (
    <group ref={g} position={[x, 0, z]}>
      {children}
    </group>
  )
}

// Un prodotto: barattolo/confezione alto quanto ne resta. Finito = non c'è.
function Pezzo({ p, i, x, y, z, w, d, h }: { p: Prodotto; i: number; x: number; y: number; z: number; w: number; d: number; h: number }) {
  const f = quanto[p.livello]
  if (!f) return null
  const hh = Math.max(0.03, h * f)
  return (
    <group>
      <Box b={[x - w / 2, y, z - d / 2, x + w / 2, y + hh, z + d / 2]} c={t.contenuti[i % t.contenuti.length]} r={0.6} />
      <Box b={[x - w / 2 + 0.01, y + hh, z - d / 2 + 0.01, x + w / 2 - 0.01, y + hh + 0.015, z + d / 2 - 0.01]} c="#FFFFFF" r={0.6} />
    </group>
  )
}

function useInventario(id: ObjId) {
  return useCasa((s) => s.entita[id]?.inventario ?? [])
}

export function Frigo() {
  const aperta = useNav((s) => s.oggetto === 'frigo')
  const inv = useInventario('frigo')
  const frigo = inv.filter((p) => p.gruppo === 'Frigo')
  const gelo = inv.filter((p) => p.gruppo === 'Congelatore')
  const C = t.colonnaFrigo
  // ripiani del frigo (3 per piano) e del congelatore (2 per piano)
  const pianiFrigo = [1.0, 1.35, 1.7]
  const pianiGelo = [0.05, 0.5]
  return (
    <Interattivo id="frigo" b={[7.3, 0, 2.85, 7.88, 2.1, 3.4]}>
      {/* carcassa cava */}
      <Box b={[7.3, 0, 2.85, 7.88, 2.1, 2.88]} c={C} />
      <Box b={[7.3, 0, 3.37, 7.88, 2.1, 3.4]} c={C} />
      <Box b={[7.84, 0, 2.88, 7.88, 2.1, 3.37]} c={t.interno} />
      <Box b={[7.3, 2.05, 2.88, 7.84, 2.1, 3.37]} c={C} />
      <Box b={[7.3, 0, 2.88, 7.84, 0.05, 3.37]} c={t.interno} />
      <Box b={[7.3, 0.95, 2.88, 7.84, 1.0, 3.37]} c={C} />
      {[1.35, 1.7].map((y) => <Box key={y} b={[7.32, y - 0.01, 2.88, 7.84, y, 3.37]} c={t.ripiano} />)}
      <Box b={[7.32, 0.49, 2.88, 7.84, 0.5, 3.37]} c={t.ripiano} />
      {frigo.map((p, i) => (
        <Pezzo key={p.id} p={p} i={i} x={7.6} y={pianiFrigo[Math.floor(i / 3) % 3]} z={2.96 + (i % 3) * 0.165} w={0.12} d={0.16} h={0.24} />
      ))}
      {gelo.map((p, i) => (
        <Pezzo key={p.id} p={p} i={i + 3} x={7.58} y={pianiGelo[Math.floor(i / 2) % 2]} z={3.01 + (i % 2) * 0.24} w={0.18} d={0.2} h={0.32} />
      ))}
      {/* ante con cerniera sul lato verso il piano di lavoro */}
      <Anta x={7.3} z={3.37} angolo={1.75} aperta={aperta}>
        <Box b={[-0.025, 1.0, -0.49, 0, 2.05, 0]} c={t.antaFrigo} />
        <Box b={[-0.04, 0.98, -0.44, -0.025, 1.0, -0.22]} c="#B9B1A4" />
      </Anta>
      <Anta x={7.3} z={3.37} angolo={1.5} aperta={aperta}>
        <Box b={[-0.025, 0.05, -0.49, 0, 0.95, 0]} c={t.antaFrigo} />
      </Anta>
    </Interattivo>
  )
}

export function Dispensa() {
  const aperta = useNav((s) => s.oggetto === 'dispensa')
  const inv = useInventario('dispensa')
  const [x0, x1, y0, y1, zf, zb] = [4.65, 7.3, 1.45, 2.1, 4.12, 4.44]
  const piani = [y0 + 0.04, 1.8]
  const perPiano = Math.max(1, Math.ceil(inv.length / 2))
  const passo = (x1 - x0 - 0.2) / perPiano
  return (
    <Interattivo id="dispensa" b={[x0, y0, zf, x1, y1, zb]}>
      <Box b={[x0, y0, zb - 0.03, x1, y1, zb]} c={t.interno} />
      <Box b={[x0, y1 - 0.04, zf, x1, y1, zb]} c={t.cucinaPensili} />
      <Box b={[x0, y0, zf, x1, y0 + 0.04, zb]} c={t.cucinaPensili} />
      <Box b={[x0, y0, zf, x0 + 0.02, y1, zb]} c={t.cucinaPensili} />
      <Box b={[x1 - 0.02, y0, zf, x1, y1, zb]} c={t.cucinaPensili} />
      <Box b={[x0, 1.79, zf + 0.02, x1, 1.8, zb]} c={t.ripiano} />
      {inv.map((p, i) => (
        <Pezzo key={p.id} p={p} i={i} x={x0 + 0.1 + passo * ((i % perPiano) + 0.5)} y={piani[Math.floor(i / perPiano) % 2]} z={4.28} w={Math.min(0.14, passo * 0.7)} d={0.14} h={0.22} />
      ))}
      {[4.67, 5.33, 5.99, 6.65].map((x) => (
        <Anta key={x} x={x} z={zf} angolo={1.85} aperta={aperta}>
          <Box b={[0, 1.48, -0.02, 0.62, 2.07, 0]} c={t.anta} />
        </Anta>
      ))}
    </Interattivo>
  )
}

// Blocchetto della lista della spesa, attaccato al fianco del frigo verso la sala.
// Più voci in lista = più righe scritte (segnale gentile, nessun numero).
export function Blocchetto() {
  const n = useCasa((s) => vociInLista(s.entita).length)
  const [x0, x1, y0, y1, z] = [7.42, 7.72, 1.25, 1.65, 2.85]
  return (
    <Interattivo id="lista" b={[x0, y0, z - 0.02, x1, y1, z]}>
      <Box b={[x0, y0, z - 0.012, x1, y1, z]} c={t.blocchetto} r={1} />
      <Box b={[x0, y1 - 0.05, z - 0.016, x1, y1, z]} c={t.blocchettoTesta} r={1} />
      {Array.from({ length: Math.min(n, 6) }, (_, i) => (
        <Box key={i} b={[x0 + 0.04, y1 - 0.1 - i * 0.045, z - 0.014, x1 - 0.04 - (i % 3) * 0.05, y1 - 0.085 - i * 0.045, z - 0.012]} c={t.inchiostro} r={1} />
      ))}
    </Interattivo>
  )
}
