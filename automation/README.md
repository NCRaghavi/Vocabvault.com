# Night Autopilot (Google Apps Script)

These files run inside the **Content Engine** Google Sheet (Extensions → Apps Script), not on the website.

- `NightAutopilot.gs`: the nightly engine. It drafts and checks words, writes the Mon–Sat exam lessons and Sunday's six quizzes, and commits everything into `src/content/` once a night. It also posts to Telegram, sends emails and delivers orders.
- `Seed.gs`: starter word lists. Run `seedWordLists()` once.

Keep this copy in sync with the one in Apps Script: after changing either, copy it to the other.
