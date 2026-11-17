import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, type OrthographicCamera } from 'three'
import { useNav } from '../ui/store'
import { houseBounds, roomBounds } from '../data/house'
import { E, azimuth, objectCenters, gesture } from './camera'

const PANEL = 0.34 // quota di schermo occupata dal pannello

// Camera isometrica: segue stanza/oggetto scelti; gesti: un dito sposta, pinch zoom, due dita ruotano a scatti di 90°.
export default function CameraRig() {
  const { camera, gl, size } = useThree()
  const cam = camera as OrthographicCamera
  const stanza = useNav((s) => s.stanza)
  const oggetto = useNav((s) => s.oggetto)
  const rot = useNav((s) => s.rotazione)

  const target = useRef(new Vector3(houseBounds.cx, 0, houseBounds.cz))
  const want = useRef(new Vector3(houseBounds.cx, 0, houseBounds.cz))
  const zoom = useRef(40)
  const wantZoom = useRef(40)
  const az = useRef(azimuth(0))

  const fit = (dim: number, panel: boolean) => Math.min(size.width * (panel ? 1 - PANEL : 1), size.height * 1.4) / (dim * 1.35)

  // obiettivo in base a stanza / oggetto
  useEffect(() => {
    if (oggetto && objectCenters.get(oggetto)) {
      const c = objectCenters.get(oggetto)!
      const b = stanza ? roomBounds(stanza) : null
      want.current.set(c.x, c.y * 0.6, c.z)
      wantZoom.current = b ? fit(Math.max(b.w, b.d, 2.5) * 1.5, true) : 80
    } else if (stanza) {
      const b = roomBounds(stanza)
      want.current.set(b.cx, 0, b.cz)
      wantZoom.current = fit(Math.max(b.w, b.d, 2.5), false)
    } else {
      want.current.set(houseBounds.cx, 0, houseBounds.cz)
      wantZoom.current = fit(houseBounds.size, false)
    }
    // pannello aperto: sposta la vista a sinistra
    if (oggetto) cam.setViewOffset(size.width, size.height, (size.width * PANEL) / 2, 0, size.width, size.height)
    else cam.clearViewOffset()
    cam.updateProjectionMatrix()
  }, [stanza, oggetto, size.width, size.height])

  // gesti
  useEffect(() => {
    const el = gl.domElement
    const pts = new Map<number, { x: number; y: number }>()
    let last = { dist: 0, ang: 0, cx: 0, cy: 0 }
    let accRot = 0
    let rotDone = false
    const pair = () => {
      const [a, b] = [...pts.values()]
      return { dist: Math.hypot(b.x - a.x, b.y - a.y), ang: Math.atan2(b.y - a.y, b.x - a.x), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }
    }
    const pan = (dx: number, dy: number) => {
      const a = az.current
      const right = new Vector3(Math.cos(a), 0, Math.sin(a))
      const fwd = new Vector3(-Math.sin(a), 0, Math.cos(a)) // verso l'alto dello schermo
      const k = 1 / zoom.current
      target.current.addScaledVector(right, -dx * k).addScaledVector(fwd, (dy * k) / Math.sin(E))
      want.current.copy(target.current)
    }
    const down = (e: PointerEvent) => {
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pts.size === 1) gesture.moved = 0
      if (pts.size === 2) { last = pair(); accRot = 0; rotDone = false }
    }
    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId)
      if (!p) return
      const dx = e.clientX - p.x, dy = e.clientY - p.y
      p.x = e.clientX; p.y = e.clientY
      gesture.moved += Math.abs(dx) + Math.abs(dy)
      if (pts.size === 1 && (e.buttons || e.pointerType === 'touch')) pan(dx, dy)
      if (pts.size === 2) {
        const now = pair()
        zoom.current = wantZoom.current = Math.min(320, Math.max(18, zoom.current * (now.dist / last.dist)))
        pan(now.cx - last.cx, now.cy - last.cy)
        let d = now.ang - last.ang
        if (d > Math.PI) d -= 2 * Math.PI
        if (d < -Math.PI) d += 2 * Math.PI
        accRot += d
        if (!rotDone && Math.abs(accRot) > 0.6) { useNav.getState().ruota(accRot > 0 ? -1 : 1); rotDone = true }
        last = now
      }
    }
    const up = (e: PointerEvent) => { pts.delete(e.pointerId) }
    const wheel = (e: WheelEvent) => { zoom.current = wantZoom.current = Math.min(320, Math.max(18, zoom.current * (e.deltaY > 0 ? 0.9 : 1.1))) }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [gl])

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 6)
    target.current.lerp(want.current, k)
    zoom.current += (wantZoom.current - zoom.current) * k
    let d = azimuth(rot) - az.current
    while (d > Math.PI) d -= 2 * Math.PI
    while (d < -Math.PI) d += 2 * Math.PI
    az.current += d * k
    const a = az.current
    const t = target.current
    cam.position.set(t.x + Math.sin(a) * Math.cos(E) * 30, Math.sin(E) * 30, t.z - Math.cos(a) * Math.cos(E) * 30)
    cam.lookAt(t)
    if (Math.abs(cam.zoom - zoom.current) > 1e-3) { cam.zoom = zoom.current; cam.updateProjectionMatrix() }
  })

  return null
}
