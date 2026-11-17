import { openDB } from 'idb'
import type { Entita } from './entita'

// Salvataggio offline nel browser (IndexedDB).
const db = openDB('sims-home', 1, {
  upgrade(d) {
    d.createObjectStore('entita', { keyPath: 'id' })
  },
})

export async function leggiTutte(): Promise<Entita[]> {
  return (await db).getAll('entita')
}

export async function salvaTutte(lista: Entita[]) {
  const tx = (await db).transaction('entita', 'readwrite')
  await tx.store.clear()
  await Promise.all(lista.map((e) => tx.store.put(e)))
  await tx.done
}
