// Reddit Injector

function extractRedditPostUrl(postElement) {
  // New UI uses shreddit-post
  if (postElement.tagName.toLowerCase() === 'shreddit-post') {
    const permalink = postElement.getAttribute('permalink');
    if (permalink) {
      return `https://www.reddit.com${permalink}`;
    }
  }
  
  // Fallback to finding a permalink
  const link = postElement.querySelector('a[data-click-id="body"], a.title');
  if (link && link.href) {
    return link.href.split('?')[0];
  }
  
  return window.location.href.split('?')[0];
}

function injectIntoRedditPosts() {
  // Select posts in new UI (shreddit-post) and old UI (.Post)
  const posts = document.querySelectorAll('shreddit-post, .Post');
  
  posts.forEach(post => {
    if (post.dataset.cerebellumInjected) return;

    let actionBar = null;

    if (post.tagName.toLowerCase() === 'shreddit-post') {
      // Find the row of buttons at the bottom. Usually it's in a div or something with a specific id/class.
      // Often there's a shreddit-share-button or similar.
      const shareBtn = post.querySelector('shreddit-share-button, button[aria-label*="Share"], button[aria-label*="share"]');
      if (shareBtn) {
        actionBar = shareBtn.parentElement;
      }
    } else {
      // Old UI
      const shareBtn = post.querySelector('button[data-click-id="share"]');
      if (shareBtn) {
        actionBar = shareBtn.parentElement;
      }
    }

    if (!actionBar) return;

    const postUrl = extractRedditPostUrl(post);
    const cerebellumBtn = createCerebellumButton(postUrl, 'reddit');
    
    // Tweak reddit specific styling if needed
    cerebellumBtn.style.padding = "4px 8px";
    cerebellumBtn.style.marginLeft = "8px";
    cerebellumBtn.style.borderRadius = "9999px"; // Reddit likes rounded pills

    actionBar.appendChild(cerebellumBtn);
    post.dataset.cerebellumInjected = "true";
  });
}

// Observe DOM changes to catch new posts as user scrolls
const redditObserver = new MutationObserver((mutations) => {
  let shouldInject = false;
  for (let m of mutations) {
    if (m.addedNodes.length > 0) {
      shouldInject = true;
      break;
    }
  }
  if (shouldInject) {
    injectIntoRedditPosts();
  }
});

redditObserver.observe(document.body, { childList: true, subtree: true });

// Initial run
setTimeout(injectIntoRedditPosts, 2000);
