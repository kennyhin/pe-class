// ─────────────────────────────────────────────────────────────
// SLAM! Admin Dashboard — add these functions to your existing
// Apps Script, then add the 4 action lines inside your doGet().
// ─────────────────────────────────────────────────────────────
//
// STEP 1: In your existing doGet(e) function, add these lines
//         near the top (after you grab the 'action' param):
//
//   var action = (e && e.parameter && e.parameter.action) || '';
//   if (action === 'getPending') return _adminGetPending(e.parameter);
//   if (action === 'approve')    return _adminAct(e.parameter, 'approved');
//   if (action === 'reject')     return _adminAct(e.parameter, 'rejected');
//   if (action === 'dismiss')    return _adminAct(e.parameter, 'rejected');
//
// STEP 2: Paste the three functions below into the same script file.
// STEP 3: Deploy a NEW version (Deploy → Manage deployments → Edit → New version).
// ─────────────────────────────────────────────────────────────

function _adminVerify(token) {
  var hash = String(token || '').split('').reduce(function(t, c) {
    return (t * 31) + c.charCodeAt(0);
  }, 0);
  return hash === 1687348;
}

function _adminGetPending(params) {
  if (!_adminVerify(params.token)) return _json({ ok: false, error: 'Unauthorized' });

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = { ok: true, posts: [], questions: [] };

  // ── Pending posts ──
  var pSheet = ss.getSheetByName('Posts');
  if (pSheet && pSheet.getLastRow() > 1) {
    var pData = pSheet.getDataRange().getValues();
    var pH = pData[0];
    var pStat = pH.indexOf('Status');
    for (var i = 1; i < pData.length; i++) {
      var r = pData[i];
      var st = pStat >= 0 ? String(r[pStat]).toLowerCase().trim() : '';
      if (st === 'pending' || st === '') {
        var obj = { row: i + 1 };
        pH.forEach(function(h, j) {
          obj[h] = r[j] instanceof Date ? r[j].toISOString() : r[j];
        });
        result.posts.push(obj);
      }
    }
  }

  // ── Pending questions ──
  var qSheet = ss.getSheetByName('Questions');
  if (qSheet && qSheet.getLastRow() > 1) {
    var qData = qSheet.getDataRange().getValues();
    var qH = qData[0];
    var qStat = qH.indexOf('Status');
    for (var i = 1; i < qData.length; i++) {
      var qr = qData[i];
      var qst = qStat >= 0 ? String(qr[qStat]).toLowerCase().trim() : '';
      if (qst === 'pending' || qst === '') {
        var qobj = { row: i + 1 };
        qH.forEach(function(h, j) {
          qobj[h] = qr[j] instanceof Date ? qr[j].toISOString() : qr[j];
        });
        result.questions.push(qobj);
      }
    }
  }

  return _json(result);
}

function _adminAct(params, newStatus) {
  if (!_adminVerify(params.token)) return _json({ ok: false, error: 'Unauthorized' });

  var row = parseInt(params.row);
  var type = String(params.type || 'post').toLowerCase();
  if (!row || row < 2) return _json({ ok: false, error: 'Invalid row' });

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = type === 'question' ? 'Questions' : 'Posts';
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return _json({ ok: false, error: 'Sheet not found: ' + sheetName });

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var colIdx = headers.indexOf('Status');

  if (colIdx < 0) {
    // Add Status column if it doesn't exist yet
    colIdx = sheet.getLastColumn();
    sheet.getRange(1, colIdx + 1).setValue('Status');
  }

  sheet.getRange(row, colIdx + 1).setValue(newStatus);
  return _json({ ok: true });
}
