// Riconoscimento vocale del browser (Web Speech API), italiano. Gratuito, richiede connessione.
type Esito = { testo: string } | { errore: string }

export function vocePossibile(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
}

export function ascolta(): Promise<Esito> {
  return new Promise((resolve) => {
    if (!vocePossibile()) return resolve({ errore: 'Questo browser non supporta la voce. Prova con Chrome.' })
    if (!navigator.onLine) return resolve({ errore: 'Per la voce serve la connessione. Riprova quando sei online.' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any
    const Rec = W.SpeechRecognition || W.webkitSpeechRecognition
    const rec = new Rec()
    rec.lang = 'it-IT'
    rec.interimResults = false
    rec.maxAlternatives = 1
    let fatto = false
    rec.onresult = (e: any) => {
      fatto = true
      resolve({ testo: e.results[0][0].transcript })
    }
    rec.onerror = (e: any) => {
      fatto = true
      const msg =
        e.error === 'not-allowed'
          ? 'Serve il permesso del microfono. Puoi darlo dalle impostazioni del browser.'
          : e.error === 'network'
            ? 'Per la voce serve la connessione. Riprova quando sei online.'
            : e.error === 'no-speech'
              ? 'Non ho sentito nulla. Riprova pure.'
              : 'Non sono riuscita a capire. Riprova pure.'
      resolve({ errore: msg })
    }
    rec.onend = () => {
      if (!fatto) resolve({ errore: 'Non ho sentito nulla. Riprova pure.' })
    }
    rec.start()
  })
}
