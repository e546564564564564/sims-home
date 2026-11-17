# Decisioni di progetto (dettaglio)

Leggere solo la sezione che serve al passo in corso.

## 1. Stile
- Diorama low-poly morbido, un po' verso The Sims: materiali riconoscibili, proporzioni realistiche, luce calda, ombre morbide.
- Due livelli di dettaglio, un solo linguaggio: oggetti non interattivi semplici; oggetti interattivi con più pezzi (maniglie, ante, fuochi, oblò) e colori un po' più saturi.
- Oggetto selezionato: alone caldo intorno alla sagoma.
- Niente simboli riconoscibili di The Sims (es. il diamante verde sopra i personaggi).
- Colori come token in `src/theme.ts`; in futuro palette meno pastello.

## 2. Interazione
- Avvio: tutta la casa dall'alto, muri abbassati (vedi anteprima-casa.png).
- Tap stanza: la camera si avvicina; muri davanti spariscono, quelli dietro restano interi. Modalità muri = impostazione isolata (in futuro "tutti sempre bassi").
- Tap oggetto: alone + pannello a destra; la camera si sposta per non coprire l'oggetto.
- Tap vuoto: chiude il pannello; secondo tap o pinch out: torna alla vista d'insieme.
- Rotazione a scatti di 90° con due dita. Selettore stanza in alto a sinistra.
- Oggetti alti sui muri davanti, nella vista d'insieme, vanno tagliati bassi come i muri.

## 3. Abitanti
- Una donna e un uomo. A riposo seduti sul divano.
- Tap su oggetto: il personaggio più vicino cammina fino all'oggetto. Il pannello si apre subito, la camminata è solo scena. Nessuna assegnazione di faccende.

## 4. Pannello contestuale
- Schema unico: intestazione (icona, nome, stanza, chiudi) + stato in 1–2 etichette gentili.
- Blocchi opzionali: Inventario, Attività ricorrenti, Scadenze, Storico.
- Schede in alto solo se i blocchi non stanno in una schermata.
- Larghezza circa 1/3 dello schermo, a destra.
- Azioni immediate con "Annulla" per qualche secondo: Fatto, cambio livello, Aggiungi alla lista, Comprato.
- Segnali nella scena: dettagli del mondo (post-it sul frigo, spia sulla lavatrice), mai pallini rossi, numeri o punti esclamativi. Compaiono gradualmente, spariscono a "Fatto".

## 5. Entità e dati
- Ricorrenze: attività di casa contano dal giorno in cui sono state fatte; scadenze (bollette, raccolta rifiuti) a data fissa. Ogni ricorrenza ha tipo "dal completamento" o "a data fissa".
- Inventario a livelli: pieno / a metà / quasi finito / finito. Niente quantità. La scena rispecchia i livelli.
- Lista spesa: solo aggiunte manuali ("Aggiungi alla lista"). "Comprato" riporta a pieno. Nessuna scorta minima.

## 6. Stato vivo
- Tre gradi per ambiente: in ordine / vissuto (1–2 dettagli gentili) / da sistemare (qualche dettaglio in più). Mai sporco.
- Il grado deriva dal tempo trascorso rispetto alla frequenza, non dal merito. Nessuna barra o percentuale.
- Dettagli per stanza configurabili senza toccare la logica (da definire più avanti).

## 7. Voce
- Pulsante microfono nella scena, tocca e parla; niente ascolto continuo.
- Web Speech API di Chrome Android, italiano. Serve connessione: offline il microfono lo dice con gentilezza.
- Comprensione con regole semplici sul telefono: "manca / è finito X", "aggiungi X alla lista", "manca X, aggiungilo alla lista", "ho comprato X", "ho fatto / pulito X".
- Fumetto di conferma ("Latte → lista della spesa") con Annulla; la casa mostra il risultato.
- Esclusi per ora: Alexa, servizi AI a pagamento.

## 8. Attività: nessuna lista predefinita
- L'app NON nasce con manutenzioni o faccende preimpostate. Le attività si creano quando serve, dal pannello di qualsiasi oggetto: "+ Attività" (nome, ogni quanto oppure una volta sola, tipo dal completamento / a data fissa).
- Unica eccezione: pulizia delle stanze, con le frequenze di `docs/scheda-contenuti.md`.
- I prodotti iniziali di frigo, dispensa, bar e pulizie sono invece precaricati (stessa scheda).

## 9. Calendario di casa
- L'unico calendario dell'app è il calendario Google condiviso della casa. Nessun calendario interno.
- Oggetto nella scena: calendario cartaceo appeso in sala, sulla parete d'ingresso vicino a citofono e allarme.
- Al tap: la vista del calendario Google (embed) nel pannello a destra + pulsante "Apri in Google Calendar" per modificare.
- Configurazione: l'indirizzo/ID del calendario si inserisce una volta nelle impostazioni dell'app, non nel codice.
- Pulizie e scadenze della casa restano visibili nella casa (stato vivo, segnali sugli oggetti), non nel calendario.
- Futuro, opzionale: scrivere le scadenze della casa nel calendario Google via API (gratuita, richiede progetto Google Cloud).

## 10. Oggetti interattivi
- Sala: TV, Alexa, angolo bar, termostato (accesso unico al riscaldamento; la caldaia dietro la TV non è toccabile), citofono, allarme, calendario cartaceo.
- Cucina: frigo (colonna a incasso), dispensa (pensili), forno + induzione, lavello + lavastoviglie (scorte pastiglie, sale, brillantante), bidoni sotto il lavello (raccolta differenziata).
- Bagno: lavatrice, vasca (pulizia bagno).
- Camera: letto (lenzuola), armadio (biancheria).
- Studio: computer.
- Ripostiglio: asciugatrice, base del robot, armadio (scorte pulizia).
- Corridoio: quadro elettrico (futuro).
- Scala verso garage e cantina: esclusa per ora.
