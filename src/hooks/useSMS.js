import axios from "axios";

export const useSMS = () => {
  // --- 1️⃣ BEFIANA Provider ---
  const sendBefianaSMS = async (phone_number, message) => {
    // Normalize phone number (remove leading 0)
    const phoneNumberWithoutLeadingZero = phone_number.replace(/^0+/, "");
    const apiKey = process.env.REACT_APP_BEFIANA_API_KEY;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 sec timeout

    try {
      const res = await fetch("https://api.befiana.cloud/api/smsko/v1/send/", {
        method: "POST",
        headers: {
          Authorization: apiKey,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumberWithoutLeadingZero,
          message,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const json = await res.json();
      console.log("✅ Befiana SMS response:", json);

      if (!res.ok || json.error || json.status === false) {
        throw new Error(json.error || "Befiana SMS failed");
      }

      return { provider: "befiana", success: true, data: json };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("❌ Befiana SMS error:", error.message);
      throw new Error(error.name === "AbortError" ? "Timeout" : error.message);
    }
  };

  // --- 2️⃣ MAPI Provider (your backend proxy) ---
  const sendMapiSMS = async (phone_number, message) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/sms/send-sms`,
        { phone_number, message },
        { timeout: 10000 } // safety 10s max
      );
      console.log("✅ MAPI SMS response:", res.data);
      return { provider: "mapi", success: true, data: res.data };
    } catch (error) {
      console.error("❌ MAPI SMS error:", error.message);
      throw new Error(error.message);
    }
  };

  // --- 3️⃣ Combined sendSMS ---
  const sendSMS = async (phone_number, message) => {
    try {
      // Try Befiana first (with timeout & catch)
      const result = await sendBefianaSMS(phone_number, message);
      return result;
    } catch (error) {
      console.warn("⚠️ Befiana failed or timed out, switching to MAPI...");
      try {
        const fallback = await sendMapiSMS(phone_number, message);
        return fallback;
      } catch (fallbackError) {
        console.error("❌ Both providers failed:", fallbackError.message);
        throw new Error("All SMS providers failed.");
      }
    }
  };

  return { sendSMS, sendBefianaSMS, sendMapiSMS };
};
