// LinkedIn Injector

function extractLinkedInUrl(postContainer) {
  const urnRegex = /urn:li:activity:\d+/;

  // 0. Check the container itself first
  if (postContainer.hasAttribute('data-urn')) {
    const match = postContainer.getAttribute('data-urn').match(urnRegex);
    if (match) return `https://www.linkedin.com/feed/update/${match[0]}/`;
  }
  
  if (postContainer.hasAttribute('data-id')) {
    const match = postContainer.getAttribute('data-id').match(urnRegex);
    if (match) return `https://www.linkedin.com/feed/update/${match[0]}/`;
  }

  if (postContainer.hasAttribute('componentkey')) {
    const match = postContainer.getAttribute('componentkey').match(urnRegex);
    if (match) return `https://www.linkedin.com/feed/update/${match[0]}/`;
  }

  // 1. Try to extract from componentkey containing urn:li:activity (New Layout)
  const elementsWithKey = postContainer.querySelectorAll('[componentkey*="urn:li:activity:"]');
  if (elementsWithKey.length > 0) {
    const match = elementsWithKey[0].getAttribute('componentkey').match(urnRegex);
    if (match) return `https://www.linkedin.com/feed/update/${match[0]}/`;
  }

  // 2. Try to extract from traditional data-urn or data-id (Old Layout)
  const elementWithUrn = postContainer.querySelector('div[data-urn*="urn:li:activity:"], div[data-id*="urn:li:activity:"]');
  if (elementWithUrn) {
    const attr = elementWithUrn.getAttribute('data-urn') || elementWithUrn.getAttribute('data-id');
    const match = attr.match(urnRegex);
    if (match) return `https://www.linkedin.com/feed/update/${match[0]}/`;
  }

  // 3. Try standard post/activity links
  const postLinks = postContainer.querySelectorAll('a[href*="/posts/"], a[href*="/activity/"], a[href*="/update/"]');
  for (const link of postLinks) {
    if (link.href.includes('/activity/') || link.href.includes('/update/') || link.href.includes('/posts/')) {
       return link.href.split('?')[0];
    }
  }

  // 4. Fallback to the current page URL
  return window.location.href.split('?')[0];
}

function injectIntoLinkedIn() {
  // Find all "Comment" buttons which reliably identify the action bar of a post
  const commentButtons = document.querySelectorAll('button[aria-label="Comment" i], button[aria-label="Comment on this post" i], button[aria-label="Comment on this update" i]');
  
  commentButtons.forEach(button => {
    // Traverse up to find the action bar container. Usually it's the parent or grandparent that acts as a flex container.
    // A reliable way is to find the closest div that contains this button and other action buttons (Like, Share).
    const actionBar = button.closest('div.feed-shared-social-action-bar') || button.closest('.update-v2-social-activity') || button.parentElement;
    
    if (!actionBar || actionBar.dataset.cerebellumInjected === "true") return;

    // Traverse up more to find the main post container for URL extraction
    const postContainer = button.closest('.feed-shared-update-v2') || button.closest('div[data-urn]') || button.closest('div[data-id]') || button.closest('[componentkey]') || actionBar.parentElement.parentElement;

    const cerebellumBtn = document.createElement("button");
    cerebellumBtn.className = button.className; // Copy classes from the comment button to match styling
    
    // Create the icon (Save icon from Lucide or similar, matching LinkedIn's SVG style)
    cerebellumBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
      </svg>
      <span style="margin-left: 4px; font-weight: 600; font-size: 1.4rem; color: inherit;">Save</span>
    `;

    // Apply inline styles to match the action button exactly if it's icon-only layout
    cerebellumBtn.style.display = "flex";
    cerebellumBtn.style.alignItems = "center";
    cerebellumBtn.style.justifyContent = "center";
    cerebellumBtn.style.gap = "4px";
    cerebellumBtn.style.cursor = "pointer";
    cerebellumBtn.style.border = "none";
    cerebellumBtn.style.background = "transparent";
    cerebellumBtn.style.color = "rgba(0, 0, 0, 0.6)";
    cerebellumBtn.style.padding = "10px 8px";
    cerebellumBtn.style.borderRadius = "4px";
    cerebellumBtn.style.minHeight = "40px";

    cerebellumBtn.addEventListener("mouseenter", () => {
      cerebellumBtn.style.backgroundColor = "rgba(0, 0, 0, 0.08)";
      cerebellumBtn.style.color = "rgba(0, 0, 0, 0.9)";
    });
    cerebellumBtn.addEventListener("mouseleave", () => {
      cerebellumBtn.style.backgroundColor = "transparent";
      cerebellumBtn.style.color = "rgba(0, 0, 0, 0.6)";
    });

    // Dark mode support detection
    if (document.documentElement.classList.contains('theme--dark')) {
      cerebellumBtn.style.color = "rgba(255, 255, 255, 0.7)";
      cerebellumBtn.addEventListener("mouseenter", () => {
        cerebellumBtn.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
        cerebellumBtn.style.color = "rgba(255, 255, 255, 0.9)";
      });
      cerebellumBtn.addEventListener("mouseleave", () => {
        cerebellumBtn.style.backgroundColor = "transparent";
        cerebellumBtn.style.color = "rgba(255, 255, 255, 0.7)";
      });
    }

    cerebellumBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const linkUrl = extractLinkedInUrl(postContainer);
      console.log('Cerebellum: Saving LinkedIn URL', linkUrl);
      
      const titleElement = postContainer.querySelector('.update-components-actor__title') || postContainer.querySelector('span[dir="ltr"]');
      const author = titleElement ? titleElement.textContent.trim() : "LinkedIn Post";
      const title = `LinkedIn Post by ${author}`;

      chrome.runtime.sendMessage({
        action: "saveLink",
        linkData: {
          url: linkUrl,
          title: title,
          platform: "linkedin"
        }
      });
      
      // Visual feedback
      const originalHtml = cerebellumBtn.innerHTML;
      cerebellumBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span style="margin-left: 4px; font-weight: 600; font-size: 1.4rem; color: inherit;">Saved</span>
      `;
      setTimeout(() => {
        cerebellumBtn.innerHTML = originalHtml;
      }, 2000);
    });

    actionBar.appendChild(cerebellumBtn);
    actionBar.dataset.cerebellumInjected = "true";
  });
}

// Observe DOM changes
const linkedinObserver = new MutationObserver((mutations) => {
  let shouldInject = false;
  for (let m of mutations) {
    if (m.addedNodes.length > 0) {
      shouldInject = true;
      break;
    }
  }
  if (shouldInject) {
    injectIntoLinkedIn();
  }
});

linkedinObserver.observe(document.body, { childList: true, subtree: true });

setTimeout(injectIntoLinkedIn, 2000);
