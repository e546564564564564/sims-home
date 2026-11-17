import Box from './Box'
import Interattivo from './Interattivo'
import { useCasa, bidoniFuori, grado } from '../data/casa'
import { giorniA } from '../data/tempo'
import { rifiuti } from '../data/objects'

// Fuori dalla porta d'ingresso, sul portico: i bidoni da esporre (segnale gentile della raccolta).
function BidoniFuori() {
  const fuori = useCasa((s) => bidoniFuori(s.entita.bidoni).join('|'))
  if (!fuori) return null
  return (
    <group>
      {fuori.split('|').map((t, i) => {
        const x = 5.3 + i * 0.42
        const c = rifiuti[t] ?? '#8E9196'
        return (
          <group key={t + i}>
            <Box b={[x, 0, -0.6, x + 0.32, 0.5, -0.25]} c={c} r={0.7} />
            <Box b={[x - 0.01, 0.5, -0.62, x + 0.33, 0.54, -0.23]} c={c} r={0.5} />
            <Box b={[x + 0.12, 0.54, -0.5, x + 0.2, 0.57, -0.35]} c="#3A3A3D" />
          </group>
        )
      })}
    </group>
  )
}

// Cassetta della posta sul portico: le scadenze generiche. Una lettera spunta quando una scadenza è vicina (3 giorni).
function Posta() {
  const lettera = useCasa((s) => (s.entita.posta?.attivita ?? []).some((a) => giorniA(a.prossima) <= 3))
  return (
    <Interattivo id="posta" b={[5.72, 0, -2.8, 6.14, 1.4, -2.54]}>
      <Box b={[5.9, 0, -2.7, 5.96, 1.0, -2.64]} c="#3A3A3D" />
      <Box b={[5.75, 1.0, -2.78, 6.11, 1.3, -2.56]} c="#5E7D6A" r={0.5} />
      <Box b={[5.74, 1.3, -2.79, 6.12, 1.33, -2.55]} c="#4F6B5A" r={0.5} />
      <Box b={[5.82, 1.2, -2.785, 6.04, 1.22, -2.78]} c="#2E3B33" />
      {lettera && <Box b={[5.83, 1.2, -2.86, 6.03, 1.21, -2.74]} c="#FFFDF4" r={1} />}
      {lettera && <Box b={[5.85, 1.19, -2.9, 6.01, 1.25, -2.85]} c="#FFFDF4" r={1} />}
    </Interattivo>
  )
}

// Giardino: siepe sul fondo, aiuola, ciuffi d'erba alta quando il taglio si avvicina (stato vivo, mai trascurato).
const verde = '#5E8C4A'
const ciuffi = Array.from({ length: 40 }, (_, i) => [0.4 + ((i * 2.37) % 10.1), 9.1 + ((i * 1.61) % 2.7)] as const)

function Giardino() {
  const gp = useCasa((s) => grado(s.entita.prato))
  const gs = useCasa((s) => grado(s.entita.siepe))
  return (
    <group>
      {ciuffi.slice(0, gp === 2 ? 40 : gp === 1 ? 18 : 0).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]}>
          <coneGeometry args={[0.06, 0.12 + (i % 3) * 0.03, 5]} />
          <meshStandardMaterial color="#86B072" roughness={1} />
        </mesh>
      ))}
      <Interattivo id="siepe" b={[0.1, 0, 11.9, 10.8, 1.1, 12.25]}>
        <Box b={[0.1, 0, 11.9, 10.8, 1.1, 12.25]} c={verde} r={1} />
        {gs > 0 && Array.from({ length: gs * 7 }, (_, i) => {
          const x = 0.6 + ((i * 1.53) % 9.8)
          return <Box key={i} b={[x, 1.05, 11.92, x + 0.3, 1.25 + (i % 2) * 0.08, 12.2]} c="#6B9A55" r={1} />
        })}
      </Interattivo>
      <Interattivo id="piante" b={[0.4, 0, 9.25, 2.1, 0.7, 9.75]}>
        <Box b={[0.4, 0, 9.25, 2.1, 0.18, 9.75]} c="#8A6A4E" />
        {[0.7, 1.25, 1.8].map((x, i) => (
          <mesh key={x} position={[x, 0.38 + (i % 2) * 0.06, 9.5]} castShadow>
            <sphereGeometry args={[0.2 + (i % 2) * 0.04, 12, 10]} />
            <meshStandardMaterial color={['#6FA67A', '#84B56A', '#5E8C4A'][i]} roughness={1} />
          </mesh>
        ))}
      </Interattivo>
    </group>
  )
}

export default function Esterni() {
  return (
    <>
      <BidoniFuori />
      <Posta />
      <Giardino />
    </>
  )
}
