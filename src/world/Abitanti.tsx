import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useNav } from '../ui/store'
import { roomAt } from '../data/house'
import { objectCenters } from './camera'
import { percorso, nodi } from './percorsi'
import { davanti } from './davanti'

// Abitanti: una donna e un uomo. A riposo seduti sul divano; al tocco di un oggetto il più vicino ci va a piedi.
// Solo scena: nessuna assegnazione di faccende, nessun dato.
type P = [number, number]
type Stato = { x: number; z: number; ang: number; modo: 'seduto' | 'cammina' | 'usa'; strada: P[]; fine: 'seduto' | 'usa'; guarda: P; t: number }
type Aspetto = { id: string; posto: P; maglia: string; pantaloni: string; capelli: string; lunghi: boolean; scala: number }

const pelle = '#E8C4A0'
const abitanti: Aspetto[] = [
  { id: 'donna', posto: [2.62, 1.5], maglia: '#C9573F', pantaloni: '#4A5A78', capelli: '#5A3A28', lunghi: true, scala: 0.97 },
  { id: 'uomo', posto: [2.62, 2.2], maglia: '#5E7D9A', pantaloni: '#5A5048', capelli: '#3A2E26', lunghi: false, scala: 1.04 },
]
const VEL = 1.3 // m/s

function Persona({ a, st }: { a: Aspetto; st: Stato }) {
  const g = useRef<Group>(null)
  const gambe = [useRef<Group>(null), useRef<Group>(null)]
  const braccia = [useRef<Group>(null), useRef<Group>(null)]

  useFrame((_, dt) => {
    st.t += dt
    if (st.modo === 'cammina') {
      const [nx, nz] = st.strada[0]
      const dx = nx - st.x, dz = nz - st.z, d = Math.hypot(dx, dz), passo = VEL * dt
      if (d <= passo) {
        st.x = nx; st.z = nz; st.strada.shift()
        if (!st.strada.length) st.modo = st.fine
      } else {
        st.x += (dx / d) * passo; st.z += (dz / d) * passo
        const voluto = Math.atan2(dx, dz)
        st.ang += Math.atan2(Math.sin(voluto - st.ang), Math.cos(voluto - st.ang)) * Math.min(1, dt * 10)
      }
    }
    if (st.modo === 'seduto') st.ang = -Math.PI / 2
    if (st.modo === 'usa') st.ang = Math.atan2(st.guarda[0] - st.x, st.guarda[1] - st.z)
    if (!g.current) return
    const seduto = st.modo === 'seduto'
    g.current.position.set(st.x, seduto ? 0.43 - 0.85 * a.scala : st.modo === 'cammina' ? Math.abs(Math.sin(st.t * 8)) * 0.03 : 0, st.z)
    g.current.rotation.y = st.ang
    const { stanza, rotazione } = useNav.getState()
    const r = roomAt(st.x, st.z)
    g.current.visible = !(r && davanti(r, stanza, rotazione))
    const onda = st.modo === 'cammina' ? Math.sin(st.t * 8) * 0.55 : 0
    gambe.forEach((l, i) => l.current && (l.current.rotation.x = seduto ? -Math.PI / 2 : i ? onda : -onda))
    braccia.forEach((l, i) => {
      if (!l.current) return
      l.current.rotation.x = st.modo === 'usa' ? -1.1 + Math.sin(st.t * 4 + i) * 0.12 : seduto ? -0.5 : i ? -onda : onda
    })
  })

  const box = (w: number, h: number, d: number, c: string, y: number) => (
    <mesh position={[0, y, 0]} castShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={c} roughness={0.85} />
    </mesh>
  )
  return (
    <group ref={g} scale={a.scala}>
      {[-0.085, 0.085].map((x, i) => (
        <group key={x} ref={gambe[i]} position={[x, 0.85, 0]}>{box(0.13, 0.8, 0.14, a.pantaloni, -0.4)}</group>
      ))}
      <mesh position={[0, 1.12, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.3, 4, 12]} />
        <meshStandardMaterial color={a.maglia} roughness={0.85} />
      </mesh>
      {[-0.23, 0.23].map((x, i) => (
        <group key={x} ref={braccia[i]} position={[x, 1.36, 0]}>{box(0.09, 0.55, 0.1, a.maglia, -0.25)}{box(0.08, 0.1, 0.09, pelle, -0.56)}</group>
      ))}
      <mesh position={[0, 1.58, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color={pelle} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.62, -0.02]} scale={[1.08, 0.9, 1.08]}>
        <sphereGeometry args={[0.135, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={a.capelli} roughness={0.9} />
      </mesh>
      {a.lunghi && <group position={[0, 1.46, -0.1]}>{box(0.26, 0.32, 0.08, a.capelli, 0)}</group>}
    </group>
  )
}

export default function Abitanti() {
  const stati = useRef<Stato[]>(abitanti.map((a) => ({ x: a.posto[0], z: a.posto[1], ang: -Math.PI / 2, modo: 'seduto', strada: [], fine: 'seduto', guarda: a.posto, t: 0 })))
  const oggetto = useNav((s) => s.oggetto)

  useEffect(() => {
    const st = stati.current
    if (oggetto) {
      const c = objectCenters.get(oggetto)
      if (!c) return
      // il più vicino all'oggetto si alza e ci va
      const i = st[0].modo === 'usa' && st[0].guarda[0] === c.x ? 0 : Math.hypot(st[0].x - c.x, st[0].z - c.z) <= Math.hypot(st[1].x - c.x, st[1].z - c.z) ? 0 : 1
      const s = st[i]
      const strada = percorso([s.x, s.z], [c.x, c.z])
      const prima = strada.length > 1 ? strada[strada.length - 2] : [s.x, s.z]
      const dx = prima[0] - c.x, dz = prima[1] - c.z, d = Math.hypot(dx, dz) || 1
      strada[strada.length - 1] = [c.x + (dx / d) * Math.min(0.55, d), c.z + (dz / d) * Math.min(0.55, d)]
      Object.assign(s, { strada, modo: 'cammina', fine: 'usa', guarda: [c.x, c.z] })
      return
    }
    // pannello chiuso: dopo qualche secondo tornano sul divano
    const timer = setTimeout(() => {
      st.forEach((s, i) => {
        if (s.modo === 'seduto') return
        const strada = percorso([s.x, s.z], nodi.divano)
        strada.push(abitanti[i].posto)
        Object.assign(s, { strada, modo: 'cammina', fine: 'seduto' })
      })
    }, 4000)
    return () => clearTimeout(timer)
  }, [oggetto])

  return <>{abitanti.map((a, i) => <Persona key={a.id} a={a} st={stati.current[i]} />)}</>
}
