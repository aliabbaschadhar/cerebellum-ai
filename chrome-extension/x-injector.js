// X (Twitter) Injector

function extractXPostUrl(article) {
  // Twitter post URLs are usually wrapped around the time element
  const timeEl = article.querySelector('time');
  if (timeEl) {
    const linkEl = timeEl.closest('a');
    if (linkEl && linkEl.href) {
      return linkEl.href.split('?')[0]; // Remove analytics tracking params
    }
  }
  
  // Fallback to page URL if it's a detail view
  return window.location.href.split('?')[0];
}

function injectIntoXPosts() {
  const articles = document.querySelectorAll('article[data-testid="tweet"]');
  
  articles.forEach(article => {
    if (article.dataset.cerebellumInjected) return;

    // The action bar on Twitter is a role="group" that contains Reply, Repost, Like, Share
    const actionBar = article.querySelector('div[role="group"]');
    if (!actionBar) return;

    const postUrl = extractXPostUrl(article);
    const cerebellumBtn = createCerebellumButton(postUrl, 'x');
    
    // Tweak X specific styling to blend in
    cerebellumBtn.style.padding = "0px 12px";
    cerebellumBtn.style.color = "rgb(113, 118, 123)"; // Standard X icon color
    
    // Hover effect for X
    cerebellumBtn.addEventListener("mouseenter", () => {
      cerebellumBtn.style.color = "#10b981"; // Cerebellum green
      cerebellumBtn.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
      cerebellumBtn.style.borderRadius = "9999px";
    });
    cerebellumBtn.addEventListener("mouseleave", () => {
      cerebellumBtn.style.color = "rgb(113, 118, 123)";
      cerebellumBtn.style.backgroundColor = "transparent";
    });

    // Twitter has flex layout, we can just append it to the group
    actionBar.appendChild(cerebellumBtn);
    
    article.dataset.cerebellumInjected = "true";
  });
}

// Observe DOM changes to catch new posts as user scrolls
const xObserver = new MutationObserver((mutations) => {
  let shouldInject = false;
  for (let m of mutations) {
    if (m.addedNodes.length > 0) {
      shouldInject = true;
      break;
    }
  }
  if (shouldInject) {
    injectIntoXPosts();
  }
});

xObserver.observe(document.body, { childList: true, subtree: true });

// Initial run
setTimeout(injectIntoXPosts, 2000);
