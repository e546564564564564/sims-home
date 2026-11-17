import Box from './Box'
import { useCasa, bidoniFuori } from '../data/casa'
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

export default function Esterni() {
  return <BidoniFuori />
}
