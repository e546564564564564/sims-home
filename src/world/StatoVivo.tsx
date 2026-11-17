import Box from './Box'
import InStanza from './davanti'
import { dettagli } from './dettagli'
import { useCasa, grado } from '../data/casa'
import { stanzePulizia, type StanzaPulizia } from '../data/objects'

// Ogni stanza mostra qualche dettaglio gentile quando la pulizia si avvicina o è passata.
function Stanza({ r }: { r: StanzaPulizia }) {
  const g = useCasa((s) => grado(s.entita[`pulizia-${r}`]))
  if (!g) return null
  return (
    <InStanza id={r}>
      {dettagli[r].filter((d) => d.grado <= g).map((d, i) => {
        if (d.cil) {
          const [x, y, z, raggio, h] = d.cil
          return (
            <mesh key={i} position={[x, y, z]} castShadow>
              <cylinderGeometry args={[raggio, raggio * 0.9, h, 16]} />
              <meshStandardMaterial color={d.colore} roughness={0.8} />
            </mesh>
          )
        }
        const [x0, y0, z0, x1, y1, z1] = d.box!
        return (
          <group key={i} position={[(x0 + x1) / 2, 0, (z0 + z1) / 2]} rotation={[0, d.rot ?? 0, 0]}>
            <Box b={[(x0 - x1) / 2, y0, (z0 - z1) / 2, (x1 - x0) / 2, y1, (z1 - z0) / 2]} c={d.colore} />
          </group>
        )
      })}
    </InStanza>
  )
}

export default function StatoVivo() {
  return <>{stanzePulizia.map((r) => <Stanza key={r} r={r} />)}</>
}
