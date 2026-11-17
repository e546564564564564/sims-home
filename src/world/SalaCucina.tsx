import Box from './Box'
import InStanza from './davanti'
import Interattivo from './Interattivo'
import { theme as t } from '../theme'
import { Frigo, Dispensa, Blocchetto } from './Contenitori'

// Arredo di sala e cucina (Fase 0). Coordinate di pianta: x, y (altezza), z. Misure in metri.

function Sala() {
  const S = t.divano
  return (
    <group>
      {/* parete TV: mobile basso, pensili, mensola */}
      <Box b={[0.06, 0, 0.9, 0.46, 0.4, 3.2]} c={t.laccatoBianco} />
      <Box b={[0.06, 0.4, 0.9, 0.46, 0.43, 3.2]} c={t.rovere} />
      <Box b={[0.06, 1.55, 1.0, 0.38, 1.9, 3.0]} c={t.laccatoBianco} />
      <Box b={[0.06, 1.52, 1.0, 0.38, 1.55, 3.0]} c={t.rovere} />
      <Box b={[0.06, 1.33, 1.9, 0.32, 1.36, 3.0]} c={t.rovere} />
      {[1.15, 1.75, 2.35, 2.95].map((z) => (
        <Box key={z} b={[0.46, 0.25, z, 0.475, 0.31, z + 0.05]} c={t.cuoio} />
      ))}

      <Interattivo id="tv" b={[0.2, 0.43, 1.55, 0.32, 1.15, 2.65]}>
        <Box b={[0.2, 0.43, 1.95, 0.32, 0.46, 2.25]} c={t.nero} />
        <Box b={[0.24, 0.46, 2.06, 0.28, 0.52, 2.14]} c={t.nero} />
        <Box b={[0.25, 0.52, 1.55, 0.29, 1.15, 2.65]} c={t.nero} r={0.3} />
        <Box b={[0.29, 0.55, 1.58, 0.292, 1.12, 2.62]} c="#2B2F38" r={0.2} />
      </Interattivo>

      <Interattivo id="alexa" b={[0.18, 0.43, 1.07, 0.34, 0.55, 1.23]}>
        <mesh position={[0.26, 0.49, 1.15]} castShadow>
          <sphereGeometry args={[0.07, 20, 16]} />
          <meshStandardMaterial color={t.alexa} roughness={0.8} />
        </mesh>
      </Interattivo>

      <Interattivo id="bar" b={[0.06, 0, 3.3, 0.5, 0.75, 3.8]}>
        <Box b={[0.06, 0, 3.3, 0.48, 0.72, 3.8]} c={t.laccatoBianco} />
        <Box b={[0.06, 0.72, 3.3, 0.48, 0.75, 3.8]} c={t.rovere} />
        <Box b={[0.48, 0.05, 3.33, 0.485, 0.68, 3.545]} c="#FFFFFF" />
        <Box b={[0.48, 0.05, 3.555, 0.485, 0.68, 3.77]} c="#FFFFFF" />
        <Box b={[0.485, 0.5, 3.51, 0.5, 0.56, 3.535]} c={t.cuoio} />
        <Box b={[0.485, 0.5, 3.565, 0.5, 0.56, 3.59]} c={t.cuoio} />
      </Interattivo>

      {/* tappeto senape con forma grigia */}
      <Box b={[1.15, 0.006, 1.15, 3.0, 0.016, 3.1]} c={t.tappeto} r={1} />
      <mesh position={[1.15, 0.018, 2.12]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <circleGeometry args={[0.95, 32, 0, Math.PI]} />
        <meshStandardMaterial color={t.tappetoForma} roughness={1} />
      </mesh>

      {/* pouf */}
      <Box b={[0.95, 0, 1.7, 1.75, 0.26, 2.6]} c="#45474B" />
      <Box b={[0.95, 0.26, 1.7, 1.75, 0.38, 2.6]} c="#55575C" />

      {/* divano antracite con chaise verso il corridoio, rivolto alla TV */}
      <Box b={[2.4, 0.05, 1.0, 2.85, 0.22, 3.3]} c={S} />
      <Box b={[1.7, 0.05, 2.5, 2.4, 0.22, 3.3]} c={S} />
      <Box b={[2.85, 0.05, 1.0, 3.1, 0.78, 3.3]} c={S} />
      <Box b={[2.4, 0.05, 1.0, 2.85, 0.5, 1.2]} c={S} />
      <Box b={[1.7, 0.05, 3.1, 2.85, 0.5, 3.3]} c={S} />
      {[[1.2, 1.9], [1.92, 2.5]].map(([a, b2]) => (
        <Box key={a} b={[2.42, 0.22, a, 2.84, 0.36, b2]} c="#55575C" />
      ))}
      <Box b={[1.72, 0.22, 2.52, 2.84, 0.36, 3.08]} c="#55575C" />
      <Box b={[2.68, 0.36, 1.25, 2.86, 0.66, 3.05]} c="#525459" />
      {[[2.42, 1.02], [3.02, 1.02], [1.72, 3.22], [3.02, 3.22]].map(([x, z]) => (
        <Box key={x + '-' + z} b={[x, 0, z, x + 0.06, 0.05, z + 0.06]} c="#2A2A2D" />
      ))}

      {/* tavolo in frassino e 4 sedie bianche */}
      <Box b={[5.1, 0.72, 1.2, 5.9, 0.77, 2.6]} c={t.tavolo} />
      {[[5.15, 1.25], [5.8, 1.25], [5.15, 2.5], [5.8, 2.5]].map(([x, z]) => (
        <Box key={x + ':' + z} b={[x, 0, z, x + 0.05, 0.72, z + 0.05]} c={t.gambeTavolo} />
      ))}
      {[1.45, 2.05].map((z) => (
        <group key={z}>
          <Sedia x={4.55} z={z} schienale="ovest" />
          <Sedia x={5.95} z={z} schienale="est" />
        </group>
      ))}

      {/* termostato (parete verso il corridoio), citofono, allarme, calendario (parete d'ingresso) */}
      <Interattivo id="termostato" parete={{ x: 2.6, z: 3.9, asseX: true }} b={[2.45, 1.4, 3.8, 2.75, 1.6, 3.84]}>
        <Box b={[2.45, 1.4, 3.82, 2.75, 1.6, 3.84]} c="#FBFBF9" r={0.3} />
        <Box b={[2.56, 1.47, 3.815, 2.64, 1.53, 3.82]} c="#C8CCD0" />
      </Interattivo>
      <Interattivo id="citofono" parete={{ x: 3.3, z: 0, asseX: true }} b={[3.2, 1.25, 0.06, 3.45, 1.6, 0.1]}>
        <Box b={[3.2, 1.25, 0.06, 3.45, 1.6, 0.1]} c="#F4F4F2" />
        <Box b={[3.23, 1.4, 0.1, 3.33, 1.55, 0.102]} c="#9EA6AD" />
      </Interattivo>
      <Interattivo id="allarme" parete={{ x: 3.7, z: 0, asseX: true }} b={[3.58, 1.38, 0.06, 3.8, 1.55, 0.09]}>
        <Box b={[3.58, 1.38, 0.06, 3.8, 1.55, 0.09]} c="#F4F4F2" />
        <Box b={[3.61, 1.47, 0.09, 3.72, 1.51, 0.092]} c="#C9C27A" />
      </Interattivo>
      <Interattivo id="calendario" parete={{ x: 5.4, z: 0, asseX: true }} b={[5.2, 1.2, 0.06, 5.65, 1.8, 0.08]}>
        <Box b={[5.2, 1.2, 0.06, 5.65, 1.8, 0.075]} c="#FFFFFF" r={1} />
        <Box b={[5.2, 1.66, 0.075, 5.65, 1.8, 0.078]} c="#C9573F" />
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3, 4].map((k) => (
            <Box key={r + '-' + k} b={[5.24 + k * 0.08, 1.27 + r * 0.09, 0.075, 5.29 + k * 0.08, 1.32 + r * 0.09, 0.077]} c="#E4DED6" r={1} />
          )),
        )}
      </Interattivo>
    </group>
  )
}

