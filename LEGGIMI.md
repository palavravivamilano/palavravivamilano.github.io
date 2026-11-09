# Landing page · Corso di lingua italiana dal portoghese

Pagina di iscrizione per il corso presentato alla Palavra Viva Church Milano.
È un unico file (`index.html`) più le foto in `assets/`: niente da installare, si apre con un doppio clic.

## Cosa c'è

| File | A cosa serve |
|---|---|
| `index.html` | La pagina completa (grafica, testi IT/PT, modulo di iscrizione) |
| `assets/` | Foto Pexels (Copacabana, Duomo, bandiera, San Pietro) in tono seppia, logo Palavra Viva bianco su trasparente, `og-image.jpg` (anteprima quando si condivide il link su WhatsApp, dalla slide 1) |
| `google-apps-script.gs` | Il codice che salva le iscrizioni in un Foglio Google |

## 1. Collegare il Foglio Google (10 minuti, una volta sola)

Finché non lo colleghi, il modulo funziona in **modalità demo**: si può provare tutto, ma non invia niente.

1. Crea un nuovo Foglio Google (es. "Iscrizioni corso italiano").
2. Menu **Estensioni → Apps Script**. Cancella il codice presente e incolla tutto `google-apps-script.gs`.
3. (Facoltativo) in alto, in `NOTIFY_EMAIL`, scrivi l'email che deve ricevere un avviso a ogni iscrizione.
4. Salva, poi **Esegui il deployment → Nuovo deployment** → icona ingranaggio → **App web**:
   - *Esegui come*: **Me**
   - *Chi ha accesso*: **Chiunque**
5. Autorizza l'accesso quando Google lo chiede (è il tuo script, è normale).
6. Copia l'**URL dell'app web** (finisce con `/exec`) e incollalo in `index.html`, nella sezione `CONFIG`:
   ```js
   endpoint: "https://script.google.com/macros/s/……/exec",
   ```
7. Prova un'iscrizione: deve comparire una riga nel foglio "Iscrizioni", con la casella **Pagato?** da spuntare quando la persona paga.

> Se modifichi lo script, fai **Gestisci deployment → Modifica → Nuova versione**: l'URL resta lo stesso.

## 2. Personalizzare

Tutto si cambia nel blocco `CONFIG` all'inizio dello `<script>` in `index.html`:

- `whatsappNumber`: numero dell'organizzazione (es. `"393331234567"`). Attiva il link nel footer e il piano B "Invia su WhatsApp" se l'invio fallisce.
- `whatsappGroupLink`: link al gruppo del corso, mostrato dopo l'iscrizione.
- `churchLogo`: già impostato su `assets/logo-palavra-viva.png` (bianco su trasparente, ricavato da "Logo Escrito - Preto E Branco - 1.jpg"). Compare in alto ("… presenta") e nel footer. Se lo svuoti, al suo posto compare la scritta "Palavra Viva Church Milano".
- `startDate`, `schedule`, `location`: quando li compili compaiono nella sezione prezzi (testo unico oppure `{ it: "...", pt: "..." }`).
- `askAvailability`: metti `false` se giorno e orario sono già decisi (sparisce il passo "Quando ti sarebbe più comodo?").
- `priceFull`, `priceEarly`, `earlyBirdDeadline`: prezzi e scadenza. Dopo il 15 novembre la pagina passa da sola a €40 e nasconde il conto alla rovescia.

I testi sono nel blocco `I18N` (`it` e `pt`). La lingua si sceglie da sola in base al telefono, e si può cambiare con il pulsante IT/PT.

## 3. Pubblicare online (gratis)

**Netlify Drop** (il più semplice): vai su app.netlify.com/drop e trascina la cartella `landing-page`. In pochi secondi hai un indirizzo pubblico; puoi rinominarlo (es. `corso-italiano-palavraviva.netlify.app`) o collegare un dominio della chiesa.

Dopo la pubblicazione, in `index.html` sostituisci `assets/og-image.jpg` nel tag `og:image` con l'indirizzo completo (es. `https://corso-italiano-palavraviva.netlify.app/assets/og-image.jpg`), così l'anteprima su WhatsApp mostra la grafica del corso.

## Prima di condividere il link

- [ ] `endpoint` collegato e iscrizione di prova arrivata nel foglio
- [ ] `whatsappNumber` inserito
- [ ] Giorno, orario e luogo inseriti (o `askAvailability` lasciato a `true` se non sono ancora decisi)
- [ ] Testo privacy controllato da chi gestisce i dati per la chiesa
- [ ] Link aperto da un telefono e iscrizione di prova completata
