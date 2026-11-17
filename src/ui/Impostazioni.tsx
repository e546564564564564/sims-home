import { useRef, useState } from 'react'
import { useCasa } from '../data/casa'
import { esporta, leggiBackup } from '../data/backup'
import { useNav } from './store'

// Menu "⋯": backup manuale dei dati (esporta / importa un file).
export default function Impostazioni() {
  const [aperto, setAperto] = useState(false)
  const [errore, setErrore] = useState('')
  const file = useRef<HTMLInputElement>(null)
  const carica = async (f?: File) => {
    if (!f) return
    try {
      useCasa.getState().importa(await leggiBackup(f))
      setAperto(false)
      setErrore('')
    } catch {
      setErrore('Questo file non sembra un backup della casa.')
    }
  }
  return (
    <>
      <button className="tondo" onClick={() => setAperto(!aperto)} aria-label="Altro">⋯</button>
      {aperto && (
        <div className="menu">
          <button onClick={() => { esporta(Object.values(useCasa.getState().entita)); setAperto(false) }}>Salva un backup</button>
          <button onClick={() => file.current?.click()}>Carica un backup</button>
          <button onClick={() => { useNav.getState().apri('calendario', 'sala'); setAperto(false) }}>Calendario di casa</button>
          {errore && <p>{errore}</p>}
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => { carica(e.target.files?.[0]); e.target.value = '' }} />
        </div>
      )}
    </>
  )
}
