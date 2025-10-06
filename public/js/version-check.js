const API_URL = "https://apis.tranogasy.mg/api/apps/latest/tranogasy"; 

async function clearAllCaches() {
  if ("caches" in window) {
    const names = await caches.keys();
    await Promise.all(names.map(name => caches.delete(name)));
  }
  localStorage.clear();
}

async function checkAppVersion() {
  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    const data = await response.json();
    const latestVersion = data.version;
    const storedVersion = localStorage.getItem("app_version");

    // First visit
    if (!storedVersion) {
      console.log("🆕 First visit — setting version:", latestVersion);
      localStorage.setItem("app_version", latestVersion);
      return;
    }

    // Version mismatch
    console.log("update chack", (storedVersion !== latestVersion));
    
    if (storedVersion !== latestVersion) {
      console.log(`🔁 Updating app: ${storedVersion} → ${latestVersion}`);
      const footer = document.getElementById("footer");
      if (footer) footer.innerHTML = "<small>Mise à jour de l’application...</small>";

      await clearAllCaches();

      // Store new version after reload
      sessionStorage.setItem("update_pending_version", latestVersion);
      window.location.reload(true);
    } else {
      console.log("✅ App version up-to-date:", latestVersion);
    }
  } catch (err) {
    console.warn("Version check failed:", err);
  }
}

// After reload — commit the new version
const pending = sessionStorage.getItem("update_pending_version");
if (pending) {
  localStorage.setItem("app_version", pending);
  sessionStorage.removeItem("update_pending_version");
  console.log("✅ Version updated in localStorage:", pending);
}

checkAppVersion();
