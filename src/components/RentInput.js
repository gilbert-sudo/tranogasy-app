import React, { useState } from "react";

const RentInput = ({ rent, setRent, isRent }) => {
  const [error, setError] = useState(""); // state for error message

  // function to format number with spaces (e.g., 3400000 -> "3 400 000")
  const formatNumber = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // handle typing
  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/\s/g, ""); // remove spaces

    // Allow only digits
    if (!/^\d*$/.test(rawValue)) return;

    const numericValue = Number(rawValue);

    // Check max value
    if (numericValue > 10000000) {
      setError("Le montant maximal est 10 000 000 Ar");
      return; // stop typing more
    } else {
      setError(""); // clear error
    }

    setRent(rawValue);
  };

  return (
    <>
      {isRent && (
        <div
          style={{
            position: "relative",
            border: "1px solid #ced4da",
            borderRadius: "20px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <label
            style={{
              position: "absolute",
              top: "-10px",
              left: "15px",
              background: "#fff",
              padding: "0 6px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            Montant du loyer du bien (en Ariary)
          </label>

          <div style={{ position: "relative", marginTop: "10px" }}>
            <input
              type="tel"
              name="budgetmax"
              placeholder="Indiquer un montant"
              style={{
                width: "100%",
                border: error ? "1px solid red" : "1px solid #999",
                borderRadius: "16px",
                padding: "15px",
                fontSize: "16px",
                paddingRight: "80px",
                textAlign: rent ? "center" : "left",
                transition: "border 0.3s ease",
              }}
              value={formatNumber(rent)}
              onChange={handleChange}
              required={isRent}
            />
            <span
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6b7280",
                fontSize: "14px",
                pointerEvents: "none",
              }}
            >
              Ar / mois
            </span>
          </div>

          {error && (
            <p
              style={{
                color: "red",
                fontSize: "13px",
                marginTop: "8px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default RentInput;
