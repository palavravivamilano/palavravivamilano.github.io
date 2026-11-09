/**
 * Iscrizioni "Corso di lingua italiana dal portoghese" → Foglio Google
 *
 * Come si usa (dettagli in LEGGIMI.md):
 * 1. Crea un nuovo Foglio Google.
 * 2. Menu Estensioni → Apps Script, cancella il codice presente e incolla tutto questo file.
 * 3. (Facoltativo) scrivi in NOTIFY_EMAIL l'indirizzo che deve ricevere una mail a ogni iscrizione.
 * 4. Esegui → Nuovo deployment → tipo "App web"
 *      - Esegui come: Me
 *      - Chi ha accesso: Chiunque
 * 5. Copia l'URL che finisce con /exec e incollalo in index.html → CONFIG.endpoint
 */

const SHEET_NAME = 'Iscrizioni';
const NOTIFY_EMAIL = ''; // es. 'segreteria@palavraviva.it' — vuoto = nessuna email

const HEADERS = [
  'Data iscrizione', 'Nome e cognome', 'Livello dichiarato', 'WhatsApp', 'Email',
  'Disponibilità', 'Note', 'Quota (€)', 'Lingua pagina', 'Consenso privacy', 'Pagato?'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    // Campo-trappola anti-spam: le persone non lo vedono, i bot sì.
    if (data.website) return json_({ ok: true });

    if (!data.nome || !data.telefono) return json_({ ok: false, error: 'Dati mancanti' });

    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      clean_(data.nome),
      clean_(data.livello),
      clean_(data.telefono),
      clean_(data.email),
      clean_(data.disponibilita),
      clean_(data.note),
      Number(data.quota) || '',
      clean_(data.lingua),
      clean_(data.consenso),
      false
    ]);
    // casella di controllo nella colonna "Pagato?" per segnare i pagamenti a mano
    sheet.getRange(sheet.getLastRow(), HEADERS.length).insertCheckboxes();

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'Nuova iscrizione al corso di italiano: ' + clean_(data.nome),
        body: [
          'Nome: ' + data.nome,
          'Livello: ' + data.livello,
          'WhatsApp: ' + data.telefono,
          'Email: ' + (data.email || '—'),
          'Disponibilità: ' + (data.disponibilita || '—'),
          'Note: ' + (data.note || '—'),
          'Quota: €' + data.quota,
          '',
          'Foglio: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
        ].join('\n')
      });
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Apri l'URL /exec nel browser per verificare che il collegamento funzioni.
function doGet() {
  return json_({ ok: true, servizio: 'Iscrizioni corso di italiano' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#c7ae8b');
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(3, 260);
  }
  return sheet;
}

// Taglia i testi troppo lunghi ed evita che un valore venga interpretato come formula (es. "+39…", "=…").
function clean_(v) {
  const s = String(v == null ? '' : v).slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
