var SHEET_ID = '';
var SEASON_SHEETS = {
  fall: 'Fall Tryouts',
  winter: 'Winter Tryouts',
  spring: 'Spring Tryouts'
};

var HEADERS = [
  'Timestamp',
  'Season',
  'Sport',
  'Division',
  'Grade',
  'Shirt Size',
  'Short Size',
  'Jersey #1',
  'Jersey #2',
  'Jersey #3',
  'Student Last Name',
  'Student First Name',
  'Email',
  'Waiver Agreed',
  'Signature',
  'User Agent'
];

function doPost(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = String(params.action || '').toLowerCase();
    if (action !== 'tryout') return _json({ ok: false, error: 'Unknown action' });

    var season = String(params.season || '').toLowerCase();
    var sheetName = SEASON_SHEETS[season];
    if (!sheetName) return _json({ ok: false, error: 'Invalid season' });

    var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('No spreadsheet bound.');
    var sheet = _ensureSheet(ss, sheetName);

    var email = String(params.email || '').trim().toLowerCase();
    var signature = String(params.signature || '').trim();
    if (!email || email.indexOf('@') === -1) return _json({ ok: false, error: 'Valid email required' });
    if (signature.length < 2) return _json({ ok: false, error: 'Signature required' });

    sheet.appendRow([
      new Date(),
      _title(season),
      String(params.sport || '').trim(),
      String(params.division || '').trim(),
      String(params.grade || '').trim(),
      String(params.shirtSize || '').trim(),
      String(params.shortSize || '').trim(),
      String(params.jersey1 || '').trim(),
      String(params.jersey2 || '').trim(),
      String(params.jersey3 || '').trim(),
      String(params.lastName || '').trim(),
      String(params.firstName || '').trim(),
      email,
      String(params.waiverAgreed || '') === 'yes' ? 'Yes' : 'No',
      signature,
      String(params.ua || '').trim()
    ]);

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService
    .createTextOutput('SLAM! Athletics tryouts endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function _ensureSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  var needsHeaders = sheet.getLastRow() < 1 || String(sheet.getRange(1, 1).getValue()).trim() !== 'Timestamp';
  if (needsHeaders) {
    sheet.clear();
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function _title(value) {
  return String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1).toLowerCase();
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
