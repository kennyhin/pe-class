# SLAM! Landing — Email Signup Setup

The landing page collects emails and ships them to a Google Sheet you control,
via a tiny Google Apps Script "middleman." 10-minute setup, no ongoing cost.

## 1. Create the sheet

1. Go to <https://sheets.new> (creates a fresh Google Sheet).
2. Rename it (e.g. **SLAM! Newsletter Signups**).

## 2. Add the Apps Script

1. In that sheet, click **Extensions → Apps Script**.
2. Delete the default `function myFunction()` placeholder.
3. Open `apps-script.gs` from this project, copy the **entire contents**, paste into the Apps Script editor.
4. Click the 💾 **Save** icon (or ⌘S / Ctrl+S). Name the project anything (e.g. "SLAM Signups").

## 3. Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** `SLAM signup v1`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` *(this is required — it lets the form post to it; it does not make your sheet public)*
4. Click **Deploy**.
5. Google will ask you to **authorize** the script. Approve.
   *(If it warns "Google hasn't verified this app" → click Advanced → Go to … (unsafe) — this is normal for your own scripts.)*
6. Copy the **Web app URL** that appears. It ends in `…/exec`.

## 4. Paste the URL into the landing page

1. Open `Landing Page.html` in the preview.
2. Click the **Tweaks** toggle in the toolbar.
3. Paste your Apps Script URL into the **Signup endpoint** field.
4. Submit a test email through the form. Check the sheet — a new row appears.

## What you'll see in the sheet

| Timestamp | Email | Source | User Agent |
|---|---|---|---|
| 2026-05-23 14:22 | parent@example.com | landing | Chrome / macOS |

Duplicates are skipped automatically.

## Optional: website content tabs

The landing page can also read public-facing content from the same Apps Script
endpoint. Add these tabs to the Google Sheet:

**Events**

| Date | Type | Sport | Title | Time | Location | Opponent | Notes |
|---|---|---|---|---|---|---|---|
| 2026-05-27 | practice | Basketball | Basketball · Grades 3-5 | 5:30 PM | Gym B |  | Bring water |
| 2026-05-30 | game | Soccer | SLAM vs. Pinecrest Cadence | 9:00 AM | East Field | Pinecrest Cadence |  |

Use `Type` for what kind of schedule item it is:

| Type |
|---|
| event |
| practice |
| game |

Use `Sport` for the sport category. The Apps Script adds a dropdown for:

| Sport |
|---|
| Basketball |
| Soccer |
| Track and Field |
| Cross Country |
| Cheer |
| Volleyball |
| Flag Football |
| Baseball |
| Softball |
| Tennis |
| Other |

The website reads `Sport` directly for the Games filter. If `Sport` is blank,
it will still try to infer the sport from the title, but the cleanest setup is
to fill in both `Type` and `Sport` on every Events row.

**Posts**

| Date | Sport | Name | Handle | Body | Link |
|---|---|---|---|---|---|
| 2026-05-24 | Basketball | Coach Marcus | @coachmarc | Practice moved indoors tonight. Gym B, same time. |  |
| 2026-05-23 | Soccer | SLAM! Athletics | @slamES | Spring league finals this Saturday. Schedule: https://example.com/schedule | https://example.com/signup |

Posts are sorted newest-first by the `Date` column, no matter where they sit in
the sheet. The `Sport` column controls the icon. Paste a full URL into `Body`
to make it clickable inside the post, or put one clean URL in `Link` to show a
separate call-to-action link.

**FAQ**

| Question | Answer | Keywords | Link |
|---|---|---|---|
| When does soccer season start? | Soccer season starts in September. | soccer, season, start, fall | https://example.com/soccer |

The page only shows the first 3 FAQ rows in the Q&A accordion, but the
question form searches every FAQ row for possible answers. It checks the
`Keywords` column first, then falls back to `Question` and `Answer` text only
when no keyword match exists. Add comma-separated keywords to control what gets
suggested.

Parent questions submitted from the website are saved automatically in a
**Questions** tab:

| Timestamp | Name | Email | Question | User Agent |
|---|---|---|---|---|

After editing `apps-script.gs`, deploy a new Apps Script version so the website
uses the updated content endpoint.

## Sending the newsletter

Once you have a list, you have options:
- **Mailchimp / Buttondown / Beehiiv** — paste the email column in as a CSV import.
- **Gmail mail merge** (extension: *Yet Another Mail Merge*) — works directly off the sheet.
- **Direct from Apps Script** — let me know if you want a "send newsletter" script too.

## Troubleshooting

- **Form says "Saved locally"?** The endpoint URL is missing or wrong — paste it in Tweaks.
- **No row appearing in the sheet?** Re-deploy: in Apps Script → Deploy → Manage deployments → ✏️ edit → New version → Deploy. Apps Script caches old versions.
- **CORS errors in console?** Expected and harmless — the request still goes through (`mode: 'no-cors'`). The page assumes success after a successful POST.
- **Want to test the endpoint by hand?** Open the `…/exec` URL in a browser. You should see: *"SLAM! Athletics signup endpoint is live. POST email here."*