function Sedia({ x, z, schienale }: { x: number; z: number; schienale: 'ovest' | 'est' }) {
  const bx = schienale === 'ovest' ? x : x + 0.4
  return (
    <group>
      {[[0.04, 0.04], [0.37, 0.04], [0.04, 0.37], [0.37, 0.37]].map(([dx, dz]) => (
        <Box key={dx + '' + dz} b={[x + dx, 0, z + dz, x + dx + 0.035, 0.45, z + dz + 0.035]} c={t.gambeTavolo} />
      ))}
      <Box b={[x, 0.45, z, x + 0.45, 0.5, z + 0.45]} c={t.sedie} />
      <Box b={[bx, 0.5, z, bx + 0.05, 0.88, z + 0.45]} c={t.sedie} />
    </group>
  )
}

function Cucina() {
  const front = 3.92 // fronte delle basi (verso la sala)
  const back = 4.44
  return (
    <group>
      {/* rivestimento e LED */}
      <Box b={[4.65, 0.92, back, 7.88, 1.45, back + 0.005]} c={t.rivestimento} />
      <Box b={[4.65, 1.43, back - 0.3, 7.3, 1.45, back]} c="#FFF3D0" r={0.2} />

      <Dispensa />

      {/* lavello sopra lavastoviglie e bidoni */}
      <Box b={[4.65, 0.88, front, 5.45, 0.92, back]} c={t.piano} />
      <Box b={[4.8, 0.921, 4.0, 5.3, 0.924, 4.36]} c="#B4BBC0" r={0.3} />
      <Box b={[5.03, 0.92, 4.36, 5.07, 1.25, 4.4]} c={t.acciaio} r={0.3} />
      <Box b={[5.03, 1.21, 4.2, 5.07, 1.25, 4.4]} c={t.acciaio} r={0.3} />
      <Interattivo id="lavastoviglie" b={[4.65, 0, front, 5.05, 0.88, back]}>
        <Box b={[4.65, 0, front, 5.05, 0.88, back]} c={t.cucinaBasi} />
        <Box b={[4.68, 0.06, front - 0.005, 5.02, 0.84, front]} c="#E2DDD4" />
        <Box b={[4.75, 0.78, front - 0.02, 4.95, 0.8, front - 0.005]} c={t.acciaio} />
      </Interattivo>
      <Interattivo id="bidoni" b={[5.05, 0, front, 5.45, 0.88, back]}>
        <Box b={[5.05, 0, front, 5.45, 0.88, back]} c={t.cucinaBasi} />
        <Box b={[5.08, 0.06, front - 0.005, 5.42, 0.84, front]} c="#E2DDD4" />
        <Box b={[5.15, 0.78, front - 0.02, 5.35, 0.8, front - 0.005]} c={t.acciaio} />
      </Interattivo>

      <Interattivo id="forno" b={[5.45, 0, front, 6.05, 0.93, back]}>
        <Box b={[5.45, 0, front, 6.05, 0.88, back]} c={t.cucinaBasi} />
        <Box b={[5.45, 0.88, front, 6.05, 0.92, back]} c={t.piano} />
        <Box b={[5.5, 0.921, 4.0, 6.0, 0.926, 4.38]} c="#1F1F22" r={0.2} />
        <Box b={[5.5, 0.12, front - 0.01, 6.0, 0.72, front]} c={t.acciaio} r={0.35} />
        <Box b={[5.53, 0.16, front - 0.012, 5.97, 0.56, front - 0.01]} c={t.vetroNero} r={0.2} />
        <Box b={[5.55, 0.6, front - 0.03, 5.95, 0.62, front - 0.012]} c="#DADDE0" r={0.3} />
      </Interattivo>

      {/* cassettiere fino all'angolo */}
      <Box b={[6.05, 0, front, 7.3, 0.88, back]} c={t.cucinaBasi} />
      <Box b={[6.05, 0.88, front, 7.88, 0.92, back]} c={t.piano} />
      {[[0.06, 0.42], [0.46, 0.64], [0.67, 0.84]].map(([y0, y1]) => (
        <group key={y0}>
          <Box b={[6.08, y0, front - 0.005, 6.66, y1, front]} c="#E0DBD2" />
          <Box b={[6.7, y0, front - 0.005, 7.27, y1, front]} c="#E0DBD2" />
        </group>
      ))}

      {/* braccio della L: base d'angolo e colonna frigo */}
      <Box b={[7.3, 0, 3.4, 7.88, 0.88, back]} c={t.cucinaBasi} />
      <Box b={[7.3, 0.88, 3.4, 7.88, 0.92, 3.92]} c={t.piano} />
      <Frigo />
      <Blocchetto />
    </group>
  )
}

export default function SalaCucina() {
  return (
    <>
      <InStanza id="sala"><Sala /></InStanza>
      <InStanza id="cucina"><Cucina /></InStanza>
    </>
  )
}
