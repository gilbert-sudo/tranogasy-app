import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSMS } from "../hooks/useSMS";
import { useFormater } from "../hooks/useFormater";

const SMSBot = () => {
  const { sendBefianaSMS } = useSMS();
  const { formatDate } = useFormater();
  const XProperties = useSelector((state) => state.properties);
  // const usersProperties = useSelector((state) => state.usersProperties);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // start of tomorrow

  const todaysProperties = XProperties.filter((property) => {
    const createdAt = new Date(property.created_at);
    return createdAt >= today && createdAt < tomorrow;
  });

  console.log({ todaysProperties });

  const properties = todaysProperties;

  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const startSending = async () => {
    if (!properties || properties.length === 0) {
      alert("No properties found in store.");
      return;
    }

    setIsSending(true);
    setLogs([]);
    let sentCount = 0;
    console.log(properties);

    for (const property of properties) {
      // const phone = property.owner.phone;
      // const phone = "0345189896";
      const phone = property.phone1;
      if (!phone) continue;

      const username =
        property?.sources?.username && property.sources.username.trim() !== ""
          ? property.sources.username.trim()
          : "Mikajy ranaivo";

      const city = property.city?.fokontany || "Antananarivo";
      const rent = property.rent
        ? `${property.rent.toLocaleString()} Ar`
        : "Prix non précisé";
      const rooms = property.rooms || "Trano ahofa";
      const livingRoom = property.livingRoom || "Trano ahofa";
      const date = formatDate(property.created_at) || "ito volana ito";
      // Get the current URL
      // const propertyCurrentUrl = `${process.env.REACT_APP_API_URL}/api/preview/${property._id}`;
      const propertyCurrentUrl = `https://apis.tranogasy.mg/api/preview/${property._id}`;

      const message = `Salama ${username} 😊, arabaina !
    Ilay tranonao ${livingRoom}Lv ${rooms}Ch any ${city} (${rent}/mois) ny ${date}.
    Azonao alaina ato 👉 ${propertyCurrentUrl}
    Pejy facebook'nay: TranoGasy by Gilbert Madagascar Trano Ahofa`;

      try {
        await sendBefianaSMS(phone, message);
        sentCount++;
        setLogs((prev) => [...prev, `✅ SMS sent to ${username} (${phone})`]);
      } catch (err) {
        setLogs((prev) => [
          ...prev,
          `❌ Error sending to ${username} (${phone})`,
        ]);
      }

      setProgress(Math.round((sentCount / properties.length) * 100));
      await delay(4000); // Wait 2.5s between messages (avoid API spam)
    }

    setIsSending(false);
    alert("🎉 All messages processed!");
  };

  return (
    <div className="pt-5" style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>📱 TranoGasy SMS Bot</h1>
      <p>Properties to message: {properties?.length || 0}</p>

      <button
        onClick={startSending}
        disabled={isSending}
        style={{
          backgroundColor: isSending ? "#ccc" : "#7cbd1e",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {isSending ? "Sending..." : "Start Sending SMS"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <p>Progress: {progress}%</p>
        <div
          style={{
            height: "10px",
            width: "100%",
            background: "#ddd",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#7cbd1e",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>
      </div>

      <ul style={{ marginTop: "20px", lineHeight: "1.5em" }}>
        {logs
          .slice()
          .reverse()
          .map((log, i) => (
            <li key={i}>{log}</li>
          ))}
      </ul>
    </div>
  );
};

export default SMSBot;
