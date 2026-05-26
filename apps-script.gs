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
 *   Events: Date | Type | Sport | Title | Time | Location | Opponent | Notes
 *   Posts:  Timestamp | Approved | Name | Handle | Body | Time | Accent | Date | Sport | Link | Image | Grade | Submitter
 *   FAQ:    Question | Answer | Keywords | Link
 *
 * Questions columns (created automatically on first parent question):
 *   Timestamp | Name | Email | Question | User Agent
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
var QUESTIONS_SHEET_NAME = 'Questions';
var ADMIN_POST_PIN = '7171';
var EVENT_TYPES = ['event', 'practice', 'game'];
var SPORTS = [
  'Basketball',
  'Soccer',
  'Track and Field',
  'Cross Country',
  'Cheer',
  'Volleyball',
  'Flag Football',
  'Baseball',
  'Softball',
  'Tennis',
  'Other'
];
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    var ss = _spreadsheet();
    var params = (e && e.parameter) || {};
    var action = String(params.action || '').trim().toLowerCase();

    if (action === 'question') {
      return _saveQuestion(ss, params);
    }
    if (action === 'post') {
      return _savePost(ss, params);
    }

    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Email', 'Source', 'User Agent']);
      sheet.getRange('A1:D1').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

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

function _saveQuestion(ss, params) {
  var question = String(params.question || '').trim();
  var name = String(params.name || '').trim();
  var email = String(params.email || '').trim().toLowerCase();
  var ua = String(params.ua || '').trim();

  if (question.length < 8) {
    return _json({ ok: false, error: 'Question is too short' });
  }

  var sheet = ss.getSheetByName(QUESTIONS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(QUESTIONS_SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Question', 'User Agent']);
    sheet.getRange('A1:E1').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([new Date(), name, email, question, ua]);
  return _json({ ok: true });
}

function _savePost(ss, params) {
  var pin = String(params.pin || '').trim();
  var submitter = String(params.submitter || params.name || '').trim();
  var needsPin = ['admin', 'teacher', 'coach'].indexOf(submitter.toLowerCase()) !== -1;
  if (needsPin && pin !== ADMIN_POST_PIN) {
    return _json({ ok: false, error: 'Staff PIN required' });
  }

  var name = String(params.name || '').trim();
  var handle = String(params.handle || '').trim();
  var body = String(params.body || '').trim();
  var timestamp = new Date();
  var date = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var sport = String(params.sport || '').trim();
  var link = String(params.link || '').trim();
  var image = String(params.image || '').trim();
  var grade = String(params.grade || '').trim();
  var imageData = String(params.imageData || '').trim();
  var imageName = String(params.imageName || 'slam-update.jpg').trim();
  var imageType = String(params.imageType || 'image/jpeg').trim();

  if (!name || !body || body.length < 3) {
    return _json({ ok: false, error: 'Name and message are required' });
  }
  if (!handle) handle = '@slamES';

  var sheet = _ensurePostLikeSheet(ss, POSTS_SHEET_NAME, false);
  var rowNumber = _appendByHeaders(sheet, {
    Timestamp: timestamp,
    Approved: needsPin,
    Name: name,
    Handle: handle,
    Body: body,
    Time: timestamp,
    Date: date,
    Sport: sport,
    Link: link,
    Image: image,
    Grade: grade,
    Submitter: submitter
  });
  if (imageData) {
    try {
      image = _savePostImage(imageData, imageName, imageType);
      _setByHeader(sheet, rowNumber, 'Image', image);
    } catch (imageErr) {
      _setByHeader(sheet, rowNumber, 'Image', 'Image upload failed: ' + String(imageErr).slice(0, 160));
    }
  }
  return _json({ ok: true });
}

function _savePostImage(imageData, imageName, imageType) {
  var base64 = imageData.indexOf(',') === -1 ? imageData : imageData.split(',').pop();
  var bytes = Utilities.base64Decode(base64);
  var safeName = String(imageName || 'slam-update.jpg').replace(/[^\w.\-]+/g, '-');
  var file = DriveApp.createFile(Utilities.newBlob(bytes, imageType || 'image/jpeg', 'slam-update-' + Date.now() + '-' + safeName));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return 'https://drive.google.com/uc?export=view&id=' + file.getId();
}

// Run this once from the Apps Script editor after pasting new code if Google
// has not prompted for Drive permission yet. It forces the Drive authorization
// screen, then deletes the temporary file.
function authorizeDrive() {
  var file = DriveApp.createFile('slam-drive-auth-test.txt', 'SLAM photo upload permission test');
  file.setTrashed(true);
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  if (String(params.action || '').toLowerCase() === 'debug') {
    try {
      var debugSs = _spreadsheet();
      return _json({
        ok: true,
        spreadsheetName: debugSs.getName(),
        spreadsheetId: debugSs.getId(),
        spreadsheetUrl: debugSs.getUrl(),
        postsSheetName: POSTS_SHEET_NAME,
        postsRows: debugSs.getSheetByName(POSTS_SHEET_NAME)
          ? Math.max(0, debugSs.getSheetByName(POSTS_SHEET_NAME).getLastRow() - 1)
          : 0
      });
    } catch (debugErr) {
      return _json({ ok: false, error: String(debugErr) });
    }
  }

  if (String(params.action || '').toLowerCase() === 'verifypin') {
    var callback = String(params.callback || '').replace(/[^\w.$]/g, '');
    var payload = { ok: String(params.pin || '').trim() === ADMIN_POST_PIN };
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(payload) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return _json(payload);
  }

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
  _ensureEventsSheet(ss);
  return _rows(ss, EVENTS_SHEET_NAME).map(function (row) {
    var time = String(row.time || '').trim();
    var location = String(row.location || '').trim();
    return {
      date: _dateKey(row.date),
      type: String(row.type || 'event').trim(),
      sport: String(row.sport || '').trim(),
      title: String(row.title || '').trim(),
      time: location && time.indexOf(location) === -1 ? time + ' · ' + location : time,
      location: location,
      opponent: String(row.opponent || '').trim(),
      notes: String(row.notes || '').trim()
    };
  }).filter(function (event) {
    return event.date && event.title;
  });
}

function _ensureEventsSheet(ss) {
  var headers = ['Date', 'Type', 'Sport', 'Title', 'Time', 'Location', 'Opponent', 'Notes'];
  var sheet = ss.getSheetByName(EVENTS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(EVENTS_SHEET_NAME);
    sheet.appendRow(headers);
    sheet.appendRow([
      new Date(),
      'practice',
      'Basketball',
      'Basketball Skills Practice',
      '5:30 PM',
      'Gym B',
      '',
      'Example row - edit or delete'
    ]);
  }

  _ensureHeaders(sheet, headers);
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
  sheet.setFrozenRows(1);

  var typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(EVENT_TYPES, true)
    .setAllowInvalid(false)
    .build();
  var sportRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(SPORTS, true)
    .setAllowInvalid(false)
    .build();

  var typeColumn = _headerColumn(sheet, 'Type');
  var sportColumn = _headerColumn(sheet, 'Sport');
  if (typeColumn) sheet.getRange(2, typeColumn, Math.max(200, sheet.getMaxRows() - 1), 1).setDataValidation(typeRule);
  if (sportColumn) sheet.getRange(2, sportColumn, Math.max(200, sheet.getMaxRows() - 1), 1).setDataValidation(sportRule);
}

function _posts(ss) {
  _ensurePostsSheet(ss);
  return _rows(ss, POSTS_SHEET_NAME).filter(function (row) {
    var submitter = String(row.submitter || '').trim().toLowerCase();
    if (!submitter) return true;
    return _truthy(row.approved);
  }).map(function (row) {
    var timestamp = row.timestamp || row.time || row.date;
    return {
      date: _dateKey(row.date || row.time),
      timestamp: _timestampValue(timestamp),
      sport: String(row.sport || '').trim(),
      name: String(row.name || '').trim(),
      handle: String(row.handle || '').trim(),
      time: String(row.time || '').trim(),
      body: String(row.body || '').trim(),
      link: String(row.link || row.url || '').trim(),
      image: String(row.image || row.photo || '').trim(),
      grade: String(row.grade || '').trim(),
      submitter: String(row.submitter || '').trim()
    };
  }).filter(function (post) {
    return post.name && post.body;
  }).sort(function (a, b) {
    return String(b.timestamp || b.date || '').localeCompare(String(a.timestamp || a.date || ''));
  });
}

function _ensurePostsSheet(ss) {
  _ensurePostLikeSheet(ss, POSTS_SHEET_NAME, true);
}

function _ensurePostLikeSheet(ss, sheetName, addExample) {
  var headers = ['Timestamp', 'Approved', 'Name', 'Handle', 'Body', 'Time', 'Accent', 'Date', 'Sport', 'Link', 'Image', 'Grade', 'Submitter'];
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    if (addExample) {
      sheet.appendRow([
        new Date(),
        true,
        'SLAM! Athletics',
        '@slamES',
        'Summer camp registration opens Monday.',
        '',
        '',
        new Date(),
        'Basketball',
        '',
        '',
        '',
        ''
      ]);
    }
  }

  _ensureHeaders(sheet, headers);
  sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
  sheet.setFrozenRows(1);

  var sportRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(SPORTS, true)
    .setAllowInvalid(false)
    .build();
  var sportColumn = _headerColumn(sheet, 'Sport');
  if (sportColumn) sheet.getRange(2, sportColumn, Math.max(200, sheet.getMaxRows() - 1), 1).setDataValidation(sportRule);
  var approvedColumn = _headerColumn(sheet, 'Approved');
  if (approvedColumn) {
    var checkboxRule = SpreadsheetApp.newDataValidation()
      .requireCheckbox()
      .build();
    sheet.getRange(2, approvedColumn, Math.max(200, sheet.getMaxRows() - 1), 1).setDataValidation(checkboxRule);
  }
  return sheet;
}

function _faq(ss) {
  _ensureFaqSheet(ss);
  return _rows(ss, FAQ_SHEET_NAME).map(function (row) {
    return {
      q: String(row.question || row.q || '').trim(),
      a: String(row.answer || row.a || '').trim(),
      keywords: String(row.keywords || '').trim(),
      link: String(row.link || row.url || '').trim()
    };
  }).filter(function (item) {
    return item.q && item.a;
  });
}

function _ensureFaqSheet(ss) {
  var sheet = ss.getSheetByName(FAQ_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(FAQ_SHEET_NAME);
    sheet.appendRow(['Question', 'Answer', 'Keywords', 'Link']);
    sheet.getRange('A1:D1').setFontWeight('bold');
    sheet.setFrozenRows(1);
    return;
  }

  var lastColumn = Math.max(1, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function (header) {
    return String(header).trim().toLowerCase();
  });

  if (headers.indexOf('keywords') === -1) {
    sheet.getRange(1, lastColumn + 1).setValue('Keywords');
    sheet.getRange(1, 1, 1, lastColumn + 1).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  if (headers.indexOf('link') === -1) {
    sheet.getRange(1, sheet.getLastColumn() + 1).setValue('Link');
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function _ensureHeaders(sheet, headers) {
  var lastColumn = Math.max(1, sheet.getLastColumn());
  var existing = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function (header) {
    return String(header).trim().toLowerCase();
  });

  headers.forEach(function (header) {
    if (existing.indexOf(header.toLowerCase()) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
      existing.push(header.toLowerCase());
    }
  });
}

function _headerColumn(sheet, headerName) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var needle = String(headerName).trim().toLowerCase();
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim().toLowerCase() === needle) return i + 1;
  }
  return 0;
}

