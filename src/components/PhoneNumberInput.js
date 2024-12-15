import React, { useState } from "react";
import InputMask from "react-input-mask";

const PhoneNumberInput = ({ value, onChange }) => {
    const [isFocused, setIsFocused] = useState(false);

  return (
    <InputMask
      mask="99 99 999 99"
      placeholder={isFocused ? "00 00 000 00" : "Votre numéro de téléphone"}
      value={value}
      onChange={onChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      maskChar={null}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
          }}
          type="tel"
          required
        />
      )}
    </InputMask>
  );
};

export default PhoneNumberInput;
