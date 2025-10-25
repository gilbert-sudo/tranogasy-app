import { useState, useEffect } from "react";

/**
 * usePreventGoBack
 * @param {boolean} active - Whether to block the back button
 * @param {function} [customBackAction] - Optional custom function to run when unblocking
 */

export default function usePreventGoBack(active, customBackAction) {

  const [initiateHook, setInitiatelHook] = useState(false);

  useEffect(() => {
    console.log({ active });


    if (!active && !initiateHook) {
      setInitiatelHook(true);
      return;
    }

    if (!active && initiateHook) {
      window.history.back();
      return;
    };

    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, null, window.location.href);
      if (typeof customBackAction === "function") {
        console.log("Running custom back action");
        customBackAction(); // run custom back logic (e.g. close modal)
      }
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [active]);
}
