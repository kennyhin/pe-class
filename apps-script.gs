/**
 * SLAM! Athletics — Newsletter Signup Endpoint
 * --------------------------------------------
 * Receives newsletter signups and serves site content from Google Sheet tabs.
 *
 * Deploy as a Web App (see SETUP.md). You'll get a URL ending in /exec — paste
 * that URL into the Tweaks panel on the landing page.
 *
 * Signups columns (created automatically on first run):
 *   Timestamp | Email | Source | User Agent
 *
 * Optional content tabs:
 *   Events: Date | Type | Title | Time
 *   Posts:  Name | Handle | Time | Body | Accent
 *   FAQ:    Question | Answer
 */

// ---- CONFIG ---------------------------------------------------------------
// Leave SHEET_ID empty to write to the spreadsheet this Apps Script is bound
// to (recommended — open your sheet → Extensions → Apps Script).
// Or paste a sheet ID here to write to a different sheet.
var SHEET_ID = '';
var SHEET_NAME = 'Signups';
var EVENTS_SHEET_NAME = 'Events';
var POSTS_SHEET_NAME = 'Posts';
var FAQ_SHEET_NAME = 'FAQ';
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    var ss = SHEET_ID
      ? SpreadsheetApp.openById(SHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

    if (!ss) {
      return _json({ ok: false, error: 'No spreadsheet bound. Open the sheet first, then Extensions → Apps Script.' });
    }

    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Email', 'Source', 'User Agent']);
      sheet.getRange('A1:D1').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var params = (e && e.parameter) || {};
    var email = String(params.email || '').trim().toLowerCase();
    var source = String(params.source || 'landing').trim();
    var ua = String(params.ua || '').trim();

    if (!email || email.indexOf('@') === -1) {
      return _json({ ok: false, error: 'Invalid email' });
    }

    // De-dupe: skip if already present (case-insensitive).
    var existing = sheet.getRange('B2:B' + Math.max(2, sheet.getLastRow()))
      .getValues()
      .flat()
      .map(function (v) { return String(v).trim().toLowerCase(); });

    if (existing.indexOf(email) !== -1) {
      return _json({ ok: true, duplicate: true });
    }

    sheet.appendRow([new Date(), email, source, ua]);
    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  if (String(params.action || '').toLowerCase() === 'all') {
    try {
      var ss = _spreadsheet();
      return _json({
        ok: true,
        events: _events(ss),
        posts: _posts(ss),
        faq: _faq(ss)
      });
    } catch (err) {
      return _json({ ok: false, error: String(err), events: [], posts: [], faq: [] });
    }
  }

  return ContentService
    .createTextOutput('SLAM! Athletics endpoint is live. POST email signups or GET ?action=all for site content.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function _spreadsheet() {
  var ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error('No spreadsheet bound. Open the sheet first, then Extensions → Apps Script.');
  }

  return ss;
}

function _events(ss) {
  return _rows(ss, EVENTS_SHEET_NAME).map(function (row) {
    return {
      date: _dateKey(row.date),
      type: String(row.type || 'event').trim(),
      title: String(row.title || '').trim(),
      time: String(row.time || '').trim()
    };
  }).filter(function (event) {
    return event.date && event.title;
  });
}

function _posts(ss) {
  return _rows(ss, POSTS_SHEET_NAME).map(function (row) {
    return {
      name: String(row.name || '').trim(),
      handle: String(row.handle || '').trim(),
      time: String(row.time || '').trim(),
      body: String(row.body || '').trim(),
      accent: String(row.accent || '').trim()
    };
  }).filter(function (post) {
    return post.name && post.body;
  });
}

function _faq(ss) {
  return _rows(ss, FAQ_SHEET_NAME).map(function (row) {
    return {
      q: String(row.question || row.q || '').trim(),
      a: String(row.answer || row.a || '').trim()
    };
  }).filter(function (item) {
    return item.q && item.a;
  });
}

function _rows(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var values = sheet.getDataRange().getValues();
  var headers = values.shift().map(function (header) {
    return String(header).trim().toLowerCase();
  });

  return values.map(function (valuesRow) {
    var row = {};
    headers.forEach(function (header, index) {
      row[header] = valuesRow[index];
    });
    return row;
  });
}

function _dateKey(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value || '').trim().slice(0, 10);
}
