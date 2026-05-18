document.getElementById("save-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("status");
  const btn = document.getElementById("save-btn");
  
  btn.textContent = "Saving...";
  statusEl.textContent = "";
  statusEl.className = "";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error("Could not get current tab");

    chrome.runtime.sendMessage(
      { action: "saveLink", url: tab.url, title: tab.title, favicon: tab.favIconUrl },
      (response) => {
        if (chrome.runtime.lastError) {
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save to Cerebellum`;
          statusEl.textContent = "Error: Context invalidated.";
          statusEl.className = "error show";
          return;
        }
        if (response && response.success) {
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> Saved!`;
          statusEl.textContent = "Successfully saved.";
          statusEl.className = "success show";
          setTimeout(() => window.close(), 1500);
        } else {
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save to Cerebellum`;
          statusEl.textContent = "Failed. App running on localhost:3000?";
          statusEl.className = "error show";
        }
      }
    );
  } catch (error) {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save to Cerebellum`;
    statusEl.textContent = "Error: " + error.message;
    statusEl.className = "error show";
  }
});
