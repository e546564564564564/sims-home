import { Canvas } from '@react-three/fiber'
import { theme } from '../theme'
import { useNav } from '../ui/store'
import House from './House'
import SalaCucina from './SalaCucina'
import Stanze from './Stanze'
import StatoVivo from './StatoVivo'
import CameraRig from './CameraRig'
import { gesture } from './camera'

export default function Scene() {
  return (
    <Canvas
      shadows
      orthographic
      dpr={[1, 2]}
      camera={{ position: [20, 20, -20], zoom: 40, near: -100, far: 200 }}
      style={{ position: 'fixed', inset: 0, background: theme.sfondo, touchAction: 'none' }}
      onPointerMissed={(e) => {
        if ((e as MouseEvent).type === 'click' && gesture.moved < 10) useNav.getState().indietro()
      }}
    >
      <ambientLight intensity={1.05} color="#FFF4E6" />
      <hemisphereLight args={['#FFF6EA', '#C8A57E', 0.45]} />
      <directionalLight
        position={[12, 18, -6]}
        intensity={1.5}
        color="#FFE7C2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0005}
      />
      <House />
      <SalaCucina />
      <Stanze />
      <StatoVivo />
      <CameraRig />
    </Canvas>
  )
}
