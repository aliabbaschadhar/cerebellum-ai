// common-injector.js

function createCerebellumButton(postUrl, platform) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.padding = "8px";
  wrapper.style.cursor = "pointer";
  wrapper.className = "cerebellum-btn-wrapper";

  // Use currentColor but respect inherit if passed, otherwise default to a nice neutral
  const svgIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cerebellum-icon" style="transition: all 0.2s ease; width: 1.25em; height: 1.25em;">
      <path d="M12 2a4 4 0 0 1 4 4v2h2.5A2.5 2.5 0 0 1 21 10.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-8A2.5 2.5 0 0 1 5.5 8H8V6a4 4 0 0 1 4-4z"></path>
      <circle cx="12" cy="14" r="2"></circle>
      <path d="M12 16v2"></path>
    </svg>
  `;
  
  wrapper.innerHTML = svgIcon;

  wrapper.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const icon = wrapper.querySelector("svg");
    icon.style.stroke = "#10b981"; 
    icon.style.transform = "scale(1.1)";
    
    showToast(`Saving ${platform} post...`);

    chrome.runtime.sendMessage(
      {
        action: "saveLink",
        url: postUrl,
        title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Post`,
        favicon: `https://www.${platform === 'x' ? 'twitter' : platform}.com/favicon.ico`,
        platform: platform === 'x' ? 'twitter' : platform
      },
      (response) => {
        setTimeout(() => { icon.style.transform = "scale(1)"; }, 200);
        if (response && response.success) {
          showToast("Saved to Cerebellum!", "success");
        } else {
          icon.style.stroke = "#ef4444";
          showToast("Failed to save post.", "error");
        }
      }
    );
  });

  wrapper.addEventListener("mouseenter", () => {
    wrapper.style.opacity = "0.7";
  });
  wrapper.addEventListener("mouseleave", () => {
    wrapper.style.opacity = "1";
  });

  return wrapper;
}

function showToast(message, type = "info") {
  let toast = document.getElementById("cerebellum-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cerebellum-toast";
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.className = `cerebellum-toast show ${type}`;
  
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}
