# Add Link Details

## Goal
Add an optional "additional details" field to the add link form that gets stored in the database, with a note encouraging users to provide context to help the AI search it later.

## Tasks
- [x] Task 1: Update Prisma schema → Verify: `Link` model has an optional `aiContext` string field, run `npx prisma db push`
- [x] Task 2: Update `AddLinkForm.tsx` UI → Verify: Form includes an optional text area/input for "additional details" and a helper text mentioning it helps AI search
- [x] Task 3: Update `/api/links` endpoint → Verify: API accepts `aiContext` field and saves it to the database
- [x] Task 4: Update `page.tsx` or types if necessary → Verify: Frontend types match the updated Prisma schema

## Done When
- [x] Users can submit a link with optional context, and both URL and context are saved to the database.
