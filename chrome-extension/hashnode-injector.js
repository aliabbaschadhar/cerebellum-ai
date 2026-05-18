// Hashnode Injector

function extractHashnodeUrl() {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) return canonical.href;
  return window.location.href.split('?')[0];
}

function injectIntoHashnode() {
  if (document.dataset.cerebellumInjected === window.location.href) return;

  // Hashnode usually has a sticky action bar on the left or bottom with buttons
  // Look for the Like button or the Bookmark button
  const actionBars = Array.from(document.querySelectorAll('div')).filter(div => {
    return div.querySelector('button[aria-label*="Like"], button[aria-label*="Bookmark"]');
  });

  if (actionBars.length === 0) return;
  
  // Pick the most likely action bar (usually a flex container with buttons)
  const actionBar = actionBars.find(bar => {
    const style = window.getComputedStyle(bar);
    return style.display === 'flex' && bar.children.length > 2;
  }) || actionBars[0];

  if (!actionBar) return;

  const postUrl = extractHashnodeUrl();
  const cerebellumBtn = createCerebellumButton(postUrl, 'hashnode');
  
  // Tweak styling
  cerebellumBtn.style.padding = "8px";
  cerebellumBtn.style.borderRadius = "50%";
  cerebellumBtn.style.color = "currentColor"; // Inherit
  
  const svg = cerebellumBtn.querySelector('svg');
  if (svg) {
    svg.style.width = "24px";
    svg.style.height = "24px";
  }

  // Hover
  cerebellumBtn.addEventListener("mouseenter", () => {
    cerebellumBtn.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  });
  cerebellumBtn.addEventListener("mouseleave", () => {
    cerebellumBtn.style.backgroundColor = "transparent";
  });

  // Check dark mode
  if (document.documentElement.classList.contains('dark')) {
    cerebellumBtn.addEventListener("mouseenter", () => {
      cerebellumBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    });
  }

  actionBar.appendChild(cerebellumBtn);
  
  document.dataset.cerebellumInjected = window.location.href;
}

// Observe DOM changes
let hashnodeLastUrl = window.location.href;
const hashnodeObserver = new MutationObserver(() => {
  if (window.location.href !== hashnodeLastUrl) {
    hashnodeLastUrl = window.location.href;
    document.dataset.cerebellumInjected = "";
  }
  injectIntoHashnode();
});

hashnodeObserver.observe(document.body, { childList: true, subtree: true });

setTimeout(injectIntoHashnode, 2000);
