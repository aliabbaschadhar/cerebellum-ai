# Platform Specific Post Injection

## Goal
Inject a native-looking "Save to Cerebellum" button directly into individual posts (starting with Instagram) so users can save specific content from their feed without leaving the page.

## Tasks
- [x] Task 1: Update `manifest.json` → Verify: Content script runs on `https://*.instagram.com/*`.
- [x] Task 2: Create `instagram-injector.js` using `MutationObserver` to detect Instagram `<article>` posts in the feed → Verify: Console logs when a new post scrolls into view.
- [x] Task 3: Build a sleek, native-looking SVG button (matching Instagram's action bar style) and inject it into the post's action row → Verify: Button appears next to the Like/Comment/Share/Bookmark buttons on Instagram posts.
- [x] Task 4: Add click handler to extract the specific post's URL (usually from the timestamp link) and image/text → Verify: Clicking the button extracts the correct post URL, not just the generic feed URL.
- [x] Task 5: Send POST request to `http://localhost:3000/api/links` and show an elegant toast notification (improving UI) on success → Verify: Data saves to DB and a clean toast appears, no ugly alerts.

## Done When
- [x] Users scrolling Instagram see a seamless "Save" button on every post.
- [x] Clicking the button accurately grabs that specific post's URL and saves it to the database, confirming with a modern toast UI.