function _appendByHeaders(sheet, valuesByHeader) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = headers.map(function (header) {
    var key = String(header).trim().toLowerCase();
    var match = Object.keys(valuesByHeader).filter(function (name) {
      return name.toLowerCase() === key;
    })[0];
    return match ? valuesByHeader[match] : '';
  });
  var rowNumber = _lastMeaningfulRow(sheet) + 1;
  if (rowNumber > sheet.getMaxRows()) {
    sheet.insertRowsAfter(sheet.getMaxRows(), rowNumber - sheet.getMaxRows());
  }
  var approvedColumn = _headerColumn(sheet, 'Approved');
  if (approvedColumn) sheet.getRange(rowNumber, approvedColumn).insertCheckboxes();
  sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
  return rowNumber;
}

function _setByHeader(sheet, rowNumber, headerName, value) {
  var column = _headerColumn(sheet, headerName);
  if (column) sheet.getRange(rowNumber, column).setValue(value);
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

function _lastMeaningfulRow(sheet) {
  var lastRow = Math.max(1, sheet.getLastRow());
  var lastColumn = sheet.getLastColumn();
  if (lastRow < 2) return 1;
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function (header) {
    return String(header).trim().toLowerCase();
  });
  var ignore = { approved: true, accent: true };
  var values = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  for (var r = values.length - 1; r >= 0; r--) {
    for (var c = 0; c < lastColumn; c++) {
      if (ignore[headers[c]]) continue;
      if (String(values[r][c] || '').trim() !== '') return r + 2;
    }
  }
  return 1;
}

function compactPostsSheet() {
  var ss = _spreadsheet();
  var sheet = _ensurePostLikeSheet(ss, POSTS_SHEET_NAME, false);
  var lastColumn = sheet.getLastColumn();
  var header = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var rows = sheet.getDataRange().getValues().slice(1).filter(function (row) {
    return row.some(function (value, index) {
      var key = String(header[index] || '').trim().toLowerCase();
      if (key === 'approved' || key === 'accent') return false;
      return String(value || '').trim() !== '';
    });
  });
  sheet.clearContents();
  sheet.getRange(1, 1, 1, lastColumn).setValues([header]);
  if (rows.length) sheet.getRange(2, 1, rows.length, lastColumn).setValues(rows);
  _ensurePostLikeSheet(ss, POSTS_SHEET_NAME, false);
}

function _dateKey(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value || '').trim().slice(0, 10);
}

function _timestampValue(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return value.toISOString();
  }
  return String(value || '').trim();
}

function _truthy(value) {
  return value === true
    || String(value).toLowerCase() === 'true'
    || String(value).toLowerCase() === 'yes'
    || String(value).toLowerCase() === 'approved';
}
