import Scene from './world/Scene'
import MicButton from './ui/MicButton'
import RotateHint from './ui/RotateHint'
import Panel from './ui/Panel'
import RoomPicker from './ui/RoomPicker'

export default function App() {
  return (
    <>
      <Scene />
      <RoomPicker />
      <MicButton />
      <Panel />
      <RotateHint />
    </>
  )
}
