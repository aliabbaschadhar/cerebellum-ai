// Create and inject the floating widget with warm Neumorphic styling
function injectFloatingWidget() {
  if (document.getElementById("cerebellum-widget-container")) return;

  const container = document.createElement("div");
  container.id = "cerebellum-widget-container";
  
  // Create Icon Tab Wrapper
  const iconWrapper = document.createElement("div");
  iconWrapper.className = "cerebellum-icon-wrapper";
  iconWrapper.title = "Save to Cerebellum AI";
  iconWrapper.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v2h2.5A2.5 2.5 0 0 1 21 10.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-8A2.5 2.5 0 0 1 5.5 8H8V6a4 4 0 0 1 4-4z"></path>
      <circle cx="12" cy="14" r="2"></circle>
      <path d="M12 16v2"></path>
    </svg>
  `;

  // Toggle open state on tab click
  iconWrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    container.classList.toggle("open");
    if (container.classList.contains("open")) {
      const descInput = document.getElementById("cerebellum-desc-input");
      if (descInput) descInput.focus();
    }
  });

  // Create Panel
  const panel = document.createElement("div");
  panel.className = "cerebellum-panel";

  // Panel Inner Content
  const panelInner = document.createElement("div");
  panelInner.className = "cerebellum-panel-inner";

  // Header
  const header = document.createElement("div");
  header.className = "cerebellum-header";
  header.innerHTML = `
    <div class="cerebellum-brand-wrapper">
      <div class="cerebellum-header-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a4 4 0 0 1 4 4v2h2.5A2.5 2.5 0 0 1 21 10.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-8A2.5 2.5 0 0 1 5.5 8H8V6a4 4 0 0 1 4-4z"></path>
          <circle cx="12" cy="14" r="2"></circle>
          <path d="M12 16v2"></path>
        </svg>
      </div>
      <div>
        <div class="cerebellum-title">Cerebellum AI</div>
        <div class="cerebellum-subtitle">Page Clipper</div>
      </div>
    </div>
    <button class="cerebellum-close-btn" id="cerebellum-close-panel" title="Close">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  // Link Input Group
  const linkGroup = document.createElement("div");
  linkGroup.className = "cerebellum-input-group";
  const linkLabel = document.createElement("label");
  linkLabel.innerText = "Target Link";
  const linkInput = document.createElement("input");
  linkInput.type = "text";
  linkInput.className = "cerebellum-input";
  linkInput.id = "cerebellum-link-input";
  linkInput.value = window.location.href;
  linkGroup.appendChild(linkLabel);
  linkGroup.appendChild(linkInput);

  // Description / Notes Input Group
  const descGroup = document.createElement("div");
  descGroup.className = "cerebellum-input-group";
  const descLabel = document.createElement("label");
  descLabel.innerText = "Notes / AI Context (Optional)";
  const descInput = document.createElement("textarea");
  descInput.className = "cerebellum-input";
  descInput.id = "cerebellum-desc-input";
  descInput.placeholder = "Add key points, tags, or context...";
  descGroup.appendChild(descLabel);
  descGroup.appendChild(descInput);

  // Submit Button
  const submitBtn = document.createElement("button");
  submitBtn.className = "cerebellum-btn";
  submitBtn.id = "cerebellum-submit-btn";
  submitBtn.innerHTML = `
    <svg class="cerebellum-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
    <svg class="cerebellum-btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
      <path d="M12 2a10 10 0 0 1 10 10"></path>
    </svg>
    <span class="cerebellum-btn-text">Save to Cerebellum</span>
  `;

  submitBtn.addEventListener("click", () => {
    submitBtn.classList.add("loading");
    submitBtn.querySelector(".cerebellum-btn-text").innerText = "Saving...";

    const faviconLink = document.querySelector("link[rel~='icon']");
    const faviconUrl = faviconLink ? faviconLink.href : "";
    const urlToSave = linkInput.value || window.location.href;
    const description = descInput.value.trim();

    chrome.runtime.sendMessage(
      {
        action: "saveLink",
        url: urlToSave,
        title: document.title || "Web Page",
        favicon: faviconUrl,
        aiContext: description || undefined,
      },
      (response) => {
        submitBtn.classList.remove("loading");
        if (response && response.success) {
          submitBtn.classList.add("success");
          submitBtn.querySelector(".cerebellum-btn-text").innerText = "Saved to Cerebellum!";
          
          setTimeout(() => {
            submitBtn.classList.remove("success");
            submitBtn.querySelector(".cerebellum-btn-text").innerText = "Save to Cerebellum";
            descInput.value = "";
            container.classList.remove("open");
          }, 1500);
        } else {
          submitBtn.querySelector(".cerebellum-btn-text").innerText = "Save to Cerebellum";
          alert("Failed to save to Cerebellum. Make sure the Cerebellum web app is running.");
        }
      }
    );
  });

  // Assemble panel
  panelInner.appendChild(header);
  panelInner.appendChild(linkGroup);
  panelInner.appendChild(descGroup);
  panelInner.appendChild(submitBtn);
  panel.appendChild(panelInner);

  // Assemble container
  container.appendChild(iconWrapper);
  container.appendChild(panel);

  document.body.appendChild(container);

  // Close button listener
  document.getElementById("cerebellum-close-panel").addEventListener("click", (e) => {
    e.stopPropagation();
    container.classList.remove("open");
  });

  // Escape key listener to close drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && container.classList.contains("open")) {
      container.classList.remove("open");
    }
  });
}

// Inject the widget
injectFloatingWidget();
