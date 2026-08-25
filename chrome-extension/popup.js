let currentTab = null;

document.addEventListener("DOMContentLoaded", async () => {
  const titleEl = document.getElementById("tab-title");
  const domainEl = document.getElementById("tab-domain");
  const faviconEl = document.getElementById("tab-favicon");
  const saveBtn = document.getElementById("save-btn");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      currentTab = tab;
      titleEl.textContent = tab.title || "Untitled Page";
      
      try {
        const urlObj = new URL(tab.url);
        domainEl.textContent = urlObj.hostname.replace(/^www\./, "");
      } catch (e) {
        domainEl.textContent = tab.url || "Page URL";
      }

      if (tab.favIconUrl && !tab.favIconUrl.startsWith("chrome://")) {
        faviconEl.src = tab.favIconUrl;
        faviconEl.style.display = "block";
      }
    }
  } catch (err) {
    console.error("Could not fetch active tab:", err);
    titleEl.textContent = "Could not detect active tab";
    domainEl.textContent = "Unknown";
  }

  saveBtn.addEventListener("click", handleSave);
});

async function handleSave() {
  const saveBtn = document.getElementById("save-btn");
  const btnText = document.getElementById("btn-text");
  const notesInput = document.getElementById("notes-input");
  const statusEl = document.getElementById("status");

  if (!currentTab || !currentTab.url) {
    showStatus("Error: No active tab to save", "error");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.classList.add("loading");
  btnText.textContent = "Saving to Cerebellum...";
  statusEl.className = "status-badge";

  try {
    const payload = {
      action: "saveLink",
      url: currentTab.url,
      title: currentTab.title || "",
      favicon: currentTab.favIconUrl || null,
      aiContext: notesInput.value.trim() || undefined
    };

    chrome.runtime.sendMessage(payload, (response) => {
      saveBtn.classList.remove("loading");

      if (chrome.runtime.lastError) {
        saveBtn.disabled = false;
        btnText.textContent = "Save to Cerebellum";
        showStatus("Extension context invalidated. Reload page.", "error");
        return;
      }

      if (response && response.success) {
        saveBtn.classList.add("success");
        btnText.textContent = "Saved to Cerebellum!";
        showStatus("✓ Successfully indexed into your second brain", "success");
        setTimeout(() => window.close(), 1300);
      } else {
        saveBtn.disabled = false;
        btnText.textContent = "Save to Cerebellum";
        showStatus("Failed to save. Ensure Cerebellum is running.", "error");
      }
    });
  } catch (error) {
    saveBtn.classList.remove("loading");
    saveBtn.disabled = false;
    btnText.textContent = "Save to Cerebellum";
    showStatus("Error: " + error.message, "error");
  }
}

function showStatus(text, type) {
  const statusEl = document.getElementById("status");
  statusEl.textContent = text;
  statusEl.className = `status-badge ${type} show`;
}
