import { Vector3 } from 'three'

// Stato condiviso tra controller della camera e oggetti (posizioni degli oggetti interattivi).
export const E = Math.atan(1 / Math.SQRT2) // elevazione isometrica (35,26°)
export const azimuth = (rot: number) => Math.PI / 4 + (rot * Math.PI) / 2

// direzione orizzontale dal bersaglio verso la camera
export function camDir(a: number) {
  return { x: Math.sin(a), z: -Math.cos(a) }
}

export const objectCenters = new Map<string, Vector3>()

// distanza percorsa dall'ultimo gesto: serve a distinguere un tap da un trascinamento
export const gesture = { moved: 0 }
