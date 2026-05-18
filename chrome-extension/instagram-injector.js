// Instagram Injector

function extractPostUrl(article) {
  // Try to find the time element which is usually wrapped in an 'a' tag linking to the post
  const timeEl = article.querySelector('time');
  if (timeEl) {
    const linkEl = timeEl.closest('a');
    if (linkEl && linkEl.href) {
      return linkEl.href.split('?')[0]; // Remove tracking params
    }
  }
  
  // Fallback: look for any link containing '/p/' or '/reel/' inside the article
  const links = Array.from(article.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]'));
  if (links.length > 0) {
    return links[0].href.split('?')[0];
  }
  
  // Ultimate fallback, the current page URL
  return window.location.href.split('?')[0];
}

function injectIntoArticles() {
  const articles = document.querySelectorAll('article');
  
  articles.forEach(article => {
    // Prevent double injection
    if (article.dataset.cerebellumInjected) return;

    // A highly robust way to find the action bar on Instagram is to look for the heart icon (Like button)
    // or the comment icon. They are always in the same row.
    // The action bar is typically the section containing these.
    
    // Look for any SVG with aria-label="Like", "Comment", "Share", "Save"
    const actionIcons = article.querySelectorAll('svg[aria-label="Like"], svg[aria-label="Unlike"], svg[aria-label="Comment"], svg[aria-label="Share"], svg[aria-label="Save"], svg[aria-label="Remove"]');
    
    if (actionIcons.length > 0) {
      // Go up from the icon to find the main action bar section
      let actionBar = actionIcons[0].closest('section');
      
      if (!actionBar) {
        // Fallback: go up a few levels from the button
        const iconBtn = actionIcons[0].closest('button') || actionIcons[0].closest('div[role="button"]');
        if (iconBtn) {
          actionBar = iconBtn.parentElement.parentElement;
        }
      }

      if (!actionBar) return;

      const postUrl = extractPostUrl(article);
      const cerebellumBtn = createCerebellumButton(postUrl, 'instagram');
      
      // Inject to the action bar. By default appending to the section puts it nicely inside.
      // We wrap it in a div if necessary or just append it.
      // Usually, there's a right-aligned div for the save button.
      // Let's just append it to the main section and use flex-end or absolute positioning if needed,
      // or just insert it into the first child which is usually the left button group.
      
      const leftButtonGroup = actionBar.firstElementChild;
      if (leftButtonGroup && leftButtonGroup.tagName === 'DIV') {
        leftButtonGroup.appendChild(cerebellumBtn);
      } else {
        actionBar.appendChild(cerebellumBtn);
      }
      
      article.dataset.cerebellumInjected = "true";
    }
  });
}

// Observe DOM changes to catch new posts as user scrolls
const observer = new MutationObserver((mutations) => {
  let shouldInject = false;
  for (let m of mutations) {
    if (m.addedNodes.length > 0) {
      shouldInject = true;
      break;
    }
  }
  if (shouldInject) {
    injectIntoArticles();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial run
setTimeout(injectIntoArticles, 2000);
