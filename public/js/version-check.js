const API_URL = "https://apis.tranogasy.mg/api/apps/latest/tranogasy";

async function deleteIndexHtmlFromCaches() {
  if (!("caches" in window)) return;

  const cacheNames = await caches.keys();

  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();

    for (const request of keys) {
      const url = new URL(request.url);

      if (
        url.pathname.endsWith("/index.html") ||
        url.pathname === "/" ||
        url.pathname === "/tranogasy/"
      ) {
        console.log("🗑️ Deleting cached:", url.href);
        await cache.delete(request);
      }
    }
  }
}

async function checkAppVersion() {
  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    const data = await response.json();
    const latestVersion = data.version;
    const storedVersion = localStorage.getItem("app_version");

    if (!storedVersion) {
      console.log("🆕 First visit — setting version:", latestVersion);
      localStorage.setItem("app_version", latestVersion);
      return;
    }

    if (storedVersion !== latestVersion) {
      console.log(`🔁 Updating app: ${storedVersion} → ${latestVersion}`);

      // Display message if you want
      const footer = document.getElementById("footer");
      if (footer) footer.innerHTML = "<small>Mise à jour de l’application...</small>";

      // Delete only index.html from cache
      await deleteIndexHtmlFromCaches();

      // Store new version temporarily
      sessionStorage.setItem("update_pending_version", latestVersion);

      // 🔥 Soft reload (no data loss)
      window.location.reload(); 
    } else {
      console.log("✅ App version up-to-date:", latestVersion);
    }
  } catch (err) {
    console.warn("Version check failed:", err);
  }
}

// Finalize update
const pending = sessionStorage.getItem("update_pending_version");
if (pending) {
  localStorage.setItem("app_version", pending);
  sessionStorage.removeItem("update_pending_version");
  console.log("✅ Version updated in localStorage:", pending);
}

checkAppVersion();
