# The Sims Home — CLAUDE.md

Fonte unica di verità. Se qualcosa altrove contraddice questo file, vale questo file.
Dettagli in `docs/`: leggerli SOLO quando il passo in corso li riguarda.

## Cos'è
Web app 3D isometrica della mia casa reale, stile diorama "quasi Sims". La casa è l'interfaccia: tocco un oggetto, si apre il suo pannello. Ogni cosa nel gioco corrisponde alla realtà (scorte, pulizie, manutenzioni, scadenze).

## Regole fisse
- Niente punteggi, livelli, premi, classifiche, vittorie. Nessuna pressione.
- Segnali gentili: dettagli del mondo (post-it, spia), mai pallini rossi o numeri.
- Interfaccia in italiano.
- Solo smartphone Android (Chrome), solo orizzontale.
- Tutto gratuito: GitHub + GitHub Pages, PWA, dati in IndexedDB, niente servizi a pagamento. Se qualcosa costa, chiedere prima.
- Partire semplice. Fare solo il passo richiesto. Niente funzioni di passi futuri.
- Risparmiare token: niente refactoring non richiesti, niente spiegazioni lunghe, file piccoli.

## Stack
Vite + React + TypeScript, React Three Fiber + drei, Zustand, idb, vite-plugin-pwa. Nessun'altra libreria senza motivo.

## Architettura (4 livelli separati)
- `src/world/` scena 3D: mostra le entità, non contiene dati.
- `src/data/` entità, salvataggio, `house.ts`.
- Calendario: solo Google Calendar condiviso, mostrato in embed dal calendario cartaceo in sala. Nessun calendario interno.
- `src/integrations/` voce e dispositivi (più avanti).
- `src/ui/` pannello e HUD.
- `src/theme.ts` tutti i colori e materiali come token.

## Stile 3D
- Diorama su base di legno, muri frontali tagliati, luce calda, ombre morbide.
- Oggetti costruiti in codice con forme semplici arrotondate, niente modelli esterni per ora.
- Non interattivi semplici; interattivi con più pezzi e colori un po' più saturi.
- Casa ordinata: niente oggetti appoggiati, quadri, soprammobili. Le decorazioni dipinte sui muri sì.
- Colori e mobili: `docs/scheda-sala.md`, `docs/scheda-stanze.md`. Riferimenti visivi: `docs/anteprima-casa.png`, `docs/anteprima-sala-v4.png`.

## Interazione
- Avvio: tutta la casa dall'alto. Tap stanza → zoom, muri davanti abbassati (impostazione isolata). Tap oggetto → alone + pannello a destra (1/3 schermo). Tap vuoto → chiude / torna indietro.
- Pinch zoom, trascinamento, rotazione a scatti di 90°. Aree di tocco più grandi della geometria.
- Azioni rapide immediate con "Annulla" per qualche secondo; niente conferme.

## Dati
- Entità: id, stanza, tipo, stato, inventario?, attività?, scadenze?, storico.
- Inventario a livelli (pieno / a metà / quasi finito / finito). Lista spesa solo manuale. "Comprato" → pieno.
- Ricorrenze: attività di casa dal completamento; scadenze a data fissa.
- Dettagli: `docs/decisioni.md`.

## Casa
- Pianta in `src/data/house.ts` (unico posto), partendo da `docs/house-draft.ts`.
- Misure reali NON disponibili: stimate dalla planimetria (porta = 80 cm). Tutto deve dipendere da quel file.

## Modo di lavorare
- Un passo per sessione (`docs/piano-di-lavoro.md`).
- Fine passo: build ok, deploy su GitHub Pages, breve elenco di cosa provare sul telefono.
- Aggiornare "Stato" qui sotto a fine passo (una riga).

## Stato
- Blocco 0 fatto: Vite + React + R3F, scena di prova (cubo), PWA landscape installabile, deploy GitHub Pages via Actions, prova microfono (Web Speech it-IT).
