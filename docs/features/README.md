# Features — Index

One file per feature. Each file ends with an acceptance checklist. That checklist is the demo script.

| Feature | Status | Spec |
|---------|--------|------|
| [Report Submission](./report-submission.md) | ready | public form → ticket |
| [Ticket Check](./ticket-check.md) | ready | public status lookup |
| [Evidence Upload](./evidence-upload.md) | ready | local MVP → Supabase Storage |
| [Admin Auth](./admin-auth.md) | ready | single Guru BK session |
| [Admin Dashboard](./admin-dashboard.md) | ready | filter + update status/urgency |
| [Notifications](./notifications.md) | ready | admin badge+polling + Telegram push, student timeline |

Rule: API shapes live in `../specs/api.md`. Feature files describe behavior only.
