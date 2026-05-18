// YouTube Injector

function extractYouTubeUrl() {
  // We only inject on watch pages, so the current URL without playlist/time params is fine,
  // or we can just keep the 'v' parameter.
  const url = new URL(window.location.href);
  const videoId = url.searchParams.get('v');
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  
  // Shorts fallback
  if (url.pathname.startsWith('/shorts/')) {
    return window.location.href.split('?')[0];
  }

  return window.location.href;
}

function injectIntoYouTube() {
  if (document.dataset.cerebellumInjected === window.location.href) return;

  // Find the action bar under the video player (Like, Dislike, Share, Download)
  // New YouTube UI: ytd-menu-renderer inside ytd-watch-metadata
  const menuRenderer = document.querySelector('ytd-watch-metadata ytd-menu-renderer #top-level-buttons-computed');
  
  // YouTube Shorts:
  const shortsActions = document.querySelector('ytd-reel-video-renderer[is-active] #actions');

  const actionBar = menuRenderer || shortsActions;

  if (!actionBar) return;

  const postUrl = extractYouTubeUrl();
  const cerebellumBtn = createCerebellumButton(postUrl, 'youtube');
  
  // Tweak YouTube specific styling
  cerebellumBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  cerebellumBtn.style.borderRadius = "18px";
  cerebellumBtn.style.padding = "0 16px";
  cerebellumBtn.style.height = "36px";
  cerebellumBtn.style.marginLeft = "8px";
  cerebellumBtn.style.fontWeight = "500";
  cerebellumBtn.style.fontSize = "14px";
  
  // Add a text label to match YouTube's style
  const textSpan = document.createElement("span");
  textSpan.textContent = "Save to Brain";
  textSpan.style.marginLeft = "6px";
  cerebellumBtn.appendChild(textSpan);

  // Hover effect
  cerebellumBtn.addEventListener("mouseenter", () => {
    cerebellumBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  });
  cerebellumBtn.addEventListener("mouseleave", () => {
    cerebellumBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  });

  actionBar.appendChild(cerebellumBtn);
  
  // We attach it to the document dataset with the current URL so we inject again if the user navigates without full reload (SPA)
  document.dataset.cerebellumInjected = window.location.href;
}

// Observe DOM changes to catch when the page fully loads or navigates via SPA
let lastUrl = window.location.href;
const ytObserver = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    // URL changed (SPA navigation), allow injection again
    document.dataset.cerebellumInjected = "";
  }
  
  // We only want to run on watch or shorts pages
  if (window.location.pathname.startsWith('/watch') || window.location.pathname.startsWith('/shorts')) {
    injectIntoYouTube();
  }
});

ytObserver.observe(document.body, { childList: true, subtree: true });

// Initial run
setTimeout(() => {
  if (window.location.pathname.startsWith('/watch') || window.location.pathname.startsWith('/shorts')) {
    injectIntoYouTube();
  }
}, 2000);
