chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-cerebellum",
    title: "Save this page to Cerebellum",
    contexts: ["page", "link"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-to-cerebellum") {
    const targetUrl = info.linkUrl || info.pageUrl || tab?.url;
    saveToCerebellum(targetUrl, tab?.title || "Saved Link", tab?.favIconUrl);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveLink") {
    const url = request.url || request.linkData?.url;
    const title = request.title || request.linkData?.title;
    const favicon = request.favicon || request.linkData?.favicon;
    const aiContext = request.aiContext || request.linkData?.aiContext;
    
    saveToCerebellum(url, title, favicon, aiContext).then(success => {
      sendResponse({ success });
    });
    return true; // Keep the message channel open for the async response
  }
});

async function saveToCerebellum(url, title, favicon, aiContext) {
  if (!url) return false;

  try {
    // Attempt to parse the URL to extract a platform/domain name
    let platform = "unknown";
    try {
      const parsedUrl = new URL(url);
      platform = parsedUrl.hostname.replace(/^www\./, "");
    } catch (e) {
      console.warn("Could not parse platform from URL:", url);
    }

    const payload = {
      url,
      title: title || "",
      platform,
      favicon: favicon || null,
      aiContext: aiContext || undefined,
    };

    console.log("Saving link to Cerebellum:", payload);

    const response = await fetch("http://localhost:3000/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return true;
    } else {
      console.error("Failed to save link:", await response.text());
      return false;
    }
  } catch (error) {
    console.error("Error saving link:", error);
    return false;
  }
}
