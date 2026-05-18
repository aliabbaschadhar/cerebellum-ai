// GitHub Injector

function extractGitHubUrl() {
  // Usually we want to save the base repo URL
  const metaObj = document.querySelector('meta[property="og:url"]');
  if (metaObj) return metaObj.content;
  
  // Or just clean the current URL
  return window.location.href.split('?')[0];
}

function injectIntoGitHub() {
  if (document.dataset.cerebellumInjected === window.location.href) return;

  // The action bar on a GitHub repo page is ul.pagehead-actions
  const actionBar = document.querySelector('ul.pagehead-actions');
  if (!actionBar) return;

  const postUrl = extractGitHubUrl();
  const cerebellumBtn = createCerebellumButton(postUrl, 'github');
  
  // Create an li wrapper
  const li = document.createElement("li");
  li.className = "cerebellum-github-wrapper";
  
  // Tweak GitHub specific styling to match their buttons
  cerebellumBtn.style.padding = "3px 12px";
  cerebellumBtn.style.fontSize = "12px";
  cerebellumBtn.style.fontWeight = "500";
  cerebellumBtn.style.lineHeight = "20px";
  cerebellumBtn.style.color = "var(--fgColor-default, var(--color-fg-default))";
  cerebellumBtn.style.backgroundColor = "var(--button-default-bgColor-rest, var(--color-btn-bg))";
  cerebellumBtn.style.border = "1px solid var(--button-default-borderColor-rest, var(--color-btn-border))";
  cerebellumBtn.style.borderRadius = "6px";
  cerebellumBtn.style.boxShadow = "var(--button-default-shadow-resting, var(--color-btn-shadow)), var(--button-default-shadow-inset, var(--color-btn-inset-shadow))";
  cerebellumBtn.style.transition = "80ms cubic-bezier(0.33, 1, 0.68, 1)";
  cerebellumBtn.style.transitionProperty = "color,background-color,box-shadow,border-color";

  // Make the SVG smaller
  const svg = cerebellumBtn.querySelector('svg');
  if (svg) {
    svg.style.width = "16px";
    svg.style.height = "16px";
    svg.style.marginRight = "4px";
    svg.style.color = "var(--fgColor-muted, var(--color-fg-muted))";
  }

  // Add text label
  const textSpan = document.createElement("span");
  textSpan.textContent = "Save";
  cerebellumBtn.appendChild(textSpan);

  // Hover
  cerebellumBtn.addEventListener("mouseenter", () => {
    cerebellumBtn.style.backgroundColor = "var(--button-default-bgColor-hover, var(--color-btn-hover-bg))";
    cerebellumBtn.style.borderColor = "var(--button-default-borderColor-hover, var(--color-btn-hover-border))";
  });
  cerebellumBtn.addEventListener("mouseleave", () => {
    cerebellumBtn.style.backgroundColor = "var(--button-default-bgColor-rest, var(--color-btn-bg))";
    cerebellumBtn.style.borderColor = "var(--button-default-borderColor-rest, var(--color-btn-border))";
  });

  li.appendChild(cerebellumBtn);
  actionBar.insertBefore(li, actionBar.firstChild);
  
  document.dataset.cerebellumInjected = window.location.href;
}

// Observe DOM changes (for soft navigations)
let githubLastUrl = window.location.href;
const githubObserver = new MutationObserver(() => {
  if (window.location.href !== githubLastUrl) {
    githubLastUrl = window.location.href;
    document.dataset.cerebellumInjected = "";
  }
  injectIntoGitHub();
});

githubObserver.observe(document.body, { childList: true, subtree: true });

setTimeout(injectIntoGitHub, 1000);
