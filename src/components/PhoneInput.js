import React, { useState } from "react";
import InputMask from "react-input-mask";

const PhoneInput = ({ phone, setPhone, required }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    // remove all non-digits to get raw numeric value
    const numericValue = e.target.value.replace(/\D/g, "");
    setPhone(numericValue);
  };

  return (
    <InputMask
      mask="0 99 99 999 99"
      maskChar={null}
      value={phone ? phone : ""}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          type="tel"
          placeholder={isFocused ? "0 00 00 000 00" : "Téléphone 2"}
          style={{
            width: "100%",
            border: "1px solid #999",
            borderRadius: "16px",
            padding: "10px",
            fontSize: "16px",
            textAlign: "center",
          }}
          inputMode="numeric"
          pattern="[0-9\s]*"
          required={required}
        />
      )}
    </InputMask>
  );
};

export default PhoneInput;
