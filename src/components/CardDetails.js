import {
  FaBed,
  FaCouch,
  FaUtensils,
  FaToilet,
  FaShower,
  FaRulerCombined,
} from "react-icons/fa";

const CardDetails = ({ property }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "20px",
        padding: "20px 10px 10px 10px",
        position: "relative",
        marginBottom: "20px",
        backgroundColor: "transparent",
        color: "#333",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Title embedded in border */}
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "20px",
          backgroundColor: "#fff",
          padding: "0 8px",
          fontWeight: "400",
          color: "#333",
          fontSize: "13px",
        }}
      >
        Plus de détails
      </div>

      <div className="row g-2 justify-content-center">
        <SpecItem value={property?.rooms} icon={<FaBed />} label="Chambre(s)" />
        <SpecItem value={property?.livingRoom} icon={<FaCouch />} label="Salon" />
        <SpecItem value={property?.kitchen} icon={<FaUtensils />} label="Cuisine(s)" />
        <SpecItem
          value={property?.toilet}
          icon={<FaToilet />}
          label={`W.C (${property?.features.insideToilet ? "Intérieur" : "Extérieur"})`}
        />
        <SpecItem
          value={property?.bathrooms}
          icon={<FaShower />}
          label={`Douche (${property?.features.insideBathroom ? "Intérieur" : "Extérieur"})`}
        />
        <SpecItem
          value={property?.area}
          icon={<FaRulerCombined />}
          label="Surface"
          unit="m²"
        />
      </div>
    </div>
  );
};

const SpecItem = ({ value, icon, label, unit }) => (
  <div
    className="col-4 col-lg text-center d-flex flex-column align-items-center justify-content-center"
    style={{
      padding: "8px",
      minWidth: "90px",
      color: "#333",
      backgroundColor: "transparent",
    }}
  >
    <div
      style={{
        fontSize: "14px",
        marginBottom: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {value}
      {unit ? ` ${unit}` : ""}
      <span style={{ marginLeft: "4px", fontSize: "16px" }}>{icon}</span>
    </div>
    <div
      style={{
        fontSize: "12px",
        color: "#555",
        lineHeight: "1.2",
        fontWeight: "400",
      }}
    >
      {label}
    </div>
  </div>
);

export default CardDetails;
