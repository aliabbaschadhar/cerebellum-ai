# Plan

Build a Chrome extension to universally save links from any platform into the Cerebellum application.

## Scope
- In: 
  - Chrome extension boilerplate (Manifest V3).
  - Universal content script that injects a floating "Save to Cerebellum" button on **every platform**.
  - Right-click context menu and Extension Popup as universal fallbacks for every platform.
  - Background script that sends the extracted data directly to `http://localhost:3000/api/links` to add it into the database.
  - Open a new tab to the Cerebellum web app to allow the user to confirm, view, or add more details.
- Out:
  - Deep custom DOM parsing for every single website's unique feed (instead, we use a universal floating button and context menus that work everywhere).

## Action Items
- [x] Initialize Chrome extension structure (`chrome-extension/` folder with `manifest.json`, icons, background scripts).
- [x] Create `content.js` to inject a universal floating "Save to Cerebellum" button on every webpage.
- [x] Implement a right-click Context Menu ("Save this page to Cerebellum").
- [x] Implement click handler in the extension to extract the current page URL and title.
- [x] Implement background script logic to send a POST request with the extracted data to `http://localhost:3000/api/links` so it is added to the database.
- [x] Implement logic to automatically open a new tab to Cerebellum (`http://localhost:3000`) so the user can see the added link and add details.
- [ ] Verify the extension works locally by loading it unpacked in Chrome and testing on multiple platforms.
