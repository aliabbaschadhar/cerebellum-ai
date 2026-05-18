// TikTok Injector

function extractTikTokUrl(container) {
  // TikTok usually has an 'a' tag linking to the video
  const link = container.querySelector('a[href*="/video/"]');
  if (link && link.href) {
    return link.href.split('?')[0];
  }
  // Fallback for single video page
  if (window.location.pathname.includes('/video/')) {
    return window.location.href.split('?')[0];
  }
  return window.location.href;
}

function injectIntoTikTok() {
  // Find video containers or action bars
  // TikTok uses various data-e2e tags like recommend-list-item-container, or class names like action-right
  const actionContainers = document.querySelectorAll('div[class*="DivActionItemContainer"], div[class*="action-right"], div[data-e2e*="action-bar"]');
  
  actionContainers.forEach(actionBar => {
    // Traverse up to find the main container to avoid double injecting and to find URL
    const container = actionBar.closest('div[data-e2e="recommend-list-item-container"]') || actionBar.parentElement.parentElement;
    
    if (container && container.dataset.cerebellumInjected) return;

    const postUrl = extractTikTokUrl(container || document);
    const cerebellumBtn = createCerebellumButton(postUrl, 'tiktok');
    
    // Tweak TikTok specific styling
    cerebellumBtn.style.flexDirection = "column";
    cerebellumBtn.style.padding = "8px";
    cerebellumBtn.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
    cerebellumBtn.style.borderRadius = "50%";
    cerebellumBtn.style.width = "48px";
    cerebellumBtn.style.height = "48px";
    cerebellumBtn.style.marginTop = "16px";
    
    // TikTok hover
    cerebellumBtn.addEventListener("mouseenter", () => {
      cerebellumBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    });
    cerebellumBtn.addEventListener("mouseleave", () => {
      cerebellumBtn.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
    });

    actionBar.appendChild(cerebellumBtn);
    
    if (container) {
      container.dataset.cerebellumInjected = "true";
    }
  });
}

// Observe DOM changes
const tiktokObserver = new MutationObserver((mutations) => {
  let shouldInject = false;
  for (let m of mutations) {
    if (m.addedNodes.length > 0) {
      shouldInject = true;
      break;
    }
  }
  if (shouldInject) {
    injectIntoTikTok();
  }
});

tiktokObserver.observe(document.body, { childList: true, subtree: true });

setTimeout(injectIntoTikTok, 2000);
