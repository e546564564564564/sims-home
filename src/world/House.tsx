import { useMemo } from 'react'
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, MeshStandardMaterial, type Texture } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { rooms, T, type RoomId } from '../data/house'
import { theme } from '../theme'
import { useNav } from '../ui/store'
import { buildPieces, type Piece } from './walls'
import { camDir, azimuth } from './camera'

// Piastrelle in diagonale disegnate su canvas (nessuna immagine esterna).
function tiles(base: string, grout: string): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  g.fillStyle = base
  g.fillRect(0, 0, 128, 128)
  g.strokeStyle = grout
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(0, 64); g.lineTo(64, 0); g.lineTo(128, 64); g.lineTo(64, 128); g.closePath()
  g.stroke()
  const t = new CanvasTexture(c)
  t.wrapS = t.wrapT = RepeatWrapping
  t.colorSpace = SRGBColorSpace
  return t
}

function Floors() {
  const vaiStanza = useNav((s) => s.vaiStanza)
  const chiudi = useNav((s) => s.chiudi)
  const tex = useMemo(() => ({ beige: tiles(theme.pavimento, theme.fughe), menta: tiles(theme.pavimentoBagno, theme.fugheBagno) }), [])
  const click = (id: RoomId) => (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 10) return
    e.stopPropagation()
    const { stanza, oggetto } = useNav.getState()
    if (oggetto && stanza === id) chiudi()
    else vaiStanza(id)
  }
  return (
    <>
      {rooms.flatMap((r) =>
        r.rects.map((q, i) => {
          const t = r.pavimento === 'beige' || r.pavimento === 'menta' ? tex[r.pavimento].clone() : null
          if (t) { t.repeat.set(q.w / 0.9, q.d / 0.9); t.needsUpdate = true }
          const col = r.pavimento === 'prato' ? theme.prato : r.pavimento === 'portico' ? theme.portico : '#ffffff'
          return (
            <mesh key={r.id + i} position={[q.x + q.w / 2, 0.005, q.z + q.d / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={click(r.id)}>
              <planeGeometry args={[q.w, q.d]} />
              <meshStandardMaterial color={col} map={t ?? undefined} roughness={0.95} />
            </mesh>
          )
        }),
      )}
    </>
  )
}

// colore della faccia del muro in base alla stanza che ci si affaccia
function faceColor(p: Piece, lato: RoomId | null, latoPositivo: boolean): string {
  if (p.kind === 'vetro') return theme.vetro
  if (p.kind === 'soglia') return theme.portaIngresso
  if (lato === 'sala' && !p.asseX && p.x < 0.1 && latoPositivo) return theme.muroTV
  if (lato === 'bagno' && p.y0 < 2) return theme.mosaico
  if (lato === 'studio' && !p.asseX && p.x > 8.7 && p.z < 7 && !latoPositivo) return theme.muroAntracite
  return theme.muro
}

const matCache = new Map<string, MeshStandardMaterial>()
function mat(color: string, glass = false) {
  const k = color + glass
  if (!matCache.has(k)) matCache.set(k, new MeshStandardMaterial({ color, roughness: glass ? 0.2 : 0.9, transparent: glass, opacity: glass ? 0.55 : 1 }))
  return matCache.get(k)!
}

function Walls() {
  const stanza = useNav((s) => s.stanza)
  const rot = useNav((s) => s.rotazione)
  const pieces = useMemo(() => buildPieces(camDir(azimuth(rot)), stanza), [stanza, rot])
  return (
    <>
      {pieces.map((p, i) => {
        const h = p.y1 - p.y0
        const sx = p.asseX ? p.len : T
        const sz = p.asseX ? T : p.len
        const glass = p.kind === 'vetro'
        const top = mat(p.kind === 'muro' ? '#FFFFFF' : faceColor(p, null, true), glass)
        const side = mat(glass ? theme.telaio : theme.muro)
        const a = mat(faceColor(p, p.latoA, true), glass)
        const b = mat(faceColor(p, p.latoB, false), glass)
        // ordine facce box: +x, -x, +y, -y, +z, -z
        const m = p.asseX ? [side, side, top, top, a, b] : [a, b, top, top, side, side]
        return (
          <mesh key={i} position={[p.x, p.y0 + h / 2, p.z]} material={m} castShadow={!glass} receiveShadow>
            <boxGeometry args={[sx, h, sz]} />
          </mesh>
        )
      })}
    </>
  )
}

// Cerchi dipinti in camera (parete ovest), visibili quando il muro è alto
function CerchiCamera() {
  const stanza = useNav((s) => s.stanza)
  const rot = useNav((s) => s.rotazione)
  const visibile = camDir(azimuth(rot)).x > 0 && (stanza === null || stanza === 'camera')
  if (!visibile) return null
  return (
    <group position={[T / 2 + 0.004, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[-6.6, 1.45, 0]}>
        <circleGeometry args={[0.95, 40]} />
        <meshStandardMaterial color={theme.cerchiCamera} roughness={1} />
      </mesh>
      <mesh position={[-5.4, 1.75, 0.001]}>
        <circleGeometry args={[0.55, 40]} />
        <meshStandardMaterial color={theme.cerchiCamera} roughness={1} opacity={0.85} transparent />
      </mesh>
    </group>
  )
}

export default function House() {
  return (
    <group>
      {/* base del diorama */}
      {rooms.flatMap((r) =>
        r.rects.map((q, i) => (
          <mesh key={'base' + r.id + i} position={[q.x + q.w / 2, -0.2, q.z + q.d / 2]} receiveShadow>
            <boxGeometry args={[q.w + 0.12, 0.4, q.d + 0.12]} />
            <meshStandardMaterial color={theme.base} roughness={1} />
          </mesh>
        )),
      )}
      <Floors />
      <Walls />
      <CerchiCamera />
    </group>
  )
}
