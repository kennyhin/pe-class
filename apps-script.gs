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
 *   Posts:  Name | Handle | Body | Time | Accent | Date | Sport | Link | Image
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
  if (pin !== ADMIN_POST_PIN) {
    return _json({ ok: false, error: 'Staff PIN required' });
  }

  var name = String(params.name || '').trim();
  var handle = String(params.handle || '').trim();
  var body = String(params.body || '').trim();
  var date = String(params.date || '').trim();
  var sport = String(params.sport || '').trim();
  var link = String(params.link || '').trim();
  var image = String(params.image || '').trim();
  var imageData = String(params.imageData || '').trim();
  var imageName = String(params.imageName || 'slam-update.jpg').trim();
  var imageType = String(params.imageType || 'image/jpeg').trim();

  if (!name || !body || body.length < 3) {
    return _json({ ok: false, error: 'Name and message are required' });
  }
  if (!date) date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  if (!handle) handle = '@slamES';

  var sheet = _ensurePostLikeSheet(ss, POSTS_SHEET_NAME, false);
  var rowNumber = _appendByHeaders(sheet, {
    Name: name,
    Handle: handle,
    Body: body,
    Date: date,
    Sport: sport,
    Link: link,
    Image: image
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
  return _rows(ss, POSTS_SHEET_NAME).map(function (row) {
    return {
      date: _dateKey(row.date || row.time),
      sport: String(row.sport || '').trim(),
      name: String(row.name || '').trim(),
      handle: String(row.handle || '').trim(),
      time: String(row.time || '').trim(),
      body: String(row.body || '').trim(),
      link: String(row.link || row.url || '').trim(),
      image: String(row.image || row.photo || '').trim()
    };
  }).filter(function (post) {
    return post.name && post.body;
  }).sort(function (a, b) {
    return String(b.date || '').localeCompare(String(a.date || ''));
  });
}

function _ensurePostsSheet(ss) {
  _ensurePostLikeSheet(ss, POSTS_SHEET_NAME, true);
}

function _ensurePostLikeSheet(ss, sheetName, addExample) {
  var headers = ['Name', 'Handle', 'Body', 'Time', 'Accent', 'Date', 'Sport', 'Link', 'Image'];
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    if (addExample) {
      sheet.appendRow([
        'SLAM! Athletics',
        '@slamES',
        'Summer camp registration opens Monday.',
        '',
        '',
        new Date(),
        'Basketball',
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
  sheet.appendRow(row);
  return sheet.getLastRow();
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

function _dateKey(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value || '').trim().slice(0, 10);
}
