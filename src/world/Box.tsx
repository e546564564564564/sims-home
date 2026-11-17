// Parallelepipedo definito dai suoi estremi (più comodo per mobili in coordinate di pianta).
export default function Box({ b, c, r = 0.9 }: { b: [number, number, number, number, number, number]; c: string; r?: number }) {
  const [x0, y0, z0, x1, y1, z1] = b
  return (
    <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]} castShadow receiveShadow>
      <boxGeometry args={[x1 - x0, y1 - y0, z1 - z0]} />
      <meshStandardMaterial color={c} roughness={r} />
    </mesh>
  )
}
