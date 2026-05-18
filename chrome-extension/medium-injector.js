// Medium Injector

function extractMediumUrl() {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) return canonical.href;
  return window.location.href.split('?')[0];
}

function injectIntoMedium() {
  if (document.dataset.cerebellumInjected === window.location.href) return;

  // Medium usually has top and bottom action bars containing claps, responses, save, listen.
  // We look for the "Save" or "Clap" button's container
  const actionBtns = document.querySelectorAll('button[aria-label*="Save"], button[aria-label*="Clap"], button[data-testid="saveButton"]');
  
  if (actionBtns.length === 0) return;

  let injected = false;

  actionBtns.forEach(btn => {
    // The parent is usually a flex container holding multiple actions
    const actionBar = btn.parentElement;
    if (!actionBar || actionBar.dataset.cerebellumInjected) return;

    const postUrl = extractMediumUrl();
    const cerebellumBtn = createCerebellumButton(postUrl, 'medium');
    
    // Tweak styling
    cerebellumBtn.style.padding = "4px";
    cerebellumBtn.style.margin = "0 8px";
    cerebellumBtn.style.color = "inherit"; 
    
    // SVG sizing
    const svg = cerebellumBtn.querySelector('svg');
    if (svg) {
      svg.style.width = "20px";
      svg.style.height = "20px";
      svg.style.opacity = "0.7";
    }

    // Hover
    cerebellumBtn.addEventListener("mouseenter", () => {
      if(svg) svg.style.opacity = "1";
    });
    cerebellumBtn.addEventListener("mouseleave", () => {
      if(svg) svg.style.opacity = "0.7";
    });

    actionBar.appendChild(cerebellumBtn);
    actionBar.dataset.cerebellumInjected = "true";
    injected = true;
  });

  if (injected) {
    document.dataset.cerebellumInjected = window.location.href;
  }
}

// Observe DOM changes
let mediumLastUrl = window.location.href;
const mediumObserver = new MutationObserver(() => {
  if (window.location.href !== mediumLastUrl) {
    mediumLastUrl = window.location.href;
    document.dataset.cerebellumInjected = "";
  }
  injectIntoMedium();
});

mediumObserver.observe(document.body, { childList: true, subtree: true });

setTimeout(injectIntoMedium, 2000);
