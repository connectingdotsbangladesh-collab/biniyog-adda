/**
 * ==============================================================================
 * Orthalaap (অর্থালাপ) — Google Sheets Registration Backend (Google Apps Script)
 * ==============================================================================
 * Setup:
 * 1. Open Google Sheets (sheets.google.com) -> Create a new spreadsheet ("Orthalaap Registrations")
 * 2. Go to Extensions -> Apps Script
 * 3. Delete any existing code, paste this entire file, and Save (Ctrl+S)
 * 4. Click "Deploy" -> "New deployment"
 * 5. Type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 6. Click "Deploy", authorize permissions, and copy the "Web app URL" (ends in /exec)
 * ==============================================================================
 */

var SHEET_NAME = 'Registrations';
var ORGANIZER_PASSCODES = ['orthalaap2026', 'biniyog2026'];

var HEADERS = [
  'ID',
  'Created At',
  'Event ID',
  'Name',
  'Phone',
  'Occupation',
  'Area',
  'Email',
  'Payment Method',
  'Sender Phone',
  'Transaction ID',
  'Interest / Question',
  'Status',
  'Source',
  'Consent Version',
  'Status Updated At'
];

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Normalize BD mobile number digits (supports Bangla numerals too)
 */
function normalizePhone(raw) {
  if (!raw) return '';
  var bn = '০১২৩৪৫৬৭৮৯';
  var en = '0123456789';
  var out = '';
  var str = String(raw);
  for (var i = 0; i < str.length; i++) {
    var idx = bn.indexOf(str[i]);
    out += idx !== -1 ? en[idx] : str[i];
  }
  out = out.replace(/[^0-9+]/g, '');
  if (out.indexOf('+880') === 0) out = out.slice(3);
  else if (out.indexOf('880') === 0) out = out.slice(2);
  return out;
}

/**
 * POST Handler: Handles new registrations and organizer status updates
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    var payload = JSON.parse(e.postData.contents || '{}');

    // Action 1: Organizer status update
    if (payload.action === 'updateStatus') {
      var passcode = String(payload.passcode || '').trim().toLowerCase();
      if (ORGANIZER_PASSCODES.indexOf(passcode) === -1) {
        return jsonResponse({ success: false, error: 'Unauthorized passcode' });
      }
      var targetId = String(payload.id || '').trim();
      var newStatus = String(payload.status || '').trim();
      var allowed = ['interested', 'contacted', 'confirmed', 'cancelled'];
      if (!targetId || allowed.indexOf(newStatus) === -1) {
        return jsonResponse({ success: false, error: 'Invalid status payload' });
      }

      var sheet = getOrCreateSheet();
      var values = sheet.getDataRange().getValues();
      var updatedAt = new Date().toISOString();
      for (var r = 1; r < values.length; r++) {
        if (String(values[r][0]) === targetId) {
          sheet.getRange(r + 1, 13).setValue(newStatus);   // Status column (M)
          sheet.getRange(r + 1, 16).setValue(updatedAt);   // Status Updated At (P)
          return jsonResponse({ success: true, status: newStatus, status_updated_at: updatedAt });
        }
      }
      return jsonResponse({ success: false, error: 'Applicant ID not found' });
    }

    // Action 2: Public Registration Submission
    if (payload.honeypot && String(payload.honeypot).trim().length > 0) {
      return jsonResponse({ success: true, message: 'registered' });
    }
    if (payload.consentGiven !== true) {
      return jsonResponse({ success: false, error: 'সম্মতি প্রদান আবশ্যক।' });
    }

    var name = String(payload.name || '').trim();
    var phone = normalizePhone(payload.phoneNormalized || '');
    var occupation = String(payload.occupation || '').trim();
    var area = String(payload.area || '').trim();
    var email = String(payload.email || '').trim();
    var paymentMethod = String(payload.paymentMethod || '').trim();
    var senderPhone = normalizePhone(payload.paymentSenderPhone || '');
    var trxId = String(payload.transactionId || '').trim().toUpperCase();
    var interest = String(payload.interest || '').trim();
    var eventId = String(payload.eventId || 'orthalaap-2026-11-21').trim();
    var source = String(payload.source || 'direct').trim();

    if (name.length < 2 || !/^01[3-9][0-9]{8}$/.test(phone)) {
      return jsonResponse({ success: false, error: 'সঠিক নাম ও বাংলাদেশি মোবাইল নম্বর দিন।' });
    }

    var sheet = getOrCreateSheet();
    var rows = sheet.getDataRange().getValues();

    // Check duplicate by phone + TrxID (keep idempotent)
    for (var i = 1; i < rows.length; i++) {
      var existingPhone = String(rows[i][4] || '');
      var existingTrx = String(rows[i][10] || '').toUpperCase();
      if (existingPhone === phone && existingTrx === trxId && trxId !== '' && trxId !== 'MANUAL') {
        return jsonResponse({ success: true, message: 'registered', duplicate: true });
      }
    }

    var nowIso = new Date().toISOString();
    var id = 'app-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substring(2, 6);

    sheet.appendRow([
      id,
      nowIso,
      eventId,
      name,
      "'" + phone, // preserve leading zero in Sheets
      occupation,
      area,
      email,
      paymentMethod,
      senderPhone ? "'" + senderPhone : '',
      trxId,
      interest,
      'interested',
      source,
      'v2',
      ''
    ]);

    return jsonResponse({
      success: true,
      message: 'registered',
      id: id,
      created_at: nowIso
    });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET Handler: Protected by organizer passcode for Admin Dashboard sync
 */
function doGet(e) {
  try {
    var passcode = String((e && e.parameter && e.parameter.passcode) || '').trim().toLowerCase();
    if (ORGANIZER_PASSCODES.indexOf(passcode) === -1) {
      return jsonResponse({ success: false, error: 'Unauthorized' });
    }

    var sheet = getOrCreateSheet();
    var values = sheet.getDataRange().getValues();
    var records = [];

    for (var i = values.length - 1; i >= 1; i--) {
      var row = values[i];
      if (!row[0] && !row[3]) continue;
      records.push({
        id: String(row[0] || ('row-' + i)),
        created_at: row[1] ? new Date(row[1]).toISOString() : new Date().toISOString(),
        name: String(row[3] || ''),
        phone_normalized: String(row[4] || '').replace(/^'/, ''),
        occupation: String(row[5] || ''),
        area: String(row[6] || ''),
        email: row[7] ? String(row[7]) : null,
        payment_method: row[8] ? String(row[8]) : undefined,
        payment_sender_phone: row[9] ? String(row[9]).replace(/^'/, '') : undefined,
        transaction_id: row[10] ? String(row[10]) : undefined,
        interest: row[11] ? String(row[11]) : null,
        status: String(row[12] || 'interested'),
        source: String(row[13] || 'direct'),
        consent_version: String(row[14] || 'v2'),
        consented_at: row[1] ? new Date(row[1]).toISOString() : new Date().toISOString(),
        status_updated_at: row[15] ? String(row[15]) : null
      });
    }

    return jsonResponse({ success: true, data: records });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}
