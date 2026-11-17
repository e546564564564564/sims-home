import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { Mesh } from 'three'
import { theme } from '../theme'

// Scena di prova del Blocco 0: un cubo arrotondato su un piano, camera isometrica fissa.
function Cubo() {
  const ref = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.6
  })
  return (
    <RoundedBox ref={ref} args={[1.4, 1.4, 1.4]} radius={0.18} smoothness={4} position={[0, 0.7, 0]} castShadow>
      <meshStandardMaterial color={theme.muroTV} roughness={0.7} />
    </RoundedBox>
  )
}

export default function Scene() {
  return (
    <Canvas
      shadows
      orthographic
      camera={{ position: [10, 10, 10], zoom: 90, near: 0.1, far: 100 }}
      style={{ position: 'fixed', inset: 0, background: theme.sfondo }}
    >
      <ambientLight intensity={1.1} color="#FFF4E6" />
      <directionalLight position={[6, 10, 4]} intensity={1.6} color="#FFE7C2" castShadow shadow-mapSize={[1024, 1024]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color={theme.pavimento} roughness={0.9} />
      </mesh>
      <Cubo />
    </Canvas>
  )
}
