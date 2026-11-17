import Box from './Box'
import InStanza from './davanti'
import Interattivo from './Interattivo'
import { theme as t } from '../theme'
import { useCasa, daFare } from '../data/casa'

// Arredo di bagno, camera, studio e ripostiglio (docs/scheda-stanze.md). Coordinate di pianta, metri.

function Cilindro({ p, r, h, c, asse = 'y' }: { p: [number, number, number]; r: number; h: number; c: string; asse?: 'x' | 'y' | 'z' }) {
  const rot: [number, number, number] = asse === 'x' ? [0, 0, Math.PI / 2] : asse === 'z' ? [Math.PI / 2, 0, 0] : [0, 0, 0]
  return (
    <mesh position={p} rotation={rot} castShadow>
      <cylinderGeometry args={[r, r, h, 24]} />
      <meshStandardMaterial color={c} roughness={0.7} />
    </mesh>
  )
}

function Bagno() {
  const lav = useCasa((s) => daFare(s.entita.lavatrice).length > 0)
  return (
    <group>
      {/* mobile lavabo sospeso con lavabo ovale d'appoggio */}
      <Interattivo id="mobileBagno" b={[3.21, 0.45, 6.3, 3.71, 1.0, 7.2]}>
        <Box b={[3.21, 0.45, 6.3, 3.69, 0.85, 7.2]} c={t.bianco} />
        <Box b={[3.69, 0.48, 6.33, 3.7, 0.64, 7.17]} c="#ECEAE5" />
        <Box b={[3.69, 0.66, 6.33, 3.7, 0.82, 7.17]} c="#ECEAE5" />
        <Box b={[3.21, 0.85, 6.3, 3.71, 0.88, 7.2]} c={t.bambu} />
        <mesh position={[3.45, 0.93, 6.75]} scale={[1, 0.5, 1.3]} castShadow>
          <sphereGeometry args={[0.18, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
      </Interattivo>

      {/* lavatrice verso la finestra: oblò e spia (ambra quando c'è un'attività da fare) */}
      <Interattivo id="lavatrice" b={[3.21, 0, 7.95, 3.81, 0.86, 8.55]}>
        <Box b={[3.21, 0, 7.95, 3.8, 0.85, 8.55]} c="#FBFBF9" r={0.5} />
        <Box b={[3.8, 0.7, 7.98, 3.805, 0.83, 8.52]} c="#E8E8E4" />
        <Cilindro p={[3.81, 0.38, 8.25]} r={0.2} h={0.03} c="#D6DADD" asse="x" />
        <Cilindro p={[3.82, 0.38, 8.25]} r={0.14} h={0.02} c="#9FB3BF" asse="x" />
        <Cilindro p={[3.81, 0.765, 8.38]} r={0.035} h={0.03} c={t.acciaio} asse="x" />
        <Box b={[3.8, 0.75, 8.06, 3.81, 0.78, 8.1]} c={lav ? t.spiaAttesa : t.spiaOk} r={0.2} />
      </Interattivo>

      {/* vasca con pannello in mosaico e parete doccia */}
      <Box b={[4.39, 0, 5.75, 5.09, 0.55, 7.45]} c={t.mosaico} />
      <Box b={[4.42, 0.55, 5.78, 5.07, 0.57, 7.42]} c="#FFFFFF" r={0.4} />
      <Box b={[4.5, 0.4, 5.86, 4.99, 0.571, 7.34]} c="#EEF3F3" r={0.3} />
      <Box b={[4.39, 0.57, 6.8, 4.41, 1.9, 7.45]} c={t.vetro} r={0.2} />

      {/* WC e bidet sospesi verso la finestra */}
      {[7.62, 8.2].map((z) => (
        <group key={z}>
          <Box b={[4.6, 0.25, z, 5.09, 0.42, z + 0.38]} c="#FFFFFF" r={0.4} />
          <Box b={[4.62, 0.42, z + 0.02, 5.07, 0.44, z + 0.36]} c="#F2F2F0" r={0.4} />
        </group>
      ))}
    </group>
  )
}

function Camera() {
  return (
    <group>
      {/* armadio a muro scorrevole, un'anta a specchio */}
      <Interattivo id="armadio" parete={{ x: 1.5, z: 3.9, asseX: true }} taglia b={[0.06, 0, 3.96, 2.9, 2.4, 4.56]}>
        <Box b={[0.06, 0, 3.96, 2.9, 2.4, 4.54]} c={t.bianco} />
        <Box b={[0.1, 0.05, 4.54, 1.0, 2.35, 4.56]} c="#F2F1EE" />
        <Box b={[1.0, 0.05, 4.54, 1.95, 2.35, 4.56]} c={t.specchio} r={0.15} />
        <Box b={[1.95, 0.05, 4.54, 2.86, 2.35, 4.56]} c="#F2F1EE" />
      </Interattivo>

      {/* letto con testata contro la parete del bagno, comodini */}
      <Interattivo id="letto" b={[1.0, 0, 5.85, 3.09, 1.15, 7.45]}>
        <Box b={[3.0, 0, 5.85, 3.09, 1.15, 7.45]} c={t.bianco} />
        <Box b={[1.0, 0, 5.85, 3.0, 0.35, 7.45]} c={t.bianco} />
        <Box b={[1.03, 0.35, 5.88, 2.98, 0.52, 7.42]} c="#F4F4F2" />
        <Box b={[1.0, 0.52, 5.86, 2.55, 0.6, 7.44]} c={t.biancheria} />
        {[5.95, 6.7].map((z) => (
          <Box key={z} b={[2.6, 0.52, z, 2.95, 0.66, z + 0.65]} c="#E7E8EA" r={1} />
        ))}
      </Interattivo>
      {[5.35, 7.55].map((z) => (
        <Box key={z} b={[2.65, 0, z, 3.09, 0.5, z + 0.42]} c={t.bianco} />
      ))}
    </group>
  )
}

function Studio() {
  return (
    <group>
      {/* divano letto lungo la parete ovest */}
      <Box b={[5.21, 0.05, 6.0, 6.06, 0.42, 7.9]} c={t.divanoLetto} />
      <Box b={[5.21, 0.42, 6.0, 5.42, 0.85, 7.9]} c={t.divanoLetto} />
      {/* tappeto a ottagoni */}
      <Box b={[6.3, 0.006, 6.3, 7.6, 0.014, 7.8]} c="#E9E7E2" r={1} />
      {[6.55, 7.0, 7.45].map((z) =>
        [6.6, 7.05].map((x) => <Box key={x + '-' + z} b={[x, 0.014, z - 0.12, x + 0.26, 0.016, z + 0.12]} c={x > 7 ? t.tappeto : '#A7A39E'} r={1} />),
      )}
      {/* scrivania nella nicchia antracite, monitor argento, sedia nera */}
      <Interattivo id="computer" b={[8.04, 0, 6.0, 8.74, 1.25, 7.4]}>
        <Box b={[8.04, 0.72, 6.0, 8.74, 0.75, 7.4]} c={t.bianco} />
        <Box b={[8.1, 0, 6.02, 8.7, 0.68, 6.45]} c={t.bianco} />
        <Box b={[8.7, 0, 7.3, 8.74, 0.72, 7.38]} c={t.bianco} />
        <Box b={[8.0, 0.62, 6.6, 8.4, 0.64, 7.2]} c={t.nero} />
        <Box b={[8.6, 0.75, 6.82, 8.66, 0.86, 6.92]} c={t.argento} />
        <Box b={[8.55, 0.86, 6.5, 8.6, 1.25, 7.24]} c={t.argento} r={0.3} />
        <Box b={[8.548, 0.89, 6.53, 8.55, 1.22, 7.21]} c="#2B2F38" r={0.2} />
      </Interattivo>
      <Box b={[7.55, 0.42, 6.65, 7.95, 0.5, 7.1]} c={t.nero} />
      <Box b={[7.5, 0.5, 6.65, 7.56, 0.95, 7.1]} c={t.nero} />
      <Box b={[7.72, 0, 6.84, 7.78, 0.42, 6.9]} c="#2A2A2D" />
      {/* cassettiera in rovere accanto alla portafinestra */}
      <Box b={[7.2, 0.12, 8.3, 8.04, 0.92, 8.74]} c={t.rovereChiaro} />
      {[0.25, 0.51, 0.77].map((y) => <Box key={y} b={[7.2, y, 8.295, 8.04, y + 0.008, 8.3]} c="#B89F78" />)}
      {[7.24, 7.98].map((x) => <Box key={x} b={[x, 0, 8.34, x + 0.03, 0.12, 8.38]} c={t.nero} />)}
    </group>
  )
}

function Ripostiglio() {
  return (
    <group>
      {/* scarpiera e panca con la base del robot */}
      <Box b={[8.86, 0, 5.7, 9.21, 0.98, 6.6]} c={t.rovere} />
      <Box b={[8.86, 0.98, 5.7, 9.21, 1.0, 6.6]} c={t.nero} />
      <Box b={[8.86, 0.4, 6.7, 9.26, 0.45, 7.7]} c={t.bianco} />
      {[6.72, 7.64].map((z) => <Box key={z} b={[8.88, 0, z, 9.24, 0.4, z + 0.04]} c={t.bianco} />)}
      <Interattivo id="robot" b={[8.86, 0, 6.95, 9.3, 0.12, 7.45]}>
        <Box b={[8.86, 0, 7.08, 8.94, 0.12, 7.32]} c="#2A2A2D" />
        <Cilindro p={[9.1, 0.05, 7.2]} r={0.17} h={0.09} c="#F4F4F2" />
        <Cilindro p={[9.1, 0.1, 7.2]} r={0.05} h={0.02} c="#2A2A2D" />
      </Interattivo>
      {/* armadio alto delle pulizie e asciugatrice */}
      <Interattivo id="armadioPulizie" parete={{ x: 10.75, z: 5.2, asseX: false }} taglia b={[10.19, 0, 4.75, 10.69, 2.2, 5.75]}>
        <Box b={[10.19, 0, 4.75, 10.69, 2.2, 5.75]} c={t.bianco} />
        <Box b={[10.185, 0.05, 4.78, 10.19, 2.15, 5.24]} c="#F0EFEB" />
        <Box b={[10.185, 0.05, 5.26, 10.19, 2.15, 5.72]} c="#F0EFEB" />
        <Box b={[10.17, 1.0, 5.18, 10.185, 1.2, 5.21]} c={t.acciaio} />
      </Interattivo>
      <Interattivo id="asciugatrice" b={[10.09, 0, 6.2, 10.69, 0.86, 6.8]}>
        <Box b={[10.1, 0, 6.2, 10.69, 0.85, 6.8]} c="#FBFBF9" r={0.5} />
        <Cilindro p={[10.09, 0.4, 6.5]} r={0.2} h={0.03} c="#D6DADD" asse="x" />
        <Cilindro p={[10.08, 0.4, 6.5]} r={0.14} h={0.02} c="#C9CED2" asse="x" />
        <Box b={[10.095, 0.7, 6.24, 10.1, 0.82, 6.76]} c="#E8E8E4" />
      </Interattivo>
    </group>
  )
}

export default function Stanze() {
  return (
    <>
      <InStanza id="bagno"><Bagno /></InStanza>
      <InStanza id="camera"><Camera /></InStanza>
      <InStanza id="studio"><Studio /></InStanza>
      <InStanza id="ripostiglio"><Ripostiglio /></InStanza>
    </>
  )
}
