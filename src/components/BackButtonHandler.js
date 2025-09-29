import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";

function BackButtonHandler() {
  useEffect(() => {
    const handler = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      const currentHash = window.location.hash; // e.g. "#/explore" or "#/tranogasyMap"

      // If user is already on a "root" page, don't go back further
      if (currentHash === "#/explore" || currentHash === "#/loader" || currentHash === "#/" || currentHash === "") {
        CapacitorApp.minimizeApp(); // minimize instead of going back
      } else {
        window.history.back(); // go back normally
      }
    });

    return () => {
      handler.remove();
    };
  }, []);

  return null;
}

export default BackButtonHandler;
