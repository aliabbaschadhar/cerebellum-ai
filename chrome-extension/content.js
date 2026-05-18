// Create and inject the floating widget
function injectFloatingWidget() {
  if (document.getElementById("cerebellum-widget-container")) return;

  const container = document.createElement("div");
  container.id = "cerebellum-widget-container";
  
  // Create Icon Wrapper
  const iconWrapper = document.createElement("div");
  iconWrapper.className = "cerebellum-icon-wrapper";
  iconWrapper.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  `;

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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
    Save to Cerebrum
  `;

  // Link Input Group
  const linkGroup = document.createElement("div");
  linkGroup.className = "cerebellum-input-group";
  const linkLabel = document.createElement("label");
  linkLabel.innerText = "Link";
  const linkInput = document.createElement("input");
  linkInput.type = "text";
  linkInput.className = "cerebellum-input";
  linkInput.id = "cerebellum-link-input";
  linkInput.value = window.location.href;
  linkGroup.appendChild(linkLabel);
  linkGroup.appendChild(linkInput);

  // Description Input Group
  const descGroup = document.createElement("div");
  descGroup.className = "cerebellum-input-group";
  const descLabel = document.createElement("label");
  descLabel.innerText = "Description";
  const descInput = document.createElement("textarea");
  descInput.className = "cerebellum-input";
  descInput.id = "cerebellum-desc-input";
  descInput.placeholder = "Add a description (optional)";
  descGroup.appendChild(descLabel);
  descGroup.appendChild(descInput);

  // Submit Button
  const submitBtn = document.createElement("button");
  submitBtn.className = "cerebellum-btn";
  submitBtn.id = "cerebellum-submit-btn";
  submitBtn.innerHTML = `
    <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"></path>
      <path d="M12 5l7 7-7 7"></path>
    </svg>
    <span>Add to cerebrum</span>
  `;

  submitBtn.addEventListener("click", () => {
    submitBtn.classList.add("loading");
    submitBtn.querySelector("span").innerText = "Saving...";
    submitBtn.querySelector(".btn-icon").innerHTML = `<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>`; // Change icon temporarily or let css spin it
    
    // Attempt to extract favicon
    const faviconLink = document.querySelector("link[rel~='icon']");
    const faviconUrl = faviconLink ? faviconLink.href : "";

    const urlToSave = linkInput.value || window.location.href;
    const description = descInput.value || "";

    chrome.runtime.sendMessage(
      {
        action: "saveLink",
        url: urlToSave,
        title: document.title, // Title from page
        description: description,
        favicon: faviconUrl,
      },
      (response) => {
        submitBtn.classList.remove("loading");
        if (response && response.success) {
          submitBtn.classList.add("success");
          submitBtn.querySelector("span").innerText = "Saved!";
          submitBtn.querySelector(".btn-icon").innerHTML = `<polyline points="20 6 9 17 4 12"></polyline>`;
          
          setTimeout(() => {
            submitBtn.classList.remove("success");
            submitBtn.querySelector("span").innerText = "Add to cerebrum";
            submitBtn.querySelector(".btn-icon").innerHTML = `<path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path>`;
            descInput.value = ""; // Clear description
          }, 2000);
        } else {
          submitBtn.querySelector("span").innerText = "Add to cerebrum";
          submitBtn.querySelector(".btn-icon").innerHTML = `<path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path>`;
          alert("Failed to save to Cerebellum. Make sure the app is running on localhost:3000.");
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
}

// Inject the widget
injectFloatingWidget();
