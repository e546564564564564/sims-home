import Scene from './world/Scene'
import MicButton from './ui/MicButton'
import RotateHint from './ui/RotateHint'
import Panel from './ui/Panel'
import RoomPicker from './ui/RoomPicker'
import Avviso from './ui/Avviso'
import { useCasa } from './data/casa'
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    useCasa.getState().carica()
  }, [])
  return (
    <>
      <Scene />
      <RoomPicker />
      <MicButton />
      <Panel />
      <Avviso />
      <RotateHint />
    </>
  )
}
