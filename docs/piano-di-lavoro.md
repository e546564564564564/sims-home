# Piano di lavoro

Un passo per sessione. Ogni passo finisce online e si prova sul telefono in orizzontale. Dopo i punti di verifica si usa l'app davvero prima di proseguire.

## Blocco 0 – Fondamenta
1. Repository GitHub (fatto da me).
2. Progetto base Vite + React + TS + React Three Fiber, struttura cartelle come in CLAUDE.md.
3. Deploy automatico su GitHub Pages (GitHub Actions).
4. PWA installabile, standalone, bloccata in orizzontale.
4b. Prova del microfono: pulsante che mostra il testo riconosciuto (Web Speech API, it-IT).
Verifica: si installa dal telefono, si apre in orizzontale, scena fluida, il microfono trascrive.

## Blocco 1 – Base visiva
5. `src/theme.ts` con i token di colore delle schede.
6. Componente pannello a destra (vuoto, con contenuti finti).

## Blocco 2 – La casa come mondo
7. `src/data/house.ts` da `docs/house-draft.ts`.
8. Pavimenti e muri generati dal file (guscio completo, porte e finestre).
9. Camera isometrica: pinch, trascinamento, rotazione a 90°.
10. Tap stanza: zoom e muri davanti abbassati.
11. Mobili e oggetti di sala e cucina (scheda-sala).
12. Tap oggetto: alone + pannello con contenuti finti.
Verifica (Fase 0): muoversi è piacevole, gli oggetti si toccano bene.

## Blocco 3 – Motore dei dati
13. Modello a entità. 14. IndexedDB offline. 15. Collegamento scena–dati. 16. Esporta/importa backup.

## Blocco 4 – Cucina
17. Frigo e dispensa a livelli, con i prodotti di partenza di docs/scheda-contenuti.md. 18. "Aggiungi alla lista". 19. Lista spesa con "Comprato". 20. Scadenze alimenti. 21. Frigo e dispensa mostrano il livello.

## Blocco 4b – Voce per la cucina
22. Comandi "manca", "aggiungi alla lista", "ho comprato" con fumetto e Annulla.

## Blocco 5 – Lavatrice e attività ricorrenti
23. "+ Attività" dal pannello di qualsiasi oggetto (nessuna lista predefinita), con "Fatto" e Annulla. 24. Storico. 25. Segnale gentile nella scena. 26. Voce "ho fatto / ho pulito".

## Blocco 6 – Calendario di casa
27. Calendario cartaceo in sala (parete d'ingresso). 28. Al tap: embed del calendario Google condiviso nel pannello + "Apri in Google Calendar". 29. ID del calendario nelle impostazioni dell'app.
Verifica (Fase 1): due settimane d'uso reale.

## Blocchi successivi (ordine libero)
7 Pulizie e stato vivo · 8 Rifiuti e biancheria · 9 Angolo bar · 10 Esterni · 11 Garage (da discutere) · 12 Scadenze generiche · 13 Abitanti animati · 14 Integrazioni (robot Roborock, termostato BTicino, Home Assistant) e condivisione.
